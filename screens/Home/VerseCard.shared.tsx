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

  const fetchVerseOfTheDay = async () => {
    try {
      const data = await apiClientGet("/bibleverse/daily");
      setImageUrl(data?.image_url || null);
    } catch (error) {
      console.error("Error loading verse of the day:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerseOfTheDay();
  }, []);

  return { user, imageUrl, loading };
};
