import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../users/screens/Login';
import Register from '../users/screens/Register';
import ScanQR from '../users/screens/ScanQR';
import OtpLogin from '../users/screens/OtpLogin';
import TabBar from './TabBar';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ScanQR" component={ScanQR} />
        <Stack.Screen name="OtpLogin" component={OtpLogin} />
        <Stack.Screen name="tab" component={TabBar} />
        {/* <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ScanHome" component={ScanHome} />
        <Stack.Screen name="Voucher" component={Voucher} /> */}
      </Stack.Navigator>
 
  );
};

export default Navigation;
