// apiClient.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiClientGet = async (url, options = {}) => {
  const token = await AsyncStorage.getItem("userToken");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("Unauthorized - Please login again");
  }

  return response.json();
};

export const apiClient = async (url, options = {}) => {
  const token = await AsyncStorage.getItem("userToken");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("Unauthorized - Please login again");
  }

  return response;
};
