import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/AntDesign';

const Cart = () => {
  const renderItem = ({item}) => {
    const {_id, image, name, price} = item;
    console.log(image, '<<<<<<<<<<<<<');
    return (
      <TouchableOpacity
        onPress={() => {
          // console.log(_id)
          // navigation.navigate('Detail', { newsId: _id });
        }}>
        <View style={styles.itemFlatlist}>
          <Image style={styles.imageVoucherItem} source={image} />
          <View style={{justifyContent: 'space-between'}}>
            <Text style={{color: 'black', fontSize: hp(2)}}>{name}</Text>
            <View>
              <Text>{price}</Text>
              <View></View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={Keyboard.dismiss}>
        <View style={{width: '100%', height: '100%'}}>
          {/* Header */}
          <View style={styles.headerContainer}>
            {/* Total money */}
            <View
              style={{
                // backgroundColor: 'red',
                height: '100%',
                alignItems: 'flex-start',
                justifyContent: 'center',
                marginRight: 10,
                width: hp(10),
              }}>
              <Text>Tổng tiền</Text>
              <Text
                style={{
                  fontSize: hp(2.2),
                  fontWeight: '500',
                  color: '#E8900C',
                }}>
                đ 13.000
              </Text>
            </View>

            {/* pay button */}
            <TouchableOpacity style={styles.payBtn}>
              <Text style={styles.payText}>Thanh toán</Text>
            </TouchableOpacity>
          </View>

          {/* Body */}

          {/* Voucher */}
          <View style={styles.voucherContainer}>
            <Icon name="tagso" size={24} color="#E8900C" />

            {/* <Text style={styles.voucherText}>Nhập mã Voucher</Text> */}

            {/* TextInput */}
            <TextInput
              // value={query}
              placeholder="Nhập mã giảm giá"
              style={styles.voucherTextInput}
            />
            <TouchableOpacity
              style={{
                backgroundColor: '#E8900C',
                padding: hp(1.2),
                borderRadius: 8,
              }}>
              <Text style={{color: 'white', fontSize: hp(2)}}>Áp dụng</Text>
            </TouchableOpacity>
          </View>

          {/* menu */}
          <View style={{height: '77%', width: '100%'}}>
            <FlatList
              // numColumns={1}
              showsVerticalScrollIndicator={false}
              style={{width: '100%'}}
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) =>
                item.id ? item.id.toString() : index.toString()
              }
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  headerContainer: {
    height: hp(7),
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 3,
  },
  payBtn: {
    width: hp(15),
    height: '100%',
    backgroundColor: '#E8900C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payText: {
    fontSize: hp(2.2),
    //lineHeight: 16,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
  },
  imageVoucherItem: {
    width: hp(8.5),
    height: hp(8.5),
    marginHorizontal: 15,
    // backgroundColor: 'red',
  },
  itemFlatlist: {
    marginVertical: 10,
    backgroundColor: 'white',
    paddingVertical: 20,
    flexDirection: 'row',
    width: '100%',
  },
  voucherContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    //  marginBottom: 10,
    marginVertical: 20,
    height: hp(8),
  },
  iconVoucher: {},
  voucherText: {
    color: 'black',
    fontSize: hp(2),
  },
  voucherTextInput: {
    //  backgroundColor: 'red',
    borderWidth: 1,
    borderColor: '#E8900C',
    height: hp(5),
    borderRadius: 8,
    width: hp(20),
    // alignItems:'center',
    //justifyContent:'center'
  },
});

const data = [
  {
    id: '1',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
    },
    name: 'Chó hấp xả',
    price: '120.000',
  },
  {
    id: '2',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
    },
    name: 'Cầy giả heo',
    price: '80.000',
  },
  {
    id: '3',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
    },
    name: 'Chó om chuối',
    price: '90.000',
  },
  {
    id: '4',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
    },
    name: 'Mì gói súp xì tin',
    price: '30.000',
  },
  {
    id: '5',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
    },
    name: 'Cô ca cô hát',
    price: '15.000',
  },
  {
    id: '6',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
    },
    name: 'gà giả cầy',
    price: '70.000',
  },
  {
    id: '7',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
    },
    name: 'Cá chà bặc',
    price: '500.000',
  },
  {
    id: '8',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
    },
    name: 'Chem chép om dưa',
    price: '300.000',
  },
];
