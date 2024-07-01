import {
  Button,
  Image,
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
import React, {useState,useCallback} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/AntDesign';
import CustomInput from '../../fragment/CustomInput';
import {updateUser} from '../../users/UserHTTP';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { infoProfile } from '../ProductsHTTP';

const UpdateInfo = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [count, setCount] = useState(0);

  const handleUpdate = async () => {
  //  setCount(count + 1);
    try {
        // create formData 
      const formData = new FormData();
      formData.append('fullName', fullName); // change value of fullName in api
      formData.append('img_avatar_url', {
        uri: imageFile.uri,
        type: imageFile.type,
        name: imageFile.fileName
      }); // value of photo change value of img_avatar_url in api
      await updateUser(formData)  // send form data to updatee user
        .then((success) => {
            console.log('------------', success);
            console.log('>>>>>> Return Profile screen');
            ToastAndroid.show('Cập nhật thành công', ToastAndroid.SHORT);
           // setCount(count + 1);
            navigation.navigate('Profile');
        } ) // value success from api
        .catch(err => console.log(err, 'err'));
       
        
        
    
    } catch (error) {
      console.log(error);
    }
  };


 const takePhoto = useCallback(async (response) => {
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
          <View>
            <Button title="chụp" onPress={openCamera} />
            <Button title="chọn" onPress={openLibrary} />
            {image != '' ? (
              <Image source={{uri: image}} style={{width: 50, height: 50}} />
            ) : (
              <View style={{width: 50, height: 50, backgroundColor: 'red'}}>
                <Text style={{color: 'white', fontSize: 24, fontWeight: '500'}}>
                  HIhihaha
                </Text>
              </View>
            )}

            {/* Input Text */}
            <CustomInput
              containerStyle={{marginTop: 100}}
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
