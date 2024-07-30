import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const OtpAgain = () => {
  return (
    <View>
      <Text>OtpAgain</Text>
    </View>
  )
}

export default OtpAgain

const styles = StyleSheet.create({
    container: {
      padding: 24,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: 'white',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    labelLogin: {
      fontSize: 24,
      fontWeight: '500',
      color: 'white',
    },
    image: {
      width: 270,
      height: 270,
      alignSelf: 'center',
      marginTop: 40,
    },
    textOtp: {
      fontSize: 16,
      fontWeight: '500',
      color: 'white',
    },
    textSendOtp: {},
    btnLogin: {
      width: '100%',
      height: 48,
      backgroundColor: '#E8900C',
      borderRadius: 8,
      justifyContent: 'center',
    },
  
    textLogin: {
      fontSize: 17,
      lineHeight: 16,
      fontWeight: '500',
      color: '#fff',
      textAlign: 'center',
      width: '100%',
    },
  });