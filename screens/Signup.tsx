import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import { Dropdown } from "react-native-element-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // 👈 For eye icon

export default function SignupScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const countries = [
    { label: "India", value: "India" },
    { label: "UK", value: "UK" },
  ];

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

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirm_password.trim();

    if (name.trim().length === 0 || name.length > 20) {
      Toast.show({
        type: "error",
        text1: "Invalid Name",
        text2: "Name must be between 1 and 20 characters.",
      });
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email.",
      });
      return;
    }

    if (!validatePassword(trimmedPassword)) {
      Toast.show({
        type: "error",
        text1: "Invalid Password",
        text2:
          "Password must contain uppercase, lowercase, number, special character, and not end with a space.",
      });
      return;
    }

    if (trimmedPassword !== trimmedConfirm) {
      Toast.show({
        type: "error",
        text1: "Mismatch",
        text2: "Passwords do not match.",
      });
      return;
    }

    if (!country) {
      Toast.show({
        type: "error",
        text1: "Country Required",
        text2: "Please select a country.",
      });
      return;
    }

    if (!city) {
      Toast.show({
        type: "error",
        text1: "City Required",
        text2: "Please select a city.",
      });
      return;
    }

    try {
      const response = await fetch(
        "https://bible-verse-backend-1kvo.onrender.com/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email: trimmedEmail,
            password: trimmedPassword,
            confirm_password: trimmedConfirm,
            city,
            country,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw data?.error;

      Toast.show({
        type: "success",
        text1: "Account created successfully",
        text2: "Please Login",
      });
      navigation.navigate("Login");
    } catch (err) {
      if (err === "Email already registered") {
        Toast.show({
          type: "error",
          text1: "Email already exists",
          text2: "Try again with a different email.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to Signup",
          text2: "Please try again later.",
        });
      }
    }
  };

  return (
    <ScrollView>
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
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Password Field */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Field */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            value={confirm_password}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Icon
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* <Text style={styles.label}>Country</Text> */}
        <Dropdown
          style={styles.dropdown}
          data={countries}
          labelField="label"
          valueField="value"
          placeholder="Choose a country"
          value={country}
          onChange={(item) => {
            setCountry(item.value);
            setCity("");
          }}
        />

        {/* <Text style={styles.label}>City</Text> */}
        <Dropdown
          style={styles.dropdown}
          data={cityOptions[country] || []}
          labelField="label"
          valueField="value"
          placeholder="Choose a city"
          value={city}
          onChange={(item) => setCity(item.value)}
          disable={!country}
        />

        <Button title="Sign Up" onPress={handleSignup} />

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 14,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  link: { marginTop: 12, color: "blue", textAlign: "center" },
  label: { marginBottom: 6, fontSize: 16, fontWeight: "500", color: "#333" },
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
});
