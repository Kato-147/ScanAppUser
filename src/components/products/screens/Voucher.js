import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  FlatList,
  Image
} from 'react-native';
import React, {useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import SearchBar from '../../fragment/SearchBar';
import {SliderBox} from 'react-native-image-slider-box';


const Voucher = ({navigation}) => {
  const [value, setValue] = useState();

  const handleMyVoucher = () => {
    navigation.navigate('MyVoucher');
  }

  const updateSearch = value => {
    // setValue(value);
    //do your search logic or anything
    console.log(value);
  };

  const renderItem = ({item}) => {
  //  const {_id, image, name, description} = item;
    console.log(item.image, '<<<<<<<<<<<<<');
    return (
      <TouchableOpacity
      style={{   }}
      activeOpacity={1}
        onPress={() => {
           console.log(item.id)
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
          colors={['#FFB266', '#EEEEEE', '#EEEEEE', '#EEEEEE']}
          style={styles.container}>

          {/* Search bar */}
          <SearchBar style={{alignSelf:'center', marginTop: 10 }} value={value} updateSearch={updateSearch} />

          {/* Baner */}
          <View
            style={{
              width: '80%',
              height: hp(15),
              backgroundColor: 'yellow',
              alignSelf: 'center',
              justifyContent: 'center',
              marginVertical: 20,
            }}>
            <SliderBox
              images={images}
              sliderBoxHeight={200}
              dotColor="#FFEE58"
              inactiveDotColor="#90A4AE"
              paginationBoxVerticalPadding={20}
              autoplay
              circleLoop
              // resizeMethod={'resize'}
              // resizeMode={'cover'}
              // paginationBoxStyle={styles.paginationBox}
              dotStyle={styles.dotStyle}
              ImageComponentStyle={styles.imageStyle}
              imageLoadingColor="#2196F3"
            />
          </View>

          {/* See your voucher */}
          <TouchableOpacity
          onPress={handleMyVoucher}
            activeOpacity={0.8}
            style={styles.seeVoucherContainer}>
            <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
              <Icon name="tagso" size={24} color="#E8900C" />
              <Text style={styles.voucherText}>Xem ưu đãi của bạn</Text>
            </View>

            <Icon Icon name="right" size={24} color="#E8900C" />
          </TouchableOpacity>

          {/* Vouchers hot */}

          <View style={{height: hp(55)}}>
            <View style={{flexDirection:'row', alignItems:'center', gap: 10, margin: 15}}>
              <Icon2 name='fire-alt' size={24} color="#E8900C"/>
            <Text
                style={{
                  fontSize: hp(2.3),
                  fontWeight: '500',
                  color: 'black',
                  marginTop: 5
                }}>
                Các Voucher hot
              </Text>
            </View>
           
           <View style={{height: hp(46.5)}}>
           <FlatList
                numColumns={2}
                showsVerticalScrollIndicator={false}
                style={{width: hp(45), alignSelf:'center'}}
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

export default Voucher;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 0,
    padding: 0,
    margin: 0,
    display: 'none',
  },
  imageStyle: {
    borderRadius: 15,
    width: 50,
    height: 50,
    marginTop: 5,
  },
  seeVoucherContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginVertical: 20,
    height: hp(6.5),
    marginHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8900C',
  },
  iconVoucher: {},
  voucherText: {
    color: 'black',
    fontSize: hp(2),
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
    width:hp(21),
    
  },
});

const images = [
  require('../../../images/iconQr.png'),
  require('../../../images/phoneVerify.png'),
  require('../../../images/iconQr.png'),
  require('../../../images/phoneVerify.png'),
  require('../../../images/iconQr.png'),
  require('../../../images/phoneVerify.png'),
  require('../../../images/iconQr.png'),
  require('../../../images/phoneVerify.png'),
];

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
    id: '8',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
    },
    name: 'Item 8',
    description: 'Description for item 3',
  },
];

