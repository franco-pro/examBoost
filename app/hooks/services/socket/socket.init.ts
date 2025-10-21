import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://172.20.10.2:3000/rooms";

let socket: Socket | null = null;

export function connectRoomsSocket(token?: string) {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });
  }
  return socket;
}

export function getSocket() {
  if (!socket) throw new Error("Not connected to a room");
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
