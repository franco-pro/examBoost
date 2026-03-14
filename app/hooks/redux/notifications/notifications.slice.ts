import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Interface pour les notifications
export interface Notification {
  id: number;
  title: string;
  text: string;
  type: 'INVITATION' | 'ADMIN_ALERT' | 'SYSTEM';
  isRead: boolean;
  senderID?: number;
  receiverID: number;
  createdAt: Date;
}

// État du slice de notifications
export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  isConnected: boolean;
}

// État initial
const initialState: NotificationsState = {
  notifications: [],
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

// Thunks pour les opérations asynchrones
export const fetchNotifications = () => async (dispatch: any) => {
  dispatch(loadNotificationsStart());
  try {
    // TODO: Implémenter l'appel API pour récupérer les notifications
    // const response = await notificationsAPI.getNotifications();
    // dispatch(loadNotificationsSuccess(response.data));
  } catch (error) {
    dispatch(loadNotificationsError((error as Error).message || 'Failed to load notifications'));
  }
};

export const markNotificationAsReadAsync = (notificationId: number) => async (dispatch: any) => {
  try {
    // TODO: Implémenter l'appel API pour marquer comme lu
    // await notificationsAPI.markAsRead(notificationId);
    dispatch(markNotificationAsRead(notificationId));
  } catch (error) {
    dispatch(loadNotificationsError((error as Error).message || 'Failed to mark notification as read'));
  }
};

export const deleteNotificationAsync = (notificationId: number) => async (dispatch: any) => {
  try {
    // TODO: Implémenter l'appel API pour supprimer
    // await notificationsAPI.deleteNotification(notificationId);
    dispatch(removeNotification(notificationId));
  } catch (error) {
    dispatch(loadNotificationsError((error as Error).message || 'Failed to delete notification'));
  }
};
