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
  import React, { useState } from 'react';
  import Icon from 'react-native-vector-icons/AntDesign'
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import { checkPrice } from '../products/screens/Oder';

const AccodianUserOrder = ({title,quantity, items}) => {
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
          <View style={styles.header}>
            <View>
            <Text style={styles.title}> Lần đặt {title}</Text>
            <Text style={styles.details}> số lượng {quantity}</Text>
            </View>

            <Icon name={opened ? 'caretup' : 'caretdown'} size={16} />
          </View>
        </TouchableWithoutFeedback>
  
        {opened && (
          <View style={[styles.content]}>
            {items.map((item,index)=>(
               <TouchableOpacity key={index} activeOpacity={1} style={styles.itemContainer}>
               {/* Image wp30 */}
               <View
                 style={{
                   width: wp(30),
                   height: hp(12),
                   justifyContent: 'center',
                   alignItems: 'center',
                 }}>
                 <Image
                   source={{uri: item.menuItemId.image_url}}
                   style={styles.image}
                 />
               </View>
       
               <View style={styles.detailsContainer}>
                 <Text style={styles.name}>{item.menuItemId.name}</Text>
                 <Text style={styles.price}>
                   {checkPrice(item.menuItemId.price)} đ
                 </Text>
       
                 {/* Options */}
                 {item.options === '' ? (
                   <View />
                 ) : (
                   <Text style={styles.options}>{item.options}</Text>
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
                 <TouchableOpacity
                   onPress={() => {
                    // handleDeleteItems(item._id);
                   }}
                   style={{
                     marginTop: hp(1),
                     backgroundColor: '#E8900C',
                     padding: wp(2),
                     borderRadius: 99,
                   }}>
                   <Icon name="delete" size={wp(5)} color="#ffffff" />
                 </TouchableOpacity>
       
                 <Text style={styles.quantity}>x {item.quantity}</Text>
               </View>
             </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
}

export default AccodianUserOrder

const styles = StyleSheet.create({
    details: {
      opacity: 0.65,
    },
    title: {
      textTransform: 'capitalize',
      fontWeight: 'bold',
      fontSize: hp(2.2),
    },
    content: {
      marginTop: 8, 
    },
    container: {
      margin: 10,
      padding: 10,
      borderRadius: 6,
      borderWidth:1,
      borderColor:'#E8900C'
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