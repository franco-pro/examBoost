export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: number;
  title: string;
  text: string;
  type: 'INVITATION' | 'ADMIN_ALERT' | 'SYSTEM' | 'INVITATION_ACCEPTED' | 'INVITATION_DECLINED' | 'COMPETITION_START';
  isRead: boolean;
  senderID?: number;
  receiverID: number;
  created_at: Date;
  competionID: number;
  link?: string;
}
