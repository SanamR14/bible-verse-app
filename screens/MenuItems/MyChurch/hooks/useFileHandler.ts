// hooks/useFileHandler.ts
import { Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";

export const getFileIcon = (mime: string) => {
  if (!mime) return "file";
  if (mime.includes("image")) return "image";
  if (mime.includes("pdf")) return "file-text";
  if (mime.includes("doc") || mime.includes("ppt")) return "file-text";
  return "file";
};

export const useFileHandler = () => {
  const navigation = useNavigation();

  const openFile = (file: { file_url: string; mime_type?: string; file_name: string }) => {
    const previewable =
      file.mime_type?.includes("image") ||
      file.mime_type?.includes("pdf") ||
      file.mime_type?.includes("doc") ||
      file.mime_type?.includes("ppt");

    if (previewable) {
      navigation.navigate("FilePreview", {
        fileUrl: file.file_url,
        mimeType: file.mime_type,
        name: file.file_name,
      });
    } else {
      Linking.openURL(file.file_url);
    }
  };

  return { openFile, getFileIcon };
};
