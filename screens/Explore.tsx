import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";

const devotions = [
  { id: "1", title: "God's Battle Axe", author: "Apos Joshua Selman" },
  { id: "2", title: "Worship Devotion 01", author: "Pas Sunny Prasad" },
  { id: "3", title: "Jehovah Jireh", author: "Apos Joshua Selman" },
];

export default function Explore() {
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: "" }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>by {item.author}</Text>
      </View>
      <Icon name="bookmark" size={20} />
    </View>
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(devotions);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredData(devotions);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = devotions.filter((item) =>
        item.title.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredData(filtered);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>FYI - For Your Inner Man</Text> */}

      {/* <View style={styles.searchBar}>
        <Text> Search</Text>
        <Icon name="sliders" size={16} />
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

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  heading: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F8F9F9",
    marginBottom: 10,
    borderRadius: 10,
    elevation: 1,
    gap: 12,
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  title: { fontWeight: "bold" },
  author: { color: "#555", fontSize: 12 },
});
