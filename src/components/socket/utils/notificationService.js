import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';
import PushNotification from './pushNotificationConfig';

export async function requestUserPermission() {
  if (Platform.OS == 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
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
    console.log('FCM Token:', token);
  } catch (error) {
    console.log('Error during generating token', error);
  }
};

// Cấu hình notification khi app ở foreground
const displayNotification = (title, body) => {
  PushNotification.localNotification({
    title: title,  //
    message: body,
  });
};

// Lắng nghe tin nhắn khi ứng dụng ở foreground
messaging().onMessage(async remoteMessage => {
  const {title, body} = remoteMessage.notification;
  displayNotification(title, body);
});

// Lắng nghe sự kiện tin nhắn khi ứng dụng được khởi động từ một thông báo
messaging().onNotificationOpenedApp(remoteMessage => {
  console.log(
    'Notification caused app to open from background state:',
    remoteMessage.notification,
  );
});

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
