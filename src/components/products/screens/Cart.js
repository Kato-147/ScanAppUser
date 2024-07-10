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
import {useIsFocused} from '@react-navigation/native';
import { postOrder } from '../ProductsHTTP';

const Cart = ({navigation}) => {

  const [cartItems, setCartItems] = useState([]);
  const [cartItemUI, setCartItemUI] = useState([])
 // console.log(cartItemUI, '---------------CartItemUI');

   //console.log(cartItems, 'cardddddddddddddddddddddddd');
  const handleMenu = () => {
    console.log('Back to menu');
    navigation.navigate('Menu');
  };

  const cutStr =(string)=>{
    return string.length > 30 ? string.slice(0,30)+"..." : string;
  }

  const handlePlaceOrder = async () => {
   // const userId = await AsyncStorage.getItem('userID');  // Thay thế bằng userId thực tế
    const tableId = await AsyncStorage.getItem('idTable');
  
    await postOrder( tableId);
  };

  // Hợp nhất các mục trùng lặp dựa trên id và option
  const mergeCartItems = (items) => {
    const mergedItems = [];
    items.forEach((item) => {
      // Tìm kiếm mục hiện có trong mergedItems có cùng id và option._id
      const existingItem = mergedItems.find(
        (mergedItem) =>
          mergedItem.id === item.id && mergedItem?.option?._id === item?.option?._id
      );
      if (existingItem) {
        // Nếu tồn tại, tăng quantity của mục đó
        existingItem.quantity += item.quantity;
      } else {
        // Nếu không tồn tại, thêm mục mới vào mergedItems
        mergedItems.push({ ...item });
      }
    });
    return mergedItems; // Trả về mảng mergedItems đã hợp nhất
  };
  

  // Lấy các mục giỏ hàng từ AsyncStorage khi component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // Lấy dữ liệu giỏ hàng từ AsyncStorage
        let items = await AsyncStorage.getItem('cartItems');
        // Chuyển dữ liệu từ chuỗi JSON thành mảng JavaScript
        items = items ? JSON.parse(items) : [];
        setCartItems(items);
        setCartItemUI(mergeCartItems(items));
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems(); // Gọi hàm fetchCartItems khi component mount
  }, []);

//   useEffect(()=>{
// const fetchCartItemUI = async()=>{
//   try {
//     setCartItemUI(cartItems);
//     mergeCartItems(cartItemUI);
//   } catch (error) {
//     console.log(error);
//   }
// }
// fetchCartItemUI();
//   },[])

  // Cập nhật AsyncStorage khi cartItems thay đổi
  useEffect(() => {
    const updateStorage = async () => {
      try {
        // Lưu trạng thái hiện tại của cartItems vào AsyncStorage
        await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error updating cart items in AsyncStorage:', error);
      }
    };
    updateStorage(); // Gọi hàm updateStorage mỗi khi cartItems thay đổi
  }, [cartItems]);

  // plus quantity item
  const increaseQuantity = (id, option) => {
    const newItem = cartItems.find(item => item?.id === id && item?.option?._id === option?._id);
    if (newItem) {
      setCartItems([...cartItems, newItem]);
    }

    setCartItemUI((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item?.option?._id === option?._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // minus quantity item
  const decreaseQuantity = (id, option) => {
    const itemIndex = cartItems.findIndex(item => item?.id === id && item?.option?._id === option?._id);
    if (itemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems.splice(itemIndex, 1);
      setCartItems(updatedCartItems);
    }

    setCartItemUI((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item?.option?._id === option?._id && item?.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  //Delete item in cart
  const handleDeleteItem = (id, option) => {
    const updatedCartItems = cartItems.filter(
      (item) => item.id !== id || item?.option?._id !== option?._id
    );

    const updatedCartItemUI = cartItemUI.filter(
      (item) => item.id !== id || item?.option?._id !== option?._id
    );

    setCartItems(updatedCartItems);
    setCartItemUI(updatedCartItemUI);
  };

  const renderItem = ({item}) => {
    // console.log('Item when render .....: ',item.name, item.quantity);
    //   console.log(item);

     // Hợp nhất các mục trùng lặp và cập nhật state
  //   setCartItems(mergeCartItems(item));

  

    return (
      <TouchableOpacity
      style={{width:hp(90)}}
        activeOpacity={1}
        onPress={() => {
          console.log('id', item._id, item.name);
        }}>
        <View style={styles.itemFlatlist}>
          <Image
            source={{
              // If API have value of image, show image from API. If image != value, show image URL
              uri: item?.image
                ? item?.image
                : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
            }}
            style={styles.imageVoucherItem}
          />

          {/* text info */}
          <View style={{justifyContent: 'space-between'}}>
            {/* name */}
            <Text
             numberOfLines={1} 
             ellipsizeMode="head"
            style={{color: 'black', fontSize: hp(2)}}>
              {cutStr(item.name)}
            </Text>

            <Text>{item?.option?.name}</Text>

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
                <TouchableOpacity onPress={() => decreaseQuantity(item.id, item.option)}>
                  <Icon name="minussquareo" size={24} color="black" />
                </TouchableOpacity>
                <Text>{item.quantity}</Text>
                <TouchableOpacity onPress={() => increaseQuantity(item.id, item.option)}>
                  <Icon name="plussquareo" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Button
            title="Xóa"
            onPress={() => handleDeleteItem(item.id, item.option)}
            color="red"
          />
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
              data={cartItemUI}
              renderItem={renderItem}
              keyExtractor={(item, index) => `${item.id}-${item.option}-${index}`}
            />
          </View>

          {/* Cart */}
          <View
            style={styles.paymentContainer}
            // onPress={handleCart}
          >
            <TouchableOpacity
              onPress={handleMenu}
              style={styles.payButtonContainer}>
              <Text style={styles.payButtonText}> TRỞ LẠI MENU </Text>
            </TouchableOpacity>

            {/* pay button */}
            <TouchableOpacity
            onPress={handlePlaceOrder}
            style={styles.payButtonContainer}>
              <Text style={styles.payButtonText}>ĐẶT MÓN</Text>
            </TouchableOpacity>
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
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems:"center",
    display:'flex'
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
