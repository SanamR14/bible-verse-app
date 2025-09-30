// screens/quiz/JoinQuiz.tsx
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // expo icons
import { socket } from "../../../services/socket";

export default function JoinQuiz({ navigation }: any) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    socket.on("joined", (player) => {
      navigation.navigate("Quiz", { player, sessionCode: code });
    });
    socket.on("quiz_error", (msg) => Alert.alert("Error", msg));
    return () => {
      socket.off("joined");
      socket.off("quiz_error");
    };
  }, [navigation, code]);

  const joinQuiz = () => {
    if (!name || !code) return Alert.alert("Error", "Enter name and code");
    socket.emit("join_session", { playerName: name, sessionCode: code });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1b4a7a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Take a Quiz</Text>
        <View style={{ width: 24 }} /> {/* spacing to balance icon */}
      </View>

      {/* Content */}
      <View style={styles.container}>
        {/* Option 1: Join live quiz */}
        <View style={styles.card}>
          <Text style={styles.subHeader}>Join a Live Quiz</Text>
          <TextInput
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Session Code"
            value={code}
            onChangeText={setCode}
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={joinQuiz}>
            <Text style={styles.buttonText}>Join Live Quiz</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <Text style={styles.orText}>— OR —</Text>

        {/* Option 2: FYI Quiz */}
        <TouchableOpacity
          style={[styles.button, styles.fyiButton]}
          onPress={() => navigation.navigate("FyiQuiz")}
        >
          <Text style={styles.buttonText}>Play FYI Quiz</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,

  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#1b4a7a",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
    color: "#1b4a7a",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#1b4a7a",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  fyiButton: {
    backgroundColor: "#4caf50",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  orText: {
    textAlign: "center",
    marginVertical: 16,
    fontSize: 16,
    color: "#555",
  },
});
