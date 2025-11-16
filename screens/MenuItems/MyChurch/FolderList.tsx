import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  Platform,
  TextInput,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

interface Folder {
  id: string;
  name: string;
}

interface FolderListProps {
  apiUrl: string;
  isAdmin?: boolean;
  pageName: string;
  onFolderPress?: (folder: Folder) => void;
}

export default function FolderList({
  apiUrl,
  isAdmin = false,
  onFolderPress,
}: FolderListProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      const res = await axios.get(apiUrl);
      setFolders(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load folders");
    }
  };

  const addFolder = async (folderName: string) => {
    if (!folderName.trim()) return;
    try {
      await axios.post(apiUrl, { name: folderName });
      setModalVisible(false);
      setNewFolderName("");
      loadFolders();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to create folder");
    }
  };

  const handleAddFolder = () => {
    if (Platform.OS === "ios") {
      Alert.prompt("New Folder", "Enter folder name", (text) => {
        if (text) addFolder(text);
      });
    } else {
      setModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#1b4b7aff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Worship</Text>

        {isAdmin && (
          <TouchableOpacity onPress={handleAddFolder} style={{ margin: 16 }}>
            <Icon name="folder-plus" size={24} color="#1b4b7aff" />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={folders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.folderCard}
            onPress={() => onFolderPress && onFolderPress(item)}
          >
            <Icon name="folder" size={24} color="#1b4b7aff" />
            <Text style={styles.folderName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No folders yet</Text>
          </View>
        }
      />

      {/* Modal for Android */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>New Folder</Text>
            <TextInput
              placeholder="Folder name"
              value={newFolderName}
              onChangeText={setNewFolderName}
              style={styles.modalInput}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => addFolder(newFolderName)}
                style={[styles.modalButton, { backgroundColor: "#1b4b7aff" }]}
              >
                <Text style={{ color: "#fff" }}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1b4b7aff",
  },
  folderCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  folderName: {
    marginLeft: 10,
    fontSize: 16,
    color: "#1b4b7aff",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#1b4b7aff",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
    marginLeft: 10,
  },
});
