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
import { checkPrice } from '../../products/screens/Oder';

const MenuNoLogin = ({route, navigation}) => {

  const tableId = route.params;

  const [loading, setLoading] = useState(false);
  const [table, setTable] = useState('');
  const [idTable, setidTable] = useState(tableId)
  const isFocused = useIsFocused();
  console.log('--------',table);

    // Back  function
    const handleBack = () => {
      console.log('back');
      navigation.goBack();
    };

    useEffect(() => {
     // setidTable(tableId);
      getTableNumber(tableId);
     // loadCategories();
    }, []);

    const getTableNumber = async (tableId) => {
      try {
        
        const table = await getTables(tableId);
          console.log('===table==', table);
        setTable(table);
      } catch (error) {
        console.error('Table error', error);
      }
    };

    // if (loading) {
    //   return (
    //     <LinearGradient
    //       style={{width: wp(100), height: hp(100)}}
    //       colors={['white', 'white', 'white', '#F6F6F6']}>
    //       {/* Header h10 */}
    //       <View style={styles.headerContainer}>
    //         <View
    //           style={{
    //             flexDirection: 'row',
    //             alignItems: 'center',
    //             gap: 20,
    //           }}>
    //           <TouchableOpacity onPress={handleHome} style={{}}>
    //             <Icon style={styles.backIcon} name="left" />
    //           </TouchableOpacity>
    //           <Text
    //             style={{fontSize: hp(3), fontWeight: '600', color: '#525252'}}>
    //             Đang tải ...
    //           </Text>
    //         </View>
    //       </View>
    //       <View
    //         style={{
    //           height: hp(90),
    //           alignItems: 'center',
    //           justifyContent: 'center',
    //         }}>
    //         <ActivityIndicator size="large" color="blue" />
    //       </View>
    //     </LinearGradient>
    //   );
    // }
  

  return (
    
    <View style={styles.container}>
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
                Bàn {table?.tableNumber}
              </Text>
            </View>

          </View>
      </LinearGradient>
    </View>
  )
}

export default MenuNoLogin

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