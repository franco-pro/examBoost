export type Pack = {
  id: string;
  title: string; // maps SQL `name`
  description: string; // maps SQL `description`
  coverUrl?: string;
  price?: number;
  oldPrice?: number;
  discountPct?: number;
  isSubscribed?: boolean;
  progressPct?: number; // 0..100 if subscribed
  level?: string; // e.g., "Seconde", "Première", "Terminale"
  tags?: string[];
  rating?: number; // 0..5
  modulesCount?: number;
  estimatedTimeMin?: number;
  // new fields from SQL table
  durationDays?: number; // maps SQL `durationDays`
  isActive?: boolean; // maps SQL `isActive` (1/0)
  createdAt?: string; // maps SQL `created_at`
  updatedAt?: string; // maps SQL `updated_at`
  isFeatured?: boolean;
  // niveau pour filtrer les documents associés
  niveauID?: number; // maps documents.niveauID
};
