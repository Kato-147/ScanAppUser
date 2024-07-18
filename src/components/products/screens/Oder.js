import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {getOrderUser} from '../ProductsHTTP';
import {useIsFocused} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import {RadioButton} from 'react-native-paper';

const mergeOrderItems = items => {
  const mergedItems = [];

  items.forEach(item => {
    const existingItem = mergedItems.find(
      i =>
        i.menuItemId._id === item.menuItemId._id && i.options === item.options,
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      mergedItems.push({...item});
    }
  });

  return mergedItems;
};

const calculateTotalPrice = items => {
  return items.reduce((total, item) => {
    return total + item.menuItemId.price * item.quantity;
  }, 0);
};

export const checkPrice = (amount) => {
  // Kiểm tra nếu amount không hợp lệ (undefined hoặc null)
  if (amount == null || isNaN(amount)) {
    return '0';
  }

  // Chuyển số tiền thành chuỗi và tách phần nguyên và phần thập phân (nếu có)
  const [integerPart, decimalPart] = amount.toString().split('.');

  // Định dạng phần nguyên bằng cách sử dụng biểu thức chính quy và phương thức replace
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Nếu có phần thập phân, ghép phần nguyên đã định dạng với phần thập phân
  // Nếu không có phần thập phân, chỉ trả về phần nguyên đã định dạng
  return decimalPart ? `${formattedIntegerPart},${decimalPart}` : formattedIntegerPart;
};

