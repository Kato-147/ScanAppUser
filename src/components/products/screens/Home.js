import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import SearchBar from '../../fragment/SearchBar';
import IconQr from 'react-native-vector-icons/MaterialCommunityIcons';
import IconChat from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused} from '@react-navigation/native';
import {infoProfile} from '../ProductsHTTP';
import Loading from '../../fragment/Loading';

const Home = props => {
  const {navigation} = props;
  const [userInfo, setUserInfo] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const fetchProfileInfo = async () => {
        try {
          const data = await infoProfile();
          setUserInfo(data);
        } catch (err) {
          setError(err.message);
          ToastAndroid.show(err.message, ToastAndroid.SHORT);
        }
      };
      fetchProfileInfo();
    }
  }, [isFocused]);

  const handleScanHome = () => {
    navigation.navigate('ScanHome');
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={{}}
        activeOpacity={1}
        onPress={() => {
          console.log(item.id);
          // navigation.navigate('Detail', { newsId: _id });
        }}>
        <View style={styles.itemFlatlist}>
          <Image style={styles.imageVoucherItem} source={item.image} />
          <Text>{item.name}</Text>
          {/* <Text>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#C96913', '#FFB266', '#F6F6F6', '#F6F6F6']}
          style={styles.container}>
          {/* Header */}
          <View style={styles.headerContainer}>
            {userInfo === null ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: wp(80),
                  gap: wp(5),
                }}>
                <ActivityIndicator size="large" color="#0000ff" />
                {/* style={styles.avatarImage} */}
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: wp(80),
                  gap: wp(5),
                }}>
                <Image
                  source={{uri: userInfo.data.user.img_avatar_url}}
                  style={styles.avatarImage}
                />
                <Text
                  style={{
                    fontSize: hp(2.2),
                    letterSpacing: 1,
                    fontWeight: 'bold',
                    color: '#000000',
                  }}>
                  {userInfo.data.user.fullName}
                </Text>
              </View>
            )}
            <TouchableOpacity>
              <IconChat
                name="chatbox-ellipses-outline"
                size={wp(7)}
                color="#E8900C"
              />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={styles.bodyContainer}>
            {/* Scan Here */}
            <View
              style={{
                justifyContent: 'space-evenly',
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: hp(8),
              }}>
              <Text
                style={{
                  marginStart: 24,
                  fontSize: hp(2.3),
                  fontWeight: '500',
                  color: 'white',
                  marginTop: 10,
                }}>
                Quét mã để xem Menu
              </Text>
              <TouchableOpacity onPress={handleScanHome}>
                <IconQr name="qrcode-scan" style={styles.iconQr} />
              </TouchableOpacity>
            </View>

            {/* Voucher */}
            <View style={{height: hp(60)}}>
              <Text
                style={{
                  fontSize: hp(2.8),
                  fontWeight: '500',
                  color: 'black',
                  marginTop: 5,
                  marginStart: 24,
                }}>
                Thông báo
              </Text>
              <FlatList
                numColumns={2}
                showsVerticalScrollIndicator={false}
                style={{width: hp(45), alignSelf: 'center'}}
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) =>
                  item.id ? item.id.toString() : index.toString()
                }
              />
            </View>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  iconQr: {
    color: 'white',
    fontSize: wp(20),
  },
  headerContainer: {
    height: hp(10),
    width: wp(100),
    // backgroundColor: '#E8900C',
    backgroundColor: 'white',
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  bodyContainer: {
    //  backgroundColor: 'yellow',
    display: 'flex',
    // width: hp(10)
  },
  avatarImage: {
    width: hp(6),
    height: hp(6),
    borderRadius: 45,
    // backgroundColor: 'red',
    color: 'white',
  },
  imageStyle: {
    borderRadius: 15,
    width: 50,
    height: 50,
    marginTop: 5,
  },
  imageVoucherItem: {
    width: 50,
    height: 50,
    backgroundColor: 'red',
  },
  itemFlatlist: {
    margin: 5,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    // alignSelf:'center',
    width: hp(21),
  },
});

const data = [
  {
    id: '1',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
    },
    name: 'Item 1',
    description: 'Description for item 1',
  },
  {
    id: '2',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
    },
    name: 'Item 2',
    description: 'Description for item 2',
  },
  {
    id: '3',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
    },
    name: 'Item 3',
    description: 'Description for item 3',
  },
  {
    id: '4',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
    },
    name: 'Item 3',
    description: 'Description for item 3',
  },
  {
    id: '5',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
    },
    name: 'Item 3',
    description: 'Description for item 3',
  },
  {
    id: '6',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
    },
    name: 'Item 3',
    description: 'Description for item 3',
  },
  {
    id: '7',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
    },
    name: 'Item 3',
    description: 'Description for item 3',
  },
  {
    id: '6',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
    },
    name: 'Item 8',
    description: 'Description for item 3',
  },
];
