import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  PermissionsAndroid,
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
import {updateUser} from '../../users/UserHTTP';

const UpdateInfo = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleUpdate = async () => {
    try {
      // Gọi hàm updateUser với các giá trị mới
      const updatedUser = await updateUser(fullName, avatarUrl);
      console.log('Thông tin người dùng đã được cập nhật:', updatedUser);
      ToastAndroid.show('Cập nhật thành công', ToastAndroid.SHORT);
      // Xử lý sau khi cập nhật thành công (ví dụ: thông báo thành công)
    } catch (error) {
      console.error(error.message);
      // Xử lý lỗi (ví dụ: thông báo lỗi)
    }
  };

  const requestCameraPermission = async () => {
    try {
      const checkPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      if (checkPermission === PermissionsAndroid.RESULTS.GRANTED) {
        const result = await launchCamera({mediaType:'photo',cameraType:'back'});
        console.log('Đây là result photo >>>>>>>',result);
    } else {
        console.log('bị từ chối ồi');
    }
    } catch (error) {
      console.log(error);
    }
  };

  //Back to Profile Screen
  const handleBack = () => {
    console.log('>>>>>> Click Back Button');
    navigation.navigate('Profile');
  };

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={handleBack}>
              <Icon name="arrowleft" size={24} color="#E8900C" />
            </TouchableOpacity>

            <Text style={styles.headerText}>CẬP NHẬT THÔNG TIN </Text>
          </View>

          {/* Body */}
          <View>
            <Button title="Chọn ảnh nhé" onPress={requestCameraPermission} />

            {/* Input Text */}
            <CustomInput
              containerStyle={{marginTop: 20}}
              placeholder={'Tên'}
              onChangeText={setFullName}
            />

            {/* Button Confirm change info */}
            <TouchableOpacity onPress={handleUpdate}>
              <View>
                <Text>Cập nhật</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default UpdateInfo;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    // backgroundColor: 'white',
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
