import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
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
import { SwipeListView } from "react-native-swipe-list-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Folder {
  id: string;
  name: string;
  room_name: string;
  church: string;
}

interface FolderListProps {
  apiUrl: string;
  pageName: string;
  onFolderPress?: (folder: Folder) => void;
}

export default function FolderList({
  apiUrl,
  pageName,
  onFolderPress,
}: FolderListProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigation = useNavigation();
  const rowRef = useRef<any>({});

  /** LOAD USER FIRST */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem("userData");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUserData(parsed);
          setIsAdmin(parsed?.is_church_admin || false);
        }
      } catch (err) {
        console.error("User load error:", err);
      }
    };

    loadUser();
  }, []);

  /** LOAD FOLDERS AFTER USER IS READY */
  useEffect(() => {
    if (userData) {
      loadFolders();
    }
  }, [userData, apiUrl, pageName]);

  /** FILTER FOLDERS FOR THIS PAGE + CHURCH */
  const loadFolders = useCallback(async () => {
    try {
      const res = await axios.get(apiUrl);
      const allFolders = res.data || [];

      const filtered = allFolders.filter((f: Folder) => {
        const roomMatch = f.room_name?.toLowerCase() === pageName.toLowerCase();

        const churchMatch =
          f.church?.toLowerCase() === userData?.church?.toLowerCase();

        return roomMatch && churchMatch;
      });

      setFolders(filtered);
    } catch (err) {
      console.error("loadFolders:", err);
      Alert.alert("Error", "Failed to load folders");
    }
  }, [apiUrl, pageName, userData]);

  /** ADD FOLDER */
  const addFolder = async (folderName: string) => {
    if (!folderName.trim()) return;
    try {
      await axios.post(apiUrl, {
        name: folderName.trim(),
        room_name: pageName,
        church: userData?.church,
      });
      setModalVisible(false);
      setNewFolderName("");
      loadFolders();
    } catch (err) {
      console.error("addFolder:", err);
      Alert.alert("Error", "Failed to create folder");
    }
  };

  const handleAddFolder = () => {
    if (Platform.OS === "ios") {
      // @ts-ignore
      Alert.prompt("New Folder", "Enter folder name", (text) => {
        if (text) addFolder(text);
      });
    } else {
      setModalVisible(true);
    }
  };

  /** DELETE FOLDER */
  const confirmAndDeleteFolder = (folderId: string, rowKey?: string) => {
    Alert.alert("Delete Folder", "Are you sure?", [
      { text: "Cancel", style: "cancel", onPress: () => closeRow(rowKey) },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteFolder(folderId, rowKey),
      },
    ]);
  };

  const deleteFolder = async (folderId: string, rowKey?: string) => {
    try {
      await axios.delete(`${apiUrl}/${folderId}`);
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
      closeRow(rowKey);
    } catch (err) {
      console.error("deleteFolder:", err);
      Alert.alert("Error", "Failed to delete folder");
    }
  };

  const closeRow = (rowKey?: string) => {
    if (!rowKey) return;
    const row = rowRef.current[rowKey];
    if (row && row.closeRow) row.closeRow();
  };

  const renderHiddenItem = (data: any) => (
    <View style={styles.rowBack}>
      {isAdmin && (
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => confirmAndDeleteFolder(data.item.id, data.item.id)}
        >
          <Icon name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderItem = (data: { item: Folder }) => (
    <TouchableOpacity
      style={styles.folderCard}
      activeOpacity={0.7}
      onPress={() => onFolderPress && onFolderPress(data.item)}
    >
      <Icon name="folder" size={22} color="#1b4a7aff" />
      <Text style={styles.folderName}>{data.item.name}</Text>
      <View style={{ flex: 1 }} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#1b4a7aff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{pageName}</Text>

        {isAdmin ? (
          <TouchableOpacity onPress={handleAddFolder}>
            <Icon name="folder-plus" size={24} color="#1b4a7aff" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      {/* LIST */}
      <SwipeListView
        useFlatList
        data={folders}
        keyExtractor={(item) => item.id}
        renderItem={(rowData) => {
          const id = rowData.item.id;
          return (
            <View
              ref={(ref) => {
                if (ref) rowRef.current[id] = ref;
              }}
            >
              {renderItem(rowData)}
            </View>
          );
        }}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        disableRightSwipe={true}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No folders available</Text>
          </View>
        }
      />

      {/* ANDROID ADD FOLDER MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
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
                style={[styles.modalButton, { backgroundColor: "#1b4a7aff" }]}
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

/* ---------------------- STYLES ------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1b4a7aff",
  },

  folderCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  folderName: {
    marginLeft: 12,
    fontSize: 16,
    color: "#1b4a7aff",
  },

  rowBack: {
    backgroundColor: "#f44336",
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingRight: 12,
  },
  deleteBtn: {
    width: 70,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyState: { paddingTop: 40, alignItems: "center" },
  emptyText: { fontSize: 15, color: "#777", fontStyle: "italic" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  modalActions: { flexDirection: "row", justifyContent: "flex-end" },
  modalButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
});
