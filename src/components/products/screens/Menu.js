import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {StatusBar} from 'react-native';
import axios from 'axios';
import Categories from '../piece/Categories';
import Recipes from '../piece/Food';

const Menu = ({navigation}) => {
  const handleHome = () => {};

  const [activeCategory, setActiveCategory] = useState('Beef');
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    getCategories();
    getRecipes();
  }, []);

  const handleChangeCategory = category => {
      getRecipes(category);
    setActiveCategory(category);
    setMeals([]);
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(
        'https://themealdb.com/api/json/v1/1/categories.php',
      );
      //console.log('got categories: ',response.data);
      if (response && response.data) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.log('error: ', err.message);
    }
  };

  const getRecipes = async(category="Beef") =>{
    try{
      const response = await axios.get(`https://themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      //console.log('got recipes: ',response.data);
      if(response && response.data){
        setMeals(response.data.meals);
      }
    }catch(err){
      console.log('error: ',err.message);
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={{
          // backgroundColor: 'red',
          // height: '30%',
          position: 'relative',
          width: '100%',
        }}>
        <Icon style={styles.backIcon} name="left" />
        <View style={{height: '25%'}}>
          <Image
            resizeMode="cover"
            style={styles.imageHeader}
            source={require('../../../images/artFood.jpg')}
          />
        </View>
      </View>

      {/* Body */}
      <View style={{marginHorizontal: 24}}>
        {/* Restaurant name */}
        <Text style={{fontSize: hp(3), fontWeight: '600', color: '#525252'}}>
          Thịt chó bà ba - gất ok
        </Text>

        {/* Voucher */}
        {/* <TouchableOpacity style={styles.voucherContainer}>
          <View style={styles.iconVoucher}>
            <Icon name="tagso" size={24} color="black" />
          </View>
          <Text style={styles.voucherText}>Xem voucher sẵn có</Text>
          <View />
          <View />
          <View style={styles.iconVoucher}>
            <Icon name="right" size={24} color="black" />
          </View>
        </TouchableOpacity> */}
      </View>

      {/* Menu */}
      <View>
      <Text style={{fontSize: hp(2.5), fontWeight: '400', color: '#525252', marginStart: 20}}>
        Menu
      </Text>
         {/* categories */}
         <View>
            {categories.length > 0 && (
              <Categories
                categories={categories}
                activeCategory={activeCategory}
                handleChangeCategory={handleChangeCategory}
              />
            )}
          </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 50}}
          //style={{marginTop: 10}}
          >

          {/* recipes */}
        <View>
          <Recipes meals={meals} categories={categories}/>
        </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  imageHeader: {
    height: '350%',
    // aspectRatio: 2,
    width: '100%',
    alignSelf: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: 'white',
    borderRadius: 4,
    position: 'absolute',
    zIndex: 2,
    margin: 10,
  },

});
