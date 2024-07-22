import {StyleSheet, Text, View, TouchableOpacity, Linking} from 'react-native';
import React, {useState} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

const ScanQR = () => {
  const [data, setData] = useState('scan something');

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
  );
};

export default ScanQR;

const styles = StyleSheet.create({});
