// services/notificationsAPI.ts
import axios from "axios";

const API = "https://bible-verse-backend-1kvo.onrender.com";

export async function savePushToken(userId, token) {
  try {
    await axios.post(`${API}/save-token`, { userId, token });
  } catch (e) {
    console.log("Token save failed:", e.message);
  }
}

export async function sendPushToOne(userId, message) {
  return axios.post(`${API}/push/send-to-one`, { userId, message });
}

export async function sendPushToAll(message) {
  return axios.post(`${API}/push/send-to-all`, { message });
}
