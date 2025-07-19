// src/screens/SignupScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen({ navigation }: any) {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

  // const handleSignup = async () => {
  //   // Normally send data to backend for user creation
  //   if (email && password) {
  //     await AsyncStorage.setItem('userToken', 'dummy-auth-token');
  //     navigation.replace('MainApp');
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        // value={email}
        // onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        // value={password}
        // onChangeText={setPassword}
      />
      <Button title="Sign Up" onPress={() =>navigation.replace('MainTabs')} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  link: {
    marginTop: 12,
    color: 'blue',
    textAlign: 'center',
  },
});
