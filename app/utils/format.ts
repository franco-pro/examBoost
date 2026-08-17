export function formatPriceXOF(price?: number): string {
  if (price == null) return '';
  if (price === 0) return 'Gratuit';
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${price} U`;
  }
}

export function formatDays(days?: number | null): string {
  if (days == null) return '—';
  if (days <= 0) return 'Sans limite';
  return `${days} jour${days > 1 ? 's' : ''}`;
}

export function isNewSince(createdAt?: string, withinDays = 14): boolean {
  if (!createdAt) return false;
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return false;
  const now = Date.now();
  const diffDays = (now - created) / (1000 * 60 * 60 * 24);
  return diffDays <= withinDays;
}
