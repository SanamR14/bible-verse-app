// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }: any) {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

  // const handleLogin = async () => {
  //   // Normally validate credentials via API, here we just store a token
  //   if (email && password) {
  //     await AsyncStorage.setItem('userToken', 'dummy-auth-token');
  //     navigation.navigate('MainApp');
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <Button title="Login" onPress={() => navigation.navigate('LandingPage')} />
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
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
