import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import bible from "../../../assets/bible/WEB_bible.json";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BibleReader() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { book, chapter } = route.params;

  const verses = bible[book][chapter];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#1b4b7aff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {book} {chapter}
        </Text>

        <Text></Text>
      </View>

      <ScrollView>
        {Object.keys(verses).map((v) => (
          <View key={v} style={styles.verseBox}>
            <Text style={styles.verseNumber}>{v}</Text>
            <Text style={styles.verseText}>{verses[v]}</Text>
          </View>
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

  verseBox: {
    flexDirection: "row",
    paddingVertical: 6,
  },

  verseNumber: {
    width: 30,
    color: "#1b4b7aff",
    fontWeight: "700",
  },

  verseText: { flex: 1, color: "#374151", fontSize: 15, lineHeight: 22 },
});
