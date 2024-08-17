import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/AntDesign';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

const Help = ({navigation}) => {
  const handleBack = () => {
    navigation.goBack();
    console.log('back');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrowleft" size={24} color="#E8900C" />
        </TouchableOpacity>

        <Text style={styles.headerText}>HỖ TRỢ </Text>
      </View>
      {/* body */}
      <View>
        <Text style={{fontSize: 28}}>Muốn gì thì hỏi phục vụ</Text>
      </View>

      {/* footer */}
      <View style={{height: hp(18), width: wp(100), backgroundColor: '#E8900C', flexDirection:'row'}}>
        <View style={{height:'100%', width: wp(60), paddingStart: wp(2), justifyContent:'center', gap: 5}} >
      <Text style={{color: 'white', }}>
        Liên hệ với chúng tôi qua Email:
      </Text>
      <Text style={{color: 'white', }}>deptrainhatthegioi@gmail.com </Text>
      <Text style={{color: 'white', }}>Địa chỉ : </Text>
      <Text style={{color: 'white', }}>Tòa T Cao đẳng FPT Polytechnic HCM</Text>
        </View>
        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            initialRegion={{
              latitude: 10.856800035801468,
              longitude: 106.62602474081999,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}>
            <Marker
              // key={index}
              coordinate={{
                latitude: 10.853800035801468,
                longitude: 106.62602474081999,
              }}
              title={'Trường tôi yêu <3'}
              // description={marker.description}
            />
          </MapView>
        </View>
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
    justifyContent: 'space-between',
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
  mapContainer: {
    // ...StyleSheet.absoluteFillObject,
    height: hp(18),
    width: wp(40),
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-end',
    // backgroundColor:'red'
  },
  map: {
    height: 200,
    width: 200,
    ...StyleSheet.absoluteFillObject,
  },
});
