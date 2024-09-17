import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import PushNotification from './pushNotification';

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


// Cấu hình notification khi app ở foreground
const displayNotification = (title, body) => {
  PushNotification.localNotification({
    title: title,
    message: body,
    defaultSound: 'wow_voice',

  largeIcon: 'food', // Icon lớn hiển thị trong thông báo
  smallIcon: 'food', // Icon nhỏ hiển thị trong thanh trạng thái
  });
};

// Lắng nghe tin nhắn khi ứng dụng ở foreground
messaging().onMessage(async remoteMessage => {
  const {title, body} = remoteMessage.notification;
  displayNotification(title, body);
  if(remoteMessage.data.type === 'events'){
    console.log('-------NHẬN NOTI THÔNG BÁO--pushnoti--');
  } 
  if(remoteMessage.data.type === 'afterPayment'){
   // await AsyncStorage.removeItem('idTable');
   // await AsyncStorage.removeItem('tableNumber');
    console.log('-------NHẬN NOTI THANH TOÁN THÀNH CÔNG--pushnoti--');
  }
});

//cấu hình back ground





// Kiểm tra tin nhắn khi ứng dụng được khởi động từ một thông báo (khi app bị kill và được mở lại)
messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      console.log(
        'Notification caused app to open from quit state:',
        remoteMessage.notification,
      );
    }
  });
