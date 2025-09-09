import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { socket } from "../../../services/socket";

export default function JoinQuiz({ navigation }: any) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    // per-socket confirmation: only the joining client receives this
    socket.on("joined", (player) => {
      console.log("Joined confirmed for player:", player);
      navigation.navigate("Quiz", { player, sessionCode: code });
    });

    // others joining are broadcast: show in lobby if you want
    socket.on("player_joined", (player) => {
      console.log("Another player joined:", player);
      // You can show a toast / update a lobby players list here.
    });

    socket.on("quiz_error", (msg) => {
      Alert.alert("Error", msg);
    });

    return () => {
      socket.off("joined");
      socket.off("player_joined");
      socket.off("quiz_error");
    };
  }, [navigation, code]);

  const joinQuiz = () => {
    if (!name || !code) {
      return Alert.alert("Error", "Enter name and code");
    }
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
