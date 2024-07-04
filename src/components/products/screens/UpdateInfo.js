import {
  Button,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PermissionsAndroid,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/AntDesign';
import CustomInput from '../../fragment/CustomInput';
import {updateUser} from '../../users/UserHTTP';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const UpdateInfo = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [showModal, setshowModal] = useState(false);

  // onclick to call api update info user
  const handleUpdate = async () => {
    try {
      const formData = new FormData(); // create formData
      formData.append('fullName', fullName); // change value of fullName in api
      formData.append('img_avatar_url', {
        uri: imageFile.uri,
        type: imageFile.type,
        name: imageFile.fileName,
      }); // value of photo change value of img_avatar_url in api
      await updateUser(formData) // send form data to updatee user
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

  const takePhoto = useCallback(async response => {
    if (response.didCancel) return;
    if (response.errorCode) return;
    if (response.errorMessage) return;
    if (response.assets && response.assets.length > 0) {
      const asset = response.assets[0];

      setImage(asset.uri); //show photo in screen
      setImageFile(asset); // send value of imageFile in form data

      setshowModal(false); //turn off modal
    }
  }, []);

  // take photo with camera
  const openCamera = useCallback(async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: true,
    };
    await launchCamera(options, takePhoto);
  }, []);

  // choose photo in library
  const openLibrary = useCallback(async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: true,
    };
    await launchImageLibrary(options, takePhoto);
  }, []);

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
          <View style={{paddingHorizontal: wp(4), marginTop: hp(3)}}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={showModal}
              onRequestClose={() => setshowModal(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <View style={{width: 25}}></View>
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={[styles.text2, {padding: 4}]}>
                        Thêm hình ảnh
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{width: 20, margin: 5}}
                      onPress={() => setshowModal(false)}>
                      {/* <MaterialCommunityIcons name='close' size={20} /> */}
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      width: '80%',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        openCamera();
                      }}>
                      <View style={{alignItems: 'center'}}>
                        {/* <MaterialCommunityIcons
                          name="camera"
                          color="black"
                          size={40}
                        /> */}
                        <Text style={styles.text1}>Chụp từ camera</Text>
                      </View>
                    </TouchableOpacity>
                    <Text>hoặc</Text>
                    <TouchableOpacity
                      onPress={() => {
                        openLibrary();
                      }}>
                      <View style={{alignItems: 'center'}}>
                        {/* <MaterialCommunityIcons
                          name="image-area"
                          color="black"
                          size={40}
                        /> */}
                        <Text style={styles.text1}>Lấy từ thư viện</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View></View>
                </View>
              </View>
            </Modal>

            {image != '' ? (
              <View style={styles.addedImageContainer}>
                <Image style={styles.addImage} source={{uri: image}}></Image>
                <TouchableOpacity
                  style={styles.icEdit1Container}
                  onPress={() => setshowModal(true)}>
                  {/* <Image source={require('../../media/icEdit.png')}></Image> */}
                  <Text>Edit</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.addImageContainer}>
                <TouchableOpacity
                  style={{alignItems: 'center'}}
                  onPress={() => setshowModal(true)}>
                  {/* <Image source={require('../../media/icPlus.png')}></Image> */}
                  <Text>+</Text>
                </TouchableOpacity>
                <Text style={styles.text1}>Add Cover Photo</Text>
              </View>
            )}

            {/* Input Text */}
            <CustomInput
              containerStyle={{marginTop: 100}}
              placeholder={'Tên'}
              onChangeText={setFullName}
            />
          </View>
          {/* Button Confirm change info */}
          <View
            style={{
              //
              justifyContent: 'flex-end',
              marginBottom: 20,
              width: '100%',
            }}>
            <TouchableOpacity onPress={handleUpdate}>
              <View
                style={{
                  alignItems: 'center',
                  height: hp(6),
                  backgroundColor: '#E8900C',
                  borderRadius: 8,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: hp(2),
                    fontWeight: '500',
                    color: 'white',
                  }}>
                  Cập nhật
                </Text>
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
    justifyContent: 'space-between',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    justifyContent: 'space-between',
    width: '90%',
    height: '40%',

    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  text1: {
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: 0.12,
    textAlign: 'center',
    color: '#4E4B66',
    width: 120,
  },
  addImageContainer: {
    height: 380,
    height: 183,
    borderRadius: 6,
    borderStyle: 'dashed',
    borderColor: '#4E4B66',
    borderWidth: 1,
    paddingVertical: 65,
    paddingHorizontal: 130,
    alignItems: 'center',
    gap: 8,
  },
  addImage: {
    width: 370,
    height: 220,
    borderRadius: 6,
  },
  addedImageContainer: {
    position: 'relative',
  },
});
