import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [church, setChurch] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Privacy
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

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
    if (!acceptedPrivacy) {
      Toast.show({
        type: "error",
        text1: "Privacy Notice",
        text2: "You must accept the Privacy Notice to continue.",
      });
      return;
    }

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
      setLoading(true);
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
            church,
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
    } finally {
      setLoading(false);
    }
  };

  const { colors } = useTheme();

  return (
    <SafeAreaView style={styles.container}>
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
              color="#1b4b7aff"
            />
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
            <Icon
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={24}
              color="#1b4b7aff"
            />
          </TouchableOpacity>
        </View>

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
        <TextInput
          style={styles.input}
          placeholder="Enter your church name here (optional)"
          value={church}
          onChangeText={setChurch}
        />

        {/*Privacy Checkbox */}
        <View style={styles.privacyContainer}>
          <TouchableOpacity
            onPress={() => setAcceptedPrivacy(!acceptedPrivacy)}
            style={styles.checkbox}
          >
            <Icon
              name={
                acceptedPrivacy ? "checkbox-marked" : "checkbox-blank-outline"
              }
              size={24}
              color="#1b4b7aff"
            />
          </TouchableOpacity>
          <Text style={styles.privacyText}>
            I agree to the{" "}
            <Text
              style={styles.link}
              onPress={() => setPrivacyModalVisible(true)}
            >
              Privacy Notice
            </Text>
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#1b4b7aff"
            style={{ marginTop: 20 }}
          />
        ) : (
          <TouchableOpacity style={styles.primaryBtn} onPress={handleSignup}>
            <Text style={styles.primaryBtnText}>Sign Up</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.links}>Already have an account? Log in</Text>
        </TouchableOpacity>

        {/* Privacy Notice Modal */}
        <Modal visible={privacyModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalTitle}>Privacy Notice</Text>
              <Text style={styles.modalText}>
                By registering with For Your Inner Man (FYI) application, you
                agree to provide your personal details (name, email, city,
                country and church you attend) so that we can provide you our
                services.
                {"\n\n"}
                We will use your information only for:{"\n"}- Managing your
                account based on the place and connecting you with your church
                {"\n"}- Contacting you if there are any issues or updates
                {"\n\n"}
                We will not share your details with third parties, except where
                required by law. Your data will be stored securely and retained
                until you wish to be with us.{"\n\n"}
                For more details about how we handle your information, or to
                exercise your rights under UK data protection law (including
                access, correction, or deletion of your data), please contact us
                at foryourinnerman@gmail.com.
              </Text>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => setPrivacyModalVisible(false)}
              >
                <Text style={styles.primaryBtnText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1b4b7aff",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#1b4b7aff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    color: "#1b4b7aff",
  },
  primaryBtn: {
    backgroundColor: "#1b4b7aff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  primaryBtnText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  links: {
    marginTop: 12,
    color: "#90a9afff",
    textAlign: "center",
    fontWeight: "500",
  },
  privacyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkbox: { marginRight: 8 },
  privacyText: { fontSize: 14, color: "#333", flexShrink: 1 },
  link: { color: "#1b4b7aff", fontWeight: "600" },
  modalContainer: { flex: 1, backgroundColor: "#fff", padding: 20 },
  modalContent: { paddingBottom: 30 },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1b4b7aff",
  },
  modalText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    marginBottom: 20,
  },
});
