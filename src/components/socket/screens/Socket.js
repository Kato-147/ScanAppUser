import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import socketServices from '../utils/socketService';

const Socket = () => {
  const [messge, setmessge] = useState('');
  const [data, setdata] = useState([]);

  useEffect(() => {
    socketServices.inittializeSocket();
  }, []);

  useEffect(() => {
    socketServices.on('received_message', msg => {
      console.log('message received in reactApp', msg);
      let cloneArry = [...data];
      setdata(cloneArry.concat(msg));
    });
  }, [data]);

  const sendMessage = () => {
    if (!!messge) {
      socketServices.emit('send_message', messge);
      setmessge('');
      return;
    }
    Alert.alert('Plese enter your message');
  };

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text>Hihiahâha</Text>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              gap: 20,
              paddingHorizontal: 20,
            }}>
            <TextInput
              value={messge}
              style={styles.inputStyle}
              placeholder="Enter your messge...."
              onChangeText={text => setdata(text)}
            />
            <Button onPress={sendMessage} title="cặc" />
          </View>

          {data.map((val, i) => {
            return (
              <View>
                <Text style={{fontWeight: 'bold', marginTop: 10}}>{val}</Text>
              </View>
            );
          })}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

//make this component available to the app

export default Socket;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  inputStyle: {
    height: 42,
    borderWidth: 1,
    borderRadius: 6,
  },
});
