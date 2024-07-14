import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Navigation from './src/components/navigation/Navigation';
import {NavigationContainer} from '@react-navigation/native';
import Menu from './src/components/products/screens/Menu';
//////////////////////asdfasdfsadfsdfsa
const App = () => {
  return (
    <NavigationContainer>
      <Navigation />
      {/* <Menu/> */}
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