const Oder = ({navigation}) => {
  const [oderItems, setOderItems] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('COD');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const loadOrderUser = async () => {
        try {
          const response = await getOrderUser();

          if (response.success === 'success') {
            const mergedItems = mergeOrderItems(response.data[0].items);
            setOderItems(mergedItems);
          } else {
            console.error('Failed to fetch order data:', response.data);
          }
        } catch (error) {
          setError(error.message);
          console.log('-------------', error);
        } finally {
          setLoading(false);
        }
      };
      loadOrderUser();
    }
  }, [isFocused]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <LinearGradient
        colors={['#ffffff', '#ffffff', '#ffffff', '#F6F6F6']}
        style={styles.errorContainer}>
        <Image
          style={styles.errorImage}
          source={{
            uri: 'https://i.pinimg.com/564x/55/96/49/559649030e6667d7f8d50fc15afbbd20.jpg',
          }}
        />
        <Text style={styles.errorText}>Bạn chưa đặt món nào cả</Text>
      </LinearGradient>
    );
  }

  const handleHihihaha = () => {
    navigation.navigate('Hihihaha');
  };

  const renderOrderItem = ({item}) => {
    return (
      <TouchableOpacity activeOpacity={1} style={styles.itemContainer}>
        {/* Image wp30 */}
        <View
          style={{
            width: wp(30),
            height: hp(12),
            padding: 14,
            justifyContent: 'center',
            alignItems: 'center',
            // borderRadius: 10,
            //marginRight: wp(2),
            // backgroundColor: 'red',
          }}>
          <Image
            source={{uri: item.menuItemId.image_url}}
            style={styles.image}
          />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{item.menuItemId.name}</Text>
          <Text style={styles.price}>
            {checkPrice(item.menuItemId.price)} đ
          </Text>

          {/* Options */}
          {item.options === '' || error ? (
            <View />
          ) : (
            <Text style={styles.options}>{item.options}</Text>
          )}
        </View>

        <View
          style={{
            width: wp(20),
            // backgroundColor: 'yellow',
            height: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              marginTop: hp(1),
              backgroundColor: '#E8900C',
              padding: wp(2),
              borderRadius: 99,
            }}>
            <Icon name="delete" size={wp(5)} color="#ffffff" />
          </View>

          <Text style={styles.quantity}>x {item.quantity}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const totalPrice = calculateTotalPrice(oderItems);

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {oderItems.length === 0 || error ? (
          <LinearGradient
            colors={['#ffffff', '#ffffff', '#ffffff', '#F6F6F6']}
            style={styles.errorContainer}>
            <Image
              style={styles.errorImage}
              source={{
                uri: 'https://i.pinimg.com/564x/55/96/49/559649030e6667d7f8d50fc15afbbd20.jpg',
              }}
            />
            <Text style={styles.errorText}>Bạn chưa đặt món nào cả</Text>
          </LinearGradient>
        ) : (
          <LinearGradient
            colors={['#ffffff', '#ffffff', '#ffffff', '#F6F6F6']}
            style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text
                style={{fontSize: hp(3), fontWeight: '600', color: '#525252'}}>
                Đặt món
              </Text>
            </View>

            {/* Order Item */}

            <View style={{height: hp(40)}}>
              <FlatList
                data={oderItems}
                keyExtractor={item => item._id.toString()}
                renderItem={renderOrderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.menuList}
              />
            </View>

            {/* Voucher & payment method */}
            <View style={{height: hp(35)}}>
              <View>
                {/* Voucher */}
                <View style={styles.voucherContainer}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                    <Icon name="tagso" size={24} color="#E8900C" />

                    <TextInput
                      // value={query}
                      placeholder="Nhập mã giảm giá"
                      style={styles.voucherTextInput}
                    />
                  </View>

                  <TouchableOpacity
                    style={{
                      backgroundColor: '#E8900C',
                      padding: hp(1.2),
                      borderRadius: 8,
                    }}>
                    <Text style={{color: 'white', fontSize: hp(2)}}>
                      Áp dụng
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Payment method */}
                <View style={{paddingHorizontal: 10}}>
                  <Text style={styles.title}>Phương thức thanh toán</Text>

                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.optionContainer}
                    onPress={() => setSelectedMethod('COD')}>
                    <View style={styles.optionContent}>
                      <Image
                        source={{
                          uri: 'https://e7.pngegg.com/pngimages/199/428/png-clipart-paper-computer-icons-money-banknote-united-states-dollar-banknote-rectangle-sign.png',
                        }}
                        style={styles.logo}
                      />
                      <Text style={styles.optionText}>Thanh toán tiền mặt</Text>
                    </View>
                    <RadioButton
                      value="COD"
                      status={
                        selectedMethod === 'COD' ? 'checked' : 'unchecked'
                      }
                      onPress={() => setSelectedMethod('COD')}
                      color="#E8900C"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.optionContainer}
                    onPress={() => setSelectedMethod('Zalo')}>
                    <View style={styles.optionContent}>
                      <Image
                        source={{
                          uri: 'https://www.plusweb.vn/uploads/public/2021/06/03/1622682588188_zalopay.png',
                        }}
                        style={styles.logo}
                      />
                      <Text style={styles.optionText}>Ví điện tử ZaloPay</Text>
                    </View>

                    <RadioButton
                      value="Zalo"
                      status={
                        selectedMethod === 'Zalo' ? 'checked' : 'unchecked'
                      }
                      onPress={() => setSelectedMethod('Zalo')}
                      color="#E8900C"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Total Price */}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: wp(6),
                  width: wp(100),
                }}>
                <Text style={styles.totalText}>Tổng tiền : </Text>
                <Text style={[styles.totalText, {fontSize: hp(2.2)}]}>
                  {checkPrice(totalPrice)} đ{' '}
                </Text>
              </View>
            </View>

            {/* Button Order */}

            <View style={{height: hp(10)}}>
              <TouchableOpacity
                onPress={handleHihihaha}
                style={styles.orderButton}>
                <Text style={styles.orderButtonText}>Thanh toán</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Oder;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',

    // backgroundColor: 'white',
  },
  headerContainer: {
    width: wp(100),
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(8),
    paddingHorizontal: wp(5),
  },
  menuList: {
    paddingBottom: 20,
    marginTop: 5,
  },
  menuOrderItem: {
    width: '100%',
    //  flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    marginVertical: 10,
    flexDirection: 'row',
  },
  itemContainer: {
    width: wp(100),
    height: hp(12),
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: wp(25),
    height: wp(25),
    borderRadius: 10,
    // resizeMode: 'contain',
  },
  detailsContainer: {
    // flex: 1,
    // justifyContent: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'space-around',
    width: wp(50),
    // backgroundColor: '#EEEEEE',
  },
  name: {
    fontSize: hp(2.2),
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#888',
  },
  options: {
    fontSize: 14,
    color: '#555',
  },
  quantity: {
    fontSize: 14,
    color: '#555',
  },
  voucherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: hp(8),
  },
  voucherText: {
    color: 'black',
    fontSize: hp(2),
  },
  voucherTextInput: {
    //  backgroundColor: 'red',
    borderWidth: 1,
    borderColor: '#E8900C',
    height: hp(5),
    borderRadius: 8,
    width: hp(24),
    // alignItems:'center',
    //justifyContent:'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    // marginTop: hp(1),
    color: '#525252',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: hp(6),
    height: hp(4),
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
  },
  orderButton: {
    backgroundColor: '#E8900C',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: wp(10),
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  totalText: {
    fontSize: hp(2),
    color: '#2e2e2e',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  errorContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: hp(5),
  },
  errorText: {
    // alignSelf:'center'
    fontSize: hp(2.2),
  },
  errorImage: {
    width: hp(10),
    height: hp(10),
  },
});
