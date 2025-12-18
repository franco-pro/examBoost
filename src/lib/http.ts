import { API_URL } from '@/src/config/env';
import axios from 'axios';

export const http = axios.create({
  baseURL: API_URL || '/',
});

export const getHttpErrorMessage = (e: any): string => {
  const msg = e?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join(', ');
  if (typeof msg === 'string' && msg.trim()) return msg;
  if (typeof e?.message === 'string' && e.message.trim()) return e.message;
  return 'Erreur réseau';
};
