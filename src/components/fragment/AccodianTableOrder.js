import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  UIManager,
  Platform,
  LayoutAnimation,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {checkPrice} from '../products/screens/Oder';

const AccodianTableOrder = ({
  name,
  quantity,
  amount,
  image,
  options,
  userOrders,
}) => {
  const [opened, setOpened] = useState(false);

  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  function toggleAccordion() {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {type: 'easeIn', property: 'opacity'},
      update: {type: 'linear', springDamping: 0.3, duration: 250},
    });
    setOpened(!opened);
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={toggleAccordion}>
        <View style={styles.itemContainer}>
          {/* Image wp30 */}
          <View
            style={{
              width: wp(30),
              height: hp(12),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image source={{uri: image}} style={styles.image} />
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.price}>{checkPrice(amount)} đ</Text>

            {/* Options */}
            {options === '' ? (
              <View />
            ) : (
              <Text style={styles.options}>{options}</Text>
            )}
          </View>

          <View
            style={{
              width: wp(20),
              height: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {/* Icon */}
            <Icon name={opened ? 'caretup' : 'caretdown'} size={16} />

            <Text style={styles.quantity}>x {quantity}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {opened && (
        <View style={[styles.content]}>
          {userOrders.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={1}
              style={[styles.itemContainer,{paddingHorizontal: wp(3)}]}>
              <View
                style={{
                  width: wp(25),
                  height: hp(12),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={{uri: item.img_avatar_url}}
                  style={{  width: wp(20),
                    height: wp(20),
                    borderRadius: 10,}}
                />
              </View>
<View style={styles.detailsContainer}>
<Text style={styles.name}>{item.fullName}</Text>
</View>


<View></View>

            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default AccodianTableOrder;

const styles = StyleSheet.create({
  details: {
    opacity: 0.65,
  },
  title: {
    textTransform: 'capitalize',
  },
  content: {
    marginTop: 8,
  },
  container: {
    margin: 10,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E8900C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemContainer: {
    width: '100%',
    height: hp(12),
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: wp(25),
    height: wp(25),
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
});
