import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  FlatList,
  Image,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import {SliderBox} from 'react-native-image-slider-box';
import {useIsFocused} from '@react-navigation/native';
import {getApiVoucher, getMyPromotionsRedeemedAPI} from '../ProductsHTTP';
import CopyIcon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

const Voucher = ({navigation}) => {
  const isFocused = useIsFocused();
  const [voucherItems, setvoucherItems] = useState([]);
  const [voucherRedeemed, setvoucherRedeemed] = useState([]);
  const [copyCode, setcopyCode] = useState('');
  const [loading, setloading] = useState(true);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'hot', title: 'Các Voucher hot'},
    {key: 'mine', title: 'Voucher của tôi'},
  ]);

  const copyToClipboard = code => {
    Clipboard.setString(code);
    ToastAndroid.show(`Đã sao chép ${code} vào bộ nhớ tạm`, ToastAndroid.SHORT);
    setcopyCode(code);  
  };

  useEffect(() => {
    if (isFocused) {
      getVoucher();
      getMyPromotionsRedeemed();
    }
  }, [isFocused]);

  const getVoucher = async () => {
    try {
      const response = await getApiVoucher();
      if (response.status === 'success') {
        setvoucherItems(response.data.promotions);
      }
      return response;
    } catch (error) {
      console.log('err>>', error);
    } finally {
      setloading(false);
    }
  };

  const getMyPromotionsRedeemed = async () => {
    try {
      const response = await getMyPromotionsRedeemedAPI();
      if (response.status === 'success') {
        setvoucherRedeemed(response.data.promotionsRedeemed);
      }
      return response;
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setloading(false);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      activeOpacity={1}
      onPress={() => {
        console.log(item._id);
      }}>
      <View style={styles.itemFlatlist}>
        <Image
          style={styles.imageVoucherItem}
          source={{uri: 'https://www.themealdb.com/images/meal-icon.png'}}
        />
      </View>
      <View style={styles.detailsContainer}>
        <Text
          style={{fontSize: hp(2), fontWeight: 'bold', color: 'black'}}
          numberOfLines={2}>
          {item.description}
        </Text>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingEnd: wp(5),
          }}>
          <Text style={{width: wp(50), color: 'black'}}>Mã: {item.code}</Text>
          <TouchableOpacity
            onPress={() => copyToClipboard(item.code)}
            style={{
              backgroundColor: '#E8900C',
              padding: wp(2),
              borderRadius: 8,
            }}>
            <CopyIcon name="content-copy" size={wp(5)} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <Text style={{color: 'black'}}>
          Hạn sử dụng: {new Date(item.endDate).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderRedeemedItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      activeOpacity={1}
      onPress={() => {
        console.log(item.promotionId);
      }}>
      <View style={styles.itemFlatlist}>
        <Image
          style={styles.imageVoucherItem}
          source={{uri: 'https://www.themealdb.com/images/meal-icon.png'}}
        />
      </View>
      <View style={styles.detailsContainer}>
        <Text
          style={{
            fontSize: hp(2),
            fontWeight: 'bold',
            color: 'black',
            marginBottom: 5,
          }}
          numberOfLines={2}>
          {item.description}
        </Text>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingEnd: wp(5),
            marginBottom: 5,
          }}>
          <Text style={{width: wp(50), color: 'black'}}>
            {' '}
            Mã: {item.promotionCode}
          </Text>
          <TouchableOpacity
            onPress={() => copyToClipboard(item.promotionCode)}
            style={{
              backgroundColor: '#E8900C',
              padding: wp(2),
              borderRadius: 8,
            }}>
            <CopyIcon name="content-copy" size={wp(5)} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <Text style={{color: 'black', marginBottom: 5}}>
          Lượt dùng: {item.usageCount}
        </Text>
        <Text style={{color: 'black'}}>
          Đã đổi lúc: {new Date(item.redeemedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const HotVouchers = () => (
    <View style={{height: hp(45)}}>
      {loading ? (
        <View
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : voucherItems.length === 0 ? (
        <View
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={styles.errorImage}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/256/3405/3405177.png',
            }}
          />
          <Text style={styles.errorText}>Hiện không có voucher</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={voucherItems}
          renderItem={renderItem}
          keyExtractor={item => item._id.toString()}
          contentContainerStyle={styles.menuList}
        />
      )}
    </View>
  );

  const MyVouchers = () => (
    <View style={{height: hp(45)}}>
      {loading ? (
        <View
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : voucherRedeemed.length === 0 ? (
        <View
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={styles.errorImage}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/256/3405/3405177.png',
            }}
          />
          <Text style={styles.errorText}>Hiện không có voucher</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={voucherRedeemed}
          renderItem={renderRedeemedItem}
          keyExtractor={item => item.promotionId.toString()}
          contentContainerStyle={styles.menuList}
        />
      )}
    </View>
  );

  const renderScene = SceneMap({
    hot: HotVouchers,
    mine: MyVouchers,
  });

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#ffffff', '#ffffff', '#ffffff', '#F6F6F6']}
          style={styles.container}>
          <View
            style={{
              width: wp(100),
              height: hp(6.2),
              justifyContent: 'center',
              paddingHorizontal: wp(5),
            }}>
            <Text
              style={{fontSize: hp(3), fontWeight: '600', color: '#525252'}}>
              Voucher
            </Text>
          </View>

          <View
            style={{
              height: hp(6.5),
              marginVertical: hp(2.6),
              paddingHorizontal: 15,
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
            }}>
            <Icon2 name="fire-alt" size={24} color="#E8900C" />
            <Text
              style={{
                fontSize: hp(2.3),
                fontWeight: '500',
                color: 'black',
                marginTop: 5,
              }}>
              Săn Voucher hay, quà liền tay
            </Text>
          </View>

          <View
            style={{
              width: wp(100),
              height: hp(20),
              alignSelf: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}>
            <SliderBox
              images={images}
              sliderBoxHeight={200}
              dotColor="#FFEE58"
              inactiveDotColor="#90A4AE"
              paginationBoxVerticalPadding={20}
              autoplay
              circleLoop
              dotStyle={styles.dotStyle}
              ImageComponentStyle={styles.imageStyle}
              imageLoadingColor="#2196F3"
            />
          </View>

          <TabView
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{width: wp(100)}}
            renderTabBar={props => (
              <TabBar
                {...props}
                indicatorStyle={{backgroundColor: '#E8900C'}}
                style={{backgroundColor: 'white'}}
                labelStyle={{color: 'black', fontWeight: 'bold'}}
              />
            )}
          />
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Voucher;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 0,
    padding: 0,
    margin: 0,
    display: 'none',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },
  imageVoucherItem: {
    width: wp(25),
    height: wp(25),
    borderRadius: 10,
  },
  itemFlatlist: {
    width: wp(30),
    height: hp(12),
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    width: wp(100),
    height: hp(15),
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuList: {
    paddingBottom: 20,
    marginTop: 5,
  },
  detailsContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-around',
    width: wp(50),
  },
  errorText: {
    fontSize: hp(2.2),
  },
  errorImage: {
    width: hp(10),
    height: hp(10),
  },
});

const images = [
  {
    uri: 'https://cdn.create.vista.com/downloads/a872c327-e398-4e0c-95b7-9fb77fd0464a_1024.jpeg',
  },
  {
    uri: 'https://cdn.create.vista.com/downloads/2f091ea2-b749-4aa4-904f-55739768f749_1024.jpeg',
  },
  {
    uri: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/restaurant-food-voucher-template-design-3f760e8c846b211d1f48bbbdc1364386_screen.jpg?ts=1588142046',
  },
  {
    uri: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/orange-food-gift-voucher-design-template-ea779e971972b66be32009352e52d1ba_screen.jpg?ts=1589184242',
  },
  {
    uri: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/red-food-gift-card-voucher-design-template-97e81f812b13d305d852edc6d17b86e1_screen.jpg?ts=1657194809',
  },
];
