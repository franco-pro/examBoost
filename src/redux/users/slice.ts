import type { User } from '@/src/features/user/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ChangePasswordPayload } from './thunks';
import { changePasswordHttp, deleteUserHttp, deleteUserImageHttp, fetchUserById, fetchUsers, updateUserHttp, uploadUserImageHttp } from './thunks';

export type UsersState = {
  byId: Record<number, User>;
  ids: number[];
  loading: boolean;
  error?: string | null;
  updating: boolean;
  uploading: boolean;
  deletingImage: boolean;
  changingPassword: boolean;
};

const initialState: UsersState = {
  byId: {},
  ids: [],
  loading: false,
  error: null,
  updating: false,
  uploading: false,
  deletingImage: false,
  changingPassword: false,
};

export const loadUsers = createAsyncThunk('users/loadUsers', async () => {
  return await fetchUsers();
});

export const loadUserById = createAsyncThunk('users/loadUserById', async (userID: number) => {
  return await fetchUserById(userID);
});

export const updateUser = createAsyncThunk('users/updateUser', async (userData: User) => {
  return await updateUserHttp(userData);
});

export const changePassword = createAsyncThunk('users/changePassword', async (payload: ChangePasswordPayload) => {
  return await changePasswordHttp(payload);
});

export const uploadUserImage = createAsyncThunk('users/uploadUserImage', async (params: { userID: number; file: any }) => {
  return await uploadUserImageHttp(params);
});

export const deleteUserImage = createAsyncThunk('users/deleteUserImage', async (params: { userID: number }) => {
  return await deleteUserImageHttp(params);
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (params: { userID: number }) => {
  return await deleteUserHttp(params);
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state: UsersState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUsers.fulfilled, (state: UsersState, action: PayloadAction<User[]>) => {
        state.loading = false;
        const users = action.payload;
        state.byId = {};
        state.ids = [];
        for (const u of users) {
          state.byId[u.id] = u;
          state.ids.push(u.id);
        }
      })
      .addCase(loadUsers.rejected, (state: UsersState, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur chargement utilisateurs';
      })
      .addCase(loadUserById.pending, (state: UsersState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUserById.fulfilled, (state: UsersState, action: PayloadAction<User>) => {
        state.loading = false;
        const u = action.payload;
        state.byId[u.id] = u;
        if (!state.ids.includes(u.id)) state.ids.push(u.id);
      })
      .addCase(loadUserById.rejected, (state: UsersState, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur chargement utilisateur';
      })
      .addCase(updateUser.pending, (state: UsersState) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state: UsersState, action: PayloadAction<User>) => {
        const updatedUser = action.payload;
        state.byId[updatedUser.id] = updatedUser;
        state.updating = false;
        if (!state.ids.includes(updatedUser.id)) state.ids.push(updatedUser.id);
      })
      .addCase(updateUser.rejected, (state: UsersState, action) => {
        state.updating = false;
        state.error = action.error.message || 'Erreur mise à jour utilisateur';
      })
      .addCase(changePassword.pending, (state: UsersState) => {
        state.changingPassword = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state: UsersState) => {
        state.changingPassword = false;
      })
      .addCase(changePassword.rejected, (state: UsersState, action) => {
        state.changingPassword = false;
        state.error = action.error.message || 'Erreur mise à jour mot de passe';
      })
      .addCase(uploadUserImage.pending, (state: UsersState) => {
        state.uploading = true;
      })
      .addCase(uploadUserImage.fulfilled, (state: UsersState, action: PayloadAction<{ done: boolean; imgUrl: string }>) => {
        state.uploading = false;
        // NOTE: l'état serveur (user) sera migré vers React Query. Pour l'instant,
        // l'écran profil rafraîchit ses données après mutation.
      })
      .addCase(uploadUserImage.rejected, (state: UsersState, action) => {
        state.uploading = false;
        state.error = action.error.message || 'Erreur upload image';
      })
      .addCase(deleteUserImage.pending, (state: UsersState) => {
        state.deletingImage = true;
      })
      .addCase(deleteUserImage.fulfilled, (state: UsersState) => {
        state.deletingImage = false;
        // NOTE: l'état serveur (user) sera migré vers React Query.
      })
      .addCase(deleteUserImage.rejected, (state: UsersState, action) => {
        state.deletingImage = false;
        state.error = action.error.message || 'Erreur suppression image';
      })
      .addCase(deleteUser.fulfilled, (state: UsersState, action: PayloadAction<{ done: boolean; userID: number }>) => {
        const id = action.payload.userID;
        delete state.byId[id];
        state.ids = state.ids.filter((x: number) => x !== id);
      });
  },
});
export default usersSlice.reducer;
