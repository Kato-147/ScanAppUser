import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// id ban 1 : 666c5a75c55050edf1b3168e
// id ban 3 : 6679893df3da9df0bfcf3da9
//{"tableId":"6679893df3da9df0bfcf3da9","type":"softQRCode"} : hardQRCode

const ScanHome = ({navigation}) => {
  const [data, setData] = useState('scan something');
  const [scanning, setScanning] = useState(true); // Trạng thái để quản lý việc kích hoạt máy quét

  const handleMenu = async scannedData => {
    if (scannedData) {
      // Lưu dữ liệu vào AsyncStorage nếu cần
      await AsyncStorage.setItem('idTable', scannedData);
      // Điều hướng đến màn hình Menu
      navigation.replace('Menu');
    }
  };

  // bàn 3 6679893df3da9df0bfcf3da9
  const fastGo = async () => {
    const cc = {tableId: '666c5a75c55050edf1b3168e', type: 'softQRCode'};
    await AsyncStorage.setItem('idTable', JSON.stringify(cc));
    navigation.replace('Menu');
  };

  const handleBack = () => {
    console.log('back to Home');
    navigation.goBack();
  };

  const handleScan = ({data: scannedData}) => {
    setData(scannedData);
    setScanning(false); // Dừng máy quét sau khi quét lần đầu
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            display: 'flex',
            width: wp(100),
            paddingHorizontal: wp(10),
          }}>
          <TouchableOpacity onPress={handleBack}>
            <Icon style={styles.backIcon} name="left" />
          </TouchableOpacity>
          <Text>{data}</Text>
          <View></View>
        </View>
      }
      // Bottom
      bottomContent={
        <TouchableOpacity onPress={() => fastGo()}>
          <Text style={{fontSize: hp(2), color: 'black'}}> Menu</Text>
        </TouchableOpacity>
      }
    />
  );
};

export default ScanHome;

const styles = StyleSheet.create({
  backIcon: {
    fontSize: hp(3),
    color: 'black',
  },
});
