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

interface FileItem {
  id: number;
  folder_id: number;
  file_name: string;
  file_url: string;
  mime_type: string;
  size: number;
}

const FolderDetail = ({ route, navigation }) => {
  const { folderId, folderName, isAdmin, userEmail } = route.params;

  const [files, setFiles] = useState<FileItem[]>([]);

  // Web file input reference
  const webInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const res = await axios.get(`${API_URL}/folders/${folderId}/files`);
      setFiles(res.data);
    } catch (err) {
      Alert.alert("Error", "Failed to load files");
      console.log("loadFiles error:", err);
    }
  };

  /** ------------------------------
   📱 UPLOAD (iOS & Android)
  --------------------------------*/
  const uploadFileMobile = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "mixed",
        selectionLimit: 1,
      });

      if (result.didCancel || !result.assets || !result.assets[0]) return;

      const file = result.assets[0];

      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.fileName || "upload",
        type: file.type || "application/octet-stream",
      } as any);

      formData.append("userEmail", userEmail);

      await axios.post(`${API_URL}/folders/${folderId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Successfully uploaded");
      loadFiles();
    } catch (err) {
      console.log("uploadFileMobile:", err);
      Alert.alert("Upload failed");
    }
  };

  /** ------------------------------
   🌐 UPLOAD (WEB)
  --------------------------------*/
  const uploadFileWeb = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("userEmail", userEmail);
    console.log(file);
    try {
      await axios.post(`${API_URL}/folders/${folderId}/upload`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      e.target.value = ""; // reset input
      Alert.alert("Uploaded Successfully");
      loadFiles();
    } catch (err) {
      console.log("uploadFileWeb:", err);
      Alert.alert("Upload Failed");
    }
  };

  const uploadFile = () => {
    if (Platform.OS === "web") {
      webInputRef.current?.click();
    } else {
      uploadFileMobile();
    }
  };

  /** ------------------------------
   FILE ICON
  --------------------------------*/
  const getFileIcon = (mime: string) => {
    if (!mime) return "file";
    if (mime.includes("image")) return "image";
    if (mime.includes("pdf")) return "file-text";
    if (mime.includes("doc") || mime.includes("ppt")) return "file-text";
    return "file";
  };

  /** ------------------------------
   OPEN FILE
  --------------------------------*/
  const openFile = (item: FileItem) => {
    const previewable =
      item.mime_type?.includes("image") ||
      item.mime_type?.includes("pdf") ||
      item.mime_type?.includes("doc") ||
      item.mime_type?.includes("ppt");

    if (previewable) {
      navigation.navigate("FilePreview", {
        fileUrl: item.file_url,
        mimeType: item.mime_type,
        name: item.file_name,
      });
    } else {
      Linking.openURL(item.file_url);
    }
  };

  /** ------------------------------
   DELETE FILE
  --------------------------------*/
  const deleteFile = async (id: number) => {
    // Alert.alert("Delete", "Are you sure?", [
    //   { text: "Cancel" },
    //   {
    //     text: "Delete",
    //     style: "destructive",
    //     onPress: async () => {
    //       try {
    await axios.delete(`${API_URL}/folders/files/${id}`);
    //         loadFiles();
    //       } catch (err) {
    //         console.log("delete error:", err);
    //         Alert.alert("Error deleting file");
    //       }
    //     },
    //   },
    // ]);
  };

  return (
    <View style={styles.container}>
      {/* Web hidden input */}
      {Platform.OS === "web" && (
        <input
          type="file"
          ref={webInputRef}
          style={{ display: "none" }}
          onChange={uploadFileWeb}
        />
      )}

      {/* HEADER */}
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

      {/* FILE LIST */}
      <FlatList
        data={files}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.fileRow}
            onPress={() => openFile(item)}
          >
            <Icon
              name={getFileIcon(item.mime_type)}
              size={22}
              color="#1b4b7aff"
            />

            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.fileName}>{item.file_name}</Text>
              <Text style={styles.meta}>{item.mime_type}</Text>
            </View>

            {isAdmin && (
              <TouchableOpacity onPress={() => deleteFile(item.id)}>
                <Icon name="trash" size={20} color="red" />
              </TouchableOpacity>
            )}
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
    marginTop: 15,
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
    alignItems: "center",
  },
  fileName: { fontSize: 15, color: "#1b4b7aff", fontWeight: "500" },
  meta: { fontSize: 12, color: "#777" },
  empty: {
    textAlign: "center",
    marginTop: 30,
    fontStyle: "italic",
    color: "#999",
  },
});
