import { StyleSheet, Text, View, TouchableOpacity, Linking, Alert } from 'react-native'
import React,{useState, useEffect} from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ScanHome = ({navigation}) => {
  const [data, setData] = useState('scan something')
  const [scanning, setScanning] = useState(true); // Trạng thái để quản lý việc kích hoạt máy quét
  console.log(data);
  

  const handleMenu = async (scannedData) => {
    if (scannedData) {
      // Lưu dữ liệu vào AsyncStorage nếu cần
      await AsyncStorage.setItem('idTable', scannedData);
      // Điều hướng đến màn hình Menu
      navigation.navigate('Menu');
    }
  };
  
  const handleScan = ({ data: scannedData }) => {
    setData(scannedData);
    setScanning(false); // Dừng máy quét sau khi quét lần đầu
  };

  return (

    <QRCodeScanner
    onRead={({ data: scannedData }) => {
      setData(scannedData); // Cập nhật state với dữ liệu đã quét
      handleMenu(scannedData); // Gọi hàm handleMenu khi có dữ liệu hợp lệ
    }}
    fadeIn={true}
    reactivate={true}
    reactivateTimeout={100}
    showMarker={true}
    topContent={
      <View>
        <Text>{data}</Text>
      </View>
    }
    // bottomContent={
    //   <TouchableOpacity onPress={() => handleMenu(data)}>
    //     <Text> Menu</Text>
    //   </TouchableOpacity>
    // }
  />
  )
}

export default ScanHome

const styles = StyleSheet.create({

})