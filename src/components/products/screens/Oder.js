import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {getOrderUser} from '../ProductsHTTP';
import {useIsFocused} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import {RadioButton} from 'react-native-paper';

const mergeOrderItems = items => {
  const mergedItems = [];

  items.forEach(item => {
    const existingItem = mergedItems.find(
      i =>
        i.menuItemId._id === item.menuItemId._id && i.options === item.options,
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      mergedItems.push({...item});
    }
  });

  return mergedItems;
};

const calculateTotalPrice = items => {
  return items.reduce((total, item) => {
    return total + item.menuItemId.price * item.quantity;
  }, 0);
};

const Oder = () => {
  const [oderItems, setOderItems] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('MoMo');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const loadOrderUser = async () => {
        try {
          const response = await getOrderUser();

          if (response.success === 'success') {
            const mergedItems = mergeOrderItems(response.data[0].items);
            setOderItems(mergedItems);
          } else {
            console.error('Failed to fetch order data:', response.data);
          }
        } catch (error) {
          setError(error.message);
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      loadOrderUser();
    }
  }, [isFocused]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles?.errorText}>{error?.response?.data?.message}</Text>
      </View>
    );
  }

  const renderOrderItem = ({item}) => {
    return (
      <TouchableOpacity activeOpacity={1} style={styles.itemContainer}>
        <Image source={{uri: item.menuItemId.image_url}} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{item.menuItemId.name}</Text>
          <Text style={styles.price}>{item.menuItemId.price} VND</Text>
          <Text style={styles.options}>Options: {item.options}</Text>
          <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const totalPrice = calculateTotalPrice(oderItems);

  return (
    <LinearGradient
      colors={['white', 'white', '#FBFAFF', '#FBFAFF']}
      style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={{fontSize: hp(3), fontWeight: '600', color: '#525252'}}>
          Đặt món
        </Text>
      </View>

      {/* Order Item */}
      {oderItems.length === 0 ? (
        <View>
          <Text style={{fontSize: hp(4)}}>Đặt món đi ban oi</Text>
        </View>
      ) : (
        <View style={{height: hp(32)}}>
          <FlatList
            data={oderItems}
            keyExtractor={item => item._id.toString()}
            renderItem={renderOrderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.menuList}
          />
        </View>
      )}

      {/* Voucher & payment method */}
      <View style={{height: hp(42)}}>
        <View>
          {/* Voucher */}
          <View style={styles.voucherContainer}>
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
          </View>

          {/* Payment method */}
          <View style={{backgroundColor: 'white', paddingHorizontal: 10}}>
            <Text style={styles.title}>Phương thức thanh toán</Text>

            <TouchableOpacity
              style={styles.optionContainer}
              onPress={() => setSelectedMethod('MoMo')}>
              <View style={styles.optionContent}>
                <Image
                  source={{
                    uri: 'https://www.plusweb.vn/uploads/public/2021/06/03/1622682588188_zalopay.png',
                  }}
                  style={styles.logo}
                />
                <Text style={styles.optionText}>Ví điện tử ZaloPay</Text>
              </View>

              <RadioButton
                value="MoMo"
                status={selectedMethod === 'MoMo' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedMethod('MoMo')}
                color="#F53360"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionContainer}
              onPress={() => setSelectedMethod('COD')}>
              <View style={styles.optionContent}>
                <Image
                  source={{
                    uri: 'https://e7.pngegg.com/pngimages/199/428/png-clipart-paper-computer-icons-money-banknote-united-states-dollar-banknote-rectangle-sign.png',
                  }}
                  style={styles.logo}
                />
                <Text style={styles.optionText}>Thanh toán tiền mặt</Text>
              </View>
              <RadioButton
                value="COD"
                status={selectedMethod === 'COD' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedMethod('COD')}
                color="#F53360"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Total Price */}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: wp(6),
            width: wp(100),
          }}>
          <Text>Tổng tiền : </Text>
          <Text>{totalPrice}</Text>
        </View>
      </View>

      {/* Button Order */}

      <View>
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Order</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default Oder;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',

    // backgroundColor: 'white',
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(8),
  },
  menuList: {
    paddingBottom: 20,
    marginTop: 5,
  },
  menuOrderItem: {
    width: '100%',
    //  flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    marginVertical: 10,
    flexDirection: 'row',
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
    // backgroundColor:'red'
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
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
  voucherContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: hp(8),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  voucherText: {
    color: 'black',
    fontSize: hp(2),
  },
  voucherTextInput: {
    //  backgroundColor: 'red',
    borderWidth: 1,
    borderColor: '#E8900C',
    height: hp(5),
    borderRadius: 8,
    width: hp(24),
    // alignItems:'center',
    //justifyContent:'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
  },
  orderButton: {
    backgroundColor: '#E8900C',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: wp(10),
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
