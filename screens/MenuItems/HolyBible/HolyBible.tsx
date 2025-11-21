import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import bible from "../../../assets/bible/WEB_bible.json";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HolyBible() {
  const navigation = useNavigation<any>();

  const books = Object.keys(bible);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color="#1b4b7aff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Holy Bible</Text>
            <Text></Text>
          </View>

          {books.map((book) => (
            <TouchableOpacity
              key={book}
              style={styles.item}
              onPress={() => navigation.navigate("BibleChapters", { book })}
            >
              <Text style={styles.itemText}>{book}</Text>
              <Icon name="chevron-right" size={22} color="#1b4b7aff" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1b4b7aff" },

  item: {
    padding: 14,
    backgroundColor: "#f7f9fc",
    marginVertical: 6,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemText: { fontSize: 16, color: "#1b4b7aff" },
});
