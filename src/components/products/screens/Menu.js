import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getCategories, getTables} from '../ProductsHTTP';
import {getMenuItem} from '../ProductsHTTP';
import Loading from '../../fragment/Loading';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused} from '@react-navigation/native';

const Menu = ({navigation}) => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [table, setTable] = useState('');
  const [activeOptions, setActiveOptions] = useState({});
  // const [selectedItems, setSelectedItems] = useState([]);
  const isFocused = useIsFocused();

  // console.log(selectedItems,'ok');

  // Back to home function
  const handleHome = () => {
    console.log('back');
    navigation.navigate('Home');
  };

  // Go to Cart Screen
  const handleCart = () => {
    console.log('Go to cart screen');
    navigation.navigate('Cart');
  };

  // useEffect(() => {
  //   const unsubcrise = navigation.addListener('focus', () => {});
  //   return unsubcrise;
  // }, [navigation]);

  // Get idTable from AsyncStorage
  useEffect(() => {
    const idTable = async () => {
      try {
        const idTable = await AsyncStorage.getItem('idTable');
        console.log('ID Table từ AsyncStorage', idTable);
        const table = await getTables(idTable);
        //  console.log('===table==', table);
        setTable(table);
      } catch (error) {
        console.error('Table error', error);
      }
    };
    idTable();
  }, []);

  // Get data Categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        if (data.length > 0) {
          setActiveCategory(data[3]._id); // Chọn mục đầu tiên làm mặc định
          loadMenuItems(data[3]._id); // Lấy món ăn cho danh mục đầu tiên
          console.log('=====firstCategory=======', activeCategory);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Add menuItem to Cart
  const handleAddToCart = async (item, selectedOptionId) => {
    try {
      console.log(item.name, '<<<<<<<<<<<<<<<<<item');
  
      // Tạo đối tượng mới chỉ với các trường cần thiết
      const cartItem = {
        image: item?.image_url,
        id: item?._id,
        name: item?.name,
        option: item?.options?.find(option => option?._id === selectedOptionId),
      };
  
      let cartItems = await AsyncStorage.getItem('cartItems');
      cartItems = cartItems ? JSON.parse(cartItems) : [];
  
      // Kiểm tra xem mặt hàng đã tồn tại trong giỏ hàng hay chưa
      const existingItemIndex = cartItems.findIndex(
        ci => ci?.id === cartItem?.id && ci?.option?._id === selectedOptionId,
      );
      if (existingItemIndex >= 0) {
        // Nếu đã tồn tại, tăng số lượng lên
        cartItems[existingItemIndex].quantity += 1;
      } else {
        // Nếu chưa tồn tại, thêm mặt hàng mới vào giỏ hàng
        cartItems.push({...cartItem, quantity: 1});
      }
      await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  

  // Get data Menu item from API
  const loadMenuItems = async categoryId => {
    try {
      const items = await getMenuItem(categoryId);
      setMenuItems(items);
    //  console.log(items[0]);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Function handle change Categories
  const handleChangeCategory = categoryId => {
    setActiveCategory(categoryId);
    loadMenuItems(categoryId);
    console.log('Danh mục đang hoạt động || category:', categoryId);
  };

  // Function render item for flatlist Categories
  const renderItem = ({item}) => {

    const isActive = item._id === activeCategory;
    const activeButtonStyle = {
      borderColor: isActive ? '#E8900C' : '#757575',
    };
    const activeTextStyle = {
      color: isActive ? '#E8900C' : '#757575',
    };
    return (
      <TouchableOpacity
        onPress={() => handleChangeCategory(item._id)}
        style={styles.touchableOpacityCategories}>
        <View style={[styles.buttonViewCategories, activeButtonStyle]}>
          <Text style={[styles.buttonTextCategories, activeTextStyle]}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleChangeOption = (menuItemId, optionId) => {
    setActiveOptions({...activeOptions, [menuItemId]: optionId});
  };
  

  const handcheck =(id)=>{
    console.log(id,'ID ITem');
  }

  // Function render item for flatlist MenuItem
  const renderMenuItem = ({item}) => {

    const activeOption = activeOptions[item._id];
    
    const isActive = item.options._id === activeOption;
    const activeButtonStyle = {
      borderColor: isActive ? '#E8900C' : '#757575',
    };
    const activeTextStyle = {
      color: isActive ? '#E8900C' : '#757575',
    };

    return (
      <TouchableOpacity
        onPress={() => handcheck(item._id)}>
        <View style={styles.menuItem}>
          <Image
            source={{
              // If value of Image in API not null, show image : show Image URL
              uri: item.image_url
                ? item.image_url
                : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
            }}
            style={styles.menuItemImage}
          />

          <View style={styles.menuItemInfo}>
            <Text
              style={styles.menuItemName}
              numberOfLines={1}
              ellipsizeMode="tail">
              {item.name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                //  backgroundColor: 'blue',
                alignItems: 'center',
              }}>
              <Text style={styles.menuItemPrice}>{item.price} VND</Text>

              {/* Button Add ItemMenu */}
              <TouchableOpacity onPress={() => handleAddToCart(item, activeOption)}>
                <View
                  style={{
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: '#E8900C',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: hp(10),
                    padding: hp(0.5),
                  }}>
                  <Icon name="shoppingcart" size={hp(2.8)} color="#E8900C" />
                  <Text
                    style={{
                      fontSize: hp(2),
                      fontWeight: 500,
                      color: '#E8900C',
                    }}>
                    Thêm
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{height: 1, width: hp(100), backgroundColor: '#C0C0C0'}} />

        {item.options.length > 0 ? (
          <ScrollView
            horizontal
            style={{width: hp(100), height: hp(5), paddingHorizontal: wp(2)}}>
            {item.options.map((option) => (
              <TouchableOpacity  onPress={()=>handleChangeOption(item._id, option._id)}>
                <View
                  key={option._id}
                  
                  style={[{ marginRight: wp(3), borderWidth: 1, borderRadius: 10},activeOption === option._id ?  {borderColor: 'blue'} : {borderColor:'red'}]}>
                  <Text style={[{}, activeTextStyle]}>{option.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View></View>
        )}
      </TouchableOpacity>
    );
  };

  // Tính tổng giá tiền bằng reduce

  // const totalPrice = selectedItems.reduce(
  //   (total, item) => total + item.price,
  //   0,
  // );

  return (
    <View style={styles.container}>
      {table?.status === 'open' ? (
        <LinearGradient colors={['#ffff', '#ffff', '#F6F6F6', '#F6F6F6']}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={handleHome}>
              <Icon style={styles.backIcon} name="left" />
            </TouchableOpacity>
            <Text
              style={{fontSize: hp(3), fontWeight: '600', color: '#525252'}}>
              Bàn {table?.tableNumber}
            </Text>
          </View>

          {/* Body */}

          {/* Menu */}
          <View>
            <Text style={styles.textMenu}>Menu</Text>
            {/* categories */}
            <View>
              {categories.length > 0 && (
                <FlatList
                  horizontal
                  data={categories}
                  keyExtractor={item => item._id.toString()}
                  renderItem={renderItem}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.contentContainer}
                  style={styles.flatList}
                />
              )}
            </View>

            <View style={{height: '70%'}}>
              {/* Menu Item */}
              {menuItems.length > 0 ? (
                <FlatList
                  data={menuItems}
                  keyExtractor={item => item._id.toString()}
                  renderItem={renderMenuItem}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.menuList}
                />
              ) : (
                <Loading style={{marginTop: 100, fontSize: 100}} />
              )}
            </View>

            {/* Cart */}
            <TouchableOpacity
              style={styles.paymentContainer}
              onPress={handleCart}>
              <View
                style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <View style={{}}>
                  <View
                    style={{
                      width: hp(2.2),
                      height: hp(2.2),
                      backgroundColor: '#E8900C',
                      borderRadius: 40,
                      top: hp(-0.8),
                      right: wp(-2.2),
                      position: 'absolute',
                      zIndex: 1,
                    }}>
                    <Text
                      style={{
                        alignSelf: 'center',
                        color: 'white',
                        fontSize: hp(1.6),
                      }}>
                      {/* {selectedItems.length} */}0
                    </Text>
                  </View>
                  <Icon name="shoppingcart" size={hp(3.5)} color="#E8900C" />
                </View>

                <View style={styles.lineVertical} />
                <View>
                  <Text style={{fontSize: hp(1.7)}}>Tổng tiền :</Text>
                  <Text
                    style={{
                      fontSize: hp(2.3),
                      fontWeight: '500',
                      color: 'black',
                    }}>
                    cc đ
                  </Text>
                </View>
              </View>

              {/* pay button */}
              <View style={styles.payButtonContainer}>
                <Text style={styles.payButtonText}>GIỎ HÀNG</Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      ) : (
        // --------- Screen data undefined
        <View style={{alignSelf: 'center'}}>
          <Text> Bàn không khả dụng </Text>
        </View>
      )}
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    // backgroundColor: 'white',
  },
  backIcon: {
    fontSize: hp(3),
    color: 'black',
  },
  contentContainer: {
    paddingHorizontal: 5,
  },
  flatList: {
    marginTop: 20,
    height: hp(8),
  },
  touchableOpacityCategories: {
    // flex: 1,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonViewCategories: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 6,
    marginHorizontal: 4,
  },
  buttonTextCategories: {
    fontSize: hp(2),
    fontWeight: '500',
  },
  menuItem: {
    width: '100%',
    //  flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    marginVertical: 10,
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  menuItemImage: {
    width: wp(20),
    height: hp(10),
    borderRadius: 10,
    marginRight: 10,
  },
  menuItemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  menuItemName: {
    fontSize: hp(2),
    fontWeight: '500',
  },
  menuItemPrice: {
    fontSize: hp(2),
    color: '#757575',
  },
  menuList: {
    paddingBottom: 20,
    marginTop: 5,
  },
  noMenuItems: {
    textAlign: 'center',
    marginTop: 20,
    color: '#757575',
    fontSize: hp(2),
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    margin: 20,
  },
  textMenu: {
    fontSize: hp(2.5),
    fontWeight: '400',
    color: '#525252',
    marginStart: 20,
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
  lineVertical: {
    width: 1, // Chiều rộng của đường thẳng
    height: hp(5), // Chiều cao của đường thẳng
    backgroundColor: '#C0C0C0', // Màu của đường thẳng
  },
  payButtonText: {
    fontSize: hp(1.8),
    fontWeight: '500',
    color: 'white',
  },
});
