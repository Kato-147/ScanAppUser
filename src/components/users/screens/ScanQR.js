import {StyleSheet, Text, View, TouchableOpacity, Linking} from 'react-native';
import React, {useState} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const ScanQR = ({navigation}) => {
  const [data, setData] = useState('scan something');

  const handleMenu = async scannedData => {
    if (scannedData) {
      // Lưu dữ liệu vào AsyncStorage nếu cần
      await AsyncStorage.setItem('idTableHome', scannedData);
      // Điều hướng đến màn hình Menu
    //  navigation.replace('Menu');
    }
  };

  const handleBack = () => {
    console.log('back to Home');
    navigation.goBack();
  };

  return (
    <QRCodeScanner
      onRead={({data: scannedData}) => {
        setData(scannedData); // Cập nhật state với dữ liệu đã quét
        handleMenu(scannedData); // Gọi hàm handleMenu khi có dữ liệu hợp lệ
      }}
      fadeIn={true}
      reactivate={true}
      reactivateTimeout={100}
      showMarker={true}
      // topp
      topContent={
        <View style={{flexDirection: 'row', justifyContent: 'space-between', display: 'flex', width: wp(100), paddingHorizontal: wp(10)}}>
          <TouchableOpacity onPress={handleBack}>
            <Icon style={styles.backIcon} name="left" />
          </TouchableOpacity>
          <Text>{data}</Text>
          <View></View>
        </View>
      }
      // Bottom
      bottomContent={
        <TouchableOpacity
          onPress={() => handleMenu('666c5a75c55050edf1b3168e')}>
          <Text> Menu</Text>
        </TouchableOpacity>
      }
    />
  );
};

export default ScanQR;

const styles = StyleSheet.create({
  backIcon: {
    fontSize: hp(3),
    color: 'black',
  },
});
