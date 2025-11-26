import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getNotifications,
  deleteNotification,
  clearNotifications,
} from "../../storage/notificationStorage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  date: string;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const navigation = useNavigation();
  const loadNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    loadNotifications();
  };

  const handleClearAll = async () => {
    await clearNotifications();
    loadNotifications();
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <View style={styles.rowFront}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
      <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>

      <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        style={styles.deleteBtn}
      >
        <Icon name="trash-can-outline" size={20} color="#f44336" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={handleClearAll}>
          <Icon name="broom" size={24} color="#1b4b7aff" />
        </TouchableOpacity>
      </View>

      {notifications.length === 0 ? (
        <Text style={styles.empty}>No notifications yet</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#1b4b7aff" },
  rowFront: {
    backgroundColor: "#ECF0F1",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: "relative",
  },
  title: { fontSize: 16, fontWeight: "700", color: "#1b4b7aff" },
  body: { fontSize: 14, marginTop: 4, color: "#1b4b7aff" },
  date: { fontSize: 12, marginTop: 4, color: "#555" },
  deleteBtn: { position: "absolute", top: 16, right: 16 },
  empty: { fontSize: 16, color: "#888", textAlign: "center", marginTop: 50 },
});
