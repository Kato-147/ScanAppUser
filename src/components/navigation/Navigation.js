import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../users/screens/Login';
import Register from '../users/screens/Register';
import ScanQR from '../users/screens/ScanQR';
import OtpLogin from '../users/screens/OtpLogin';
import TabBar from './TabBar';
import ScanHome from '../products/screens/ScanHome';
import Menu from '../products/screens/Menu';
import Splash from '../users/screens/Splash';
import UpdateInfo from '../products/screens/UpdateInfo';
import UpdatePassword from '../products/screens/UpdatePassword';
import Cart from '../products/screens/Cart';
import HistoryOrder from '../products/screens/HistoryOrder';
import DetailHistoryOrder from '../products/screens/DetailHistoryOrder';
import Help from '../products/screens/Help';
import DetailNews from '../products/screens/DetailNews';
import MenuNoLogin from '../users/screens/MenuNoLogin';
import DetailMenuItem from '../products/screens/DetailMenuItem';
import ResetPassword from '../users/screens/ResetPassword';
import PaymentStatistics from '../products/screens/PaymentStatistics';
import {useLinkTo} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';


const Stack = createNativeStackNavigator();

const Navigation = () => {
  const linkTo = useLinkTo();

  useEffect(() => {
    // Lắng nghe sự kiện tin nhắn khi ứng dụng được khởi động từ một thông báo
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      if(remoteMessage.data.type === 'events'){
        linkTo('/tab');
      }else if(remoteMessage.data.type === 'afterPayment'){
        linkTo('/HistoryOrder');
      }
      
    });
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ScanQR" component={ScanQR} />
      <Stack.Screen name="OtpLogin" component={OtpLogin} />
      <Stack.Screen name="tab" component={TabBar} />
      <Stack.Screen name="ScanHome" component={ScanHome} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="Menu" component={Menu} />
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="UpdateInfo" component={UpdateInfo} />
      <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="HistoryOrder" component={HistoryOrder} />
      <Stack.Screen name="DetailHistoryOrder" component={DetailHistoryOrder} />
      <Stack.Screen name="DetailNews" component={DetailNews} />
      <Stack.Screen name="MenuNoLogin" component={MenuNoLogin} />
      <Stack.Screen name="DetailMenuItem" component={DetailMenuItem} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="PaymentStatistics" component={PaymentStatistics} />
    </Stack.Navigator>
  );
};

export default Navigation;
