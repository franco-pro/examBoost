export const API_URL = 'http://192.168.1.112:3000';

export const toAbsoluteUrl = (u: string): string => {
  const base = API_URL;
  if (!u) return u;
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  if (!base) return u;
  if (u.startsWith('/')) return `${base}${u}`;
  return `${base}/${u}`;
};
