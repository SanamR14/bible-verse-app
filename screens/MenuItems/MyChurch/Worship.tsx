import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import FolderList from "./FolderList";
import { useFileHandler } from "./hooks/useFileHandler";

export default function Worship() {
  const navigation = useNavigation();
  const { openFile } = useFileHandler();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FolderList
        apiUrl="https://bible-verse-backend-1kvo.onrender.com/folders"
        isAdmin={true}
        pageName="Worship"
        onFolderPress={(folder) =>
          navigation.navigate("FolderDetail", {
            folderId: folder.id,
            folderName: folder.name,
            isAdmin: true,
          })
        }
      />
    </SafeAreaView>
  );
}
