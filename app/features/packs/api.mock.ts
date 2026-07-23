import type { Pack } from './types';

// Modélisation d'une ligne renvoyée par l'API (selon le schéma SQL partagé)
export type BackendPackRow = {
  id: number;
  name: string;
  price: number;
  description: string;
  duration: number | null;
  durationDays: number;
  isActive: 0 | 1 | boolean; // MySQL tinyint(1) peut arriver sous forme 0/1
  created_at: string; // datetime
  updated_at: string; // datetime
};

// Données mock inspirées de votre SQL
let store: BackendPackRow[] = [
  {
    id: 1,
    name: 'pack standard',
    price: 1500,
    description: 'ras',
    duration: 30,
    durationDays: 30,
    isActive: 1,
    created_at: '2025-09-19 13:28:11',
    updated_at: '2025-09-19 16:38:57',
  },
  {
    id: 2,
    name: 'prenium',
    price: 2000,
    description: 'ras',
    duration: null,
    durationDays: 30,
    isActive: 1,
    created_at: '2025-09-19 17:05:21',
    updated_at: '2025-09-19 17:05:21',
  },
];

// Normalisation backend -> UI `Pack`
function toPack(row: BackendPackRow): Pack {
  return {
    id: String(row.id),
    title: row.name,
    description: row.description,
    price: row.price,
    // Champs optionnels UI non présents en base: on les laisse undefined ou on met des valeurs par défaut
    discountPct: undefined,
    oldPrice: undefined,
    isSubscribed: false,
    progressPct: undefined,
    level: undefined,
    tags: undefined,
    rating: undefined,
    modulesCount: undefined,
    estimatedTimeMin: row.duration ?? undefined,
    isFeatured: undefined,
  };
}

export async function listPacks(search?: string): Promise<Pack[]> {
  await delay(220);
  let rows = [...store];
  // Tri récent d'abord par updated_at
  rows.sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at));
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    rows = rows.filter(
      (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    );
  }
  return rows.map(toPack);
}

export async function getPack(id: string): Promise<Pack | undefined> {
  await delay(160);
  const row = store.find((r) => String(r.id) === id);
  return row ? toPack(row) : undefined;
}

export async function upsertPack(payload: Partial<BackendPackRow> & { id?: number }): Promise<Pack> {
  await delay(180);
  if (payload.id == null) {
    const nextId = (store.at(-1)?.id ?? 0) + 1;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const row: BackendPackRow = {
      id: nextId,
      name: payload.name ?? 'Nouveau pack',
      price: payload.price ?? 0,
      description: payload.description ?? '',
      duration: payload.duration ?? null,
      durationDays: payload.durationDays ?? 30,
      isActive: (payload.isActive as any) ?? 1,
      created_at: now,
      updated_at: now,
    };
    store.push(row);
    return toPack(row);
  } else {
    const idx = store.findIndex((r) => r.id === payload.id);
    if (idx === -1) throw new Error('Pack introuvable');
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updated: BackendPackRow = {
      ...store[idx],
      ...payload,
      updated_at: now,
    } as BackendPackRow;
    store[idx] = updated;
    return toPack(updated);
  }
}

export async function removePack(id: string): Promise<void> {
  await delay(140);
  store = store.filter((r) => String(r.id) !== id);
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
