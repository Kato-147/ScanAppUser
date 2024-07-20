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
import {postOrder} from '../ProductsHTTP';
import LinearGradient from 'react-native-linear-gradient';
import {checkPrice} from '../screens/Oder';

const Cart = ({navigation}) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartItemUI, setCartItemUI] = useState([]);
  //  console.log(cartItemUI, '---------------CartItemUI');

  const handleMenu = () => {
    console.log('Back to menu');
    navigation.goBack();
  };

  const cutStr = (string, maxLength = 30) =>
    string.length > maxLength ? `${string.slice(0, maxLength)}...` : string;

  // Post MenuItems to API
  const handlePlaceOrder = async () => {
    try {
      const response = await postOrder();
      if (response.status === 'success') {
        await AsyncStorage.removeItem('cartItems');
        await AsyncStorage.removeItem('idTable');
        console.log('Cart items cleared');
        navigation.navigate('Oder');
      }
      if (response.status === 'fail') {
        console.log('status fail >>>>>', response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Hợp nhất các mục trùng lặp dựa trên id và option
  const mergeCartItems = items => {
    const mergedItems = [];
    items.forEach(item => {
      // Tìm kiếm mục hiện có trong mergedItems có cùng id và option._id
      const existingItem = mergedItems.find(
        mergedItem =>
          mergedItem.id === item.id &&
          mergedItem?.option?._id === item?.option?._id,
      );
      if (existingItem) {
        // Nếu tồn tại, tăng quantity của mục đó
        existingItem.quantity += item.quantity;
      } else {
        // Nếu không tồn tại, thêm mục mới vào mergedItems
        mergedItems.push({...item});
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
    const newItem = cartItems.find(
      item => item?.id === id && item?.option?._id === option?._id,
    );
    if (newItem) {
      setCartItems([...cartItems, newItem]);
    }

    setCartItemUI(prevItems =>
      prevItems.map(item =>
        item.id === id && item?.option?._id === option?._id
          ? {...item, quantity: item.quantity + 1}
          : item,
      ),
    );
  };

  // minus quantity item
  const decreaseQuantity = (id, option) => {
    // Tìm vị trí của mục trong mảng cartItems
    const itemIndex = cartItems.findIndex(
      item => item?.id === id && item?.option?._id === option?._id,
    );

    if (itemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems.splice(itemIndex, 1);
      setCartItems(updatedCartItems);
    }

    // Cập nhật UI để phản ánh số lượng đã giảm
    setCartItemUI(prevItems =>
      prevItems.map(item =>
        item.id === id &&
        item?.option?._id === option?._id &&
        item?.quantity > 1
          ? {...item, quantity: item.quantity - 1}
          : item,
      ),
    );
  };

  //Delete item in cart
  const handleDeleteItem = (id, option) => {
    const updatedCartItems = cartItems.filter(
      item => item.id !== id || item?.option?._id !== option?._id,
    );

    const updatedCartItemUI = cartItemUI.filter(
      item => item.id !== id || item?.option?._id !== option?._id,
    );

    setCartItems(updatedCartItems);
    setCartItemUI(updatedCartItemUI);
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.itemFlatlist}
        activeOpacity={1}
        onPress={() => {
          console.log('id', item.id, item.name);
        }}>
        {/* Image */}
        <View
          style={{
            width: wp(30),
            height: hp(12),
            padding: 14,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={{
              // If API have value of image, show image from API. If image != value, show image URL
              uri: item?.image
                ? item?.image
                : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
            }}
            style={styles.imageVoucherItem}
          />
        </View>

        {/* text info */}
        <View
          style={{
            flex: 1,
            height: '100%',
            justifyContent: 'space-around',
            width: wp(50),
          }}>
          {/* name */}
          <Text
            numberOfLines={1}
            // ellipsizeMode="head"
            style={{color: 'black', fontSize: hp(2.2), fontWeight: 'bold'}}>
            {cutStr(item.name)}
          </Text>

          <Text style={{fontSize: hp(2), color: '#888'}}>
            {checkPrice(item.price)} đ
          </Text>

          {/* Options */}
          {item?.option?.name === null ? (
            <View />
          ) : (
            <Text style={{fontSize: 14, color: '#555'}}>
              {item?.option?.name}
            </Text>
          )}
        </View>

        <View
          style={{
            width: wp(20),
            //    backgroundColor: 'yellow',
            height: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => handleDeleteItem(item.id, item.option)}
            style={{
              marginTop: hp(1),
              backgroundColor: '#E8900C',
              padding: wp(2),
              borderRadius: 99,
            }}>
            <Icon name="delete" size={wp(5)} color="#ffffff" />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: hp(16),
            }}>
            {/* quantity */}
            <View style={{flexDirection: 'row', gap: 10}}>
              {item.quantity > 1 ? (
                <TouchableOpacity
                  onPress={() => decreaseQuantity(item.id, item.option)}>
                  <Icon name="minussquareo" size={24} color="black" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity>
                  <Icon name="minussquareo" size={24} color="black" />
                </TouchableOpacity>
              )}

              <Text>{item.quantity}</Text>

              <TouchableOpacity
                onPress={() => increaseQuantity(item.id, item.option)}>
                <Icon name="plussquareo" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
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
          </View>

          {/* Body */}

          {/* menu */}
          {cartItemUI.length > 0 ? (
            <LinearGradient
              colors={['#ffffff', '#ffffff', '#ffffff', '#F6F6F6']}
              style={{height: hp(82), width: '100%'}}>
              <FlatList
                // numColumns={1}
                showsVerticalScrollIndicator={false}
                style={{width: '100%'}}
                data={cartItemUI}
                renderItem={renderItem}
                keyExtractor={(item, index) =>
                  `${item.id}-${item.option}-${index}`
                }
              />
            </LinearGradient>
          ) : (
            <LinearGradient
              colors={['#ffffff', '#ffffff', '#ffffff', '#F6F6F6']}
              style={styles.errorContainer}>
              <Image
                style={styles.errorImage}
                source={{
                  uri: 'https://i.pinimg.com/564x/55/96/49/559649030e6667d7f8d50fc15afbbd20.jpg',
                }}
              />
              <Text style={styles.errorText}>Chưa có món trong giỏ hàng</Text>
            </LinearGradient>
          )}

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
            {cartItemUI.length > 0 ? (
              <TouchableOpacity
                onPress={handlePlaceOrder}
                style={styles.payButtonContainer}>
                <Text style={styles.payButtonText}>ĐẶT MÓN</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  console.log('co cai db');
                }}
                style={{
                  backgroundColor: '#a0a0a0a0',
                  borderRadius: 5,
                  padding: 10,
                }}>
                <Text style={styles.payButtonText}>ĐẶT MÓN</Text>
              </TouchableOpacity>
            )}
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
    width: wp(25),
    height: wp(25),
    borderRadius: 10,
    // backgroundColor: 'red',
  },
  itemFlatlist: {
    width: wp(100),
    height: hp(12),
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
  errorContainer: {
    width: '100%',
    height: hp(82),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: hp(5),
  },
  errorText: {
    // alignSelf:'center'
    fontSize: hp(2.2),
  },
  errorImage: {
    width: hp(10),
    height: hp(10),
  },
});
