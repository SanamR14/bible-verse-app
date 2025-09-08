import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import axios from "axios";
import { socket } from "../../../services/socket";
import { Question, Player } from "../../../types";

const API_URL = "https://bible-verse-backend-1kvo.onrender.com";

export default function HostSession({ route, navigation }: any) {
  const { quizId } = route.params;
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  useEffect(() => {
    const createSession = async () => {
      try {
        const res = await axios.post<{ sessionCode: string }>(
          `${API_URL}/quiz/${quizId}/session`
        );
        setSessionCode(res.data.sessionCode);
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to start session");
      }
    };

    const loadQuestions = async () => {
      try {
        const res = await axios.get<Question[]>(
          `${API_URL}/quiz/${quizId}/questions`
        );
        setQuestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    createSession();
    loadQuestions();

    socket.on("player_joined", (player: Player) => {
      setPlayers((prev) => [...prev, player]);
    });

    return () => {
      socket.off("player_joined");
    };
  }, []);

  const startQuestion = (index = currentQIndex) => {
    if (!sessionCode || !questions[index]) return;
    const question = questions[index];
    console.log("➡️ Sending question:", question);
    socket.emit("start_question", { sessionCode, question });
  };

  const nextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => {
        const nextIndex = prev + 1;
        startQuestion(nextIndex); // pass next index explicitly
        return nextIndex;
      });
    } else {
      socket.emit("end_quiz", { sessionCode });
      navigation.navigate("Leaderboard", { sessionCode });
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Host Session</Text>
      {sessionCode && <Text>Session Code: {sessionCode}</Text>}
      <Text style={{ marginTop: 10 }}>Players:</Text>
      {players.map((p) => (
        <Text key={p.id}>- {p.name}</Text>
      ))}
      <Button
        title="Start Question"
        onPress={() => startQuestion()}
        disabled={!sessionCode || questions.length === 0}
      />
      <Button title="Next Question" onPress={nextQuestion} />
    </View>
  );
}
