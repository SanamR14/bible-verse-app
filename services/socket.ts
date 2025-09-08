import { io, Socket } from "socket.io-client";

const API_URL = "https://bible-verse-backend-1kvo.onrender.com"; // backend

export const socket: Socket = io(API_URL, {
  transports: ["websocket"],
});
