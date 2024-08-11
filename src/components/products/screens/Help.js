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
    <View>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrowleft" size={24} color="#E8900C" />
        </TouchableOpacity>

        <Text style={styles.headerText}>HỖ TRỢ </Text>

        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}>
            <Marker
             // key={index}
              coordinate={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
              title={'con cac'}
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
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  map: {
    height: 200,
    width: 200,
    ...StyleSheet.absoluteFillObject,
  },
});
