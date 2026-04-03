// utilisation du hook useNotifications avec Redux store
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNotifications } from './notifications.gateway';
import { 
  selectNotifications, 
  selectUnreadCount, 
  selectUnreadNotifications,
  selectReadNotifications,
  selectNotificationsError,
  clearNotifications,
  markAllNotificationsAsRead
} from '../../redux/notifications/notifications.slice';

export const NotificationComponent: React.FC<{ userId: number }> = ({ userId }) => {
  // Hook pour gérer la connexion WebSocket
  const { isConnected, markAsRead } = useNotifications(userId);
  
  // Selectors Redux pour l'état des notifications
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const unreadNotifications = useSelector(selectUnreadNotifications);
  const readNotifications = useSelector(selectReadNotifications);
  const error = useSelector(selectNotificationsError);
  const dispatch = useDispatch();

  return (
    <div>
      <h3>Notifications</h3>
      
      {/* État de connexion */}
      <div style={{ 
        padding: '10px', 
        backgroundColor: isConnected ? '#d4edda' : '#f8d7da',
        borderRadius: '5px',
        marginBottom: '10px'
      }}>
        Status: {isConnected ? ' Connected' : ' Disconnected'}
      </div>

      {/* Message d'erreur */}
      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8d7da',
          borderRadius: '5px',
          marginBottom: '10px',
          color: '#721c24'
        }}>
          Error: {error}
        </div>
      )}

      {/* Compteur de notifications non lues */}
      <div style={{ marginBottom: '10px' }}>
        <strong>Unread: {unreadCount}</strong>
        <button 
          onClick={() => dispatch(clearNotifications())}
          style={{ marginLeft: '10px', padding: '5px 10px' }}
        >
          Clear All
        </button>
        <button 
          onClick={() => dispatch(markAllNotificationsAsRead())}
          style={{ marginLeft: '5px', padding: '5px 10px' }}
        >
          Mark All Read
        </button>
      </div>

      {/* Liste des notifications */}
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map((notification: any) => (
            <div
              key={notification.id}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                marginBottom: '5px',
                backgroundColor: notification.isRead ? '#f8f9fa' : '#e3f2fd'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{notification.title}</div>
              <div>{notification.text}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Type: {notification.type} | 
                {notification.isRead ? '  Read' : '  Unread'}
              </div>
              {!notification.isRead && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  style={{ marginTop: '5px', padding: '3px 8px' }}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Statistiques */}
      <div style={{ marginTop: '20px', fontSize: '14px' }}>
        <strong>Statistics:</strong><br/>
        Total: {notifications.length}<br/>
        Unread: {unreadNotifications.length}<br/>
        Read: {readNotifications.length}
      </div>
    </div>
  );
};

// Exemple de page avec Redux
export const NotificationsPage: React.FC = () => {
  // Récupérer l'ID utilisateur depuis le store Redux
  const { userId } = useSelector((state: any) => state.user?.currentUser) || { userId: null };
  
  // Si pas d'utilisateur connecté, afficher un message
  if (!userId) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>My Notifications</h1>
        <p>Please log in to view your notifications.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>My Notifications</h1>
      <NotificationComponent userId={userId} />
    </div>
  );
};

// Hook personnalisé combiné pour plus de simplicité
export const useNotificationsWithRedux = (userId?: number) => {
  const { isConnected, markAsRead } = useNotifications(userId || 0);
  
  // Selectors Redux
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const unreadNotifications = useSelector(selectUnreadNotifications);
  const dispatch = useDispatch();

  return {
    // État de connexion
    isConnected,
    
    // État des notifications (Redux)
    notifications,
    unreadCount,
    unreadNotifications,
    
    // Actions
    markAsRead,
    markAllAsRead: () => dispatch(markAllNotificationsAsRead()),
    clearAll: () => dispatch(clearNotifications()),
    
    // Utilitaires
    hasUnread: unreadCount > 0,
  };
};
