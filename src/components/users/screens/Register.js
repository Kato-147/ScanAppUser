import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon2 from 'react-native-vector-icons/Ionicons';
import CustomInput from '../../fragment/CustomInput';
import {register} from '../UserHTTP';

const Register = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {

    console.log('btn register');
    if (email === '' || password === '' || fullName === '') {
      ToastAndroid.show('Vui lòng điền đầy đủ thông tin',ToastAndroid.SHORT);
      return;
    }

    try {
      const response = await register(fullName, email, password);
      console.log(response);
      if(response.status ==="succsess"){
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
      }

      if (response) {
        ToastAndroid.show('Register succseccfully', ToastAndroid.SHORT);
        setTimeout(() => {
          navigation.navigate('OtpLogin');
        }, 1000);

      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Lỗi đăng ký', ToastAndroid.SHORT);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#CE8025', '#FFB266', '#E0E0E0']}
          style={styles.container}>
          <View>
            <Text style={styles.login}> Đăng ký </Text>
          </View>

          <View style={{marginTop: 20}}>
            {/* Text input */}

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

          {/* button login */}
          <View style={{marginTop: 40}}>
            <TouchableOpacity style={styles.btnLogin}>
              <Text onPress={handleRegister} style={styles.textLogin}>
                Xác nhận
              </Text>
            </TouchableOpacity>
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
