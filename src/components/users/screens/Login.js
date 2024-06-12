import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../../fragment/CustomInput';
import Icon from 'react-native-vector-icons/FontAwesome6'
import LinearGradient from 'react-native-linear-gradient';

const Login = ({navigation}) => {
  const [sdt, setSdt] = useState('');

  const DismissKeyboardHOC = Comp => {
    return ({children, ...props}) => (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Comp {...props}>{children}</Comp>
      </TouchableWithoutFeedback>
    );
  };
  const DismissKeyboardView = DismissKeyboardHOC(View);

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleQR = () => {
    navigation.navigate('ScanQR');
  };

  const handleOtpLogin = () =>{
navigation.navigate('OtpLogin');
  };

  return (
    <LinearGradient colors={['#C55402', '#CE8025', '#FFB266']} style={styles.container}>
      {/* Mã QR */}
      <DismissKeyboardView>


        <Icon name='qrcode' style={styles.iconQr} onPress={handleQR}/>

        <Text style={styles.labelQR}>Quét mã QR</Text>
      </DismissKeyboardView>
      {/* Input text */}

      {/* Input Text */}
      <CustomInput
        containerStyle={{marginTop: 20}}
        placeholder={'Email'}
        onChangeText={setSdt}
      />

      {/* button login */}
      <View style={{marginTop: 40}}>
        <TouchableOpacity style={styles.btnLogin} onPress={handleOtpLogin}>
          <Text
            // onPress={handleLogin}
            style={styles.textLogin}>
            Đăng nhập
          </Text>
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
          marginBottom: 20,
        }}>
        <Text style={{textAlign: 'center'}}>
          Bằng việc đăng nhập, bạn đồng ý tuân thủ {'\n'} Điều khoản và điều
          kiện {'\n'} & Chính sách bảo mật của chúng tôi
        </Text>
      </View>
    </LinearGradient>
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
    marginTop: 90,
    fontSize: 55,
    color: 'white'
  },
  labelQR: {
    alignSelf: 'center',
    fontSize: 12,
    marginBottom: 50,
    marginTop: 10,
    color:'white'
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
});
