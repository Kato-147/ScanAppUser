import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
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
import Icon2 from 'react-native-vector-icons/Ionicons';
import {getHistoryOrder} from '../ProductsHTTP';
import { formatDate } from './DetailHistoryOrder';

const HistoryOrder = ({navigation}) => {
  const [items, setitems] = useState([]);
  const [loading, setLoading] = useState(true);
 
  //Back to Profile Screen
  const handleBack = () => {
    console.log('>>>>>> Click Back Button');
    navigation.goBack();
  };

  useEffect(() => {
    historyOrder();
  }, []);

  const historyOrder = async () => {
    try {
      const response = await getHistoryOrder();
      // console.log(response);
      if (response.status === 'success') {
        setitems(response.data);
      }
      return response;
    } catch (error) {
      setError(error.message);
      console.log('======OrderTable=====', error);
    } finally{
      setLoading(false);
    }
  };

    //Loading
    if (loading) {
      return (<View style={[styles.container, {alignItems:'center', justifyContent:'center'}]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>);
    }

  const handleDetail = item => {
    navigation.navigate('DetailHistoryOrder', {item});
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => handleDetail(item)}
        style={styles.itemContainer}>

        <View style={styles.imageItem}>
          {item.paymentMethod === 'ZaloPay' ? (<Image style={styles.image} source={require('../../../images/zaloPay.png')} />):(<Image style={styles.image} source={require('../../../images/cash.png')}  />)}
        </View>

        <View
          style={{
            height: '100%',
            width: wp(75),
            alignItems: 'center',
            justifyContent: 'center',
            
          }}>
          <Text style={styles.textItem}>
            Bạn đã thanh toán thành công hóa đơn{' '}
            <Text style={{fontWeight: '400', color: '#E8900C'}}>
              {item.appTransactionId}
            </Text>
          </Text>
          <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%', padding:5}}>
            <Text>Thời gian : </Text>
            <Text>{formatDate(item.createdAt)}</Text>
          </View>
          
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={['#ffffff', '#ffffff', '#ffffff', '#F6F6F6']}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrowleft" size={24} color="#E8900C" />
        </TouchableOpacity>

        <Text style={styles.headerText}>LỊCH SỬ ĐƠN HÀNG </Text>
      </View>

      <View>
        
        { items.length === 0 ? (
          <View />
        ) : (
          <FlatList
            style={{}}
            data={items}
            keyExtractor={item => item._id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.menuList}
          />
        )}
      </View>
    </LinearGradient>
  );
};

export default HistoryOrder;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'space-between',
  },
  headerContainer: {
    height: hp(8),
    width: wp(100),
    backgroundColor: 'white',
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
  menuList: {
    gap: 10,
    marginTop: hp(2),
    // paddingHorizontal: wp(2)
  },
  itemContainer: {
    height: hp(10),
    // backgroundColor: 'yellow',
    paddingHorizontal: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
  },
  imageItem: {
    width: wp(21),
    alignItems: 'center',
    justifyContent: 'center',
    height:'100%',
    borderRadius: 10
  },
  textItem: {
    fontWeight: 'bold',
    fontSize: hp(2.2),
  },
  image:{
    width: wp(20),
    height: wp(20),
    borderRadius:10
  }
});
