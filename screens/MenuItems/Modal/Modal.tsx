import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import Icon from "react-native-vector-icons/Feather";

type RequestModalProps = {
  visible: boolean;
  onClose: () => void;
};

const PrayerModal: React.FC<RequestModalProps> = ({ visible, onClose }) => {
  const [prayer, setPrayer] = useState<any[]>([]);

  const [userId, setUserId] = useState(0);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem("userData");
        if (userStr) {
          const userData = JSON.parse(userStr);
          setUserId(userData.id);
        }
      } catch (err) {
        console.error("Error loading user:", err);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchPrayerRequets = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/prayer-requests/${userId}`
        );
        const data = await response.json();
        console.log(data);
        setPrayer(data);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
      }
    };

    fetchPrayerRequets();
  }, [userId]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>My Prayer Request</Text>
          <SwipeListView
            data={prayer}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            renderItem={({ item }) => (
              <View style={styles.rowFront}>
                <Text style={styles.text}>{item.prayer}</Text>
              </View>
            )}
            renderHiddenItem={() => <View />} // Empty, or implement swipe action
            rightOpenValue={-70}
            disableRightSwipe
            contentContainerStyle={{ paddingBottom: 100 }}
          />
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default PrayerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  closeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
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
