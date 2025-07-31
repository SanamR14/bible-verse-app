import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
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
  const [userId, setUserId] = useState<number | null>(null);

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
        setPrayer(data);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
      }
    };

    fetchPrayerRequets();
  }, [userId]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/prayer-requests/${userId}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPrayer(prev => prev.filter(item => item.prayerid !== id));
      } else {
        console.error('Failed to delete');
        Alert.alert('Delete failed', 'Could not delete the prayer request.');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };
  
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>My Prayer Requests</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="x" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <SwipeListView
            data={prayer}
            keyExtractor={(item) => item.prayerid.toString()}
            renderItem={({ item }) => (
              <View style={styles.rowFront}>
                <Text style={styles.text}>{item.prayer}</Text>
              </View>
            )}
            renderHiddenItem={({ item }) => (
              <View style={styles.rowBack}>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item.prayerid)}
                >
                  <Icon name="trash-2" color="#fff" size={20} />
                </TouchableOpacity>
              </View>
            )}
            rightOpenValue={-70}
            disableRightSwipe
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default PrayerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '75%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rowFront: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#f44336',
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 10,
    paddingRight: 15,
  },
  deleteBtn: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
  },
});