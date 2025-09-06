// apiClient.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://bible-verse-backend-1kvo.onrender.com";

// helper to build headers
const getHeaders = (token, extraHeaders = {}) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...extraHeaders,
});

// helper to refresh access token
const refreshAccessToken = async () => {
  const refreshToken = await AsyncStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: refreshToken }),
    });

    if (!res.ok) {
      await AsyncStorage.clear(); // clear session if refresh fails
      return null;
    }

    const data = await res.json();
    await AsyncStorage.setItem("userToken", data.token);
    return data.token;
  } catch (err) {
    console.error("Refresh token failed:", err);
    return null;
  }
};

// GET request
export const apiClientGet = async (url, options = {}) => {
  let token = await AsyncStorage.getItem("userToken");

  let response = await fetch(`${API_URL}${url}`, {
    ...options,
    method: "GET",
    headers: getHeaders(token, options.headers),
  });

  // if expired, try refresh
  if (response.status === 401 || response.status === 403) {
    const newToken = await refreshAccessToken();
    if (!newToken) throw new Error("Unauthorized - Please login again");

    response = await fetch(`${API_URL}${url}`, {
      ...options,
      method: "GET",
      headers: getHeaders(newToken, options.headers),
    });
  }

  return response.json();
};

// POST/PUT/DELETE (generic)
export const apiClient = async (url, options = {}) => {
  let token = await AsyncStorage.getItem("userToken");

  let response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: getHeaders(token, options.headers),
  });

  // if expired, try refresh
  if (response.status === 401 || response.status === 403) {
    const newToken = await refreshAccessToken();
    if (!newToken) throw new Error("Unauthorized - Please login again");

    response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: getHeaders(newToken, options.headers),
    });
  }

  return response;
};
