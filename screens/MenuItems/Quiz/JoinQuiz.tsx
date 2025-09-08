import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { socket } from "../../../services/socket";

export default function JoinQuiz({ navigation }: any) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    // When a player successfully joins
    socket.on("player_joined", (player) => {
      console.log("Player joined:", player);
      navigation.navigate("Quiz", { player, sessionCode: code });
    });

    // If you want error handling from backend
    socket.on("quiz_error", (msg) => {
      Alert.alert("Error", msg);
    });

    return () => {
      socket.off("player_joined");
      socket.off("quiz_error");
    };
  }, [navigation, code]);

  const joinQuiz = () => {
    if (!name || !code) {
      return Alert.alert("Error", "Enter name and code");
    }

    // Match backend event name
    socket.emit("join_session", { playerName: name, sessionCode: code });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Join Quiz</Text>

      <TextInput
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Session Code"
        value={code}
        onChangeText={setCode}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Button title="Join" onPress={joinQuiz} />
    </View>
  );
}
