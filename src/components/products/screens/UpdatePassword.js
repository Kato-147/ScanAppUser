import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/AntDesign';
import CustomInput from '../../fragment/CustomInput';
import { updatePassword } from '../../users/UserHTTP';

const UpdatePassword = ({navigation}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  //Back to Profile Screen
  const handleBack = () => {
    console.log('>>>>>> Click Back Button');
    navigation.navigate('Profile');
  };

  const handleCheckPassword = () => {
    newPassword1 === newPassword
      ? setPasswordError('')
      : setPasswordError('Xác nhận mật khẩu không đúng');
  };

    // onclick to call api update password user
  const handleUpdate = async() => {
    handleCheckPassword();
    try {
        await updatePassword(currentPassword, newPassword).then(success => {
            console.log('------------', success);
            console.log('>>>>>> Return Profile screen');
            ToastAndroid.show('Cập nhật thành công', ToastAndroid.SHORT);
            // setCount(count + 1);
            navigation.navigate('Profile');
          }) // value success from api
          .catch(err => console.log(err, 'err'));
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={handleBack}>
              <Icon name="arrowleft" size={24} color="#E8900C" />
            </TouchableOpacity>

            <Text style={styles.headerText}>THAY ĐỔI MẬT KHẨU </Text>
          </View>

          {/* Body */}
          <View>
            {/* Input Text */}
            <CustomInput
              containerStyle={{marginTop: 100}}
              placeholder={'Mật khẩu cũ'}
              onChangeText={setCurrentPassword}
            />

            <CustomInput
              containerStyle={{marginTop: 100}}
              placeholder={'Mật khẩu mới'}
                onChangeText={setNewPassword1}
              error={passwordError}
              secureTextEntry
            />

            <CustomInput
              containerStyle={{marginTop: 100}}
              placeholder={'Mật khẩu mới'}
              error={passwordError}
              secureTextEntry
              onChangeText={setNewPassword}
            />
          </View>

          {/* Button Ok */}
          <TouchableOpacity onPress={handleUpdate}>
            <Text>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default UpdatePassword;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'space-between',
  },
  headerContainer: {
    height: hp(7),
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
});
