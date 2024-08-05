import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/AntDesign';

const Help = ({navigation}) => {
  const handleBack = () => {
    navigation.goBack();
    console.log('back');
  };

  return (
    <View>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleBack}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon name="left" color="#E8900C" style={{fontSize: hp(2.4)}} />
        </TouchableOpacity>

        <Text style={styles.textHeader}>Voucher</Text>
      </View>
    </View>
  );
};

export default Help;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  headerContainer: {
    height: hp(7),
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 3,
    gap: 25,
    paddingHorizontal: 20,
  },
  textHeader: {
    fontSize: hp(2.4),
    color: '#E8900C',
    fontWeight: '500',
  },
});
