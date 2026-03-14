import { connectNotificationsSocket, getNotificationsSocket } from "./socket.init";
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  addNotification, 
  markNotificationAsRead, 
  setNotificationsConnectionStatus,
  loadNotificationsError
} from '../../redux/notifications/notifications.slice';

// Interface pour les notifications
export interface NotificationPayload {
  id: number;
  title: string;
  text: string;
  type: 'INVITATION' | 'ADMIN_ALERT' | 'SYSTEM';
  isRead: boolean;
  senderID?: number;
  receiverID: number;
  createdAt: Date;
}

// Initialisation du gateway de notifications
export function initializeNotificationsGateway(dispatch: any, userId: number) {
  const socket = connectNotificationsSocket();
  
  // Écouteurs d'événements
  socket.off("notification-new");
  socket.off("notification-marked-read");
  socket.off("error");
  socket.off("connect");
  socket.off("disconnect");

  socket.on("connect", () => {
    console.log("Connected to notifications gateway with ID:", socket.id);
    dispatch(setNotificationsConnectionStatus(true));
  });

  socket.on("notification-new", (notification: NotificationPayload) => {
    console.log("New notification received:", notification);
    dispatch(addNotification(notification));
  });

  socket.on("notification-marked-read", (data: { notificationId: number, userId: number }) => {
    console.log("Notification marked as read:", data);
    dispatch(markNotificationAsRead(data.notificationId));
  });

  socket.on("error", (error: any) => {
    console.error("Notifications gateway error:", error);
    dispatch(loadNotificationsError(error.message || 'WebSocket connection error'));
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from notifications gateway");
    dispatch(setNotificationsConnectionStatus(false));
  });

  return socket;
}

// Service de notifications pour le frontend
export function NotificationsService() {
  const socket = getNotificationsSocket();
  
  return {
    // Marquer une notification comme lue
    markAsRead: (notificationId: number) => {
      socket.emit("notification-read", notificationId);
    },

    // Vérifier si connecté
    isConnected: () => {
      return socket.connected;
    },

    // Obtenir l'ID du socket
    getSocketId: () => {
      return socket.id;
    }
  };
}

// Hook personnalisé pour les notifications***
export function useNotifications(userId: number) {
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (!userId) return;
    
    const socket = initializeNotificationsGateway(dispatch, userId);
    
    // Écouter les événements de connexion
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    
    // Nettoyage au démontage
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('notification-new');
      socket.off('notification-marked-read');
    };
  }, [userId, dispatch]);
  
  const service = NotificationsService();
  
  return {
    // État
    isConnected,
    
    // Actions
    markAsRead: service.markAsRead,
    
    // Utilitaires
    initialize: () => initializeNotificationsGateway(dispatch, userId),
  };
}
