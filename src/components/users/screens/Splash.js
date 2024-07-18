import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {useSharedValue, withSpring} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

const Splash = ({navigation}) => {
  const ring1padding = useSharedValue(0);
  const ring2padding = useSharedValue(0);

  useEffect(() => {
    ring1padding.value = 0;
    ring2padding.value = 0;
    setTimeout(
      () => (ring1padding.value = withSpring(ring1padding.value + hp(5))),
      100,
    );
    setTimeout(
      () => (ring2padding.value = withSpring(ring2padding.value + hp(5, 5))),
      300,
    );

    // setTimeout(() => navigation.navigate('Home'),2500);
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      ring1padding.value = 0;
      ring2padding.value = 0;
      setTimeout(
        () => (ring1padding.value = withSpring(ring1padding.value + hp(5))),
        100,
      );
      setTimeout(
        () => (ring2padding.value = withSpring(ring2padding.value + hp(5, 5))),
        300,
      );

      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          // Token có dữ liệu, chuyển đến màn hình User
          setTimeout(() => navigation.replace('tab'), 1000);
        } else {
          // Token null, chuyển đến màn hình Login
          setTimeout(() => navigation.replace('Login'), 1000);
        }
      } catch (error) {
        console.error('Lỗi khi lấy token:', error);
        // Nếu có lỗi, chuyển đến màn hình Login
        setTimeout(() => navigation.replace('Login'), 1000);
      }
    };

    // Gọi hàm checkToken để kiểm tra token khi component được mount
    checkToken();
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#C55402', '#CE8025', '#CE8025', '#EEEEEE']}
      style={styles.container}>
      {/* <StatusBar style="light"/> */}

      {/* logo image with rings */}
      <Animated.View style={[styles.rings, {padding: ring2padding}]}>
        <Animated.View style={[styles.rings, {padding: ring1padding}]}>
          <Image
            source={require('../../../images/food.png')}
            style={{width: hp(20), height: hp(20)}}
          />
        </Animated.View>
      </Animated.View>

      {/* title and punchline */}
      <View style={{alignItems: 'center', marginTop: 8}}>
        <Text
          style={{
            fontWeight: 'bold',
            color: '#fff',
            letterSpacing: 1.6,
            fontSize: hp(7),
          }}>
          Ngon Restaurant
        </Text>
        <Text
          style={{
            fontWeight: '600',
            color: '#fff',
            letterSpacing: 1.6,
            fontSize: hp(2),
          }}>
          Ăn ngon hơn khi tải ứng dụng này ^_^ !
        </Text>
      </View>
    </LinearGradient>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF9800',
  },
  rings: {
    backgroundColor: '#ffffff4d',
    borderRadius: 999,
  },
});
