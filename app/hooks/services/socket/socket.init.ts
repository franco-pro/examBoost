import { io, Socket } from "socket.io-client";
import { WEBSOCKET_CONFIG } from "./socket.config";
import { getItem } from "@/app/utils/asyncStorage";

let roomsSocket: Socket | null = null;
let notificationsSocket: Socket | null = null;

// Connexion au namespace /rooms
export function connectRoomsSocket(userId: number) {
  if (!roomsSocket) {
    roomsSocket = io(WEBSOCKET_CONFIG.getNamespaceUrl(WEBSOCKET_CONFIG.NAMESPACES.ROOMS), {
      ...WEBSOCKET_CONFIG.DEFAULT_OPTIONS,
      auth: { userId: userId},
      transports: ["websocket"],
    });
  }
  return roomsSocket;
}

// Connexion au namespace /notifications
export async function connectNotificationsSocket(userId: number) {
  console.log('try connection entry', notificationsSocket)
  
  if (!notificationsSocket) {
    console.log('try connection')
    notificationsSocket = io(WEBSOCKET_CONFIG.getNamespaceUrl(WEBSOCKET_CONFIG.NAMESPACES.NOTIFICATIONS), {
      ...WEBSOCKET_CONFIG.DEFAULT_OPTIONS,
      query: { userId: userId },
      auth: {
        token: await getItem("accessToken")
      },
      transports: ["websocket"],
    });
    
  }else if(notificationsSocket && !notificationsSocket.connected){
    console.log('try connection reconnect')
    notificationsSocket = null;
  }
 
  return notificationsSocket;
}

// Getters pour les sockets
export function getRoomsSocket() {
  if (!roomsSocket) throw new Error("Not connected to rooms");
  return roomsSocket;
}

export function getNotificationsSocket() {
  if (!notificationsSocket) throw new Error("Not connected to notifications");
  return notificationsSocket;
}

// Déconnexion des sockets
export function disconnectRoomsSocket() {
  if (roomsSocket) {
    roomsSocket.disconnect();
    roomsSocket = null;
  }
}

export function disconnectNotificationsSocket() {
  if (notificationsSocket) {
    notificationsSocket.disconnect();
    notificationsSocket = null;
  }
}

// Déconnexion de tous les sockets
export function disconnectAllSockets() {
  disconnectRoomsSocket();
  disconnectNotificationsSocket();
}

// Vérification de connexion
export function isRoomsConnected(): boolean {
  return roomsSocket?.connected || false;
}

export function isNotificationsConnected(): boolean {
  return notificationsSocket?.connected || false;
}

// Reconnexion automatique
export function reconnectAllSockets(userId: number, accessToken: string) {
  disconnectAllSockets();
  connectRoomsSocket(userId);
  connectNotificationsSocket(userId);
}
