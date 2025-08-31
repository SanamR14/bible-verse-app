import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Switch,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import PrayerModal from "./Modal/Modal";
import { apiClient } from "../../apiClient";

export default function PrayerRequest() {
  const navigation = useNavigation();
  const [value, setValue] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const trimmedText = value.trim();
    if (!trimmedText) {
      Alert.alert("Validation Error", "Prayer request cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      const user = await AsyncStorage.getItem("userData");
      if (!user) {
        Alert.alert("Session Expired", "Please log in again.");
        setLoading(false);
        return;
      }

      const userData = JSON.parse(user);
      const payload = {
        userid: userData.id,
        username: isAnonymous ? "Anonymous" : userData.name,
        prayer: trimmedText,
      };

      const response = await apiClient(
        "https://bible-verse-backend-1kvo.onrender.com/prayer-requests/prayerReq",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        Toast.show({ type: "success", text1: "Prayer Request submitted" });
        setValue("");
      } else {
        const error = await response.json();
        console.error("Failed:", error);
        Toast.show({
          type: "error",
          text1: "Failed to submit prayer request",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color="#1b4b7aff" />
            </Pressable>
            <Text style={styles.headerTitle}>Prayer Request</Text>
            <Pressable onPress={() => setModalVisible(true)}>
              <Icon name="menu" size={24} color="#1b4b7aff" />
            </Pressable>
          </View>

          <Text style={styles.body}>
            Please enter your prayer requests here and save. Your prayer request
            list can be accessed by clicking on the top right icon. Also, the
            requests will be sent to our prayer warrior team.
          </Text>

          <TextInput
            mode="outlined"
            multiline
            numberOfLines={6}
            maxLength={200}
            value={value}
            onChangeText={setValue}
            placeholder="Write your prayer request here."
            style={styles.textInput}
            textColor="#1b4b7aff"
          />

          <Text style={styles.body}>🙏 A small prayer comes here</Text>

          <View style={styles.privateRow}>
            <Text style={styles.label}>Anonymous Prayer Request</Text>
            <Switch value={isAnonymous} onValueChange={setIsAnonymous} trackColor={{ false: "#ECF0F1", true: "#1b4b7aff" }}/>
          </View>

          <Pressable
            onPress={handleSave}
            disabled={loading}
            android_ripple={{ color: "#ddd" }}
            style={({ pressed }) => [
              styles.saveButton,
              loading && { backgroundColor: "#ccc" },
              Platform.OS === "ios" && pressed && { opacity: 0.7 },
              Platform.OS === "web" &&
                pressed && { backgroundColor: "#eaeaea" },
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </Pressable>

          <PrayerModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    ...Platform.select({
      ios: { fontWeight: "600" },
      android: { fontWeight: "700" },
      web: { fontWeight: "500" },
    }),
    color: "#1b4b7aff", // primary
  },
  body: {
    marginVertical: 10,
    fontSize: 14,
    color: "#1b4b7aff", // softer than pure black
  },
  textInput: {
    marginVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#1b4b7aff"
  },
  privateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  label: { fontSize: 16, color: "#1b4b7aff" },
  saveButton: {
    backgroundColor: "#1b4b7aff",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    ...Platform.select({
      ios: { fontWeight: "600" },
      android: { fontWeight: "700" },
      web: { fontWeight: "500" },
    }),
  },
});
