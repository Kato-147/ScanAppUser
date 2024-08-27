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
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  deleteOrder,
  getOrderTable,
  getOrderTableApi,
  getOrderUser,
  getOrderUserApi,
  paymentCodTable,
  paymentCodUser,
  paymentZaloTable,
  paymentZaloUser,
} from '../ProductsHTTP';
import {useIsFocused} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import {RadioButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AccodianUserOrder from '../../fragment/AccodianUserOrder';
import AccodianTableOrder from '../../fragment/AccodianTableOrder';
import Toast from 'react-native-toast-message';
import toastConfig from '../../../helper/toastConfig';
const {PayZaloBridge} = NativeModules;

// const payZaloBridgeEmitter = new NativeEventEmitter(PayZaloBridge);

export const mergeOrderItems = items => {
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

const Oder = ({}) => {
  const [selectedMethod, setSelectedMethod] = useState('COD');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleted, setdeleted] = useState([]);
  const [totalOrder, settotalOrder] = useState(totalOrder);
  const [totalTable, settotalTable] = useState(totalTable);
  const [orderType, setorderType] = useState('user'); //table
  const isFocused = useIsFocused();
  const [promotionCode, setpromotionCode] = useState('');
  const [orderUserItems, setOrderUserItems] = useState([]);
  const [orderTableItems, setorderTableItems] = useState([]);

 


  useEffect(() => {
    if (isFocused) {
      orderUser(promotionCode);
      orderTable(promotionCode);
    }
  }, [
    isFocused,
    deleted,
    orderType,
    handleApplyVoucher,
    orderUser,
    orderTable,
  ]);

  // gọi api load order theo user (new)
  const orderUser = async promotionCode => {
    try {
      const response = await getOrderUserApi(promotionCode);
      if (response.status === 'success') {
        setOrderUserItems(response.data);
        settotalOrder(response.totalAmount);
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

  // gọi api load order theo user (new)
  const orderTable = async promotionCode => {
    try {
      const response = await getOrderTableApi(promotionCode);
      if (response.status === 'success') {
        setorderTableItems(response.data);
        settotalTable(response.totalAmount);
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


  const onclickUser = async () => {
    setorderType('user');
  };
  const onclickTable = () => {
    setorderType('table');
  };

  if (loading) {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // if (error) {
  //   return (
  //     <LinearGradient
  //       colors={['#ffffff', '#ffffff', '#ffffff', '#F6F6F6']}
  //       style={styles.errorContainer}>
  //       <Image
  //         style={styles.errorImage}
  //         source={{
  //           uri: 'https://i.pinimg.com/564x/55/96/49/559649030e6667d7f8d50fc15afbbd20.jpg',
  //         }}
  //       />
  //       <Text style={styles.errorText}>Bạn chưa đặt món nào cả</Text>
  //     </LinearGradient>
  //   );
  // }



  // Hàm xử lý khi người dùng nhấn nút thanh toán
  const handlePayment = promotionCode => {
    if (orderType === 'user' && selectedMethod === 'COD') {
      handlePaymentCOD(promotionCode);
    }
    if (orderType === 'user' && selectedMethod === 'Zalo') {
      handlePaymentZalo(promotionCode);
    }
    if (orderType === 'table' && selectedMethod === 'COD') {
      handlePaymentCodTable(promotionCode);
    }
    if (orderType === 'table' && selectedMethod === 'Zalo') {
      handlePaymentZaloTable(promotionCode);
    }
    // } else{
    //   ToastAndroid.show('co loi xay ra!', ToastAndroid.SHORT);
    // }
  };

  // Hàm xử lý thanh toán tiền mặt user
  const handlePaymentCOD = async promotionCode => {
    console.log('COD');
    try {
     Alert.alert('Không thể thanh toán !','Quý khách không thể thanh toán tiền mặt theo hóa đơn cá nhân.')
    } catch (err) {
      // setError(err.message);
      console.log('-------------', err);
      Alert.alert(`Lỗi thanh toán: ${err.message}`);
    }
  };

  // Hàm xử lý thanh toán zalo
  const handlePaymentZalo = async promotionCode => {
    console.log('Zalo');
    try {
      const response = await paymentZaloUser(promotionCode);
      Toast.show({
        type: 'success',
        text1: 'Chờ phục vụ xác nhận ...',
        text2: response.message
      })
      if (response.return_code === 1) {
        const payOrder = async () => {
          var payZP = NativeModules.PayZaloBridge;
          payZP.payOrder(response.order_token);
        };
        payOrder();
      }
    } catch (error) {
      console.log('------error-pay zalo user------', err);
      Toast.show({
        type: 'error',
        text1: 'Có lỗi xảy ra, vui lòng liên hệ phục vụ',
        text2: err.message
      })
    }
  };

  // Hàm xử lý thanh toán tiền mặt theo bàn
  const handlePaymentCodTable = async promotionCode => {
    console.log('pay cod table');
    try {
      await paymentCodTable(promotionCode);
      Toast.show({
        type: 'success',
        text1: 'Chờ phục vụ xác nhận ...',
        text2: 'Vui lòng chờ phục vụ xác nhận thanh toán !'
      })
    } catch (err) {
      // setError(err.message);
      console.log('------error-- pay cash table-----', err);
      Toast.show({
        type: 'error',
        text1: 'Có lỗi xảy ra, vui lòng liên hệ phục vụ',
        text2: err.message
      })
    }
  };

  // Hàm xử lý thanh toán zalo theo bàn
  const handlePaymentZaloTable = async promotionCode => {
    console.log(' pay Zalo table');
    try {
      const response = await paymentZaloTable(promotionCode);
      Toast.show({
        type: 'success',
        text1: 'Chờ phục vụ xác nhận ...',
        text2: response.message
      })
      if (response.return_code === 1) {
        const payOrder = async () => {
          var payZP = NativeModules.PayZaloBridge;
          payZP.payOrder(response.order_token);
        };
        payOrder();
      }
    } catch (error) {
      console.log('------error-pay zalo table------', err);
      Toast.show({
        type: 'error',
        text1: 'Có lỗi xảy ra, vui lòng liên hệ phục vụ',
        text2: err.message
      })
    }
  };

  //Hàm xử lý khi người dùng nhấn nút apply Voucher
  const handleApplyVoucher = async promotionCode => {
    console.log('Handle ApplyVoucher || promotion Code : ', promotionCode);
    try {
      orderType === 'user'
        ? orderUser(promotionCode)
        : orderTable(promotionCode);
    } catch (error) {
      console.log('handle Apply Voucher', error);
    }
  };


  // Hàm tính tổng tiền
  function totalMoney() {
    return orderType === 'user'
      ? checkPrice(totalOrder)
      : checkPrice(totalTable);
  }

  //Hàm hiển thị flatlist
  const handleFlatlist = () => {
    if (orderType === 'user') {
      if (orderUserItems.length === 0) {
        return (
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
                uri: 'https://i.pinimg.com/564x/55/96/49/559649030e6667d7f8d50fc15afbbd20.jpg',
              }}
            />
            <Text style={styles.errorText}>Bạn chưa đặt món nào cả</Text>
          </View>
        );
      } else {
        return (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{height: hp(40)}}>
            {orderUserItems.map((item, index) => (
              <AccodianUserOrder
                key={index.toString()}
                title={item.orderCount}
                quantity={item.totalQuantityOfOrderCount}
                items={item.items}
                setdeleted={setdeleted}
              />
            ))}
          </ScrollView>
        );
      }
    } else {
      if (orderTableItems.length === 0) {
        return (
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
                uri: 'https://i.pinimg.com/564x/55/96/49/559649030e6667d7f8d50fc15afbbd20.jpg',
              }}
            />
            <Text style={styles.errorText}>Bạn chưa đặt món nào cả</Text>
          </View>
        );
      } else {
        return (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{height: hp(40)}}>
            {orderTableItems.map((item, index) => (
              <AccodianTableOrder
                key={index.toString()}
                name={item.name}
                quantity={item.quantity}
                amount={item.amount}
                image={item.image_url}
                options={item.options}
                userOrders={item.userOrders}
              />
            ))}
          </ScrollView>
        );
      }
    }
  };

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              onPress={() => {
                onclickUser();
              }}>
              <Text
                style={[
                  styles.headerText,
                  {color: orderType === 'user' ? '#E8900C' : '#525252'},
                ]}>
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
              onPress={() => {
                onclickTable();
              }}>
              <Text
                style={[
                  styles.headerText,
                  {color: orderType === 'table' ? '#E8900C' : '#525252'},
                ]}>
                Món cả bàn
              </Text>
            </TouchableOpacity>
          </View>

          {/* Order Item */}

          <View style={{height: hp(40)}}>{handleFlatlist()}</View>

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
                  <Icon
                    name="tagso"
                    size={24}
                    color={totalMoney() == 0 ? '#a0a0a0' : '#E8900C'}
                  />

                  <TextInput
                    // value={query}
                    placeholder="Nhập mã giảm giá"
                    style={
                      totalMoney() == 0
                        ? [styles.voucherTextInput, {borderColor: '#a0a0a0'}]
                        : styles.voucherTextInput
                    }
                    onChangeText={setpromotionCode}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => handleApplyVoucher(promotionCode)}
                  style={{
                    backgroundColor: totalMoney() == 0 ? '#a0a0a0' : '#E8900C',
                    padding: hp(1.2),
                    borderRadius: 8,
                  }}>
                  <Text style={{color: 'white', fontSize: hp(2)}}>Áp dụng</Text>
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
                    status={selectedMethod === 'COD' ? 'checked' : 'unchecked'}
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
                    status={selectedMethod === 'Zalo' ? 'checked' : 'unchecked'}
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
                {totalMoney()} đ{' '}
              </Text>
            </View>
          </View>

          {/* Button Order */}

          <View style={{height: hp(10)}}>
            <TouchableOpacity
              onPress={() =>
                totalMoney() == 0
                  ? console.log('Không thanh toán vì không có giá tiền')
                  : handlePayment(promotionCode)
              }
              style={
                totalMoney() == 0
                  ? [styles.orderButton, {backgroundColor: '#a0a0a0a0'}]
                  : styles.orderButton
              }>
              <Text style={styles.orderButtonText}>Thanh toán</Text>
            </TouchableOpacity>
          </View>

          <Toast config={toastConfig}  />

        </LinearGradient>
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
    height: hp(5),
    width: wp(45),
    borderBottomWidth: 1,
    borderColor: '#525252',
  },
  headerText: {
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
  },
  detailsContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-around',
    width: wp(50),
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
