import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/AntDesign';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import AccodianHelp from '../../fragment/AccodianHelp';

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
      <ScrollView showsVerticalScrollIndicator={false} style={{height: hp(74)}}>
        {data.map((item, index) => (
          <AccodianHelp
            key={index.toString()}
            title={item.title}
            description={item.description}
          />
        ))}
      </ScrollView>

      {/* footer */}
      <View
        style={{
          height: hp(18),
          width: wp(100),
          backgroundColor: '#E8900C',
          flexDirection: 'row',
        }}>
        <View
          style={{
            height: '100%',
            width: wp(60),
            paddingStart: wp(2),
            justifyContent: 'center',
            gap: 5,
          }}>
          <Text style={{color: 'white'}}>Liên hệ với chúng tôi qua Email:</Text>
          <Text style={{color: 'white'}}>deptrainhatthegioi@gmail.com </Text>
          <Text style={{color: 'white'}}>Địa chỉ : </Text>
          <Text style={{color: 'white'}}>
            Tòa T Cao đẳng FPT Polytechnic HCM
          </Text>
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
    ...StyleSheet.absoluteFillObject,
  },
});

const data = [
  {
    id: 1,
    title: 'Cách thay đổi mật khẩu',
    description:
      'Ở màn hình "người dùng", nhấn vào nút "Thay đổi mật khẩu" ở phần "Cài đặt" để tới màn hình "Thay đổi mật khẩu". Nhập mật khẩu cũ sau đó nhập mật khẩu bạn muốn thay đổi và nhập lại mật khẩu mới. Nhấn nút "Xác nhận" để tiến hành thay đổi mật khẩu.',
  },
  {
    id: 2,
    title: 'Màn hình Menu hiển thị lỗi sau khi đã quét mã QR',
    description: ' - Kiểm tra bạn đã vào bàn khác trước đó hay chưa. Nếu đã vào bàn khác ở trước đó, vui lòng chọn dấu ba chấm góc phải trên cùng màn hình để thoát bàn và vào bàn hiện tại. \n - Nếu bàn đã có người vào trước, vui lòng quét mã QR của người vào trước để xem menu. \n - Bàn cần ở trạng thái "mở" khách hàng mới vào được, vui lòng liên hệ phục vụ để mở trạng thái bàn. \n - Nếu có lỗi khác vui lòng liên hệ phục vụ hoặc với chúng tôi qua thông tin ở dưới màn hình.',
  },
  {id: 3, title: 'Lỗi khác', description: 'Vui lòng gọi phục vụ'},
];
