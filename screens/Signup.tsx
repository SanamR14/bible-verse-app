import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import RNPickerSelect from "react-native-picker-select";

export default function SignupScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setconfirm_password] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const cityOptions: { [key: string]: { label: string; value: string }[] } = {
    India: [
      { label: "Delhi", value: "Delhi" },
      { label: "Mumbai", value: "Mumbai" },
      { label: "Bangalore", value: "Bangalore" },
    ],
    UK: [
      { label: "Edinburgh", value: "Edinburgh" },
      { label: "London", value: "London" },
      { label: "Manchester", value: "Manchester" },
      { label: "Birmingham", value: "Birmingham" },
    ],
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const endsWithSpace = /\s$/.test(password);

    return (
      password.length >= 6 &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar &&
      !endsWithSpace
    );
  };

  const handleSignup = async () => {
    if (name.trim().length === 0 || name.length > 20) {
      Alert.alert("Invalid Name", "Name must be between 1 and 20 characters.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email.");
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        "Invalid Password",
        "Password must contain upper/lowercase, number, special character, and not end with a space."
      );
      return;
    }

    if (password !== confirm_password) {
      Alert.alert("Mismatch", "Passwords do not match.");
      return;
    }

    if (!country) {
      Alert.alert("Country Required", "Please select a country.");
      return;
    }

    if (!city) {
      Alert.alert("City Required", "Please select a city.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirm_password,
          city,
          country,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Registration failed");
      }

      Toast.show({
        type: "success",
        text1: "Account created successfully",
        text2: "Please Login",
      });
      navigation.navigate("Login");
    } catch (err) {
      console.error("Signup error:", err);
      Toast.show({
        type: "error",
        text1: "Failed to SignUp",
        text2: "Try again",
      });
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

      <View style={styles.picker}>
        <RNPickerSelect
          onValueChange={(value) => {
            setCountry(value);
            setCity(""); // Reset city when country changes
          }}
          value={country || ""}
          items={[
            { label: "India", value: "India" },
            { label: "UK", value: "UK" },
          ]}
          placeholder={{ label: "Choose a country...", value: "" }}
          style={pickerSelectStyles}
        />
      </View>
      <View style={styles.picker}>
        <RNPickerSelect
          onValueChange={(value) => setCity(value)}
          value={city || ""}
          items={cityOptions[country] || []}
          placeholder={{ label: "Choose a city...", value: "" }}
          disabled={!country}
          style={pickerSelectStyles}
        />
      </View>
      <Button title="Sign Up" onPress={handleSignup} />

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 14,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  picker: {
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  link: {
    marginTop: 12,
    color: "blue",
    textAlign: "center",
  },
  label: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});
const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    color: "#333",
    height: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 10,
    color: "#333",
    height: 30,
  },
  placeholder: {
    color: "#aaa",
  },
};
