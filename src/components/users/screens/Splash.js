import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React,{useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = ({navigation}) => {

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          // Token có dữ liệu, chuyển đến màn hình User
          navigation.replace('tab');
        } else {
          // Token null, chuyển đến màn hình Login
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Lỗi khi lấy token:', error);
        // Nếu có lỗi, chuyển đến màn hình Login
        navigation.replace('Login');
      }
    };

    // Gọi hàm checkToken để kiểm tra token khi component được mount
    checkToken();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
})