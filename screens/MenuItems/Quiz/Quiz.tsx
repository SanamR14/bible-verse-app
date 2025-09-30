// screens/quiz/Quiz.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { socket } from "../../../services/socket";
import { Player, Question } from "../../../types";

export default function Quiz({ route, navigation }: any) {
  const { player, sessionCode } = route.params as {
    player: Player;
    sessionCode: string;
  };

  const [question, setQuestion] = useState<Question | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    socket.on("question_started", (q: Question) => {
      setQuestion(q);
      setAnswered(false);
    });

    socket.on("question_result", ({ playerId }) => {
      if (playerId === player.id) setAnswered(true);
    });

    socket.on("quiz_ended", () => {
      navigation.navigate("Leaderboard", { sessionCode });
    });

    return () => {
      socket.off("question_started");
      socket.off("question_result");
      socket.off("quiz_ended");
    };
  }, []);

  const submitAnswer = (optionIndex: number) => {
    if (answered || !question) return;
    socket.emit("submit_answer", {
      sessionCode,
      playerId: player.id,
      questionId: question.id,
      selectedOption: optionIndex,
    });
    setAnswered(true);
  };

  if (!question)
    return (
      <View style={styles.waitingContainer}>
        <Text style={styles.waitingText}>Waiting for host to start…</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{question.question_text}</Text>
      {question.options.map((opt, idx) => (
        <TouchableOpacity
          key={idx}
          style={[styles.optionButton, answered && { backgroundColor: "#ccc" }]}
          onPress={() => submitAnswer(idx)}
          disabled={answered}
        >
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}
      {answered && <Text style={styles.answeredText}>Answer submitted!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    backgroundColor: "#1b4a7a",
    padding: 14,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  optionText: { color: "#fff", fontSize: 16 },
  answeredText: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
    color: "green",
  },
  waitingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  waitingText: { fontSize: 18, fontStyle: "italic" },
});
