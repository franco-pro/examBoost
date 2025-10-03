import type { Notification } from './types';

let store: Notification[] = [
  {
    id: 'n1',
    title: 'Bienvenue sur ExamBoost',
    body: 'Découvrez vos packs et commencez à vous entraîner dès maintenant.',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'n2',
    title: 'Avertissment !',
    body: 'Votre pack expire dans 5 jours. Veuiller renouveler votre abonnement et profier d\'une reduction de 5%. Le succès est à portée de main de ceux qui se donnent les moyens ',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'n3',
    title: 'Pack Premium activé',
    body: 'Votre abonnement a été activé avec succès. Bonne révision!',
    type: 'success',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'n4',
    title: 'Nouvelle compétition',
    body: 'Une nouvelle compétition est disponible cette semaine.',
    type: 'warning',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    link: 'https://exam-boost.example/competitions/weekly',
  },
];

export async function listNotifications(userID?: number): Promise<Notification[]> {
  // In real API we would use userID to filter. Here we return all.
  await delay(200);
  // Return newest first
  return [...store].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function deleteNotification(id: string): Promise<void> {
  await delay(150);
  store = store.filter((n) => n.id !== id);
}

export async function clearNotifications(): Promise<void> {
  await delay(250);
  store = [];
}

export async function markRead(id: string, read: boolean): Promise<void> {
  await delay(120);
  store = store.map((n) => (n.id === id ? { ...n, read } : n));
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
