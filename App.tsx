import {StyleSheet} from 'react-native';
import React from 'react';
import Navigation from './src/components/navigation/Navigation';
import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
