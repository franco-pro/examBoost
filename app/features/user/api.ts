import type { User } from './types';

const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

function apiUrl(path: string) {
  const base = (process.env.EXPO_PUBLIC_API_URL ?? '').trim().replace(/\/$/, '');
  if (!base) return path; // fallback chemin relatif si non configuré
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function getUsers(): Promise<User[]> {
  try {
    const res = await fetch(apiUrl('/users'), { method: 'GET' });
    if (!res.ok) throw new Error(`Chargement des utilisateurs échoué (${res.status})`);
    const data = await res.json();
    // L’API renvoie { data: [...] }
    return (data?.data ?? []) as User[];
  } catch {
    // Fallback offline/mock minimal pour déverrouiller l'UI de profil
    console.warn('[user.api] getUsers fallback (offline/mock)');
    const mock: User[] = [
      {
        id: 42,
        username: 'Essoh',
        surname: 'Ghislain',
        email: 'eeg@gmail.com',
        wallet: 15000,
        role: 'user',
        phone: '657885581',
        imgUrl: null,
        isActivated: 0,
        niveauID: 3,
        created_at: '',
        updated_at: '',
      },
    ];
    return mock;
  }
}

export async function getUserById(userID: number): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.id === userID);
}

export async function updateUser(payload: { transactionID: number; user: User }): Promise<{ userID: number; user: User; done: boolean }> {
  const base = (process.env.EXPO_PUBLIC_API_URL ?? '').trim();
  // Mode frontend-only: mock la MAJ et renvoie l'utilisateur modifié
  if (!base) {
    return Promise.resolve({ userID: payload.user.id, user: payload.user, done: true });
  }

  const endpoint = apiUrl('/users');
  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let details = '';
    try { details = await res.text(); } catch {}
    throw new Error(`Mise à jour échouée (${res.status}) vers ${endpoint}${details ? `: ${details}` : ''}`);
  }
  return res.json();
}

type WebFile = File;
type RNFile = { uri: string; name: string; type: string };

export async function uploadUserImage(params: { userID: number; file: WebFile | RNFile }): Promise<{ done: boolean; imgUrl: string }> {
  const base = (process.env.EXPO_PUBLIC_API_URL ?? '').trim();
  // Mode frontend-only: pas de backend => on mock le succès et on retourne une URL locale
  if (!base) {
    try {
      let imgUrl = '';
      // Web: File => URL.createObjectURL
      if (typeof window !== 'undefined' && 'File' in window && (params.file as any) instanceof File) {
        // @ts-ignore
        imgUrl = URL.createObjectURL(params.file as File);
      } else {
        // Natif: on réutilise l'URI local
        imgUrl = (params.file as RNFile).uri;
      }
      return Promise.resolve({ done: true, imgUrl });
    } catch {
      throw new Error('Upload mock échoué en mode frontend-only');
    }
  }

  const form = new FormData();
  // @ts-ignore - RNFile est accepté par FormData côté natif
  form.append('file', params.file);
  const endpoint = apiUrl(`/users/user-img/${params.userID}`);
  const res = await fetch(endpoint, { method: 'PUT', body: form });
  if (!res.ok) {
    let details = '';
    try { details = await res.text(); } catch {}
    throw new Error(`Upload échoué (${res.status}) vers ${endpoint}${details ? `: ${details}` : ''}`);
  }
  return res.json();
}

export async function deleteUserImage(params: { userID: number }): Promise<{ done: boolean }> {
  const base = (process.env.EXPO_PUBLIC_API_URL ?? '').trim();
  if (!base) {
    return Promise.resolve({ done: true });
  }
  const endpoint = apiUrl(`/users/user-img/${params.userID}`);
  const res = await fetch(endpoint, { method: 'DELETE' });
  if (!res.ok) {
    let details = '';
    try { details = await res.text(); } catch {}
    throw new Error(`Suppression d'image échouée (${res.status}) vers ${endpoint}${details ? `: ${details}` : ''}`);
  }
  return res.json();
}

export async function deleteUser(params: { userID: number }): Promise<{ done: boolean; userID: number }> {
  const base = (process.env.EXPO_PUBLIC_API_URL ?? '').trim();
  if (!base) {
    return Promise.resolve({ done: true, userID: params.userID });
  }
  const endpoint = apiUrl(`/users/${params.userID}`);
  const res = await fetch(endpoint, { method: 'DELETE' });
  if (!res.ok) {
    let details = '';
    try { details = await res.text(); } catch {}
    throw new Error(`Suppression utilisateur échouée (${res.status}) vers ${endpoint}${details ? `: ${details}` : ''}`);
  }
  return res.json();
}
