import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DevotionStackParamList } from "../../Stack/DevotionsStack";
import { TextInput } from "react-native-paper";

const topics = Array.from({ length: 18 }, (_, i) => `Topic ${i + 1}`);

export default function Devotions() {
  const navigation =
    useNavigation<NativeStackNavigationProp<DevotionStackParamList>>();
  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.topicButton}
      onPress={() => navigation.navigate("Topic", { topic: item })}
    >
      <Text style={styles.topicText}>{item}</Text>
    </TouchableOpacity>
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(topics);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredData(topics);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = topics.filter((item) =>
        item.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredData(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search"
        value={searchQuery}
        onChangeText={handleSearch}
        underlineColor="transparent"
        style={{
          height: 40,
          paddingVertical: 0,
          backgroundColor: "#f5f5f5",
          borderRadius: 8,
          marginBottom: 16,
        }}
        theme={{
          colors: {
            primary: "transparent",
          },
        }}
        textColor="#000000"
      />
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontWeight: "bold", fontSize: 16 },
  icons: { flexDirection: "row", gap: 12 },
  icon: { marginRight: 8 },
  row: { justifyContent: "space-between" },
  topicButton: {
    backgroundColor: "#fdf6ee",
    flex: 0.48,
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  topicText: {
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  item: {
    fontSize: 18,
    paddingVertical: 8,
  },
});
