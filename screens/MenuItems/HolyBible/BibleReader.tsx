import React, { useEffect, useState } from "react";
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
import { getHighlights, toggleHighlight } from "../../../utils/bibleHighlights";

export default function BibleReader() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { book, chapter } = route.params;
  const [highlighted, setHighlighted] = useState<string[]>([]);

  const verses = bible[book][chapter];

  useEffect(() => {
    loadHighlights();
  }, []);

  const loadHighlights = async () => {
    const list = await getHighlights();
    setHighlighted(list);
  };
  const handleHighlight = async (verseId: string) => {
    const updated = await toggleHighlight(verseId);
    setHighlighted(updated);
  };

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
        {Object.keys(verses).map((v) => {
          const verseText = verses[v];
          const verseId = `${book}-${chapter}-${v}`;
          const isHighlighted = highlighted.includes(verseId);

          return (
            <TouchableOpacity
              key={v}
              onPress={() => handleHighlight(verseId)}
              style={[
                styles.verseBox,
                isHighlighted && { backgroundColor: "#FFF7A6" }, // soft yellow highlight
              ]}
            >
              <Text style={styles.verseNumber}>{v}</Text>

              <View style={{ flex: 1 }}>
                <Text style={styles.verseText}>{verseText}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
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
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#e5e5e5",
    flexDirection: "row",
    gap: 8,
  },
  verseNumber: {
    color: "#1b4b7aff",
    width: 24,
    fontWeight: "bold",
  },
  verseText: {
    color: "#333",
  },
});
