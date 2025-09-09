import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
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
      console.log("Received question_started", q.id);
      setQuestion(q);
      setAnswered(false);
    });

    socket.on("question_result", ({ playerId, correct }) => {
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
    console.log("submit_answer emitted", {
      sessionCode,
      questionId: question.id,
    });
    setAnswered(true);
  };

  if (!question)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Waiting for host to start...</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        {question.question_text}
      </Text>
      {question.options.map((opt, idx) => (
        <Button key={idx} title={opt} onPress={() => submitAnswer(idx)} />
      ))}
      {answered && <Text style={{ marginTop: 10 }}>Answer submitted!</Text>}
    </View>
  );
}
