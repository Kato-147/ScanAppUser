import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getMenuItemDetails} from '../ProductsHTTP';
import StarRating from 'react-native-star-rating-widget';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/AntDesign';
import { checkPrice } from './Oder';

const DetailMenuItem = ({route, navigation}) => {
  const {item} = route.params;
  const [itemDetail, setItemDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!item || !item._id) {
      setError('Invalid menu item ID');
      setLoading(false);
      return;
    }

    getMenuItemDetails(item._id)
      .then(res => {
        setItemDetail(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch menu item details');
        setLoading(false);
      });
  }, [item]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const handleBack=()=>{
    console.log('go Back');
    navigation.goBack();
  }

  function formatNumber(num) {
    return Math.round(num * 10) / 10;
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          height: hp(10),
          position: 'absolute',
          zIndex: 2,
          top: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 5
        }}>
        <TouchableOpacity
        activeOpacity={1}
        onPress={()=> handleBack()}
          style={{
            width: hp(5),
            height: hp(5),
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            borderRadius: 7,
            alignItems:'center',
            justifyContent:'center',
            margin: 7,
          }}>
          <Icon name="left" size={hp(4)} />
        </TouchableOpacity>
      </View>
      <ScrollView
      showsVerticalScrollIndicator={false}
      style={{}}>
        {itemDetail && (
          <>
            <Image
              style={styles.image}
              source={{uri: itemDetail.menuItem.image_url}}
              resizeMode="cover"
            />
            <Text style={styles.title}>{itemDetail.menuItem.name}</Text>
            <Text style={styles.engName}>{itemDetail.menuItem.engName}</Text>
            <Text style={styles.price}>{checkPrice(itemDetail.menuItem.price)} VND</Text>
            <Text style={styles.description}>
              {itemDetail.menuItem.description}
            </Text>
            <View style={styles.ratingContainer}>
              <StarRating
                rating={itemDetail.menuItem.rating}
                size={24}
                isDisabled={true}
                halfStarEnabled={true}
                onChange={() => {}}
              />
              <Text style={styles.ratingText}>
                {formatNumber(itemDetail.menuItem.rating)} / 5
              </Text>
            </View>

            <Text style={styles.reviewTitle}>
              Reviews ({itemDetail.reviewCount}):
            </Text>
            {itemDetail.reviews &&
              itemDetail.reviews.map((review, index) => (
                <View key={review._id} style={styles.review}>
                  <View style={styles.reviewHeader}>
                    <Image
                      style={styles.avatar}
                      source={{uri: review.userId.img_avatar_url}}
                    />
                    <View style={styles.userInfo}>
                      <Text style={styles.reviewUser}>
                        {review.userId.fullName}
                      </Text>
                      <Text style={styles.orderDate}>
                        Order Date:{' '}
                        {new Date(review.orderCreatedAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <StarRating
                    rating={review.rating}
                    size={20}
                    isDisabled={true}
                    halfStarEnabled={true}
                    onChange={() => {}}
                  />
                  <Text style={styles.comment}>{review.comment}</Text>
                </View>
              ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#f0f0f0',
    position: 'relative',
    paddingHorizontal: wp(2)
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  engName: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#888',
    marginBottom: 10,
  },
  price: {
    fontSize: 22,
    color: '#E8900C',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 18,
    color: '#ffcc00',
    marginLeft: 10,
  },
  reviewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  review: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: wp(95),
    alignSelf:'center'
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#888',
  },
  comment: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
});

export default DetailMenuItem;
