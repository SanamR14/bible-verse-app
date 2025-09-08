import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Player } from "../../../types";
import { socket } from "../../../services/socket";

export default function Leaderboard({ route }: any) {
  const { sessionCode } = route.params;
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    // Request leaderboard
    socket.emit("get_leaderboard", { sessionCode });

    // Listen for leaderboard updates
    socket.on("leaderboard", (list: Player[]) => {
      setPlayers(list.sort((a, b) => b.score - a.score));
    });

    return () => {
      socket.off("leaderboard");
    };
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Leaderboard</Text>
      <FlatList
        data={players}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <Text style={{ fontSize: 18 }}>
            {index + 1}. {item.name} - {item.score}
          </Text>
        )}
      />
    </View>
  );
}
