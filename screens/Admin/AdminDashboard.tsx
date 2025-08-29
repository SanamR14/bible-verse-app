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
  Pressable,
  Modal,
  Share,
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
import HomeStack from "../../Stack/HomeStack";
import DailyBibleVerse from "./DailyBibleVerse";

const Drawer = createDrawerNavigator();

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [testimonies, setTestimonies] = useState([]);
  const [showModal, setShowModal] = useState(false);

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

  const handleShare = async () => {
    try {
      const prayersText = prayerRequests
        .map((item) => `${item.username}: ${item.prayer}`)
        .join("\n\n");

      await Share.share({
        message: prayersText || "No prayer requests available",
      });
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#1b4b7aff" style={{ flex: 1 }} />
    );
  }

  // Only show first 5 in main view
  const displayedPrayers =
    prayerRequests.length > 5 ? prayerRequests.slice(0, 5) : prayerRequests;

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
        data={displayedPrayers}
        style={styles.item}
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

      {prayerRequests.length > 5 && (
        <Pressable style={styles.seeMoreBtn} onPress={() => setShowModal(true)}>
          <Text style={styles.btnText}>See More</Text>
        </Pressable>
      )}

      <Pressable style={styles.shareBtn} onPress={handleShare}>
        <Text style={styles.btnText}>Share</Text>
      </Pressable>

      {/* Modal for all prayers */}
      <Modal visible={showModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>All Prayer Requests</Text>
          <FlatList
            data={prayerRequests}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : `modal-prayer-${index}`
            }
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text>
                  {item.prayer} - {item.username}
                </Text>
              </View>
            )}
          />

          <Pressable style={styles.shareBtn} onPress={handleShare}>
            <Text style={styles.btnText}>Share</Text>
          </Pressable>
          <Pressable
            style={styles.closeBtn}
            onPress={() => setShowModal(false)}
          >
            <Text style={styles.btnText}>Close</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>

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
      <Drawer.Screen name="Daily Bible Verse" component={DailyBibleVerse} />
      <Drawer.Screen name="Devotions" component={DevotionsAdmin} />
      <Drawer.Screen name="Plans" component={PlansAdmin} />
      <Drawer.Screen name="Explore" component={ExploreAdmin} />
      <Drawer.Screen name="Home" component={HomeStack} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1b4b7a",
    padding: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 6,
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
    paddingLeft: 16,
  },
  listItem: {
    padding: 12,
    backgroundColor: "#f9f9f9",
    marginVertical: 6,
    borderRadius: 8,
  },
  item: {
    flexGrow: 0,
  },
  userName: { fontWeight: "bold", color: "#1b4b7aff" },
  shareBtn: {
    marginTop: 10,
    backgroundColor: "#1b4b7a",
    padding: 12,
    borderRadius: 8,
    width: "fit-content",
    margin: "auto",
  },
  seeMoreBtn: {
    marginTop: 10,
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 8,
    width: "fit-content",
    margin: "auto",
  },
  closeBtn: {
    marginTop: 12,
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 8,
    width: "fit-content",
    margin: "auto",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  modalContainer: { flex: 1, padding: 16, backgroundColor: "#fff" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
});
