import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import { Linking } from 'react-native';

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },

  // (required) Called when a remote or local notification is opened or received
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);

   // Kiểm tra màu sắc của thông báo
  if (notification.color === 'blue') {
    // Nếu màu là xanh dương, mở một URL hoặc deep link
    Linking.openURL('myapp://order'); // Thay thế 'your-app-scheme' bằng scheme của ứng dụng
  }


    // process the notification
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // ANDROID ONLY: (optional) GCM Sender ID.
  senderID: 'YOUR GCM SENDER ID',

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

export default PushNotification;
