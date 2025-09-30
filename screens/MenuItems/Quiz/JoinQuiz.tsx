// screens/quiz/JoinQuiz.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
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
    <View style={styles.container}>
      <Text style={styles.header}>Join Quiz</Text>
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
        <Text style={styles.buttonText}>Join</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1b4a7a",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
