import { http } from '@/app/lib/http';
import type { User } from './types';
import apiClient from '@/app/api/apiClient';

export type WebFile = File;
export type RNFile = { uri: string; name: string; type: string };

export async function getUserByIdHttp(userID: number): Promise<User> {
  const res = await apiClient(`/users/${userID}`);
  return res.data as User;
}

export async function updateUserHttp(userData: Partial<User> & { id: number }): Promise<User> {
  const res = await http.put('/users', userData);
  return res.data as User;
}

export async function uploadUserImageHttp(params: { userID: number; file: WebFile | RNFile }): Promise<{ done: boolean; imgUrl: string }> {
  const form = new FormData();
  form.append('file', params.file as any);
  const res = await http.put(`/users/user-img/${params.userID}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data as { done: boolean; imgUrl: string };
}

export async function deleteUserImageHttp(params: { userID: number }): Promise<{ done: boolean }> {
  const res = await http.delete(`/users/user-img/${params.userID}`);
  return res.data as { done: boolean };
}

export type ChangePasswordPayload = {
  password: string;
  newPassword: string;
};

export async function changePasswordHttp(payload: ChangePasswordPayload): Promise<{ done: boolean }> {
  const res = await apiClient.put('/users/change-password', payload);
  return res.data as { done: boolean };
}

export async function deleteUserHttp(params: { userID: number }): Promise<{ done: boolean; userID: number }> {
  const res = await http.delete(`/users/${params.userID}`);
  return res.data as { done: boolean; userID: number };
}
