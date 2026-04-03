import { connectNotificationsSocket, getNotificationsSocket } from "./socket.init";
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
  type: 'INVITATION' | 'ADMIN_ALERT' | 'SYSTEM' | 'INVITATION_ACCEPTED' | 'INVITATION_DECLINED' | 'COMPETITION_START';
  isRead: boolean;
  senderID?: number;
  receiverID: number;
  created_at: Date;
}

interface InvitationPaylod {
  competitionName: string;
  senderName: string;
  competitionId: number;
  senderID: number;
  receiverID: number;
}

// Initialisation du gateway de notifications
export function initializeNotificationsGateway(dispatch: any, userId: number) {
  const socket = connectNotificationsSocket(userId);
  
  // Écouteurs d'événements
  socket.off("new-invitation");
  socket.off("competition-started");
  socket.off("invitation-response");
  socket.off("admin-notif");
  socket.off("error");
  socket.off("connect");
  socket.off("disconnect");

  socket.on("connect", () => {
    console.log("Connected to notifications gateway with ID:", socket.id);
    dispatch(setNotificationsConnectionStatus(true));
  });

  socket.on("new-invitation", (notification: NotificationPayload) => {
    console.log("New invitation received:", notification);
    dispatch(addNotification(notification));
  });

  socket.on("competition-started", (data: NotificationPayload) => {
    console.log("Notification competition started:", data);
    dispatch(addNotification(data));
  });

  socket.on("invitation-response", (data: NotificationPayload) => {
    console.log("Notification invitation response:", data);
    dispatch(addNotification(data));
  });

  socket.on("admin-notif", (data: NotificationPayload) => {
    console.log("Notification admin:", data);
    dispatch(addNotification(data));
  });

  socket.on("error", (error: any) => {
    console.error("Notifications gateway error:", error);
    dispatch(loadNotificationsError(error.message || 'WebSocket connection error'));
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from notifications gateway");
    dispatch(setNotificationsConnectionStatus(false));
  });
}

// Service de notifications pour le frontend
export function EmitEventNotif(dispatch: any) {
  const socket = getNotificationsSocket();
  
  return {
    // Marquer une notification comme lue
    sendInvitation: (notification: InvitationPaylod) => {
      console.log('notif send')
      socket.emit("send-invitation", notification);
    },

    notificationAdmin: (notificationId: number) => {
      socket.emit("notification-admin", notificationId);
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

