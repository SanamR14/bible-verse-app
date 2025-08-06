// src/screens/PlansScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-paper";

export default function Plans() {
  type Plan = {
    id: number;
    title: string;
    message: string;
    outertitle: string;
    author: string;
    image?: string;
  };

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const response = await fetch("https://bible-verse-backend-1kvo.onrender.com/plans/");
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    setFilteredData(plans);
  }, [plans]);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.outertitle}</Text>
      <Text style={styles.by}>{item.author}</Text>
    </View>
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredData(plans);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = plans.filter((item) =>
        item.outertitle.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredData(filtered);
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(plans);
  return (
    <View style={styles.container}>
      {/* <View style={styles.searchBar}>
        <Text> Search</Text>
      </View> */}

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
   {loading ? (
        <ActivityIndicator size="large" color="#999" />
      ) : (
      <FlatList
        renderItem={renderItem}
        data={filteredData}
        keyExtractor={(item) => item.id?.toString()}
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
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  row: { justifyContent: "space-between" },
  card: {
    flex: 0.48,
    backgroundColor: "#fff",
    marginBottom: 16,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    elevation: 2,
  },
  image: { width: "100%", height: 100, borderRadius: 10 },
  title: { fontWeight: "bold", marginTop: 8, textAlign: "center" },
  by: { color: "#555", fontSize: 12, textAlign: "center" },
});
