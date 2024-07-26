import {
  FlatList,
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
import {getHistoryOrder} from '../ProductsHTTP';

const HistoryOrder = ({navigation}) => {
  const [items, setitems] = useState([]);

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
    }
  };

  const handleDetail = (item) =>{
    navigation.navigate('DetailHistoryOrder', { item })
  }

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
      activeOpacity={0}
      onPress={()=> handleDetail(item)}
      style={{height:hp(10), backgroundColor:'yellow', }}>
        
        <Text>Bạn đã thanh toán thành công hóa đơn {item.appTransactionId}</Text>
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
        {items.length === 0 ? (
          <View />
        ) : (
          <FlatList
          style={{backgroundColor:'red'}}
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
    fontSize: hp(2),
    fontWeight: '500',
    color: '#E8900C',
  },
  menuList: {
    gap: 10,
    marginTop: hp(2)
  },
});
