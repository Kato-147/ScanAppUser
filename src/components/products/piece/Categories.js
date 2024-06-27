import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//Categories

const Categories = ({ categories, activeCategory, handleChangeCategory }) => {
  const renderItem = ({ item }) => {
    const isActive = item.strCategory === activeCategory;
    const activeButtonStyle = {
      borderColor: isActive ? '#E8900C' : '#757575',
    };
    const activeTextStyle = {
      color: isActive ? '#E8900C' : '#757575',
    };

    return (
      <TouchableOpacity
        onPress={() => handleChangeCategory(item.strCategory)}
        style={styles.touchableOpacity}>
        <View
          style={[
            styles.buttonView,
            activeButtonStyle,
          ]}>
          <Text style={[styles.buttonText, activeTextStyle]}>
            {item.strCategory}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={categories}
      horizontal
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.flatListContent}
      style={styles.flatList}
    />
  );
};

const styles = StyleSheet.create({
  flatListContent: {
    paddingHorizontal: 5,
  },
  flatList: {
    marginTop: 20,
    height: hp(8),
  },
  touchableOpacity: {
    flex: 1,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonView: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 6,
    marginHorizontal: 4,
  },
  buttonText: {
    fontSize: hp(2),
    fontWeight: '500',
  },
});

export default Categories;
