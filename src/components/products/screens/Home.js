import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import SearchBar from '../../fragment/SearchBar';
import IconQr from 'react-native-vector-icons/MaterialCommunityIcons';
import IconChat from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused} from '@react-navigation/native';
import {infoProfile} from '../ProductsHTTP';
import Loading from '../../fragment/Loading';
import {
  getEventsApi,
  getPromotionRequiredPointsAPI,
  redeemPromotionAPI,
} from '../../users/UserHTTP';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import toastConfig from '../../../helper/toastConfig';
import Carousel, {Pagination} from 'react-native-snap-carousel';

const Home = props => {
  const {navigation} = props;
  const [userInfo, setUserInfo] = useState(null);
  const [promotionCode, setPromotionCode] = useState('');
  const [events, setEvents] = useState([]);
  const [promotionRequiredPoints, setPromotionRequiredPoints] = useState([]);
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(true);

  useEffect(() => {
    if (isFocused) {
      getNews();
      fetchProfileInfo();
    }
  }, [isFocused]);

  const fetchProfileInfo = async () => {
    try {
      const data = await infoProfile();
      setUserInfo(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleRedeemPromotion = async () => {
    try {
      const response = await redeemPromotionAPI(promotionCode);
      if (response && response.data) {
        Toast.show({
          type: 'success',
          text1: 'Đổi mã khuyến mãi thành công',
          text2: response.message,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Đổi mã khuyến mãi thất bại ABC',
          text2: response.message,
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Đổi mã khuyến mãi thất bại',
        text2: error.message,
      });
    }
  };

  const getNews = async () => {
    try {
      const response = await getEventsApi();
      if (response && response.data) {
        setEvents(response.data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.log(error);
      setEvents([]);
    } finally {
      setloading(false);
    }
  };

  const getPromotionRequiredPoints = async () => {
    try {
      const response = await getPromotionRequiredPointsAPI();
      if (response && response.data) {
        setPromotionRequiredPoints(response.data.promotions);
      } else {
        setPromotionRequiredPoints([]);
      }
    } catch (error) {
      console.log(error);
      setPromotionRequiredPoints([]);
    }
  };

  useEffect(() => {
    getPromotionRequiredPoints();
  }, []);

  const renderEventItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailNews', {item})}>
        <View style={styles.eventContainer}>
          {/* Image as background */}
          <ImageBackground
            source={{uri: item.image_url[0]}}
            resizeMode="cover"
            style={styles.eventImage}
            imageStyle={{borderRadius: 10}}>
            <View style={styles.overlay} />
            {/* Overlay for better text visibility */}
            <View style={styles.eventContent}>
              <Text
                style={styles.eventTitle}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.title}
              </Text>
              <Text
                style={styles.eventSummary}
                numberOfLines={2}
                ellipsizeMode="tail">
                {item.summary}
              </Text>
            </View>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPromotionItem = ({item}) => (
    <View style={styles.promotionCard} key={item._id}>
      <Text style={styles.promotionCode}>{item.code}</Text>
      <Text style={styles.promotionDescription}>{item.description}</Text>
      <TouchableOpacity
        style={styles.redeemButton}
        onPress={() => {
          // Implement redeem logic here
          Alert.alert(
            'Đổi mã khuyến mãi',
            `Bạn có chắc chắn muốn đổi mã khuyến mãi với ${item.requiredPoints} điểm?`,
            [
              {text: 'Hủy', style: 'cancel'},
              {
                text: 'Đồng ý',
                onPress: () => {
                  setPromotionCode(item.code);
                  handleRedeemPromotion();
                },
              },
            ],
          );
        }}>
        <Text style={styles.redeemButtonText}>
          Đổi với {item.requiredPoints} điểm
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#C96913', '#FFB266', '#F6F6F6', '#F6F6F6']}
          style={styles.container}>
          {/* Header */}
          <View style={styles.headerContainer}>
            {userInfo === null ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: wp(80),
                  gap: wp(5),
                }}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: wp(100),
                  gap: wp(5),
                }}>
                <Image
                  source={{uri: userInfo.data.user.img_avatar_url}}
                  style={styles.avatarImage}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {userInfo.data.user.fullName}
                  </Text>
                  <Text style={styles.userPoints}>
                    Bạn đang có {userInfo.data.user.reputationPoints} điểm
                  </Text>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 50,
                    alignItems: 'center',
                    gap: 5,
                  }}>
                  <Image
                    source={require('../../../images/user-current.png')}
                    style={{width: 30, height: 30}}
                  />
                  <Text>Bạn đang ở </Text>
                </View>
              </View>
            )}
          </View>
          <View style={styles.sliderContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <FlatList
                data={events}
                renderItem={renderEventItem}
                keyExtractor={item => item._id.toString()} // Use _id here
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            )}
          </View>
          <View style={styles.promotionContainer}>
            <Text style={styles.promotionHeader}>Mã khuyến mãi</Text>
            <FlatList
              data={promotionRequiredPoints}
              renderItem={renderPromotionItem}
              keyExtractor={item => item._id.toString()}
              showsVerticalScrollIndicator={false}
            />
          </View>
          <Toast config={toastConfig} />
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  headerContainer: {
    height: hp(10),
    width: wp(100),
    backgroundColor: 'white',
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(80),
    gap: wp(5),
  },
  avatarImage: {
    width: hp(6),
    height: hp(6),
    borderRadius: 45,
  },
  userInfo: {
    gap: 5,
  },
  greetingText: {
    fontSize: hp(2),
    color: '#000000',
  },
  userName: {
    fontSize: hp(2.2),
    fontWeight: 'bold',
    color: '#000000',
  },
  userPoints: {
    fontSize: hp(2),
    color: '#000000',
  },
  sliderContainer: {
    height: hp(35),
    marginTop: 5,
  },
  eventContainer: {
    width: wp(100),
    height: hp(35),
    marginRight: wp(5),
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
  },
  eventImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  eventContent: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  eventTitle: {
    color: '#fff',
    fontSize: hp(2.5),
    fontWeight: 'bold',
  },
  eventSummary: {
    color: '#fff',
    fontSize: hp(2),
    marginTop: 5,
  },
  eventContentText: {
    color: '#fff',
    fontSize: hp(1.8),
    marginTop: 5,
  },
  promotionContainer: {
    marginTop: 5,
    paddingHorizontal: 20,
    flex: 1, // Để FlatList có thể cuộn được
  },
  promotionHeader: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  promotionCard: {
    padding: 15,
    backgroundColor: '#FFEBCC',
    borderRadius: 10,
    marginBottom: 15,
  },
  promotionCode: {
    fontSize: hp(2.2),
    fontWeight: 'bold',
    color: '#C96913',
  },
  promotionDescription: {
    fontSize: hp(2),
    marginVertical: 5,
  },
  promotionDetails: {
    fontSize: hp(1.8),
    marginBottom: 10,
  },
  redeemButton: {
    backgroundColor: '#C96913',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  redeemButtonText: {
    color: '#fff',
    fontSize: hp(2),
  },
  noPromotionsText: {
    fontSize: hp(2),
    color: '#777',
    textAlign: 'center',
  },
});
