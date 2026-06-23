import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteAllNotifications, deleteNotification, getAdminNotification, getNotification, loadAllNotification, setAsRead } from './notification.thunks';

// Interface pour les notifications
export interface NotificationAdmin {
  id: number;
  title: string;
  text: string;
  type: 'INVITATION' | 'ADMIN_ALERT' | 'SYSTEM' | 'INVITATION_ACCEPTED' | 'INVITATION_DECLINED' | 'COMPETITION_START'|'COMPETITION_CREATED';
  isRead: boolean;
  senderID?: number;
  receiverID: number;
  created_at: Date;
  competionID?: number;
  receiver: {
			username: string,
			surname: string,
			imgUrl: string|null,
			phone: any
		},
  sender: {
			username: string,
			surname: string,
			imgUrl: string|null,
			phone: any
		}
}

export interface Notification {
  id: number;
  title: string;
  text: string;
  type: 'INVITATION' | 'ADMIN_ALERT' | 'SYSTEM' | 'INVITATION_ACCEPTED' | 'INVITATION_DECLINED' | 'COMPETITION_START'|'COMPETITION_CREATED';
  isRead: boolean;
  senderID?: number;
  receiverID: number;
  created_at: Date;
  competionID?: number;
}

// export interface NotificationAdmin {
//   id: number;
//   title: string;
//   text: string;
//   sendMode: string;
//   users: {
//     id: number;
//     username: string;
//     surname: string;
//     imgUrl: string,
//     phone: any,
//     }[];
//   created_at: Date;
// }

// État du slice de notifications
export interface NotificationsState {
  notifications: Notification[];
  notificationsAdmin: NotificationAdmin[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  isConnected: boolean;
}

// État initial
const initialState: NotificationsState = {
  notifications: [],
  notificationsAdmin: [],
  unreadCount: 0,
  loading: false,
  error: null,
  isConnected: false,
};

// Slice Redux pour les notifications
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Ajouter une nouvelle notification
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },

    addAdminNotification: (state, action: PayloadAction<NotificationAdmin>) => {
      state.notificationsAdmin.unshift(action.payload);
    },

    // Marquer une notification comme lue
    markNotificationAsRead: (state, action: PayloadAction<number>) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    // Marquer toutes les notifications comme lues
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.isRead = true;
      });
      state.unreadCount = 0;
    },

    // Supprimer une notification
    removeNotification: (state, action: PayloadAction<number>) => {
      const notificationId = action.payload;
      const notificationIndex = state.notifications.findIndex(n => n.id === notificationId);
      
      if (notificationIndex !== -1) {
        const notification = state.notifications[notificationIndex];
        if (!notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(notificationIndex, 1);
      }
    },

    // Vider toutes les notifications
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },

    // Mettre à jour l'état de connexion WebSocket
    setNotificationsConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },

    // Charger les notifications (loading state)
    loadNotificationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Succès du chargement
    loadNotificationsSuccess: (state, action: PayloadAction<Notification[]>) => {
      state.loading = false;
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.isRead).length;
    },

    // Erreur de chargement
    loadNotificationsError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Mettre à jour une notification
    updateNotification: (state, action: PayloadAction<Notification>) => {
      const updatedNotification = action.payload;
      const index = state.notifications.findIndex(n => n.id === updatedNotification.id);
      
      if (index !== -1) {
        const oldNotification = state.notifications[index];
        state.notifications[index] = updatedNotification;
        
        // Mettre à jour le compteur de non lues si nécessaire
        if (!oldNotification.isRead && updatedNotification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        } else if (oldNotification.isRead && !updatedNotification.isRead) {
          state.unreadCount += 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    // implementation des thunks de notifications asynchrones
      builder
          .addCase(loadAllNotification.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(loadAllNotification.fulfilled, (state, action) => {
            console.log('word end')
              state.loading = false;
              state.notifications = action.payload.data as Notification[];
              state.unreadCount = (action.payload && action.payload.data && action.payload.data.length != 0) ? action.payload.data.filter((n: Notification) => !n.isRead).length : [];
          })
          .addCase(loadAllNotification.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload ? (action.payload as any).message : 'Failed to load notifications';
          })

          .addCase(getNotification.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(getNotification.fulfilled, (state, action) => {
              state.loading = false;
              state.notifications = action.payload.data as Notification[];
              state.unreadCount = (action.payload && action.payload.data && action.payload.data.length != 0) ? action.payload.data.filter((n: Notification) => !n.isRead).length : [];
          })
          .addCase(getNotification.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload ? (action.payload as any).message : 'Failed to load notifications';
           })

           .addCase(getAdminNotification.pending, (state) => {
              state.loading = true;
              state.error = null;            
           })
           .addCase(getAdminNotification.fulfilled, (state, action) => {
              state.loading = false;
              state.notificationsAdmin = action.payload.data as NotificationAdmin[];
           })
            .addCase(getAdminNotification.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? (action.payload as any).message : 'Failed to load notifications';
            })
           
           .addCase(setAsRead.pending, (state) => {
              state.loading = true;
              state.error = null;
             })
           .addCase(setAsRead.fulfilled, (state, action) => {
              state.loading = false;
              const notificationId = action.payload.data.id;
              const notification = state.notifications.find(n => n.id === notificationId);
              if (notification && !notification.isRead) {
                notification.isRead = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
              }
           })
           .addCase(setAsRead.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload ? (action.payload as any).message : 'Failed to mark notification as read';
           })

           .addCase(deleteNotification.pending, (state) => {
              state.loading = true;
              state.error = null;
             })
           .addCase(deleteNotification.fulfilled, (state, action) => {
              state.loading = false;
              const notificationId = action.payload.data.id;
              const notificationIndex = state.notifications.findIndex(n => n.id === notificationId);
              if (notificationIndex !== -1) {
                const notification = state.notifications[notificationIndex];
                if (!notification.isRead) {
                  state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
                state.notifications.splice(notificationIndex, 1);
              }
           })
           .addCase(deleteNotification.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload ? (action.payload as any).message : 'Failed to delete notification';
           })

           .addCase(deleteAllNotifications.pending, (state) => {
              state.loading = true;
              state.error = null;
             })
           .addCase(deleteAllNotifications.fulfilled, (state) => {
              state.loading = false;
              state.notifications = [];
              state.unreadCount = 0;
           })
          .addCase(deleteAllNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? (action.payload as any).message : 'Failed to delete all notifications';
          })
            
    }
});

// Export des actions
export const {
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearNotifications,
  setNotificationsConnectionStatus,
  loadNotificationsStart,
  loadNotificationsSuccess,
  loadNotificationsError,
  updateNotification,
  addAdminNotification
} = notificationsSlice.actions;

// Export du reducer
export default notificationsSlice.reducer;

// Selectors
export const selectNotifications = (state: { notifications: NotificationsState }) => 
  state.notifications.notifications;

export const selectUnreadCount = (state: { notifications: NotificationsState }) => 
  state.notifications.unreadCount;

export const selectUnreadNotifications = (state: { notifications: NotificationsState }) => 
  state.notifications.notifications.filter(n => !n.isRead);

export const selectReadNotifications = (state: { notifications: NotificationsState }) => 
  state.notifications.notifications.filter(n => n.isRead);

export const selectNotificationsLoading = (state: { notifications: NotificationsState }) => 
  state.notifications.loading;

export const selectNotificationsError = (state: { notifications: NotificationsState }) => 
  state.notifications.error;

export const selectNotificationsConnectionStatus = (state: { notifications: NotificationsState }) => 
  state.notifications.isConnected;