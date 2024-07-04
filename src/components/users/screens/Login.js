import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ToastAndroid
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomInput from '../../fragment/CustomInput';
import Icon from 'react-native-vector-icons/FontAwesome6'
import LinearGradient from 'react-native-linear-gradient';
import { login } from '../UserHTTP';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('oroki147@gmail.com');
  const [password, setPassword] = useState('Tt123456')

  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('')
 
  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleQR = () => {
    navigation.navigate('ScanQR');
  };

  const handleLogin = async () =>{
    console.log('login');

    if (email === '' || password === '') {
      ToastAndroid.show('Vui lòng điền đầy đủ thông tin', ToastAndroid.SHORT);
      return;
    }

    try {
      // Gọi hàm login
      const response = await login(email, password);

      // Xử lý phản hồi thành công
      if (response.status === 'success') {
       // ToastAndroid.show(response.message, ToastAndroid.SHORT);
       await AsyncStorage.setItem('token', (response.data.token));
       console.log('======TOKENNNNNNNNN===========');
       console.log(response.data.token);
        setTimeout(() => {
          navigation.navigate('tab');
        }, 500);
      }
      if (response.status === 'fail') {
        console.log('status fail >>>>>',response.message);
      }
      
    } catch (error) {
      // Xử lý lỗi và hiển thị thông báo lỗi
      if(error.message){
        ToastAndroid.show('Tài khoản hoặc mật khẩu không đúng',ToastAndroid.SHORT);
      }

      console.log('Error in handleLogin:', error.message);
    }

  };

  return (
    
    <KeyboardAvoidingView>
    <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
    <LinearGradient colors={['#CE8025', '#FFB266', '#E0E0E0']} style={{width:'100%', height:'100%', padding: 24}}>
     
     {/* Mã QR */}
       <Icon name='qrcode' style={styles.iconQr} onPress={handleQR}/>

       <Text style={styles.labelQR}>Quét mã QR</Text>

     {/* Input Text */}
     <CustomInput
       containerStyle={{marginTop: 20}}
       placeholder={'Email'}
       onChangeText={setEmail}
     />
     <CustomInput
       containerStyle={{marginTop: 20}}
       placeholder={'Mật khẩu'}
       onChangeText={setPassword}
     />

     {/* button login */}
     <View style={{marginTop: 40}}>
       <TouchableOpacity style={styles.btnLogin} onPress={handleLogin}>
         <Text
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
    </TouchableWithoutFeedback>
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
