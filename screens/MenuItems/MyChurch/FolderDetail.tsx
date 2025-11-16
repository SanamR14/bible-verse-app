import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Linking,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import axios from "axios";
import { launchImageLibrary } from "react-native-image-picker";

const API_URL = "https://bible-verse-backend-1kvo.onrender.com";

const FolderDetail = ({ route, navigation }) => {
  const { folderId, folderName, isAdmin } = route.params;

  const [files, setFiles] = useState([]);

  // Web file input reference
  const webInputRef = useRef(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const res = await axios.get(`${API_URL}/folders/${folderId}/files`);
      setFiles(res.data);
    } catch (err) {
      Alert.alert("Error", "Failed to load files");
    }
  };

  const uploadFileMobile = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "mixed", // allows ANY file
        selectionLimit: 1,
      });

      if (result.didCancel) return;

      const file = result.assets[0];

      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.fileName || "file",
        type: file.type || "application/octet-stream",
      });

      await axios.post(`${API_URL}/folders/${folderId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Uploaded Successfully");
      loadFiles();
    } catch (err) {
      console.log(err);
      Alert.alert("Upload Failed");
    }
  };

  const uploadFileWeb = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    try {
      await axios.post(`${API_URL}/folders/${folderId}/upload`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Uploaded Successfully");
      loadFiles();
    } catch (err) {
      Alert.alert("Upload Failed");
    }
  };

  const uploadFile = () => {
    if (Platform.OS === "web") {
      webInputRef.current?.click(); // opens file dialog
    } else {
      uploadFileMobile(); // Android & iOS
    }
  };

  const openFile = (url) => Linking.openURL(url);

  return (
    <View style={styles.container}>
      {/* Web File Input */}
      {Platform.OS === "web" && (
        <input
          ref={webInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={uploadFileWeb}
        />
      )}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#1b4b7aff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{folderName}</Text>

        {isAdmin ? (
          <TouchableOpacity onPress={uploadFile}>
            <Icon name="upload" size={24} color="#1b4b7aff" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      {/* Files */}
      <FlatList
        data={files}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.fileRow}
            onPress={() => openFile(item.file_url)}
          >
            <Icon name="file" size={22} color="#1b4b7aff" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.fileName}>{item.file_name}</Text>
              <Text style={styles.meta}>{item.mime_type}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No files yet</Text>}
      />
    </View>
  );
};

export default FolderDetail;

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
    color: "#1b4b7aff",
  },
  fileRow: {
    flexDirection: "row",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  fileName: { fontSize: 15, color: "#1b4b7aff", fontWeight: "500" },
  meta: { fontSize: 12, color: "#777" },
  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#999",
  },
});
