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
import {updatePassword} from '../../users/UserHTTP';
import LinearGradient from 'react-native-linear-gradient';

const UpdatePassword = ({navigation}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  //Back to Profile Screen
  const handleBack = () => {
    console.log('>>>>>> Click Back Button');
    navigation.goBack();
  };

  const handleCheckPassword = () => {
    newPassword1 === newPassword
      ? setPasswordError('')
      : setPasswordError('Xác nhận mật khẩu không đúng');
  };

  // onclick to call api update password user
  const handleUpdate = async () => {
    handleCheckPassword();
    try {
      await updatePassword(currentPassword, newPassword)
        .then(success => {
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
  };

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#ffffff', '#ffffff', '#ffffff', '#F6F6F6']}
          style={styles.container}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={handleBack}>
              <Icon name="arrowleft" size={24} color="#E8900C" />
            </TouchableOpacity>

            <Text style={styles.headerText}>THAY ĐỔI MẬT KHẨU </Text>
          </View>

<View style={{justifyContent:'space-between', height: hp(90) }}>
 {/* Body */}
 <View style={{paddingHorizontal:wp(10), gap: hp(5), marginTop: hp(10)}}>
            {/* Input Text */}
            <CustomInput
              containerStyle={{}}
              placeholder={'Mật khẩu cũ'}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />

            <CustomInput
              containerStyle={{}}
              placeholder={'Mật khẩu mới'}
              onChangeText={setNewPassword1}
              error={passwordError}
              secureTextEntry
            />

            <CustomInput
              containerStyle={{}}
              placeholder={'Nhập lại mật khẩu mới'}
              error={passwordError}
              secureTextEntry
              onChangeText={setNewPassword}
            />
          </View>

          {/* Button Ok */}
          <TouchableOpacity
            style={{
              alignItems: 'center',
              height: hp(6),
              backgroundColor: '#E8900C',
              borderRadius: 8,
              justifyContent: 'center',
              margin: wp(10),
            }}
            onPress={handleUpdate}>
            <Text style={{fontSize: hp(2), fontWeight: '500', color: 'white'}}>
              Xác nhận
            </Text>
          </TouchableOpacity>

</View>

        </LinearGradient>
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
    height: hp(8),
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
