import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getCategories} from '../ProductsHTTP';
import {getMenuItem} from '../ProductsHTTP';

const Menu = ({navigation}) => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');

  // Back to home function
  const handleHome = () => {
    console.log('back');
    navigation.navigate('Home');
  };

  // Lấy idMenu từ AsyncStorage #useEffect của lộc
  // useEffect(() => {
  //   const idMenu = async () => {
  //     const id = await AsyncStorage.getItem('idMenu');
  //     console.log(id, 'ID Menu từ AsyncStorage');
  //   };
  //   idMenu();
  // }, []);

  // Lấy dữ liệu các danh mục từ API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        if (data.length > 0) {
          setActiveCategory(data._id); // Chọn mục đầu tiên làm mặc định
          loadMenuItems(activeCategory); // Lấy món ăn cho danh mục đầu tiên
          console.log(activeCategory,'============');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // get Menu item
  const loadMenuItems = async (categoryId) => {
    try {
      const items = await getMenuItem(categoryId);
      setMenuItems(items);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Hàm xử lý thay đổi danh mục
  const handleChangeCategory = (categoryId) => {
    setActiveCategory(categoryId);  
    loadMenuItems(categoryId);
    console.log('Danh mục đang hoạt động:', categoryId);
  };

  // Hàm render item cho FlatList danh mục
  const renderItem = ({item}) => {
    const isActive = item.name === activeCategory;
    const activeButtonStyle = {
      borderColor: isActive ? '#E8900C' : '#757575',
    };
    const activeTextStyle = {
      color: isActive ? '#E8900C' : '#757575',
    };
    return (
      <TouchableOpacity
        onPress={() => handleChangeCategory(item.name)}
        style={styles.touchableOpacityCategories}>
        <View style={[styles.buttonViewCategories, activeButtonStyle]}>
          <Text style={[styles.buttonTextCategories, activeTextStyle]}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Hàm render item cho FlatList món ăn
  const renderMenuItem = ({item}) => {
    return (
      <View style={styles.menuItem}>
        <Image source={{uri: item.image_url}} style={styles.menuItemImage} />
        <View style={styles.menuItemInfo}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          <Text style={styles.menuItemPrice}>{item.price} VND</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 20,
          margin: 20,
        }}>
        <TouchableOpacity onPress={handleHome}>
          <Icon style={styles.backIcon} name="left" />
        </TouchableOpacity>
        <Text style={{fontSize: hp(3), fontWeight: '600', color: '#525252'}}>
          Bàn 1
        </Text>
      </View>

      {/* Body */}

      {/* Menu */}
      <View>
        <Text
          style={{
            fontSize: hp(2.5),
            fontWeight: '400',
            color: '#525252',
            marginStart: 20,
          }}>
          Menu
        </Text>
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

        <View>
          {/* Món ăn */}
          {menuItems.length > 0 ? (
            <FlatList
              data={menuItems}
              keyExtractor={item => item._id.toString()}
              renderItem={renderMenuItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.menuList}
            />
          ) : (
            <Text style={styles.noMenuItems}>
              Không có món ăn nào trong danh mục này
            </Text>
          )}
        </View>
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  menuItemImage: {
    width: wp(20),
    height: hp(10),
    borderRadius: 10,
    marginRight: 10,
  },
  menuItemInfo: {
    flex: 1,
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
    paddingBottom: 30,
    marginTop: 10,
  },
  noMenuItems: {
    textAlign: 'center',
    marginTop: 20,
    color: '#757575',
    fontSize: hp(2),
  },
});
