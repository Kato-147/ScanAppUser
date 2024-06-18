import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Loading from '../../fragment/Loading';
import {CachedImage} from '../../../helper/ImageDemo';
import {useNavigation} from '@react-navigation/native';

export default function Recipes({categories, meals}) {
  const navigation = useNavigation();

  const COLUMN_COUNT = 2;

  // Để tính toán chiều rộng của mỗi mục trong lưới
  const renderItem = ({item, index}) => {
    const marginRight = (index + 1) % 1 === 0 ? 0 : 10;
    return (
      <View style={[styles.item, {marginRight}]}>
        <RecipeCard item={item} index={index} navigation={navigation} />
      </View>
    );
  };

  return (
    <View style={{marginHorizontal: 16, marginTop: 12}}>
      
      <View>
        {categories.length === 0 || meals.length === 0 ? (
          <Loading style={{marginTop: 80, fontSize: 40}} />
        ) : (
          <FlatList
            data={meals}
            keyExtractor={item => item.idMeal.toString()} // Đảm bảo key là một chuỗi duy nhất
           // numColumns={1}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
           // columnWrapperStyle={styles.columnWrapper} // Áp dụng phong cách cho các cột
            onEndReachedThreshold={0.1}
            //refreshing={isLoadingNext}
            //onRefresh={() => refetch({first: ITEM_CNT})}
            //onEndReached={() => loadNext(ITEM_CNT)}
          />
        )}
      </View>
    </View>
  );
}

const RecipeCard = ({item, index, navigation}) => {
  const isEven = index % 2 == 0;
  return (
    <Pressable
      style={{
        width: '100%',
        flex: 1,
        justifyContent: 'flex-start',
        marginBottom: 16,
        marginTop: 4,
      //  paddingLeft: isEven ? 0 : 8,
// paddingRight: isEven ? 8 : 0,
        flexDirection:'row'
      }}
      // onPress={()=> navigation.navigate('RecipeDetail', {...item})}
    >
      {/* <Image
                  source={{uri:item.strMealThumb}}
                  style={{width:'100%',height: index%3 ==0 ? hp(25):hp(35),backgroundColor:'#d4d4d4',borderRadius:35}}
                />    */}
      <CachedImage
        uri={item.strMealThumb}
        style={{
          width: hp(8),
          height: hp(8),
          backgroundColor: '#d4d4d4',
          borderRadius: 5,
        }}
        sharedTransitionTag={item.strMeal}
      />
      <Text
        style={{
          fontWeight: '600',
          marginLeft: 8,
          color: '#525252',
          fontSize: hp(1.8),
        }}>
        {item.strMeal.length > 20
          ? item.strMeal.slice(0, 20) + '...'
          : item.strMeal}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    marginBottom: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between', // Để các mục được trải đều
  },
});
