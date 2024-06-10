import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import React from 'react';

const Register = ({navigation}) => {
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.login}> Đăng ký </Text>
      </View>
      <View style={{marginTop: 20}}>
        {/* Text input */}
        <View style={{marginTop: 30}}>
          <Text style={styles.lableInput}>Số điện thoại :</Text>
          <TextInput
            // onChangeText={setEmail}
            style={styles.input}
          />
        </View>

        {/* Text input */}
        <View style={{marginTop: 24}}>
          <Text style={styles.lableInput}>Mật khẩu :</Text>
          <TextInput
            // onChangeText={setPassword}
            style={styles.input}
            secureTextEntry={true}
          />
        </View>

        {/* Text input */}
        <View style={{marginTop: 24}}>
          <Text style={styles.lableInput}>Nhập mã Otp :</Text>
          <TextInput
            // onChangeText={setPassword}
            style={styles.input}
          />
        </View>
      </View>

      {/* Forgot password & register */}
      <View
        style={{
          marginTop: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity style={{}}>
          <Text style={{color: '#191d23'}}>Gửi mã Otp</Text>
        </TouchableOpacity>
      </View>

      {/* button login */}
      <View style={{marginTop: 40}}>
        <TouchableOpacity style={styles.btnLogin}>
          <Text onPress={handleLogin} style={styles.textLogin}>
            Xác nhận
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: '#fff',
  },

  login: {
    fontSize: 26,
    lineHeight: 40,
    fontWeight: '700',
    color: '#191919',
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
