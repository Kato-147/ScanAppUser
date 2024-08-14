import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon2 from 'react-native-vector-icons/Ionicons';
import CustomInput from '../../fragment/CustomInput';
import {register} from '../UserHTTP';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Register = ({navigation}) => {
  // const [fullName, setFullName] = useState('hihihaha');
  // const [email, setEmail] = useState('oroki147@gmail.com');
  // const [password, setPassword] = useState('Tt123456789');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigation.goBack('Login');
  };

  const handleRegister = async () => {
    console.log('btn register');
    if (fullName === '' || email === '' || password === '') {
      ToastAndroid.show('Vui lòng điền đầy đủ thông tin', ToastAndroid.SHORT);
      return;
    }
    try {
      // Call register function form http
      const response = await register(fullName, email, password);
      console.log(response, 'response from register');

      //Send email to OtpLogin screen when register is successful
      if (response.status === 'success') {
        ToastAndroid.show( 'Đăng ký thành công' , ToastAndroid.SHORT);
        setTimeout(() => {
          navigation.navigate('OtpLogin', {email});
        }, 500);
      }
      if (response.status === 'fail') {
        console.log(response.message);
      }
    } catch (error) {
      // Handle error and show error message
      console.log('Error in handleRegister:', error.message);
      Alert.alert(error.message)
     // ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  };

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#C55402', '#CE8025', '#CE8025', '#EEEEEE']}
          style={styles.container}>
          {/* header */}
          <View>
            <TouchableOpacity onPress={handleLogin}>
              <Icon2 name="chevron-back-outline" size={24} color="white" />
            </TouchableOpacity>

            <View>
              <Text style={styles.login}> Đăng ký </Text>
            </View>
          </View>

          {/* Text input */}
          <View style={{marginTop: 20}}>
            <CustomInput
              containerStyle={{marginTop: 20}}
              placeholder={'Tên'}
              onChangeText={setFullName}
            />

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
          </View>
          <TouchableOpacity
          onPress={() => navigation.navigate('OtpLogin', email)}
          activeOpacity={0.5}
          style={{alignSelf:'flex-end'}}>
          <Text style={{color:'white', alignSelf:'flex-end', margin:5}}>Xác minh mã Otp</Text>
          </TouchableOpacity>

          {/* button login */}
          <View style={{marginTop: 40}}>
            <TouchableOpacity onPress={handleRegister} style={styles.btnLogin}>
              <Text style={styles.textLogin}>Xác nhận</Text>
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
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    width: '100%',
    height: '100%',
    display: 'flex',
  },

  login: {
    fontSize: 26,
    lineHeight: 40,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
  },

  lableInput: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: '#191d23',
    textAlign: 'left',
    overflow: 'hidden',
    width: 312,
    height: 24,
    marginBottom: 8,
  },

  input: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    color: '#928fa6',
    textAlign: 'left',
    overflow: 'hidden',
    width: '100%',
    height: 48,
    backgroundColor: '#ffff',
    borderStyle: 'solid',
    borderColor: '#E8900C',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
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
    width: '13%',
    height: '19%',
    marginTop: 60,
    alignSelf: 'center',
    marginBottom: 10,
  },
  labelQR: {
    alignSelf: 'center',
    fontSize: 12,
  },
});
