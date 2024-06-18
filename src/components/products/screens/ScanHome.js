import { StyleSheet, Text, View, TouchableOpacity, Linking, Alert } from 'react-native'
import React,{useState} from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const ScanHome = () => {
  const [data, setData] = useState('scan something')
  return (

    <QRCodeScanner
    onRead={({data}) => setData(data)}
  //  flashMode={RNCamera.Constants.FlashMode.torch}
  reactivate={true}
  reactivateTimeout={100}
  showMarker={true}
  topContent={
    <View>
      <Text>{data}</Text>
    </View>
  }
  />

    // <QRCodeScanner
    //     onRead={this.onSuccess}
    //     flashMode={RNCamera.Constants.FlashMode.torch}
    //     topContent={
    //       <Text style={styles.centerText}>
    //         Go to{' '}
    //         <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
    //         your computer and scan the QR code.
    //       </Text>
    //     }
    //     bottomContent={
    //       <TouchableOpacity style={styles.buttonTouchable}>
    //         <Text style={styles.buttonText}>OK. Got it!</Text>
    //       </TouchableOpacity>
    //     }
    //   />
  )
}

export default ScanHome

const styles = StyleSheet.create({})