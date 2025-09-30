// screens/quiz/CreateQuiz.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; 
import { apiClient } from "../../../apiClient";

export default function CreateQuiz() {
  const [title, setTitle] = useState("");
  const navigation = useNavigation();

  const createQuiz = async () => {
    if (!title.trim()) return Alert.alert("Error", "Enter quiz title");
    try {
      const res = await apiClient(`/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
        
        }),
      });
      const data = res.json ? await res.json() : res;
      navigation.navigate("AddQuestion", { quizId: data.id });
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to create quiz");
    }
  };

  return (
    <View style={styles.container}>
      {/* Top row with title + Saved Quizzes icon */}
      <View style={styles.topRow}>
        <Text style={styles.header}>Create New Quiz</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("SavedQuiz")}
          style={styles.savedButton}
        >
          <Ionicons name="list" size={28} color="#1b4a7a" />
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Quiz Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={createQuiz}>
        <Text style={styles.buttonText}>Create Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#ffffff" },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  savedButton: {
    paddingHorizontal: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1b4a7a",
    padding: 14,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600", textAlign: "center" },
});
