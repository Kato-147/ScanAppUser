import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {resetPassword} from '../UserHTTP';
import Toast from 'react-native-toast-message';
import {useNavigation, useRoute} from '@react-navigation/native';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordResetCode, setPasswordResetCode] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const {email} = route.params;

  const handleResetPassword = async () => {
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      await resetPassword(email, password, passwordResetCode);
      Toast.show({
        type: 'success',
        text1: 'Password reset successful',
      });
      navigation.navigate('Login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Password Reset Code"
        value={passwordResetCode}
        onChangeText={setPasswordResetCode}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default ResetPassword;
