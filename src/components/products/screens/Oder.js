import { ActivityIndicator, StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import React,{useEffect,useState} from 'react'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getOrderUser } from '../ProductsHTTP';
import { useIsFocused } from '@react-navigation/native';

const Oder = () => {

  const [oderItems, setOderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFocused = useIsFocused();


  useEffect(()=>{
    if(isFocused){
      const loadOrderUser = async()=>{
        try {
          const response = await getOrderUser();
          
          if(response.success === 'success'){
            console.log('====================================');
            console.log(response.data[0].items);
            console.log('====================================');
           setOderItems( response.data[0].items);
          }else {
            console.error('Failed to fetch order data:', response.data);
          }
          
        } catch (error) {
          setError(error.message);
          console.log(error);
        } finally{
          setLoading(false);
        }
      }
      loadOrderUser();
    }
  },[isFocused]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderOrderItem = ({item}) =>{
    return(
<TouchableOpacity style={styles.itemContainer}>
    <Image source={{ uri: item.menuItemId.image_url }} style={styles.image} />
    <View style={styles.detailsContainer}>
      <Text style={styles.name}>{item.menuItemId.name}</Text>
      <Text style={styles.price}>{item.menuItemId.price} VND</Text>
      <Text style={styles.options}>Options: {item.options}</Text>
      <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
    </View>
  </TouchableOpacity>
    );
    
  }

  return (
    <View style={styles.container}>
      <Text>HIhihaha</Text>
      { oderItems?.length === 0 ? 
      (<View><Text style={{fontSize: hp(4)}}>Đặt món đi thằng lồn</Text></View>)
       :
       (
       <View style={{ height:hp(70)}}>
        <FlatList
        data={oderItems}
        keyExtractor={item => item._id.toString()}
        renderItem={renderOrderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuList}
        />
      </View>
       )}
    </View>
  )
}

export default Oder

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    // backgroundColor: 'white',
  },
  menuList: {
    paddingBottom: 20,
    marginTop: 5,
   
    height:'100%'
  },
  menuOrderItem: {
    width: '100%',
    //  flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    marginVertical: 10,
    flexDirection: 'row',
    backgroundColor: 'red',
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
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
})