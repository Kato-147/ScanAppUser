import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createQRCodeApi,
  getCategories,
  getTables,
  getUserInTableApi,
  logOutTableApi,
} from '../ProductsHTTP';
import {getMenuItem} from '../ProductsHTTP';
import Loading from '../../fragment/Loading';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused} from '@react-navigation/native';
import {checkPrice} from './Oder';
import MoreIcon from 'react-native-vector-icons/Feather';
import BtShitMenu from '../../fragment/BtShitMenu';
import Toast from 'react-native-toast-message';
import toastConfig from '../../../helper/toastConfig';

const Menu = ({navigation}) => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [table, setTable] = useState('');
  const [activeOptions, setActiveOptions] = useState({});
  const [quantityCard, setquantityCard] = useState([]);
  const isFocused = useIsFocused();
  const [moreOptions, setMoreOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [softQrCode, setSoftQrCode] = useState('');
  const [showModalUser, setShowModalUser] = useState(false);
  const [userInTable, setUserInTable] = useState('');
  const [totalUser, setTotalUser] = useState(0);

  // Back to home function
  const handleHome = () => {
    console.log('back');
    navigation.goBack();
  };

  // Go to Cart Screen
  const handleCart = () => {
    console.log('Go to cart screen');
    navigation.navigate('Cart');
  };

  const fetchQuantity = useCallback(async () => {
    try {
      const quantity = await AsyncStorage.getItem('cartItems');
      if (quantity) {
        setquantityCard(JSON.parse(quantity).length);
      } else {
        setquantityCard(0);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchQuantity();
    }
  }, [isFocused, fetchQuantity]);

  // Get idTable from AsyncStorage
  useEffect(() => {
    idTable();
    loadCategories();
    createSoftQR();
    getUserInTable();
  }, []);

  //Get tableNumber
  const idTable = async () => {
    try {
      const idTable = await AsyncStorage.getItem('idTable');
      //{"tableId":"6679893df3da9df0bfcf3da9","type":"hardQRCode"}
      const idtable = JSON.parse(idTable).tableId;
      const tableType = JSON.parse(idTable).type;
      console.log('ID Table từ AsyncStorage', idtable, tableType);

      const table = await getTables(idtable, tableType);
      console.log('===table==========', table.data.tableNumber);

      setTable(table);
    } catch (error) {
      console.error('Table error', error);
    } finally {
      setLoading(false);
    }
  };

  // Get data Categories from API
  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
      if (data.length > 0) {
        setActiveCategory(data[0]._id); // Chọn mục đầu tiên làm mặc định
        loadMenuItems(data[0]._id); // Lấy món ăn cho danh mục đầu tiên
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Add menuItem to Cart
  const handleAddToCart = async item => {
    try {
      console.log(item.name, '<<<<<<<<<<<<<<<<<item');

      let selectedOptionId = activeOptions[item._id];
      // if (!selectedOptionId) {
      //   throw new Error('No option selected');
      // }

      const selectedOption = item?.options?.find(
        option => option?._id === selectedOptionId,
      );
      // if (!selectedOption) {
      //   throw new Error('Selected option not found');
      // }

      // Tạo đối tượng mới chỉ với các trường cần thiết
      const cartItem = {
        image: item.image_url,
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: 1, // Set initial quantity to 1
        option: selectedOption,
      };

      let cartItems = await AsyncStorage.getItem('cartItems');
      cartItems = cartItems ? JSON.parse(cartItems) : [];
      cartItems.push(cartItem);
      await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
      fetchQuantity();
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  // Get data Menu item from API
  const loadMenuItems = async categoryId => {
    try {
      const items = await getMenuItem(categoryId);
      setMenuItems(items);

      // Đặt tùy chọn đầu tiên của mỗi mục làm tùy chọn mặc định
      const initialOptions = {};
      items.forEach(item => {
        if (item.options && item.options.length > 0) {
          initialOptions[item._id] = item.options[0]._id;
        }
      });
      setActiveOptions(initialOptions);
    } catch (error) {
      console.error(error);
    }
  };

  // Create soft qr code
  const createSoftQR = async () => {
    try {
      const res = await createQRCodeApi();
      setSoftQrCode(res);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  // Get all user in table
  const getUserInTable = async () => {
    try {
      const res = await getUserInTableApi();
      setTotalUser(res.totalUser);
      setUserInTable(res.data);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  // Logout table
  const handleLogoutTable = async () => {
    try {
      
       const res = await logOutTableApi();
       console.log('-----logOut table------',res);
       if(res.status === 'success'){
        navigation.popToTop();
        Toast.show({
          type: 'success',
          text1: 'Đã thoát khỏi bàn',
          text2: 'Bạn có thể quét bàn khác'
        })
       }
       return res
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Không thể thoát bàn',
        text2: error.message
      })
      console.log(error);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        style={{width: wp(100), height: hp(100)}}
        colors={['white', 'white', 'white', '#F6F6F6']}>
        {/* Header h10 */}
        <View style={styles.headerContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
            }}>
            <TouchableOpacity onPress={handleHome} style={{}}>
              <Icon style={styles.backIcon} name="left" />
            </TouchableOpacity>
            <Text
              style={{fontSize: hp(3), fontWeight: '600', color: '#525252'}}>
              Đang tải ...
            </Text>
          </View>
        </View>
        <View
          style={{
            height: hp(90),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      </LinearGradient>
    );
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
    setActiveOptions(prevOptions => ({...prevOptions, [menuItemId]: optionId}));
    console.log('options', optionId);
  };

  // Function render item for flatlist MenuItem
  const renderMenuItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          navigation.navigate('DetailMenuItem', {item});
        }}>
        <View style={styles.menuItem}>
          {/* Image */}
          <View
            style={{
              width: wp(30),
              height: hp(13),
              padding: 14,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={{
                // If value of Image in API not null, show image : show Image URL
                uri: item.image_url
                  ? item.image_url
                  : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
              }}
              style={styles.menuItemImage}
            />
          </View>

          <View style={styles.menuItemInfo}>
            {/* Name */}
            <Text style={styles.menuItemName} numberOfLines={1}>
              {item.name}
            </Text>

            {item.options.length > 0 ? (
              <ScrollView
                horizontal
                style={{
                  width: '100%',
                  height: hp(5),
                }}>
                {item.options.map(option => {
                  const isActive = activeOptions[item._id] === option._id;

                  const activeTextOptions = {
                    color: isActive ? '#E8900C' : '#757575',
                  };

                  return (
                    <TouchableOpacity
                      style={{alignSelf: 'center'}}
                      key={option._id}
                      onPress={() => handleChangeOption(item._id, option._id)}>
                      <View
                        style={[
                          {
                            marginRight: wp(3),
                            borderWidth: 1,
                            borderRadius: 5,
                            paddingHorizontal: wp(1),
                          },
                          activeOptions[item._id] === option._id
                            ? {borderColor: '#E8900C'}
                            : {borderColor: '#757575'},
                        ]}>
                        <Text style={[{}, activeTextOptions]}>
                          {option.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : null}
            {/* Price */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                //  backgroundColor: 'blue',
                alignItems: 'center',
              }}>
              <Text style={styles.menuItemPrice}>
                {checkPrice(item.price)} đ
              </Text>

              {/* Button Add ItemMenu */}
              <TouchableOpacity onPress={() => handleAddToCart(item)}>
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
      </TouchableOpacity>
    );
  };

  const renderTotalUserItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          console.log('cc');
        }}>
        <View style={styles.userItem}>
          {/* Image */}
          <View
            style={{
              width: wp(30),
              height: '100%',
              padding: 14,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={{
                // If value of Image in API not null, show image : show Image URL
                uri: item.img_avatar_url
                  ? item.img_avatar_url
                  : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr6WsCGy-o3brXcj2cmXGkHM_fE_p0gy4X8w&s',
              }}
              style={{
                width: hp(8),
                height: hp(8),
                borderRadius: 10,
                marginRight: 10,
              }}
            />
          </View>
          <Text
            style={[styles.menuItemName, {color: '#757575'}]}
            numberOfLines={1}>
            {item.fullName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {table?.usageAllowed === 'yes' ? (
        <LinearGradient colors={['white', 'white', 'white', '#F6F6F6']}>
          {/* Header h10 */}
          <View style={styles.headerContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 20,
                //  backgroundColor: 'red',
              }}>
              <TouchableOpacity onPress={handleHome} style={{}}>
                <Icon style={styles.backIcon} name="left" />
              </TouchableOpacity>
              <Text
                style={{fontSize: hp(3), fontWeight: '600', color: '#525252'}}>
                Bàn {table?.data.tableNumber}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: wp(25),
              }}>
              {/* Cart */}
              <TouchableOpacity
                onPress={handleCart}
                style={{marginRight: wp(3)}}>
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
                    {quantityCard}
                  </Text>
                </View>
                <Icon name="shoppingcart" size={hp(3.5)} color="#E8900C" />
              </TouchableOpacity>

              {/* More Options */}
              <TouchableOpacity onPress={() => setMoreOptions(true)} style={{}}>
                <MoreIcon name="more-vertical" size={hp(3.5)} color="#E8900C" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Menu */}
          <View style={{height: hp(90)}}>
            <View style={{height: hp(12)}}>
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
            </View>

            {/* Menu Item */}
            <View style={{height: hp(78)}}>
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
          </View>

          {/* More options */}
          {moreOptions && (
            <BtShitMenu
              setMoreOptions={setMoreOptions}
              setShowModal={setShowModal}
              setShowModalUser={setShowModalUser}
              onLogoutPress={handleLogoutTable}
            />
          )}
          {/* Modal QR Code */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => setShowModal(false)}>
            <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Image
                    style={{width: '80%', height: '80%'}}
                    source={{uri: softQrCode.data}}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* Modal All User in Table */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showModalUser}
            onRequestClose={() => setShowModalUser(false)}>
            <TouchableWithoutFeedback onPress={() => setShowModalUser(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContentUser}>
                  <Text
                    style={{
                      fontSize: hp(2.5),
                      fontWeight: 'bold',
                      color: '#E8900C',
                      marginStart: wp(3),
                      marginTop: hp(1),
                    }}>
                    Số người trong bàn : {totalUser}
                  </Text>
                  <FlatList
                    horizontal
                    data={userInTable}
                    keyExtractor={item => item._id.toString()}
                    renderItem={renderTotalUserItem}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                    style={styles.flatList}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </LinearGradient>
      ) : (
        // --------- Screen data undefined
        <View style={styles.container}>
          {/* Header h10 */}
          <View style={styles.headerContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 20,
                //  backgroundColor: 'red',
              }}>
              <TouchableOpacity onPress={handleHome} style={{}}>
                <Icon style={styles.backIcon} name="left" />
              </TouchableOpacity>
              <Text
                style={{fontSize: hp(3), fontWeight: '600', color: '#525252'}}>
                Trở lại
              </Text>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              height: hp(90),
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
            }}>
            <Icon name="warning" size={hp(6)} color="#525252" />
            <Text style={{fontSize: hp(2), fontWeight: 'bold'}}>
              Bàn không khả dụng
            </Text>
            <Text style={{fontSize: hp(2), fontWeight: 'bold'}}>
              Vui lòng gọi phục vụ để được hỗ trợ
            </Text>
            <Text style={{fontSize: hp(2), fontWeight: 'bold'}}>
              hoặc vào màn hình Hỗ trợ để biết thêm chi tiết
            </Text>
          </View>
        </View>
      )}
      <Toast config={toastConfig}  />
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
    width: wp(100),
    // backgroundColor:'red',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    marginVertical: 10,
    flexDirection: 'row',
    height: hp(13),
  },
  menuItemImage: {
    width: wp(25),
    height: wp(25),
    borderRadius: 10,
    marginRight: 10,
  },
  menuItemInfo: {
    flex: 1,
    justifyContent: 'space-evenly',
    //backgroundColor:'red'
  },
  menuItemName: {
    color: 'black',
    fontSize: hp(2.2),
    fontWeight: 'bold',
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
    width: wp(100),
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(10),
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
  },
  textMenu: {
    fontSize: hp(2.5),
    fontWeight: '400',
    color: '#525252',
    marginStart: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    justifyContent: 'center',
    width: wp(90),
    height: hp(40),
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  userItem: {
    width: wp(86),
    // backgroundColor:'red',
    justifyContent: 'flex-start',
    marginVertical: 10,
    flexDirection: 'row',
    height: hp(8),
    alignItems: 'center',
  },
  modalContentUser: {
    width: wp(90),
    height: hp(45),
    backgroundColor: 'white',
    borderRadius: 10,
  },
});
