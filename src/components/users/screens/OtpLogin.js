import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon2 from 'react-native-vector-icons/Ionicons';
import CustomInput from '../../fragment/CustomInput';
import LinearGradient from 'react-native-linear-gradient';

const OtpLogin = ({navigation}) => {
  const [opt, setOtp] = useState('');

  const handleBack = () => {
    navigation.navigate('Login');
  };

  const handleHome = () => {
    navigation.navigate('tab');
  };

  return (

    <KeyboardAvoidingView>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <LinearGradient
      colors={['#C55402', '#CE8025', '#FFB266']}
      style={styles.container}>
      <View>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Icon2 name="chevron-back-outline" style={styles.iconBack} />
          </TouchableOpacity>

          <Text style={styles.labelLogin}>Đăng nhập</Text>
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

          {/* Input Text */}
          <CustomInput
            containerStyle={{marginTop: 5}}
            placeholder={'Nhập mã Otp'}
            onChangeText={setOtp}
          />

          {/* Send Otp */}
          <TouchableOpacity style={{alignSelf: 'flex-end', marginTop: 10}}>
            <Text style={{alignSelf: 'flex-end'}}>Gửi lại mã Otp</Text>
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
        <TouchableOpacity onPress={handleHome} style={styles.btnLogin}>
          <Text
            // onPress={handleLogin}
            style={styles.textLogin}>
            Xác nhận
          </Text>
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
  },
  labelLogin: {
    fontSize: 24,
    fontWeight: '500',
    color: 'white',
  },
  iconBack: {
    fontSize: 22,
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
});
