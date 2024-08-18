import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  TouchableOpacity,
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
import {getInfoApi, getNewsApi} from '../../users/UserHTTP';
import {cutStr} from './Cart';
import {formatDate} from './DetailHistoryOrder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

export const addNotificationToStorage = async (notification) => {
  try {
    const currentNotifications = await AsyncStorage.getItem('notifications');
    let notifications = [];

    if (currentNotifications) {
      notifications = JSON.parse(currentNotifications);
    }

    notifications.push(notification); // Add new notification to array

    const serializedNotifications = JSON.stringify(notifications); // Convert to JSON string
    await AsyncStorage.setItem('notifications', serializedNotifications); // Store in AsyncStorage
  } catch (error) {
    console.error('Error adding notification to storage:', error);
  }
};

const Home = props => {
  const {navigation} = props;
  const [userInfo, setUserInfo] = useState(null);
  const [news, setnews] = useState([]);
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(true);

  

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  //     console.log('====================================');
  //     console.log('-----remoteMessage',remoteMessage);
  //     console.log('====================================');
  //     if (remoteMessage.notification) {
  //       const { title, body } = remoteMessage.notification;
  
  //       console.log('nè nè nè', remoteMessage.data);
  
  //       if (title && body) {
  //         addNotificationToStorage({ title, body }); // Add notification to AsyncStorage
  
  //         Alert.alert(
  //           title,
  //           body,
  //           [
  //             { text: 'Đóng', style: 'cancel' },
  //             {
  //               text: 'Đi tới hóa đơn ' + body,
  //               onPress: () => navigation.navigate('HistoryOrder'),
  //             },
  //           ],
  //           { cancelable: false }
  //         );
  //       }
  //     }
  //   });
  
  //   return unsubscribe;
  // }, []);

  useEffect(() => {
    const getAllKeys = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        console.log('All keys:', keys);
      } catch (error) {
        console.error('Error getting keys:', error);
      }
    };

    // Gọi hàm để xem các key
    getAllKeys();
  }, []);

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
      setError(err.message);
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    }
  };

  const getNews = async () => {
    try {
      const response = await getInfoApi();
      setnews(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const handleScanHome = () => {
    navigation.navigate('ScanHome');
  };

  //Render News
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.itemFlatlist}
        activeOpacity={1}
        onPress={() => {
          console.log(item.id);
          navigation.navigate('DetailNews', {item});
        }}>
        {/* Image */}
        {item.image_url.length === 0 ? (
          <View
            style={{
              width: wp(25),
              height: hp(12),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={styles.image}
              source={{
                uri: 'https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg',
              }}
            />
          </View>
        ) : (
          <View
            style={{
              width: wp(25),
              height: hp(12),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image style={styles.image} source={{uri: item.image_url[0]}} />
          </View>
        )}

        {/* info */}
        <View style={styles.detailsContainer}>
          <Text
            numberOfLines={1}
            style={{fontSize: hp(2.2), fontWeight: 'bold'}}>
            {item.title}
          </Text>
          <Text numberOfLines={1} style={{fontSize: hp(1.8)}}>
            {item.summary}
          </Text>
          <Text numberOfLines={1} style={{fontSize: hp(1.8)}}>
            Ngày đăng :{formatDate(item.createdAt)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
                {/* style={styles.avatarImage} */}
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: wp(80),
                  gap: wp(5),
                }}>
                <Image
                  source={{uri: userInfo.data.user.img_avatar_url}}
                  style={styles.avatarImage}
                />
                <View style={{gap: 5}}>
                  <Text>Xin chào !</Text>
                  <Text
                    style={{
                      fontSize: hp(2.2),
                      letterSpacing: 1,
                      fontWeight: 'bold',
                      color: '#000000',
                      marginStart: wp(3),
                    }}>
                    {userInfo.data.user.fullName}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Body */}
          <View style={styles.bodyContainer}>
            {/* Scan Here */}
            <View
              style={{
                justifyContent: 'space-evenly',
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: hp(8),
              }}>
              <Text
                style={{
                  marginStart: 24,
                  fontSize: hp(2.3),
                  fontWeight: '500',
                  color: 'white',
                  marginTop: 10,
                }}>
                Quét mã để xem Menu
              </Text>
              <TouchableOpacity onPress={handleScanHome}>
                <IconQr name="qrcode-scan" style={styles.iconQr} />
              </TouchableOpacity>
            </View>

            {/* News */}
            <View style={{height: hp(54), width: wp(100)}}>
              <Text
                style={{
                  fontSize: hp(3),
                  fontWeight: 'bold',
                  color: 'black',
                  marginStart: wp(5),
                }}>
                Thông báo
              </Text>
              {loading ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: wp(100),
                    gap: wp(5),
                    justifyContent: 'center',
                    height: hp(40),
                  }}>
                  <ActivityIndicator size="large" color="#0000ff" />
                  {/* style={styles.avatarImage} */}
                </View>
              ) : (
                <View>
                  {news.length === 0 ? (
                    <View
                      style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text>Không có thông báo</Text>
                    </View>
                  ) : (
                    <FlatList
                      //  numColumns={2}
                      showsVerticalScrollIndicator={false}
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        marginTop: hp(2),
                      }}
                      data={news}
                      renderItem={renderItem}
                     // keyExtractor={item => item.id} // Sử dụng `id` làm key
                      contentContainerStyle={styles.menuList}
                    />
                  )}
                </View>
              )}
            </View>
          </View>
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
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  iconQr: {
    color: 'white',
    fontSize: wp(20),
  },
  headerContainer: {
    height: hp(10),
    width: wp(100),
    // backgroundColor: '#E8900C',
    backgroundColor: 'white',
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  bodyContainer: {
    //  backgroundColor: 'yellow',
    display: 'flex',
    // width: hp(10)
  },
  avatarImage: {
    width: hp(6),
    height: hp(6),
    borderRadius: 45,
    // backgroundColor: 'red',
    color: 'white',
  },
  imageStyle: {
    borderRadius: 15,
    width: 50,
    height: 50,
    marginTop: 5,
  },
  itemFlatlist: {
    width: wp(95),
    height: hp(12),
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginHorizontal: wp(2),
    borderRadius: 10,
  },
  menuList: {
    paddingBottom: 20,
    marginTop: 5,
  },
  image: {
    width: wp(25),
    height: wp(25),
    borderRadius: 10,
  },
  detailsContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-around',
    width: wp(50),
    paddingStart: wp(2),
  },
});
