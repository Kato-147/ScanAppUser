/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  if(remoteMessage.data.type === 'events'){
    console.log('-------NHẬN NOTI THÔNG BÁO-backGround---');
  } 
  if(remoteMessage.data.type === 'afterPayment'){
  //  await AsyncStorage.removeItem('idTable');
  //  await AsyncStorage.removeItem('tableNumber');
    console.log('-------NHẬN NOTI THANH TOÁN THÀNH CÔNG-backGround---');
  }
});



AppRegistry.registerComponent(appName, () => App);
