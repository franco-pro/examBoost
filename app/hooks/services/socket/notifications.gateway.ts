import { connectNotificationsSocket, getNotificationsSocket } from "./socket.init";
import { 
  addNotification, 
  markNotificationAsRead, 
  setNotificationsConnectionStatus,
  loadNotificationsError,
  addAdminNotification
} from '../../redux/notifications/notifications.slice';
import { updateStatut } from "../../redux/competitions/competitions.slice";
import { setTotalActiveUser } from "../../redux/dev-admin/dev-admin.slice";
import { addNotif, updateBalanceUser } from "../../redux/users/users.slice";
import { Transaction } from "../../entities/transaction";
import { addTransaction } from "../../redux/transactions/transactions.slice";
import { router } from "expo-router";

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
  roomId?: string;
  statut?: string;
  competitionID?: number;
}

interface InvitationPaylod {
  competitionName: string;
  senderName: string;
  competitionId: number;
  senderID: number;
  receiverID: number;
}

interface NotifiationAdmin {
  title: string;
  text: string;
  type: string,
  adminId: number;
  receiverId: number|null;
  created_at: any
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
  socket.off("new-competition-registration");
  socket.off("competition-started-change-statut");
  socket.off("new-connection");
  
  socket.off("payment-ended");
  socket.off("connect");
  socket.off("disconnect");
  socket.off('token-error');

  socket.on("connect", () => {
    console.log("Connected to notifications gateway with ID:", socket.id);
    dispatch(setNotificationsConnectionStatus(true));
  });
   socket.on("token-error", (info: string) => {
      console.log("Error on connection with this token please login :");
      router.replace("/(auth)/login")
    });

  socket.on("reconnect_attempt", () => {
    console.log("RECONNECT ATTEMPT");
  });

  socket.on("new-invitation", (notification: NotificationPayload) => {
    console.log("New invitation received:", notification);
    dispatch(addNotification(notification));
    dispatch(addNotif(notification)); //just to indicate the badge represent the numer of notifications

  });

  socket.on('new-connection', (notificaiton: {size: number})=>{
    console.log('size of connection status', notificaiton)
    dispatch(setTotalActiveUser(notificaiton.size))
  })
  socket.on("competition-started", (data: NotificationPayload) => {
    console.log("Notification competition started:", data);
    const {roomId, statut, competitionID} = data;
    dispatch(addNotification({
      ...data,
      competionID: data.competitionID
    }));

    dispatch(addNotif(data))
    
    if(roomId && statut && competitionID){
      dispatch(updateStatut({roomId: roomId, competitionId: competitionID, statut: statut}))
    }
    
  });

  socket.on("new-competition-registration", (data: NotificationPayload) => {
    console.log("Notification new registration:", data);
    dispatch(addNotification(data));
    dispatch(addNotif(data))
  });

 
  socket.on("competition-started-change-statut", (data: {roomId: string, competitionId: number, statut: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED"}) => {
      console.log("Notification competition started change statut:", data);
      dispatch(updateStatut({roomId: data.roomId, competitionId: data?.competitionId, statut: data?.statut}));
  });


  socket.on("invitation-response", (data: NotificationPayload) => {
    console.log("Notification invitation response:", data);
    dispatch(addNotification(data));
    dispatch(addNotif(data))
  });

  socket.on("admin-notif", (data: NotificationPayload) => {
    dispatch(addNotification(data));
    dispatch(addNotif(data))

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

    notificationAdmin: (notification: NotifiationAdmin,
                        extraData: {
                          receiver: {
                            id: number;
                            username: string;
                            surname: string;
                            imgUrl: string;
                            phone: string;
                          },
                          sender: {
                            id: number;
                            username: string;
                            surname: string;
                            imgUrl: string;
                            phone: string;
                          }
                        }
    ) => {
      socket.emit("notification-admin", notification);
      dispatch(addAdminNotification({
        id: Date.now(), // Générer un ID temporaire
        title: notification.title,
        text: notification.text,
        type: notification.type as 'INVITATION' | 'ADMIN_ALERT' | 'SYSTEM' | 'INVITATION_ACCEPTED' | 'INVITATION_DECLINED' | 'COMPETITION_START',
        isRead: false,
        senderID: notification.adminId,
        receiverID: notification.receiverId ?? 0, // Utiliser 0 si receiverId est null
        created_at: new Date(notification.created_at),
        sender: extraData.sender,
        receiver: extraData.receiver
      }))
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

