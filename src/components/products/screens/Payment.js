import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  NativeModules,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import { RadioButton } from 'react-native-paper';
import { checkPrice } from './Oder';
import { useIsFocused, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import toastConfig from '../../../helper/toastConfig';
import { getOrderTableApi } from '../ProductsHTTP';
const {PayZaloBridge} = NativeModules;


const Payment = ({navigation}) => {
  const [selectedMethod, setSelectedMethod] = useState('COD');
  const [promotionCode, setpromotionCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState(null);
  const [totalTable, settotalTable] = useState(totalTable);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [orderTableItems, setorderTableItems] = useState([]);


  useEffect(() => {
    if (isFocused) {
      orderTable(promotionCode);
    }
  }, [
    isFocused,
    handleApplyVoucher,
  ]);

  //Back to Order
  const handleBack = () => {
    console.log('>>>>>> Click Back Button');
    navigation.goBack();
  };

   // gọi api load order theo table
   const orderTable = async promotionCode => {
    try {
      const response = await getOrderTableApi(promotionCode);
      if (response.status === 'success') {
        setorderTableItems(response.data);
        settotalTable(response.totalAmount);
        setDiscount(response.discountAmount);
        setError(response.promotionError);
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

    //Hàm xử lý khi người dùng nhấn nút apply Voucher
    const handleApplyVoucher = async promotionCode => {
      console.log('Handle ApplyVoucher || promotion Code : ', promotionCode);
      try {
          await orderTable(promotionCode);
      } catch (error) {
        console.log('handle Apply Voucher', error);
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
            <TouchableOpacity onPress={handleBack}>
              <Icon name="arrowleft" size={24} color="#E8900C" />
            </TouchableOpacity>

            <Text style={styles.headerText}>Hóa đơn</Text>
          </View>

          {/* Body */}
          <View>
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
                    <Icon name="tagso" size={24} color={'#E8900C'} />

                    <TextInput
                      // value={query}
                      placeholder="Nhập mã giảm giá"
                      style={styles.voucherTextInput}
                      onChangeText={setpromotionCode}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => handleApplyVoucher(promotionCode)}
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

              <View>
                {discount > 0 ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      width: wp(100),
                    }}>
                    <Text style={styles.discountText}>Giảm giá : </Text>
                    <Text style={styles.discountText}>
                      {checkPrice(discount)} đ{' '}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.errorText}>{error}</Text>
                )}
                {/* Total Price */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    width: wp(100),
                  }}>
                  <Text style={styles.totalText}>Tổng tiền : </Text>
                  <Text style={[styles.totalText, {fontSize: hp(2.2)}]}>
                    {checkPrice(totalTable)} đ{' '}
                  </Text>
                </View>
              </View>
            </View>
            {/* Button Order */}

          <View style={{height: hp(10)}}>
            <TouchableOpacity
             
              style={
                styles.orderButton
              }>
              <Text style={styles.orderButtonText}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'space-between',
  },
  headerContainer: {
    height: hp(8),
    width: wp(100),
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 3,
    paddingHorizontal: 10,
    gap: 20,
  },
  headerText: {
    fontSize: hp(2),
    fontWeight: '500',
    color: '#E8900C',
  },
  voucherTextInput: {
    borderWidth: 1,
    borderColor: '#E8900C',
    height: hp(5),
    borderRadius: 8,
    width: hp(24),
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
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#525252',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
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
  discountText: {
    fontSize: hp(2),
    color: '#32CD32',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  totalText: {
    fontSize: hp(2),
    color: '#2e2e2e',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  errorText: {
    fontSize: hp(1.5),
    color: '#FF6347',
    backgroundColor: '#F6F6F6',
    padding: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
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
});
