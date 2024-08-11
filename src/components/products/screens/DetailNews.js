import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import {formatDate} from './DetailHistoryOrder';

const DetailNews = ({route, navigation}) => {
  const item = route.params;
  const [itemNews, setitemNews] = useState(item);
  console.log('-----Id Item------', itemNews.item.id);

  useMemo(() => {
    setitemNews(item);
  }, []);

  //Back to Home Screen
  const handleBack = () => {
    console.log('>>>>>> Click Back Button');
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#ffffff', '#ffffff', '#F6F6F6']}
      style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrowleft" size={24} color="#E8900C" />
        </TouchableOpacity>

        <Text style={styles.headerText}>THÔNG BÁO </Text>
      </View>

      <ScrollView
      showsVerticalScrollIndicator = {false}
      >
        {/* Body */}
        <View style={styles.bodyContainer}>
          <Image style={styles.image} source={{uri: itemNews.item.image_url}} />

          {/* info */}
          <View style={{ paddingHorizontal: wp(3)}}>
            <Text numberOfLines={2} style={styles.title}>
              {itemNews.item.title}
            </Text>

            <Text style={styles.time}>
              Thời gian đăng bài : {formatDate(itemNews.item.published_at)}
            </Text>

            <Text style={styles.description}>{itemNews.item.summary}</Text>
            <Text style={styles.description}>{itemNews.item.summary}</Text>
            <Text style={styles.description}>{itemNews.item.summary}</Text>
            <Text style={styles.description}>{itemNews.item.summary}</Text>
            <Text style={styles.description}>{itemNews.item.summary}</Text>
            <Text style={styles.description}>{itemNews.item.summary}</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default DetailNews;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
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
  bodyContainer: {
    // height: hp(92),
  },
  image: {
    width: wp(100),
    height: hp(25),
    // borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: hp(2.8),
    color: '#202020',
    marginVertical: hp(2)
  },
  time: {
    marginBottom: hp(2)
  },
  description: {
    color: '#202020',
    fontSize: hp(2),
  },
});
