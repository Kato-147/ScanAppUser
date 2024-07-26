import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  NativeModules,
  NativeEventEmitter,
  TextInput,
  Button,
  View,
  Alert
} from 'react-native';
import CryptoJS from 'crypto-js';

const {PayZaloBridge} = NativeModules;

const payZaloBridgeEmitter = new NativeEventEmitter(PayZaloBridge);

// const subscription = payZaloBridgeEmitter.addListener('EventPayZalo', data => {
//   if (data.returnCode == 1) {
//     alert('Pay success!');
//   } else {
//     alert('Pay errror! ' + data.returnCode);
//   }
// });

export default function App() {
  const [money, setMoney] = useState('10000');
  const [token, setToken] = useState('');
  const [returncode, setReturnCode] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const subscriptionRef = useRef(null);

  function getCurrentDateYYMMDD() {
    var todayDate = new Date().toISOString().slice(2, 10);
    return todayDate.split('-').join('');
  }

  async function createOrder(money) {
    let apptransid = getCurrentDateYYMMDD() + '_' + new Date().getTime();

    let appid = 2554;
    let amount = parseInt(money);
    let appuser = 'ZaloPayDemo';
    let apptime = new Date().getTime();
    let embeddata = '{}';
    let item = '[]';
    let description = 'Merchant description for order #' + apptransid;
    let hmacInput =
      appid +
      '|' +
      apptransid +
      '|' +
      appuser +
      '|' +
      amount +
      '|' +
      apptime +
      '|' +
      embeddata +
      '|' +
      item;
    let mac = CryptoJS.HmacSHA256(
      hmacInput,
      'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn',
    );
    // console.log('====================================');
    // console.log('hmacInput: ' + hmacInput);
    // console.log('mac: ' + mac);
    // console.log('====================================');
    var order = {
      app_id: appid,
      app_user: appuser,
      app_time: apptime,
      amount: amount,
      app_trans_id: apptransid,
      embed_data: embeddata,
      item: item,
      description: description,
      mac: mac,
    };

   // console.log('---------------------',order);

    let formBody = [];
    for (let i in order) {
      var encodedKey = encodeURIComponent(i);
      var encodedValue = encodeURIComponent(order[i]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    await fetch('https://sb-openapi.zalopay.vn/v2/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formBody,
    })
      .then(response => response.json())
      .then(resJson => {
        setToken(resJson.zp_trans_token);
        setReturnCode(resJson.return_code);
      })
      .catch(error => {
        console.log('error ', error);
      });
  }

  const handlePress = () => {
    
    if (isSubscribed) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
      setIsSubscribed(false);
      Alert.alert('Subscription removed');
    } else {
      console.log(subscriptionRef.current);
      subscriptionRef.current = payZaloBridgeEmitter.addListener('EventPayZalo', (data) => {
        if (data.returnCode === 1) {
          Alert.alert('Giao dịch thành công!');
        } else {
          Alert.alert('Giao dịch thất bại!');
        }
        
        // Hủy đăng ký sau khi nhận sự kiện
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
        setIsSubscribed(false);
      });
      setIsSubscribed(true);
      Alert.alert('Subscription added');
    }
  };

  // Cleanup function to ensure we remove subscription if component unmounts
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, []);

  function payOrder() {
    var payZP = NativeModules.PayZaloBridge;
    payZP.payOrder(token);
  }

  return (
    <ScrollView>
      <KeyboardAvoidingView style={styles.container}>
        <Text style={styles.welcomeHead}>ZaloPay App To App Demo</Text>
        <Text style={styles.welcome}>Amount:</Text>
        <TextInput
          onChangeText={value => setMoney(value)}
          value={money}
          keyboardType="numeric"
          placeholder="Input amount"
          style={styles.inputText}
        />
        <Button
          title="Create order"
          type="outline"
          onPress={() => {
            createOrder(money);
          }}
        />
        <Text style={styles.welcome}>ZpTranstoken: {token}</Text>
        <Text style={styles.welcome}>returncode: {returncode}</Text>
        {returncode == 1 ? (
          <Button
            title="Pay order"
            type="outline"
            onPress={() => {
              payOrder();
            }}
          />
        ) : null}
        <View>
      <Text>Payment Component</Text>
      <Button title={isSubscribed ? "Unsubscribe" : "Subscribe"} onPress={handlePress} />
    </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  welcomeHead: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  inputText: {
    marginBottom: 20,
    fontSize: 20,
    textAlign: 'center',
  },
});
