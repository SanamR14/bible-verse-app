import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const initialNotifications = [
  { id: "1", text: "Notification 1" },
  { id: "2", text: "Notification 2" },
  { id: "3", text: "Notification 3" },
  { id: "4", text: "Notification 4" },
  { id: "5", text: "Notification 5" },
  { id: "6", text: "Notification 6" },
  { id: "7", text: "Notification 7" },
  { id: "8", text: "Notification 8" },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const deleteRow = (rowKey: string) => {
    const newData = notifications.filter((item) => item.id !== rowKey);
    setNotifications(newData);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.rowFront}>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  const renderHiddenItem = (data: any, rowMap: any) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => deleteRow(data.item.id)}
      >
        <Icon name="trash-can-outline" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Text></Text>
      </View>
      <SwipeListView
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-70}
        disableRightSwipe
        contentContainerStyle={{
          paddingBottom: 100,
          width: "90%",
          alignSelf: "center",
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 50,
  },
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
    marginLeft: -22,
  },
  rowFront: {
    backgroundColor: "#fcf8f2",
    borderRadius: 14,
    padding: 20,
    marginBottom: 12,
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#f44336",
    flex: 1,
    borderRadius: 14,
    marginBottom: 12,
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingRight: 20,
  },
  deleteBtn: {
    width: 50,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
