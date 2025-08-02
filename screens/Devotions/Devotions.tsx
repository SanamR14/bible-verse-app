import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TextInput } from "react-native-paper";
import axios from "axios";
import { DevotionStackParamList } from "../../Stack/DevotionsStack";

export type Devotion = {
  id: number;
  title: string;
  message: string;
  days: null | Array<{
    title: string;
    message: string;
  }>;
};

export default function Devotions() {
  const navigation =
  useNavigation<NativeStackNavigationProp<DevotionStackParamList>>();

  const [devotions, setDevotions] = useState<Devotion[]>([]);
  const [filteredData, setFilteredData] = useState<Devotion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDevotions = async () => {
    try {
      const res = await axios.get("http://localhost:3000/devotions/"); 
      setDevotions(res.data);
      setFilteredData(res.data);
    } catch (err) {
      console.error("Failed to fetch devotions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevotions();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredData(devotions);
    } else {
      const lower = query.toLowerCase();
      const filtered = devotions.filter((item) =>
        item.title.toLowerCase().includes(lower)
      );
      setFilteredData(filtered);
    }
  };

  const renderItem = ({ item }: { item: Devotion }) => (
    <TouchableOpacity
      style={styles.topicButton}
      onPress={() =>
        navigation.navigate(item.days ? "Topic" : "Day", { topic: item })
      }
    >
      <Text style={styles.topicText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search"
        value={searchQuery}
        onChangeText={handleSearch}
        underlineColor="transparent"
        style={styles.searchInput}
        theme={{ colors: { primary: "transparent" } }}
        textColor="#000000"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#999" />
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
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
  searchInput: {
  height: 40,
  paddingVertical: 0,
  backgroundColor: "#f5f5f5",
  borderRadius: 8,
  marginBottom: 16,
},
});
