import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";

export default function SavedDetail({ route }) {
  const { id, user } = route.params;
  const [item, setItem] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchItem = async () => {
      const res = await fetch(
        `https://bible-verse-backend-1kvo.onrender.com/saved/${user}/${id}`
      );
      const data = await res.json();
      setItem(data);
    };
    fetchItem();
  }, [id]);

  if (!item) return <Text>Loading...</Text>;

  return (
    // <View style={{ padding: 16 }}>
    //   <Text style={{ fontSize: 20, fontWeight: "700" }}>{item.title}</Text>
    //   <Text style={{ marginTop: 10 }}>{item.content}</Text>
    // </View>
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{item.title}</Text>
        <Text></Text>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentCard}>
          <Text style={styles.content}>{item.content}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  item: { padding: 12, borderBottomWidth: 1, borderColor: "#eee" },
  title: { fontSize: 16, fontWeight: "600" },
  preview: { color: "#555" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  contentCard: {
    backgroundColor: "#fcf8f2",
    padding: 16,
    borderRadius: 12,
  },
  content: { fontSize: 16, color: "#333", lineHeight: 22 },
});
