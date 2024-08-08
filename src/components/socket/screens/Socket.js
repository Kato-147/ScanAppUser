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
import {requestUserPermission} from '../utils/notificationService';

const Socket = () => {
  const [message, setMessage] = useState({tableNumber: 1, voucher: ''});
  const [data, setData] = useState([]);

  useEffect(() => {
    socketServices.inittializeSocket();
    requestUserPermission();
  }, []);

  useEffect(() => {
    const handlePaymentNotification = msg => {
      console.log('message received in reactApp', msg);
      setData(prevData => [...prevData, msg]);
    };

    socketServices.on('noti_client_payment', handlePaymentNotification);

    return () => {
      socketServices.off('noti_client_payment', handlePaymentNotification); // Cleanup the listener on unmount
    };
  }, []);


  const sendMessage = () => {
    if (!!message) {
      socketServices.emit('noti_client_payment', message);
      setMessage({tableNumber: 1, voucher: ''});
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
              value={message}
              style={styles.inputStyle}
              placeholder="Enter your message...."
              onChangeText={text => setMessage(text)}
            />
            <Button onPress={sendMessage} title="Send" />
          </View>

          {/* data.map((val, i) => {
            return (
              <View>
                <Text style={{fontWeight: 'bold', marginTop: 10}}>{val}</Text>
              </View>
            );
          }) */}
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
