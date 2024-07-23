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
  ToastAndroid,
  NativeModules,
  NativeEventEmitter,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  deleteOrder,
  getOrderTable,
  getOrderUser,
  paymentCodTable,
  paymentCodUser,
  paymentZaloUser,
} from '../ProductsHTTP';
import {useIsFocused} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import {RadioButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {PayZaloBridge} = NativeModules;

const payZaloBridgeEmitter = new NativeEventEmitter(PayZaloBridge);

const mergeOrderItems = items => {
  // console.log(items);
  const mergedItems = [];

  items?.forEach(item => {
    // Tìm mục đã tồn tại trong mergedItems với cùng menuItemId và options
    const existingItem = mergedItems.find(
      i =>
        i.menuItemId._id === item.menuItemId._id &&
        JSON.stringify(i.options) === JSON.stringify(item.options),
    );

    if (existingItem) {
      // Nếu tìm thấy, cộng dồn số lượng
      existingItem.quantity += item.quantity;
    } else {
      // Nếu không, thêm mục mới vào mergedItems
      mergedItems.push({...item});
    }
  });

  return mergedItems;
};

// const calculateTotalPrice = items => {
//   return items.reduce((total, item) => {
//     return total + item.menuItemId.price * item.quantity;
//   }, 0);
// };

export const checkPrice = amount => {
  // Kiểm tra nếu amount không hợp lệ (undefined hoặc null)
  if (amount == null || isNaN(amount)) {
    return '0';
  }

  // Chuyển số tiền thành chuỗi và tách phần nguyên và phần thập phân (nếu có)
  const [integerPart, decimalPart] = amount.toString().split('.');

  // Định dạng phần nguyên bằng cách sử dụng biểu thức chính quy và phương thức replace
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    '.',
  );

  // Nếu có phần thập phân, ghép phần nguyên đã định dạng với phần thập phân
  // Nếu không có phần thập phân, chỉ trả về phần nguyên đã định dạng
  return decimalPart
    ? `${formattedIntegerPart},${decimalPart}`
    : formattedIntegerPart;
};

