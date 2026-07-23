import apiClient from '@/app/api/apiClient';

import type { Notification, NotificationType } from './types';

type BackendNotificationType =
  | 'INVITATION'
  | 'ADMIN_ALERT'
  | 'INVITATION_ACCEPTED'
  | 'WALLET_TOP_UP'
  | 'COMPETITION_START';

type BackendNotification = {
  id: number;
  title: string;
  text: string;
  type: BackendNotificationType;
  isRead: boolean;
  competionID?: number | null;
  senderID: number;
  receiverID: number;
  created_at: string;
  updated_at: string;
};

const mapType = (t: BackendNotificationType): NotificationType => {
  switch (t) {
    case 'INVITATION':
    case 'COMPETITION_START':
      return 'warning';
    case 'INVITATION_ACCEPTED':
    case 'WALLET_TOP_UP':
      return 'success';
    case 'ADMIN_ALERT':
      return 'info';
    default:
      return 'info';
  }
};

const toUi = (n: BackendNotification): Notification => {
  return {
    id: String(n.id),
    title: n.title,
    body: n.text,
    type: mapType(n.type),
    read: !!n.isRead,
    createdAt: n.created_at,
  };
};

export async function listNotifications(userID?: number): Promise<Notification[]> {
  const res = await apiClient.get<BackendNotification[]>('/notifications');
  const list = Array.isArray(res.data) ? res.data : [];

  const filtered = typeof userID === 'number' ? list.filter((n) => n.receiverID === userID) : list;

  filtered.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));

  return filtered.map(toUi);
}

export async function markRead(id: string): Promise<void> {
  const n = Number(id);
  const safeId = Number.isFinite(n) ? String(n) : id;
  await apiClient.patch(`/notifications/${encodeURIComponent(safeId)}`);
}

function shouldIgnoreDeleteError(err: any): boolean {
  const status = err?.response?.status;
  return status === 404 || status === 405 || status === 501;
}

export async function deleteNotification(idNotif: string): Promise<void> {
  try {
    await apiClient.delete(`/notifications/${encodeURIComponent(idNotif)}`);
  } catch (err) {
    if (shouldIgnoreDeleteError(err)) return;
    throw err;
  }
}

export async function deleteNotifications(ids: string[]): Promise<void> {
  try {
    await apiClient.post('/notifications/delete-many', {
      ids: ids.map((id) => Number(id)),
    });
  } catch (err) {
    if (shouldIgnoreDeleteError(err)) return;
    throw err;
  }
}
