import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getCategories, getTables} from '../../products/ProductsHTTP';
import {getMenuItem} from '../../products/ProductsHTTP';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused} from '@react-navigation/native';
import {checkPrice} from '../../products/screens/Oder';
import {getMenuNoLoginApi} from '../UserHTTP';
import Loading from '../../fragment/Loading';

const MenuNoLogin = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [activeOptions, setActiveOptions] = useState({});

  const [table, setTable] = useState('');
  //  const [idTable, setidTable] = useState(tableId)
  const isFocused = useIsFocused();

  // Back  function
  const handleBack = () => {
    console.log('back');
    navigation.goBack();
  };

  useEffect(() => {
    // setidTable(tableId);
    getTableNumber();
    loadCategories();
    //loadMenuItems();
    // loadCategories();
  }, []);

  const getTableNumber = async () => {
    try {
      const table = await getMenuNoLoginApi();
      console.log('===table==', table);
      setTable(table);
      return table;
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
      console.log('data get categori', data);
      setCategories(data);
      if (data.length > 0) {
        setActiveCategory(data[0]._id); // Chọn mục đầu tiên làm mặc định
        loadMenuItems(data[0]._id); // Lấy món ăn cho danh mục đầu tiên
      }
    } catch (error) {
      console.error(error);
    } finally {
      console.log('done finaly get category');
      setLoading(false);
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

  // Function handle change Categories
  const handleChangeCategory = categoryId => {
    setActiveCategory(categoryId);
    loadMenuItems(categoryId);
    console.log('Danh mục đang hoạt động || category:', categoryId);
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
            <TouchableOpacity onPress={handleBack} style={{}}>
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



  const renderCategoryItem = ({item}) => {
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
          console.log(item.name);
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
            </View>
          </View>
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
              <TouchableOpacity onPress={handleBack}>
                <Icon style={styles.backIcon} name="left" />
              </TouchableOpacity>
              <Text
                style={{fontSize: hp(3), fontWeight: '600', color: '#525252'}}>
                Vui lòng đăng nhập !
              </Text>
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
                    renderItem={renderCategoryItem}
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
              <TouchableOpacity onPress={handleBack} style={{}}>
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
    </View>
  );
};

export default MenuNoLogin;

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
});
