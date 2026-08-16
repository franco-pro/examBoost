export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: number;
  title: string;
  text: string;
  type: 'INVITATION' | 'ADMIN_ALERT' | 'SYSTEM' | 'INVITATION_ACCEPTED' | 'INVITATION_DECLINED' | 'COMPETITION_START' | 'COMPETITION_CREATED';
  isRead: boolean;
  senderID?: number;
  receiverID: number;
  created_at: Date;
  competionID: number;
  link?: string;
}

export function isEphemeralNotification(notification: Pick<Notification, 'id' | 'competionID'>): boolean {
  return notification.id?.toString() === `0${notification.competionID}`;
}