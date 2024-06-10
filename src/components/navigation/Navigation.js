import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../users/screens/Login';
import Register from '../users/screens/Register';
import ScanQR from '../products/screens/ScanQR';
import {NavigationContainer} from '@react-navigation/native';
import OtpLogin from '../users/screens/OtpLogin';
import TabBar from './TabBar';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ScanQR" component={ScanQR} />
        <Stack.Screen name="OtpLogin" component={OtpLogin} />
        <Stack.Screen name="tab" component={TabBar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
