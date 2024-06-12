import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useState} from 'react';
import SearchBar from '../../fragment/SearchBar';

const Home = () => {
  const [value, setValue] = useState();
  function updateSearch(value) {
    //do your search logic or anything
    console.log(value);
  }

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View
            style={{
              height: '10%',
              backgroundColor: '#E8900C',
              borderBottomEndRadius: 30,
              borderBottomStartRadius: 30,
              justifyContent: 'center',
            }}>
            <SearchBar
              value={value}
              updateSearch={updateSearch}
              style={{marginTop: '8%'}}
            />
          </View>

          <View>
            <Text>HiHiHaHa</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
});
