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
  author: string;
  days: null | Array<{
    title: string;
    message: string;
    isSaved: boolean;
  }>;
  issaved: boolean;
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
      const res = await axios.get(
        "https://bible-verse-backend-1kvo.onrender.com/devotions/"
      );
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
        textColor="#1b4b7aff"
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#999" />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF", // background
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: { justifyContent: "space-between" },
  topicButton: {
    backgroundColor: "#ECF0F1", // clean white cards
    // borderWidth: 1,
    borderColor: "#1b4b7aff", // accent border
    flex: 0.48,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 4,
    elevation: 2, // Android shadow
  },
  topicText: {
    color: "#1b4b7aff", // primary
    fontWeight: "600",
    fontSize: 15,
  },
  searchInput: {
    height: 40,
    backgroundColor: "#fff", // clean input
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    color: "#1b4b7aff",
  },
});
