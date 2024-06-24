import {Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, ToastAndroid} from 'react-native';
import React,{useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import { infoProfile } from '../ProductsHTTP';

const Profile = () => {

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        const data = await infoProfile();
        setUserInfo(data);
      } catch (err) {
        setError(err.message);
        ToastAndroid.show(err.message, ToastAndroid.LONG);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileInfo();
  }, []);
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#FFB266', '#EEEEEE', '#EEEEEE', '#EEEEEE']}
      style={{width: '100%', height: '100%', padding: 24}}>
      {/* Info */}
      <View
        style={{
          backgroundColor: 'white',
          alignItems: 'center',
          borderRadius: 10,
          paddingVertical: 20,
        }}>
        {/* Avatar */}
        {userInfo ? (
        <>
          <Image source={{ uri: userInfo.img_avatar_url }} style={styles.avatarImage} />
          
        </>
      ) : (
        <View>
        <Image
          style={styles.avatarImage}
          source={require('../../../images/phoneVerify.png')}
        />
      </View>
      )}
        

        {/* Name */}
        <View style={{justifyContent: 'space-evenly'}}>
          <Text style={{fontSize: hp(3), fontWeight: '500', color: 'black'}}>
            Nguyen Van A
          </Text>
          <Text>nguyenvana@gmail.com</Text>
        </View>
      </View>
      <Text
        style={{
          color: 'black',
          fontWeight: '500',
          fontSize: hp(3),
          marginVertical: 15,
        }}>
        Cài đặt
      </Text>
      {/* Button something */}
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 10,
          paddingVertical: 20,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity style={styles.optionsetting}>
          <Text style={styles.textOptionsetting}>Chỉnh sửa thông tin</Text>
          <Icon name="right" style={styles.iconOptionsetting} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionsetting}>
          <Text style={styles.textOptionsetting}>Quản lý tài khoản/thẻ</Text>
          <Icon name="right" style={styles.iconOptionsetting} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionsetting}>
          <Text style={styles.textOptionsetting}>Cài đặt chung</Text>
          <Icon name="right" style={styles.iconOptionsetting} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={{
          backgroundColor: 'white',
          borderRadius: 10,
          marginVertical: 20,
          justifyContent: 'space-between',
        }} >
      <TouchableOpacity style={styles.optionsetting}>
          <Text style={[styles.textOptionsetting, {color:'#FF3333'}]}>Đăng xuất</Text>
          <Icon name="right" style={styles.iconOptionsetting} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    //  flexDirection: 'column',
    backgroundColor: 'white',
  },
  avatarImage: {
    width: hp(12),
    height: hp(12),
    borderRadius: 45,
    backgroundColor: 'white',
  },
  textOptionsetting: {
    color: 'black',
    fontSize: hp(2.1),
    fontWeight: '500',
  },
  optionsetting: {
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: 15,
  },
  iconOptionsetting: {
    fontSize: hp(2.5),
    color: '#C0C0C0',
  },
});
