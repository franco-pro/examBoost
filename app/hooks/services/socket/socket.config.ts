import { socketUrl } from "@/app/api/apiClient";

// 🎯 Configuration centralisée pour les URLs WebSocket
export const WEBSOCKET_CONFIG = {
  // URL de base du backend WebSocket
  BASE_URL:`${socketUrl}`,

  // Namespaces disponibles
  NAMESPACES: {
    ROOMS: "/rooms",
    NOTIFICATIONS: "/notification",
  },

  // Options de connexion par défaut
  DEFAULT_OPTIONS: {
    transports: ["polling", "websocket"],
    timeout: 20000,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000
  },

  // Événements disponibles
  EVENTS: {
    // Rooms
    ROOM_JOIN: "room-joined",
    ROOM_LEAVE: "room-left",
    ROOM_CLOSED: "room-closed",
    USER_JOINED: "user-joined",
    USER_LEFT: "user-left",
    COMPETITION_START: "competition-started",
    COMPETITION_END: "competition-ended",
    NEW_QUESTION: "new-question",
    QUESTION_ANSWERED: "question-answered",

    // Notifications
    NOTIFICATION_NEW: "notification-new",
    NOTIFICATION_READ: "notification-read",

    // Généraux
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    ERROR: "error",
  },

  // Configuration par environnement
  getBaseUrl: () => {
    // Pour le développement
    if (__DEV__) {
      return WEBSOCKET_CONFIG.BASE_URL;
    }

    // Pour la production
    return process.env.EXPO_PUBLIC_WS_URL || WEBSOCKET_CONFIG.BASE_URL;
  },

  // URL complète pour un namespace
  getNamespaceUrl: (namespace: string) => {
    return `${WEBSOCKET_CONFIG.getBaseUrl()}${namespace}`;
  },
} as const;
