import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";

export default function SavedPage() {
  const [items, setItems] = useState([]);
  const navigation = useNavigation();
  const [userid, setUserid] = useState("");

  useEffect(() => {
    const fetchSaved = async () => {
      const user = await AsyncStorage.getItem("userData");
      if (!user) return;
      const userData = JSON.parse(user);
      setUserid(userData.id);
      const res = await fetch(
        `https://bible-verse-backend-1kvo.onrender.com/saved/${userData.id}`
      );
      const data = await res.json();
      setItems(data);
    };

    fetchSaved();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Items</Text>
        <Text></Text>
      </View>
      {items.length === 0 ? (
        <Text>No saved items yet.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate("SavedDetail", {
                  id: item.id,
                  user: userid,
                })
              }
              style={styles.item}
            >
              <Text style={styles.title}>{item.title}</Text>
              <Text numberOfLines={2} style={styles.preview}>
                {item.content}
              </Text>
            </Pressable>
          )}
        />
      )}
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
});
