import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PlansStackParamList } from "../../Stack/PlansStack";

export default function TopicScreen() {
  const route = useRoute<RouteProp<PlansStackParamList, "Plans_Topic">>();
  const navigation =
    useNavigation<NativeStackNavigationProp<PlansStackParamList>>();
  const { topic } = route.params;

  if (!topic.days || topic.days.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No days available.</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={styles.dayButton}
      onPress={() => navigation.navigate("Plans_Day", { topic, day: index })}
    >
      <Icon name="calendar" size={20} />
      <Text style={styles.dayText}>{item.title || `Day ${index + 1}`}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{topic.title}</Text>
        <Text></Text>
      </View>

      <FlatList
        data={topic.days}
        renderItem={renderItem}
        keyExtractor={(_, i) => i.toString()}
        numColumns={3}
        columnWrapperStyle={styles.row}
      />

      <TouchableOpacity style={styles.quizButton}>
        <Text style={styles.quizText}>Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    color: "#1b4a7aff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    color: "#1b4a7aff",
  },
  row: { justifyContent: "space-between", marginBottom: 12 },
  dayButton: {
    backgroundColor: "#ECF0F1",
    flex: 0.3,
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
  },
  dayText: { marginTop: 8, textAlign: "center" },
  quizButton: {
    marginTop: 16,
    backgroundColor: "#ECF0F1",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "center",
    width: "30%",
  },
  quizText: { fontWeight: "bold" },
  errorText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "gray",
  },
});
