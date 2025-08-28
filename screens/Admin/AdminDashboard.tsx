import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import DevotionsAdmin from "./DevotionsAdmin";
import PlansAdmin from "./PlansAdmin";
import ExploreAdmin from "./ExploreAdmin";

const Drawer = createDrawerNavigator();

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [testimonies, setTestimonies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await fetch(
          "https://bible-verse-backend-1kvo.onrender.com/auth"
        );
        const usersData = await usersRes.json();
        setUserCount(usersData.length || 0);

        const prayersRes = await fetch(
          "https://bible-verse-backend-1kvo.onrender.com/prayer-requests/allPrayers"
        );
        const prayersData = await prayersRes.json();
        setPrayerRequests(prayersData);

        const testimoniesRes = await fetch(
          "https://bible-verse-backend-1kvo.onrender.com/testimonies"
        );
        const testimoniesData = await testimoniesRes.json();
        setTestimonies(testimoniesData);
      } catch (err) {
        console.error("Admin fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#1b4b7aff" style={{ flex: 1 }} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Users</Text>
          <Text style={styles.cardValue}>{userCount}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Prayer Requests</Text>
          <Text style={styles.cardValue}>{prayerRequests.length}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Testimonies</Text>
          <Text style={styles.cardValue}>{testimonies.length}</Text>
        </View>
      </View>

      {/* Prayer Requests */}
      <Text style={styles.sectionTitle}>Prayer Requests</Text>
      <FlatList
        data={prayerRequests}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : `prayer-${index}`
        }
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>
              {item.prayer} - {item.username}
            </Text>
          </View>
        )}
      />

      {/* Testimonies */}
      <Text style={styles.sectionTitle}>Testimonies</Text>
      <FlatList
        data={testimonies}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : `testimony-${index}`
        }
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.userName}>{item.username}</Text>
            <Text>{item.testimony}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};
function CustomDrawerContent(props) {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      })
    );
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <DrawerItemList {...props} />

      {/* Logout at bottom */}
      <View
        style={{ marginTop: "auto", borderTopWidth: 1, borderTopColor: "#ccc" }}
      >
        <DrawerItem
          label="Logout"
          onPress={handleLogout}
          labelStyle={{ color: "red", fontWeight: "bold" }}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function AdminDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: "#1b4b7aff" },
        headerTintColor: "#fff",
        drawerActiveBackgroundColor: "#1b4b7aff",
        drawerActiveTintColor: "#fff",
      }}
    >
      <Drawer.Screen name="Dashboard" component={AdminDashboard} />
      <Drawer.Screen name="Devotions" component={DevotionsAdmin} />
      <Drawer.Screen name="Plans" component={PlansAdmin} />
      <Drawer.Screen name="Explore" component={ExploreAdmin} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" }, // global margin/padding
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1b4b7a",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 4,
  },
  cardTitle: { fontSize: 14, color: "#333" },
  cardValue: { fontSize: 18, fontWeight: "bold", color: "#1b4b7aff" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    color: "#1b4b7aff",
  },
  listItem: {
    padding: 12,
    backgroundColor: "#f9f9f9",
    marginVertical: 6,
    borderRadius: 8,
  },
  userName: { fontWeight: "bold", color: "#1b4b7aff" },
  date: { fontSize: 12, color: "#888" },
  logoutBtn: {
    marginTop: 20,
    backgroundColor: "#e74c3c",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
