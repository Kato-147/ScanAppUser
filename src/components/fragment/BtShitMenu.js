import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated,
    Pressable,
    Button,
    ScrollView,
  } from 'react-native';
  import React, {useEffect} from 'react';
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
  import Icon from 'react-native-vector-icons/MaterialIcons'

const BtShitMenu = ({setMoreOptions, setShowModal,setShowModalUser, onLogoutPress}) => {
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
  
    const closeBtSheet = () => {
      slideDown();
  
      setTimeout(() => {
        setMoreOptions(false);
      }, 250);
    };

    const handleCreateQR = () =>{
        setShowModal(true)
        setMoreOptions(false);
    }

    const handleUserInTable = () =>{
        setShowModalUser(true);
        setMoreOptions(false);
    }

   

    return (
      <Pressable onPress={closeBtSheet} style={styles.backdrop}>
        <Pressable style={{width: '100%', height: '40%'}}>
          <Animated.View
            style={[styles.bottomSheet, {transform: [{translateY: slide}]}]}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.infoContainer}>

                <TouchableOpacity onPress={()=>handleCreateQR()} activeOpacity={1} style={styles.onclick}>
                    <Text style={styles.text}>Chia sẻ bàn</Text>
                    <Icon name ="keyboard-arrow-right" style={styles.icon}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=> handleUserInTable()} activeOpacity={1} style={styles.onclick}>
                    <Text style={styles.text}>Xem các tài khoản có trong bàn</Text>
                    <Icon name ="keyboard-arrow-right" style={styles.icon}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={onLogoutPress} activeOpacity={1} style={styles.onclick}>
                    <Text style={styles.text}>Thoát khỏi bàn</Text>
                    <Icon name ="keyboard-arrow-right" style={styles.icon}/>
                </TouchableOpacity>
              
            </ScrollView>
          </Animated.View>
        </Pressable>
      </Pressable>
    );
}

export default BtShitMenu


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
     // backgroundColor:'red'
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
    infoContainer: {
      height: '100%',
      width: '100%',
    },
    onclick:{
        width:'100%', 
        height:hp(8),
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderBottomWidth:1,
        borderColor:'#C0C0C0'
    },
    text:{
        fontSize:hp(2),
        color:'#757575'
    },
    icon:{
        fontSize:wp(7),
        color:'#757575'
    }
  });