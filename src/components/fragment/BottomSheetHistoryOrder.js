import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Pressable,
  Button,
} from 'react-native';
import React, {useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {formatDate} from '../products/screens/DetailHistoryOrder';
import {checkPrice} from '../products/screens/Oder';

const BottomSheetHistoryOrder = ({setStatus, item}) => {

  const slide = React.useRef(new Animated.Value(300)).current;

  const slideUp = () => {
    // Will change slide up the bottom sheet
    Animated.timing(slide, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const slideDown = () => {
    // Will slide down the bottom sheet
    Animated.timing(slide, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    slideUp();
  });

  const closeModal = () => {
    slideDown();

    setTimeout(() => {
      setStatus(false);
    }, 250);
  };
  return (
    <Pressable onPress={closeModal} style={styles.backdrop}>
      <Pressable style={{width: '100%', height: '40%'}}>
        <Animated.View
          style={[styles.bottomSheet, {transform: [{translateY: slide}]}]}>
          <Text style={{fontSize: 25, fontWeight: 'bold'}}>
            Thông tin hóa đơn
          </Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoCard}>
              <Text style={styles.infoKeyText}>Tài khoản gọi món: </Text>
              <Text style={styles.infoValueText}>
                {item.userOrder[0].fullName}
              </Text>
            </View>

            {/* <Text>Người thanh toán: {item.userPay.fullName}</Text> */}
            <View>
              <View style={styles.infoCard}>
                <Text style={styles.infoKeyText}>Thời gian tạo đơn: </Text>
                <Text style={styles.infoValueText}>
                  {formatDate(item.createdAt)}
                </Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoKeyText}>Mã đơn: </Text>
                <Text style={styles.infoValueText}>
                  {item.appTransactionId}
                </Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoKeyText}>Phương thức thanh toán: </Text>
              <Text style={styles.infoValueText}>{item.paymentMethod}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoKeyText}>Tổng tiền: </Text>
              <Text style={styles.infoValueText}>
                {checkPrice(item.amount)} đ
              </Text>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Pressable>
  );
};

export default BottomSheetHistoryOrder;

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bcbcbc',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#40A2E3',
    alignItems: 'center',
    marginTop: 15,
  },
  infoContainer: {
    height: hp(50),
    width: wp(100),
    paddingHorizontal: wp(2),
    marginTop: hp(2),
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
