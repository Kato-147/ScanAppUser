import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon2 from 'react-native-vector-icons/Ionicons';
import CustomInput from '../../fragment/CustomInput';
import LinearGradient from 'react-native-linear-gradient';
import {useRoute} from '@react-navigation/native';
import {reSendOtp, verifyOtp} from '../UserHTTP';

const OtpLogin = ({navigation}) => {
  const [verificationCode, setVerificationCode] = useState('');

  const route = useRoute();
  const {email} = route.params;
  const [emailOtp, setemailOtp] = useState(email);

  console.log('====================================');
  console.log(emailOtp);
  console.log('====================================');

  useEffect(() => {
    console.log('Cặc');
    if (emailOtp === undefined) {
      console.log('Lồn');
    }
  }, []);

  const handleBack = () => {
    console.log('Back');
    navigation.goBack();
  };

  const handleOtpSubmit = async () => {
    console.log('send otp');
    try {
      const response = await verifyOtp(emailOtp, verificationCode); // Gửi email cùng với OTP
      if (response.status === 'success') {
        ToastAndroid.show('Xác nhận Otp thành công', ToastAndroid.SHORT);
        // Alert.alert('Thành công', 'Xác nhận OTP thành công!');
        // Điều hướng đến trang khác sau khi xác minh thành công
        navigation.popToTop('Login'); // Chuyển đến màn hình login sau khi xác minh otp thành công
      } else {
        Alert.alert('Lỗi', 'Mã OTP không hợp lệ, vui lòng thử lại.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xác minh OTP.');
      console.log(error);
    }
  };

  const sendOtpAgain = async (emailOtp) => {
    try {
      const res = await reSendOtp(emailOtp);
      ToastAndroid.show('Vui lòng kiểm tra email', ToastAndroid.SHORT);
      console.log('response from sendOtpAgain ', res);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#C55402', '#CE8025', '#CE8025', '#EEEEEE']}
          style={styles.container}>
          <View>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBack}>
                <Icon2 name="chevron-back-outline" style={styles.iconBack} />
              </TouchableOpacity>

              <Text style={styles.labelLogin}>Xác thực OTP</Text>
              <View />
            </View>

            {/* Image */}

            <Image
              style={styles.image}
              source={require('../../../images/phoneVerify.png')}
            />

            {/* Otp */}
            <View>
              <Text style={styles.textOtp}>Mã OTP đã được gửi về Email</Text>

              {email === undefined ? (
                <CustomInput
                  containerStyle={{marginTop: 5}}
                  placeholder={'Nhập Email'}
                  onChangeText={setemailOtp}
                />
              ) : (
                <View />
              )}

              {/* Input Text */}
              <CustomInput
                containerStyle={{marginTop: 5}}
                placeholder={'Nhập mã Otp'}
                onChangeText={setVerificationCode}
              />

              {/* Send Otp */}
              <TouchableOpacity
                onPress={() => {sendOtpAgain(emailOtp)}}
                style={{alignSelf: 'flex-end', marginTop: 10}}>
                <Text style={{alignSelf: 'flex-end', color: 'white'}}>
                  Gửi lại mã Otp
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* button login */}

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginBottom: 20,
            }}>
            <TouchableOpacity onPress={handleOtpSubmit} style={styles.btnLogin}>
              <Text style={styles.textLogin}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default OtpLogin;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelLogin: {
    fontSize: 24,
    fontWeight: '500',
    color: 'white',
  },
  image: {
    width: 270,
    height: 270,
    alignSelf: 'center',
    marginTop: 40,
  },
  textOtp: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  textSendOtp: {},
  btnLogin: {
    width: '100%',
    height: 48,
    backgroundColor: '#E8900C',
    borderRadius: 8,
    justifyContent: 'center',
  },

  textLogin: {
    fontSize: 17,
    lineHeight: 16,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    width: '100%',
  },
  iconBack: {
    color: 'white',
    fontSize: 30,
  },
});
