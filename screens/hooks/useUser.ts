import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useUser() {
  const [userData, setUserData] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

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
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  return { userData, isAdmin, loadingUser };
}
