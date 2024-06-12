import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React,{useState} from 'react'
import SearchBar from '../../fragment/SearchBar';


const Home = () => {

  const [value, setValue] = useState();
  function updateSearch(value) {
    //do your search logic or anything
    console.log(value)
}

  return (
    <KeyboardAvoidingView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      
      <View style={{ height: '10%', backgroundColor: "#3F569C",borderBottomEndRadius: 40, borderBottomStartRadius:20, justifyContent:'center'}}>
                <SearchBar
                    value={value}
                    updateSearch={updateSearch}
                    style={{ marginTop: '8%',  }}
                />
            </View>
            </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red', height: '100%', width: '100%' 
},
})