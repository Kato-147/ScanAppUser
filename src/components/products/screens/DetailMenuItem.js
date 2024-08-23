import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getMenuItemDetails} from '../ProductsHTTP';
import StarRating from 'react-native-star-rating-widget';

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

  return (
    <ScrollView style={styles.container}>
      {itemDetail && (
        <>
          <Image
            style={styles.image}
            source={{uri: itemDetail.menuItem.image_url}}
            resizeMode="cover"
          />
          <Text style={styles.title}>{itemDetail.menuItem.name}</Text>
          <Text style={styles.engName}>{itemDetail.menuItem.engName}</Text>
          <Text style={styles.price}>{itemDetail.menuItem.price} VND</Text>
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
              {itemDetail.menuItem.rating} / 5
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
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
    color: '#28a745',
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
