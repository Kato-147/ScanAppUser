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
} from 'react-native';
import React, {useState} from 'react';
import SearchBar from '../../fragment/SearchBar';
import IconQr from 'react-native-vector-icons/MaterialCommunityIcons';
import {SliderBox} from 'react-native-image-slider-box';

const Home = props => {
  const {navigation} = props;
  const [value, setValue] = useState();

  const updateSearch = value => {
    // setValue(value);
    //do your search logic or anything
    console.log(value);
  };

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

  const renderItem = ({item}) => {
    const {_id, image, name, description} = item;
    console.log(image,"<<<<<<<<<<<<<");
    return (
      
        <TouchableOpacity
          onPress={() => {
            // console.log(_id)
            // navigation.navigate('Detail', { newsId: _id });
          }}>
          <View style={styles.itemFlatlist}>
            <Image style={styles.imageVoucherItem} source={image} />
            <Text>{name}</Text>
            <Text>{description}</Text>
          </View>
        </TouchableOpacity>
  
    );
  };

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <SearchBar
              value={value}
              updateSearch={updateSearch}
              // style={{marginTop: '8%'}}
            />

            <IconQr name="qrcode-scan" size={26} style={styles.iconQr} />
          </View>

          {/* Body */}
          <View style={styles.bodyContainer}>
            {/* Maybe you care */}
            <View
              style={{backgroundColor: 'blue', justifyContent: 'space-evenly'}}>
              <Text>Có thể bạn quan tâm</Text>
              {/* Baner */}
              <View
                style={{
                  width: '80%',
                  height: '55%',
                  backgroundColor: 'red',
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <SliderBox
                  images={images}
                  sliderBoxHeight={200}
                  dotColor="#FFEE58"
                  inactiveDotColor="#90A4AE"
                  paginationBoxVerticalPadding={20}
                  autoplay
                  circleLoop
                  resizeMethod={'resize'}
                  resizeMode={'cover'}
                  paginationBoxStyle={styles.paginationBox}
                  dotStyle={styles.dotStyle}
                  ImageComponentStyle={styles.imageStyle}
                  imageLoadingColor="#2196F3"
                />
              </View>
            </View>

            {/* Voucher */}
            <View style={{backgroundColor: 'pink'}}>
              <Text>Voucher không thể bỏ lỡ</Text>
              <FlatList
              numColumns={2}
                showsVerticalScrollIndicator={false}
                 style={{width:'100%',height:'35%'}}
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item._id}
              />
            </View>
          </View>
        </View>
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
  },
  headerContainer: {
    height: '10%',
    backgroundColor: '#E8900C',
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  bodyContainer: {
    backgroundColor: 'yellow',
    display: 'flex',
  },
  paginationBox: {
    position: 'absolute',
    bottom: -30,
    padding: 0,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
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
  imageVoucherItem: {
    width: 50,
    height: 50,
    backgroundColor:"red"
  },
  itemFlatlist: {
     margin: 10, backgroundColor: 'lightgrey', padding: 20 
  },
});

const data = [
  {
    id: 1,
    image: {uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s'},
    name: 'Item 1',
    description: 'Description for item 1',
  },
  {
    id: 2,
    image: {uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s'},
    name: 'Item 2',
    description: 'Description for item 2',
  },
  {
    id: 3,
    image: {uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s'},
    name: 'Item 3',
    description: 'Description for item 3',
  },
  {
    id: 4,
    image: {uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s'},
    name: 'Item 3',
    description: 'Description for item 3',
  },
  {
    id: 5,
    image: {uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s'},
    name: 'Item 3',
    description: 'Description for item 3',
  },
  {
    id: 6,
    image: {uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s'},
    name: 'Item 3',
    description: 'Description for item 3',
  },
];
