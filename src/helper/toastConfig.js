// toastConfig.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BaseToast, ErrorToast} from 'react-native-toast-message';

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={styles.successToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      style={styles.errorToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
};

const styles = StyleSheet.create({
  successToast: {
    borderLeftColor: 'green',
  },
  errorToast: {
    borderLeftColor: 'red',
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  text1: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  text2: {
    fontSize: 13,
    color: '#555',
  },
});

export default toastConfig;
