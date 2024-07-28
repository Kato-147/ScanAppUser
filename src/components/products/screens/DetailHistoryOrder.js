import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/AntDesign';
import IconBill from 'react-native-vector-icons/FontAwesome5';
import {checkPrice, mergeOrderItems} from './Oder';
import BottomSheetHistoryOrder from '../../fragment/BottomSheetHistoryOrder';

export const formatDate = isoString => {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const DetailHistoryOrder = ({route, navigation}) => {
  const {item} = route.params;
  const [historyItems, sethistoryItems] = useState([]);
  const [status, setStatus] = useState(false);

  //Back to HistoryOrder Screen
  const handleBack = () => {
    console.log('>>>>>> Click Back Button');
    navigation.goBack();
  };

  useEffect(() => {
    loadItems();
    // console.log(item);
  }, []);

  const loadItems = () => {
    const mergedItems = mergeOrderItems(item.items);
    sethistoryItems(mergedItems);
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity activeOpacity={1} style={styles.itemContainer}>
        {/* Image wp30 */}
        <View
          style={{
            width: wp(30),
            height: hp(10),
            padding: 14,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image source={{uri: item.image_url}} style={styles.image} />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{checkPrice(item.price)} đ</Text>

          {/* Options */}
          {item.options === '' || error ? (
            <View />
          ) : (
            <Text style={styles.options}>{item.options}</Text>
          )}
        </View>
        <View
          style={{
            width: wp(20),
            height: '100%',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <Text style={styles.quantity}>x {item.quantity}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#ffffff', '#ffffff', '#F6F6F6']}
      style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrowleft" size={24} color="#E8900C" />
        </TouchableOpacity>
        <Text style={styles.headerText}>BÀN {item.tableNumber} </Text>
      </View>

      {/* <Text>Người thanh toán: {item.userPay.fullName}</Text> */}
      <TouchableOpacity
        style={styles.infoContainer}
        onPress={() => setStatus(true)}>
        <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
          <IconBill name="money-bill-wave" size={24} color="#E8900C" />
          <Text style={{color: 'black', fontSize: hp(2)}}>
            Chi tiết hóa đơn
          </Text>
        </View>
        <Icon Icon name="right" size={24} color="#E8900C" />
      </TouchableOpacity>

      <View style={{height: hp(80)}}>
        <FlatList
          data={historyItems}
          // keyExtractor={item => item._id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 20, marginTop: 5}}
        />
      </View>
      {status && <BottomSheetHistoryOrder item={item} setStatus={setStatus} />}
    </LinearGradient>
  );
};

export default DetailHistoryOrder;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
   // backgroundColor:'green',
  },
  headerContainer: {
    height: hp(8),
    width: wp(100),
  //  backgroundColor: 'green',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 3,
    paddingHorizontal: 10,
    gap: 20,
  },
  headerText: {
    fontSize: hp(2.2),
    fontWeight: '500',
    color: '#E8900C',
  },
  itemContainer: {
    width: wp(100),
    height: hp(12),
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    paddingBottom: hp(2),
  },
  image: {
    width: wp(20),
    height: wp(20),
    borderRadius: 10,
  },
  detailsContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-around',
    width: wp(50),
  },
  name: {
    fontSize: hp(2.2),
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#888',
  },
  options: {
    fontSize: 14,
    color: '#555',
  },
  quantity: {
    fontSize: 14,
    color: '#555',
  },
  infoContainer: {
    flexDirection: 'row',
    //backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginVertical: hp(3),
    height: hp(6),
    //borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8900C',
   
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoKeyText: {
    fontSize: hp(1.8),
    fontWeight: 'bold',
    color: '#888',
    width: wp(50),
  },
  infoValueText: {
    width: wp(50),
  },
});
