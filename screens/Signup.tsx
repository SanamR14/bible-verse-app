// src/screens/SignupScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export default function SignupScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setconfirm_password] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [date_of_birth, setdate_of_birth] = useState('');

const handleSignup = async () => {
  if (!email || !password) {
    Alert.alert('Error', 'Please enter both email and password');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify  ({ email, password,
        confirm_password,
        name,
        date_of_birth,
        city,
        country
       }),
    });

    const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Registration failed');
      }

      Alert.alert('Success', 'Account created successfully');
      navigation.navigate('Login');
    } catch (err) {
      console.error('Signup error:', err);
      Alert.alert('Error', 'Failed to register. Please try again.');
    }
};



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
        <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
       <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirm_password}
        onChangeText={setconfirm_password}
      />
        <TextInput
        style={styles.input}
        placeholder="DOB"
        value={date_of_birth}
        onChangeText={setdate_of_birth}
      />
        <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
        <TextInput
        style={styles.input}
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
      />
      <Button title="Sign Up" onPress={() =>handleSignup()} />
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
