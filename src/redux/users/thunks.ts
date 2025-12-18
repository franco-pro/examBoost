import type { User } from '@/src/features/user/types';
import { http } from '@/src/lib/http';

export const fetchUsers = async (): Promise<User[]> => {
  const res = await http.get('/users');
  return (res.data?.data ?? []) as User[];
};

export const fetchUserById = async (userID: number): Promise<User> => {
  const res = await http.get(`/users/${userID}`);
  return res.data as User;
};

export const updateUserHttp = async (userData: User): Promise<User> => {
  try {
    const { id, ...updates } = userData;
    console.log('Envoi de la requête de mise à jour:', { id, ...updates });
    const res = await http.put('/users', { id, ...updates });
    console.log('Réponse du serveur:', res.data);
    
    if (!res.data) {
      throw new Error('Aucune donnée reçue du serveur');
    }
    
    return res.data;
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    if (error.response) {
      // Le serveur a répondu avec un statut d'erreur
      console.error('Détails de l\'erreur:', error.response.data);
      throw new Error(error.response.data.message || 'Échec de la mise à jour du profil');
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      throw new Error('Aucune réponse du serveur. Vérifiez votre connexion.');
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      throw new Error('Erreur lors de la configuration de la requête');
    }
  }
};

export type ChangePasswordPayload = {
  userID: number;
  oldPassword: string;
  newPassword: string;
};

export const changePasswordHttp = async (payload: ChangePasswordPayload): Promise<{ done: boolean }> => {
  try {
    const res = await http.put('/users/change-password', payload);
    if (!res.data) {
      throw new Error('Aucune donnée reçue du serveur');
    }
    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Échec de la mise à jour du mot de passe');
    }
    if (error.request) {
      throw new Error('Aucune réponse du serveur. Vérifiez votre connexion.');
    }
    throw new Error('Erreur lors de la configuration de la requête');
  }
};

export type WebFile = File;
export type RNFile = { uri: string; name: string; type: string };

export const uploadUserImageHttp = async (params: { userID: number; file: WebFile | RNFile }): Promise<{ done: boolean; imgUrl: string }> => {
  const form = new FormData();
  form.append('file', params.file as any);
  const res = await http.put(`/users/user-img/${params.userID}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
};

export const deleteUserImageHttp = async (params: { userID: number }): Promise<{ done: boolean }> => {
  const res = await http.delete(`/users/user-img/${params.userID}`);
  return res.data;
};

export const deleteUserHttp = async (params: { userID: number }): Promise<{ done: boolean; userID: number }> => {
  const res = await http.delete(`/users/${params.userID}`);
  return res.data;
};
