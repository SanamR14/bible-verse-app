import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import bible from "../../../assets/bible/WEB_bible.json";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BibleChapters() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { book } = route.params;

  const chapters = Object.keys(bible[book]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#1b4b7aff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{book}</Text>
        <Text></Text>
      </View>

      <ScrollView>
        {chapters.map((chapter) => (
          <TouchableOpacity
            key={chapter}
            style={styles.item}
            onPress={() =>
              navigation.navigate("BibleReader", { book, chapter })
            }
          >
            <Text style={styles.itemText}>Chapter {chapter}</Text>
            <Icon name="book-open" size={20} color="#1b4b7aff" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1b4b7aff" },

  item: {
    padding: 14,
    backgroundColor: "#f1f4f8",
    marginVertical: 6,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemText: { fontSize: 16, color: "#1b4b7aff" },
});
