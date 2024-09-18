import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import CustomInput from '../../fragment/CustomInput';
import Icon from 'react-native-vector-icons/FontAwesome6';
import LinearGradient from 'react-native-linear-gradient';
import {login, forgotPassword} from '../UserHTTP';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Toast from 'react-native-toast-message';
import toastConfig from '../../../helper/toastConfig';
import Dialog from 'react-native-dialog';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('oroki147@gmail.com');
  const [password, setPassword] = useState('Tt123456');
  const [fcmToken, setfcmToken] = useState([]);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  console.log('--------fcm  Token in login---------', fcmToken);

  // get fcmToken from AsynStorage
  useMemo(() => {
    const retrieveFCMToken = async () => {
      try {
        const token = await AsyncStorage.getItem('fcmToken');
        if (token !== null) {
          setfcmToken(token);
        }
      } catch (error) {
        console.log(error);
        ToastAndroid.show(
          'Có lỗi xảy ra, vui lòng khỏi động lại ứng dụng',
          ToastAndroid.SHORT,
        );
      }
    };
    retrieveFCMToken();
  }, []);

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleQR = () => {
    navigation.navigate('ScanQR');
  };

  const handleLogin = async () => {
    console.log('login');

    if (email === '' || password === '') {
      ToastAndroid.show('Vui lòng điền đầy đủ thông tin', ToastAndroid.SHORT);
      return;
    }

    try {
      // Gọi hàm login
      const response = await login(email, password, fcmToken);

      // Xử lý phản hồi thành công
      if (response.status === 'success') {
        await AsyncStorage.setItem('token', response.data.token);
        console.log('======Login===========', response);

        setTimeout(() => {
          navigation.replace('tab');
        }, 500);
      }
      if (response.status === 'fail') {
        console.log('status fail >>>>>', response.message);
      }
    } catch (error) {
      // Xử lý lỗi và hiển thị thông báo lỗi
      if (error.message) {
        ToastAndroid.show(
          'Tài khoản hoặc mật khẩu không đúng',
          ToastAndroid.SHORT,
        );
      }

      console.log('Error in handleLogin:', error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (forgotEmail === '') {
      Toast.show({type: 'error', text1: 'Vui lòng nhập email'});
      return;
    }

    try {
      const response = await forgotPassword(forgotEmail);
      if (response.status === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Vui lòng kiểm tra email của bạn để đặt lại mật khẩu',
        });
        setIsDialogVisible(false);
        setTimeout(() => {
          navigation.navigate('ResetPassword', {email: forgotEmail});
        }, 2000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Có lỗi xảy ra, vui lòng thử lại',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Có lỗi xảy ra, vui lòng thử lại',
      });
      console.log('Error in handleForgotPassword:', error.message);
    }
  };

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#C55402', '#CE8025', '#CE8025', '#EEEEEE']}
          style={{width: '100%', height: '100%', padding: 24}}>
          {/* Mã QR */}
          <Icon name="qrcode" style={styles.iconQr} onPress={handleQR} />

          <Text style={styles.labelQR}>Quét mã QR</Text>

          {/* Input Text */}
          <CustomInput
            containerStyle={{marginTop: 20}}
            placeholder={'Email'}
            onChangeText={setEmail}
          />
          <View style={{marginTop: 20}}>
            <CustomInput
              containerStyle={{marginTop: 20}}
              placeholder={'Mật khẩu'}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.showPasswordButton}
              onPress={() => setShowPassword(!showPassword)}></TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{alignSelf: 'flex-end'}}
            onPress={() => {
              setIsDialogVisible(true);
            }}>
            <Text style={{color: 'white', alignSelf: 'flex-end', margin: 5}}>
              Quên mật khẩu ?
            </Text>
          </TouchableOpacity>

          {/* button login */}
          <View style={{marginTop: 40}}>
            <TouchableOpacity style={styles.btnLogin} onPress={handleLogin}>
              <Text style={styles.textLogin}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>

          <View>
            <View style={styles.lineView} />
          </View>

          {/* Register */}
          <View style={{alignItems: 'center'}}>
            <Text style={styles.labelSigup}>Bạn chưa có tài khoản ?</Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.textSignup}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>

          {/* Nói linh tinh */}
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginBottom: hp(2),
            }}>
            <Text style={{textAlign: 'center'}}>
              Bằng việc đăng nhập, bạn đồng ý tuân thủ {'\n'} Điều khoản và điều
              kiện {'\n'} & Chính sách bảo mật của chúng tôi
            </Text>
          </View>
          <Toast config={toastConfig} />
        </LinearGradient>
      </TouchableWithoutFeedback>

      {/* Dialog for forgot password */}
      <Dialog.Container visible={isDialogVisible}>
        <Dialog.Title>Quên mật khẩu</Dialog.Title>
        <Dialog.Description>
          Vui lòng nhập email của bạn để nhận liên kết đặt lại mật khẩu.
        </Dialog.Description>
        <Dialog.Input
          placeholder="Email"
          onChangeText={setForgotEmail}
          value={forgotEmail}
        />
        <Dialog.Button label="Hủy" onPress={() => setIsDialogVisible(false)} />
        <Dialog.Button label="Gửi" onPress={handleForgotPassword} />
      </Dialog.Container>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: '#fff',
    flex: 1,
  },
  btnLogin: {
    width: '100%',
    height: 48,
    backgroundColor: '#E8900C',
    borderRadius: 8,
    alignItems: 'center',
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
  iconQr: {
    alignSelf: 'center',
    marginTop: hp(5),
    fontSize: hp(10),
    color: 'white',
  },
  labelQR: {
    alignSelf: 'center',
    fontSize: hp(2.5),
    marginBottom: 50,
    marginTop: 10,
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 1.6,
  },
  lineView: {
    borderTopWidth: 1,
    marginVertical: 30,
    borderColor: '#E0E0E0',
  },
  labelSigup: {
    marginBottom: 15,
    fontSize: 16,
  },
  textSignup: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  showPasswordButton: {
    position: 'absolute',
    right: 10,
    top: 30,
  },
});
