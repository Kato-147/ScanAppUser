import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';

export async function requestUserPermission() {
  if (Platform.OS == 'android' && Platform.Version < 33) {
    getFCMToken();
  } else if (Platform.OS == 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('getfcm');

      getFCMToken();
    } else {
      console.log('Permission denied');
    }
  }
}

const getFCMToken = async () => {
  try {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    // Lưu token vào AsyncStorage
    await AsyncStorage.setItem('fcmToken', token);
   // console.log('FCM Token:', token);
  } catch (error) {
    console.log('Error during generating token', error);
  }
};
