// screens/Home/VerseCard.shared.tsx
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient, apiClientGet } from "../../apiClient";

export const useVerseCard = () => {
  const [images, setImages] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) setUser(JSON.parse(userData));
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };
    loadUser();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await apiClientGet(
        "https://bible-verse-backend-1kvo.onrender.com/bibleverse/"
      );
      const data = await response;
      setImages(data);
      updateImage(data);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateImage = (arr: any[]) => {
    if (arr.length === 0) return;
    const today = new Date();
    const dayIndex =
      today.getDate() + today.getMonth() * 31 + today.getFullYear();
    const index = dayIndex % arr.length;
    setImageUrl(arr[index]?.image_url);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return { user, imageUrl, loading };
};
