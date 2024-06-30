import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../users/screens/Login';
import Register from '../users/screens/Register';
import ScanQR from '../users/screens/ScanQR';
import OtpLogin from '../users/screens/OtpLogin';
import TabBar from './TabBar';
import ScanHome from '../products/screens/ScanHome';
import MyVoucher from '../products/screens/MyVoucher';
import Menu from '../products/screens/Menu';
import Splash from '../users/screens/Splash';
import UpdateInfo from '../products/screens/UpdateInfo';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    
      <Stack.Navigator initialRouteName='Splash' screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ScanQR" component={ScanQR} />
        <Stack.Screen name="OtpLogin" component={OtpLogin} />
        <Stack.Screen name="tab" component={TabBar} />
        <Stack.Screen name="ScanHome" component={ScanHome} />
        <Stack.Screen name="MyVoucher" component={MyVoucher} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="UpdateInfo" component={UpdateInfo} />
      </Stack.Navigator>
 
  );
};

export default Navigation;
