import { API_URL } from '@/app/config/env';
import { io, type Socket } from 'socket.io-client';

export type NotificationsSocketEvents = {
  // server -> client
  'new-notification': unknown;
  'admin-notif': unknown;
  'invitation-response': unknown;
};

export function connectNotificationsSocket(userID: number): Socket | null {
  if (!API_URL) return null;

  const socket = io(`${API_URL}/otification`, {
    transports: ['websocket'],
    query: { userID: String(userID) },
  });

  return socket;
}
