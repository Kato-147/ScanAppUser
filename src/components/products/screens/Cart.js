import {
  Button,
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
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const Cart = ({navigation}) => {
  const [quantities, setQuantities] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const isFocused = useIsFocused();

console.log(cartItems,'cardddddddddddddddddddddddd');
  const handleMenu =()=>{
    console.log('Back to menu');
    navigation.navigate('Menu');
  }
  // Hợp nhất các mục trùng lặp dựa trên id và option
  const mergeCartItems = (items) => {
    const mergedItems = [];
    items.forEach(item => {
      const existingItem = mergedItems.find(
        mergedItem => mergedItem._id === item._id && mergedItem.option === item.option
      );
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        mergedItems.push({...item});
      }
    });
    return mergedItems;
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        let items = await AsyncStorage.getItem('cartItems');
        items = items ? JSON.parse(items) : [];
        console.log(items,'itemmmmmmmmmmmmmmmmmmmmmmmm');
          //setCartItems(items);
          setCartItems(mergeCartItems(items));
        
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    const updateStorage = async () => {
      try {
        await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error updating cart items in AsyncStorage:', error);
      }
    };
    updateStorage();
  }, [cartItems]);

  const increaseQuantity = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleDeleteItem = (id) => {
    const updatedCartItems = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCartItems);
  };

  // Hàm tăng số lượng sản phẩm
  // const increaseQuantity = id => {
  //   setQuantities(prev => ({
  //     ...prev,
  //     [id]: (prev[id] || 0) + 1,
  //   }));
  // };

  // // Hàm giảm số lượng sản phẩm
  // const decreaseQuantity = id => {
  //   setQuantities(prev => ({
  //     ...prev,
  //     [id]: Math.max((prev[id] || 0) - 1, 0),
  //   }));
  // };

  const renderItem = ({item}) => {
   // const quantity = quantities[item.id] || 0;

    console.log(item.name, item.quantity, '<<<<<<<<<<<<<<<<<<<<<');

    // console.log(image, '<<<<<<<<<<<<<');
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          console.log('id', item._id, item.name);
        }}>
        <View style={styles.itemFlatlist}>
        <Image
          source={{
            uri: item.image_url
              ? item.image_url
              : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
          }}
          style={styles.imageVoucherItem}
        />

          {/* text info */}
          <View style={{justifyContent: 'space-between'}}>
            {/* name */}
            <Text style={{color: 'black', fontSize: hp(2)}}>{item.name}</Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: hp(30),
              }}>
              {/* price */}
              <Text>{item.price}</Text>

              {/* quantity */}
              <View style={{flexDirection: 'row', display: 'flex', gap: 10}}>
                <TouchableOpacity onPress={() => decreaseQuantity(item._id, item.option)}>
                  <Icon name="minussquareo" size={24} color="black" />
                </TouchableOpacity>
                <Text>{item.quantity}</Text>
                <TouchableOpacity onPress={() => increaseQuantity(item._id, item.option)}>
                  <Icon name="plussquareo" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Button title="Xóa" onPress={() => handleDeleteItem(item._id)} color="red" />

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
            <Text
              style={{fontSize: hp(2.2), fontWeight: '500', color: '#E8900C'}}>
              GIỎ HÀNG
            </Text>

            {/* Total money */}
            {/* <View
              style={{
             
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
            </View> */}

            {/* pay button */}
            {/* <TouchableOpacity style={styles.payBtn}>
              <Text style={styles.payText}>Thanh toán</Text>
            </TouchableOpacity> */}
          </View>

          {/* Body */}

          {/* Voucher */}
          {/* <View style={styles.voucherContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Icon name="tagso" size={24} color="#E8900C" />

             
              <TextInput
                // value={query}
                placeholder="Nhập mã giảm giá"
                style={styles.voucherTextInput}
              />
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: '#E8900C',
                padding: hp(1.2),
                borderRadius: 8,
              }}>
              <Text style={{color: 'white', fontSize: hp(2)}}>Áp dụng</Text>
            </TouchableOpacity>
          </View> */}

          {/* menu */}
          <View style={{height: hp(82), width: '100%'}}>
            <FlatList
              // numColumns={1}
              showsVerticalScrollIndicator={false}
              style={{width: '100%'}}
              data={cartItems}
              renderItem={renderItem}
              keyExtractor={(item, index) =>
                item.id ? item.id.toString() : index.toString()
              }
            />
          </View>

          {/* Cart */}
          <View
            style={styles.paymentContainer}
            // onPress={handleCart}
          >
            <TouchableOpacity onPress={handleMenu} style={styles.payButtonContainer}>
              <Text style={styles.payButtonText}> TRỞ LẠI MENU </Text>
            </TouchableOpacity>

            {/* pay button */}
            <View style={styles.payButtonContainer}>
              <Text style={styles.payButtonText}>ĐẶT MÓN</Text>
            </View>
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
    justifyContent: 'space-between',
  },
  headerContainer: {
    height: hp(8),
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 3,
    paddingHorizontal: wp(8),
  },
  // payBtn: {
  //   width: hp(15),
  //   height: '100%',
  //   backgroundColor: '#E8900C',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
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
  // voucherContainer: {
  //   flexDirection: 'row',
  //   backgroundColor: 'white',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   paddingHorizontal: 15,
  //   //  marginBottom: 10,
  //   marginVertical: 20,
  //   height: hp(8),
  // },
  // iconVoucher: {},
  // voucherText: {
  //   color: 'black',
  //   fontSize: hp(2),
  // },
  // voucherTextInput: {
  //   //  backgroundColor: 'red',
  //   borderWidth: 1,
  //   borderColor: '#E8900C',
  //   height: hp(5),
  //   borderRadius: 8,
  //   width: hp(24),
  //   // alignItems:'center',
  //   //justifyContent:'center'
  // },
 
  paymentContainer: {
    width: wp(100),
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp(10),
    paddingHorizontal: wp(5),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    elevation: 5,
  },
  payButtonContainer: {
    backgroundColor: '#E8900C',
    borderRadius: 5,
    padding: 10,
  },
  payButtonText: {
    fontSize: hp(1.8),
    fontWeight: '500',
    color: 'white',
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
