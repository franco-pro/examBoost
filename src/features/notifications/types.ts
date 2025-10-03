export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string; // frontend id (uuid) or backend id stringified
  title: string;
  body: string;
  type: NotificationType;
  read: boolean;
  createdAt: string; // ISO date string
  link?: string;
}
