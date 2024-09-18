import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon2 from 'react-native-vector-icons/Ionicons';
import CustomInput from '../../fragment/CustomInput';
import {resetPassword} from '../UserHTTP';
import Toast from 'react-native-toast-message';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordResetCode, setPasswordResetCode] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const {email} = route.params;

  const handleResetPassword = async () => {
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      await resetPassword(email, password, passwordResetCode);
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Mật khẩu đã được đặt lại',
      });
      navigation.navigate('Login');
    } catch (err) {
      setError(err.message);
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon2 name="chevron-back-outline" size={24} color="white" />
            </TouchableOpacity>

            <View>
              <Text style={styles.title}>Đặt lại mật khẩu</Text>
            </View>
          </View>

          {/* Text input */}
          <View style={{marginTop: 20}}>
            <CustomInput
              containerStyle={{marginTop: 20}}
              placeholder={'Mã đặt lại mật khẩu'}
              onChangeText={setPasswordResetCode}
            />
            <CustomInput
              containerStyle={{marginTop: 20}}
              placeholder={'Mật khẩu mới'}
              secureTextEntry
              onChangeText={setPassword}
            />
            <CustomInput
              containerStyle={{marginTop: 20}}
              placeholder={'Xác nhận mật khẩu'}
              secureTextEntry
              onChangeText={setConfirmPassword}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* button reset password */}
          <View style={{marginTop: 40}}>
            <TouchableOpacity onPress={handleResetPassword} style={styles.btnLogin}>
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
              Bằng việc đặt lại mật khẩu, bạn đồng ý tuân thủ {'\n'} Điều khoản và điều
              kiện {'\n'} & Chính sách bảo mật của chúng tôi
            </Text>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  title: {
    fontSize: 26,
    lineHeight: 40,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
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
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default ResetPassword;
