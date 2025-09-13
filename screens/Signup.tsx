import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function SignupScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [church, setChurch] = useState(""); // optional field
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (!name.trim() || name.length > 20) {
      Toast.show({ type: "error", text1: "Invalid Name" });
      return;
    }
    if (!validateEmail(email.trim())) {
      Toast.show({ type: "error", text1: "Invalid Email" });
      return;
    }
    if (!validatePassword(password.trim())) {
      Toast.show({ type: "error", text1: "Invalid Password" });
      return;
    }
    if (password.trim() !== confirm_password.trim()) {
      Toast.show({ type: "error", text1: "Passwords do not match" });
      return;
    }
    if (!country.trim()) {
      Toast.show({ type: "error", text1: "Country Required" });
      return;
    }
    if (!city.trim()) {
      Toast.show({ type: "error", text1: "City Required" });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://bible-verse-backend-1kvo.onrender.com/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email: email.trim(),
            password: password.trim(),
            confirm_password: confirm_password.trim(),
            city,
            country,
            church, // send church (can be empty)
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
      Toast.show({
        type: "error",
        text1: "Signup failed",
        text2: err?.toString() || "Please try again.",
      });
    } finally {
      setLoading(false);
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
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password fields */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? "eye-off" : "eye"} size={24} />
        </TouchableOpacity>
      </View>

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
          <Icon name={showConfirmPassword ? "eye-off" : "eye"} size={24} />
        </TouchableOpacity>
      </View>

      {/* Replaced dropdowns with text boxes */}
      <TextInput
        style={styles.input}
        placeholder="Enter your country"
        value={country}
        onChangeText={setCountry}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your city"
        value={city}
        onChangeText={setCity}
      />

      {/* Optional church field */}
      <TextInput
        style={styles.input}
        placeholder="Enter your church name here (optional)"
        value={church}
        onChangeText={setChurch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1b4b7aff" />
      ) : (
        <TouchableOpacity style={styles.primaryBtn} onPress={handleSignup}>
          <Text style={styles.primaryBtnText}>Sign Up</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  passwordInput: { flex: 1, paddingVertical: 12 },
  primaryBtn: {
    backgroundColor: "#1b4b7aff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  primaryBtnText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
