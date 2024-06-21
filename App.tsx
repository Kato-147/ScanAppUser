import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Navigation from './src/components/navigation/Navigation';
import {NavigationContainer} from '@react-navigation/native';
import Menu from './src/components/products/screens/Menu';

const App = () => {
  return (
    <NavigationContainer>
      {/* <StatusBar
        backgroundColor="transparent"  // Làm cho nền StatusBar trong suốt
       // translucent={true}  // Cho phép StatusBar chồng lên nội dung
        barStyle="dark-content"  // Màu sắc của văn bản và biểu tượng trên StatusBar
      /> */}
      <Navigation />
      {/* <Menu/> */}
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
