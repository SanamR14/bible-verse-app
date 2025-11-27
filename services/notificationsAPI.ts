import axios from "axios";

const API = "https://bible-verse-backend-1kvo.onrender.com";

export async function savePushToken(userId: number, token: string) {
  try {
    await axios.post(`${API}/save-token`, { userId, token });
  } catch (err) {
    console.log("Token save error:", err.message);
  }
}

export async function sendPushToOne(userId: string, message: string) {
  try {
    await axios.post(`${API}/push/send-to-one`, { userId, message });
  } catch (err) {
    console.log("Push error:", err);
  }
}

export async function sendPushToAll(message: string) {
  try {
    await axios.post(`${API}/push/send-to-all`, { message });
  } catch (err) {
    console.log("Push error:", err);
  }
}