const Oder = ({navigation}) => {
  const [oderItems, setOderItems] = useState([]);
  const [orderTables, setorderTables] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('COD');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleted, setdeleted] = useState([]);
  const [totalOrder, settotalOrder] = useState(0);
  const [totalTable, settotalTable] = useState(0);
  const [orderType, setorderType] = useState('user');
  const isFocused = useIsFocused();

  console.log('error: ', error);

  useEffect(() => {
    if (isFocused) {
      orderType === 'user' ? loadOrderUser() : loadOrderTable();
    }
  }, [isFocused, loadOrderUser, deleted, orderType]);

  useEffect(() => {
    const subscription = payZaloBridgeEmitter.addListener(
      'EventPayZalo',
      data => {
        if (data.return_code === 1) {
          Alert.alert('Pay success!');
          console.log('fádfádfdfádfadsfds');
        } else {
          Alert.alert('Pay error! ' + data.return_code);
          console.log('====================================');
          console.log('hihihihihi');
          console.log('====================================');
        }
      },
    );

    // Hủy đăng ký sự kiện khi thành phần bị tháo rời
    return () => {
      subscription.remove();
    };
  }, []);

  const loadOrderUser = async () => {
    try {
      const response = await getOrderUser();
      // console.log('-----------', response.data[0]);
      if (response.success === 'success') {
        const mergedItems = mergeOrderItems(response?.data);
        setOderItems(mergedItems);
        settotalOrder(response?.totalAmount);
        setError(null);
      } else {
        console.log('Failed to fetch orderUser data:', response?.data);
      }
    } catch (error) {
      setError(error.message);
      console.log('=====loadOrderUser======', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrderTable = async () => {
    try {
      const response = await getOrderTable();
      // console.log('-----------', response);
      if (response.success === 'success') {
        const mergedItems = mergeOrderItems(response?.data);
        setorderTables(mergedItems);
        settotalTable(response.totalAmount);
      } else {
        console.log('Failed to fetch orderTable data:', response?.data);
      }
    } catch (error) {
      setError(error.message);
      console.log('======OrderTable=====', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDeleteItems = async itemId => {
    console.log(itemId);
    try {
      const tableId = await AsyncStorage.getItem('idTable');
      if (!tableId) {
        throw new Error('Table ID not found');
      }
      if (!itemId) {
        throw new Error('Item ID is required');
      }
      const response = await deleteOrder(tableId, itemId);
      setdeleted(response.data);
      console.log(
        'Order deleted successfully:------',
        response.data.items.length,
      );
      //  await AsyncStorage.removeItem('idTable');
      return response;
    } catch (error) {
      console.log('Error handling delete items:', error);
      // Có thể thông báo cho người dùng hoặc xử lý lỗi theo cách khác
    }
  };

  const handlePayment = () => {
    if (orderType === 'user' && selectedMethod === 'COD') {
      handlePaymentCOD();
    }
    if (orderType === 'user' && selectedMethod === 'Zalo') {
      handlePaymentZalo();
    }
    if (orderType === 'table' && selectedMethod === 'COD') {
      handlePaymentCodTable();
    }
    if (orderType === 'table' && selectedMethod === 'Zalo') {
      handlePaymentZaloTable();
    }
    // } else{
    //   ToastAndroid.show('co loi xay ra!', ToastAndroid.SHORT);
    // }
  };

  // Hàm để xử lý thanh toán COD khi người dùng nhấn nút
  const handlePaymentCOD = async () => {
    console.log('COD');
    try {
      await paymentCodUser();
      Alert.alert('Thanh toán thành công!');
    } catch (err) {
      // setError(err.message);
      console.log('-------------', err);
      Alert.alert(`Lỗi thanh toán: ${err.message}`);
    }
  };
  const handlePaymentZalo = async () => {
    console.log('Zalo');
    try {
      const response = await paymentZaloUser();
      if (response.return_code === 1) {
        const payOrder = () => {
          var payZP = NativeModules.PayZaloBridge;
          payZP.payOrder(response.order_token);
        };
        payOrder();
      }
    } catch (error) {
      console.log('-------------', err);
      Alert.alert(`Lỗi thanh toán: ${err.message}`);
    }
  };

  const handlePaymentCodTable = async() => {
    console.log('pay cod table');
    try {
      await paymentCodTable();
      Alert.alert('Thanh toán thành công!');
    } catch (err) {
      // setError(err.message);
      console.log('-------------', err);
      Alert.alert(`Lỗi thanh toán: ${err.message}`);
    }
  };

  const handlePaymentZaloTable = async() => {
    console.log(' pay Zalo table');
    try {
      const response = await paymentZaloUser();
      if (response.return_code === 1) {
        const payOrder = () => {
          var payZP = NativeModules.PayZaloBridge;
          payZP.payOrder(response.order_token);
        };
        payOrder();
      }
    } catch (error) {
      console.log('-------------', error);
      Alert.alert(`Lỗi thanh toán: ${error.message }`);
    }
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
          <TouchableOpacity
            onPress={() => {
              handleDeleteItems(item._id);
            }}
            style={{
              marginTop: hp(1),
              backgroundColor: '#E8900C',
              padding: wp(2),
              borderRadius: 99,
            }}>
            <Icon name="delete" size={wp(5)} color="#ffffff" />
          </TouchableOpacity>

          <Text style={styles.quantity}>x {item.quantity}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  //const totalPrice = calculateTotalPrice(oderItems);

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {oderItems.length === 0 ? (
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
              <TouchableOpacity
                style={[
                  styles.containerHeaderText,
                  {borderColor: orderType === 'user' ? '#E8900C' : '#525252'},
                ]}
                onPress={() => setorderType('user')}>
                <Text
                  style={[styles.headerText,{color: orderType === 'user' ? '#E8900C' : '#525252'}]}>
                  Món của bạn
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.containerHeaderText,
                  {
                    borderColor: orderType === 'table' ? '#E8900C' : '#525252',
                    alignItems: 'flex-end',
                  },
                ]}
                onPress={() => setorderType('table')}>
                <Text
                  style={[styles.headerText,{color: orderType === 'table' ? '#E8900C' : '#525252'}]}>
                  Món cả bàn
                </Text>
              </TouchableOpacity>
            </View>

            {/* Order Item */}

            <View style={{height: hp(40)}}>
              <FlatList
                data={orderType === 'user' ? oderItems : orderTables}
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
                  {checkPrice(orderType === 'user' ? totalOrder : totalTable)} đ{' '}
                </Text>
              </View>
            </View>

            {/* Button Order */}

            <View style={{height: hp(10)}}>
              <TouchableOpacity
                onPress={handlePayment}
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
    justifyContent: 'space-between',
  },
  containerHeaderText: {
    //backgroundColor:'red',
    height: hp(5),
    width: wp(45),
    borderBottomWidth: 1,
    borderColor: '#525252',
  },
  headerText:{
    fontSize: hp(3),
    fontWeight: '600',
    color: '#525252',
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
    borderWidth: 1,
    borderColor: '#E8900C',
    height: hp(5),
    borderRadius: 8,
    width: hp(24),
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
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
    fontSize: hp(2.2),
  },
  errorImage: {
    width: hp(10),
    height: hp(10),
  },
});
