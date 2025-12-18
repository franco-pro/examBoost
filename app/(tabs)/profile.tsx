import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import { useDeleteUserImageMutation, useUpdateUserMutation, useUploadUserImageMutation, useUserQuery } from '@/src/features/user/hooks.rq';
import { setCurrentUserId } from '@/src/redux/session/slice';
import type { RootState } from '@/src/redux/store';
import { rateApp } from '@/src/utils/rateApp';
import { shareApp } from '@/src/utils/shareApp';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Linking, Platform, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const CURRENT_USER_ID = 42;

export default function ProfileScreen() {
  const router = useRouter();
  const toast = useToast();
  const dispatch = useDispatch();
  const currentUserId = useSelector((s: RootState) => s.session.currentUserId ?? CURRENT_USER_ID);

  const userQuery = useUserQuery(currentUserId);
  const user = userQuery.data;
  const loading = userQuery.isLoading;
  const error = (userQuery.error as any)?.message as string | undefined;

  const updateUserMutation = useUpdateUserMutation();
  const uploadUserImageMutation = useUploadUserImageMutation();
  const deleteUserImageMutation = useDeleteUserImageMutation();
  const updating = updateUserMutation.isPending;

  const [username, setUsername] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [editing, setEditing] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const phoneValid = useMemo(() => /^\d{9}$/.test(phone.trim()), [phone]);
  const usernameValid = useMemo(() => username.trim().length >= 2 && username.trim().length <= 50, [username]);
  const surnameValid = useMemo(() => surname.trim().length >= 2 && surname.trim().length <= 50, [surname]);
  const formValid = usernameValid && surnameValid && phoneValid;

  const avatarUri = useMemo(() => {
    if (!user?.imgUrl) return null;

    const base = (process.env.EXPO_PUBLIC_API_URL ?? '').trim().replace(/\/$/, '');
    let uri = user.imgUrl;

    // Si l'API renvoie un chemin relatif (/uploads/...), on le transforme en URL absolue
    if (!/^https?:\/\//i.test(uri) && base) {
      uri = uri.startsWith('/') ? `${base}${uri}` : `${base}/${uri}`;
    }

    if (avatarVersion) {
      const sep = uri.includes('?') ? '&' : '?';
      uri = `${uri}${sep}v=${avatarVersion}`;
    }

    return uri;
  }, [user?.imgUrl, avatarVersion]);

  useEffect(() => {
    dispatch(setCurrentUserId(CURRENT_USER_ID));
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setUsername(user.username ?? '');
      setSurname(user.surname ?? '');
      setPhone(user.phone ?? '');
    }
  }, [user]);

  const show = useCallback(
    (action: 'success' | 'error' | 'info' | 'warning' | 'muted', title: string, desc?: string) =>
      toast.show({
        placement: 'top',
        duration: 2000,
        render: () => (
          <Toast action={action} variant="solid" className="mx-3">
            <ToastTitle bold>{title}</ToastTitle>
            {desc ? <ToastDescription>{desc}</ToastDescription> : null}
          </Toast>
        ),
      }),
    [toast]
  );

  const onSave = useCallback(async () => {
    if (!user || !formValid) return;
    
    // Créer un objet avec les nouvelles valeurs
    const updatedUser = {
      ...user,
      username: username.trim(),
      surname: surname.trim(),
      phone: phone.trim()
    };
    
    // Vérifier s'il y a des changements
    const hasChanges = 
      updatedUser.username !== user.username ||
      updatedUser.surname !== user.surname ||
      updatedUser.phone !== user.phone;
    
    if (!hasChanges) {
      show('info', 'Aucune modification détectée');
      return;
    }
    
    try {
      await Haptics.selectionAsync();
      
      // Créer un objet avec uniquement les champs nécessaires pour la mise à jour
      const updateData: Partial<typeof user> & { id: number } = {
        id: user.id
      };
      
      if (updatedUser.username !== user.username) updateData.username = updatedUser.username;
      if (updatedUser.surname !== user.surname) updateData.surname = updatedUser.surname;
      if (updatedUser.phone !== user.phone) updateData.phone = updatedUser.phone;
      
      await updateUserMutation.mutateAsync(updateData as any);
      show('success', 'Mise à jour réussie');

    } catch (e: any) {
      show('error', 'Échec de la mise à jour', e?.message || 'Réessayez plus tard');
    }
  }, [user, formValid, username, surname, phone, show, updateUserMutation]);

  const onPickImage = useCallback(async () => {
    if (!user) return;
    if (Platform.OS === 'web') {
      fileInputRef.current?.click();
      return;
    }

    try {
      // Import dynamique pour éviter d'imposer la dépendance côté web
      const ImagePicker = await import('expo-image-picker');
      // Demander la permission
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm.status !== 'granted') {
        show('warning', "Permission refusée", "Activez l'accès aux photos");
        return;
      }
      // Ouvrir la galerie
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
        allowsEditing: true,
        exif: false,
      });
      // Nouveaux SDK: canceled/ assets
      // @ts-ignore - compat ancien/nouveau types
      if (result.canceled) return;
      // @ts-ignore
      const asset = (result.assets && result.assets[0]) || result;
      const uri: string = asset.uri;

      // Vérifier la taille (~2 Mo)
      try {
        const FileSystem = await import('expo-file-system');
        const info = await FileSystem.getInfoAsync(uri);
        // @ts-ignore
        const size = (info as any)?.size ?? asset.fileSize ?? 0;
        if (size && size > 2 * 1024 * 1024) {
          show('error', 'Fichier trop volumineux', 'Taille max: 2 Mo');
          return;
        }
      } catch {
        // si indisponible, on continue sans blocage
      }

      await Haptics.selectionAsync();
      const name = uri.split('/').pop() || `avatar_${user.id}.jpg`;
      const ext = (name.split('.').pop() || '').toLowerCase();
      const type = ext === 'png' ? 'image/png' : 'image/jpeg';
      const rnFile = { uri, name, type } as { uri: string; name: string; type: string };
      await uploadUserImageMutation.mutateAsync({ userID: user.id, file: rnFile });
      setAvatarVersion(Date.now());
      show('success', 'Photo mise à jour');
    } catch (_e) {
      show('warning', 'Upload non disponible', "Ajoutez 'expo-image-picker' pour activer l'upload natif");
    }
  }, [user, show, uploadUserImageMutation]);

  const onFileSelected = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !user) return;
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        show('error', 'Format invalide', 'Formats acceptés: jpg/png');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        show('error', 'Fichier trop volumineux', 'Taille max: 2 Mo');
        return;
      }
      await Haptics.selectionAsync();
      try {
        await uploadUserImageMutation.mutateAsync({ userID: user.id, file });
        show('success', 'Photo mise à jour');
      } catch (err: any) {
        show('error', "Échec de l'upload", err?.message || undefined);
      }
      // reset input
      if (fileInputRef.current) fileInputRef.current.value = '' as any;
    },
    [user, show, uploadUserImageMutation]
  );

  const onRemoveImage = useCallback(async () => {
    if (!user) return;
    await Haptics.selectionAsync();
    try {
      await deleteUserImageMutation.mutateAsync({ userID: user.id });
      setAvatarVersion(Date.now());
      show('success', 'Photo supprimée');
    } catch (e: any) {
      show('error', 'Échec de la suppression', e?.message || undefined);
    }
  }, [user, show, deleteUserImageMutation]);

  // Actions pied de page
  const onOpenSettings = useCallback(async () => {
    await Haptics.selectionAsync();
    // Navigue vers l'écran Paramètres
    router.push('/settings' as any);
  }, [router]);

  const onRateApp = useCallback(async () => {
    await Haptics.selectionAsync();
    const ok = await rateApp();
    if (ok) {
      show('success', 'Merci pour votre avis !');
    } else {
      show('warning', "Impossible d'ouvrir la page de notation");
    }
  }, [show]);

  const onSupport = useCallback(async () => {
    await Haptics.selectionAsync();
    const mailto = 'mailto:support@example.com?subject=Assistance%20ExamBoost';
    Linking.openURL(mailto);
  }, []);

  const onShareApp = useCallback(async () => {
    await Haptics.selectionAsync();
    const ok = await shareApp();
    if (ok) {
      show('success', 'Merci pour le partage !');
    } else {
      show('warning', "Le partage n'a pas pu être ouvert");
    }
  }, [show]);

  const onLogout = useCallback(async () => {
    await Haptics.selectionAsync();
    // TODO: brancher la vraie déconnexion (clear tokens, reset state, redirection)
    show('success', 'Déconnecté');
    // router.replace('/login') éventuel
  }, [show]);

  const onDeposit = useCallback(async () => {
    await Haptics.selectionAsync();
    // TODO: brancher le flux de dépôt (montant, moyen de paiement, confirmation)
    show('info', 'Dépôt', 'Fonctionnalité bientôt disponible');
  }, [show]);

  if (loading && !user) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
        <Text className="text-typography-gray">Chargement du profil…</Text>
      </View>
    );
  }

  if (error && !user) {
    return (
      <View className="flex-1 bg-background-light dark:bg-background-dark">
        <View className="h-40 bg-gradient-to-b from-[#181c5c] to-[rgba(24,28,92,0.75)]" />
        <View className="-mt-10 mx-4 p-4 rounded-2xl bg-white dark:bg-outline-900 border border-outline-100 dark:border-outline-800 shadow-sm">
          <Text className="text-typography-default dark:text-typography-white">Impossible de charger le profil.</Text>
          <Pressable onPress={() => userQuery.refetch()} className="mt-3 self-start px-4 py-2 rounded-md bg-primary-defaultOrange">
            <Text className="text-primary-defaultBlue font-extrabold">Réessayer</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Fallback de sécurité: si user n'est pas encore disponible et pas d'erreur explicite,
  // on affiche un état de chargement pour éviter d'accéder à des champs de user undefined.
  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
        <Text className="text-typography-gray">Chargement du profil…</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Top bar: flèche retour (gauche) + icône modifier (droite) */}
      <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} accessibilityLabel="Retour">
          <Ionicons name="arrow-back" size={22} color="#181c5c" />
        </Pressable>
        <Text className="text-lg font-extrabold text-typography-default dark:text-typography-white">Mon profil</Text>
        <Pressable onPress={() => setEditing((e) => !e)} accessibilityLabel="Modifier">
          <Ionicons name={editing ? 'checkmark' : 'pencil'} size={22} color="#181c5c" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={userQuery.isRefetching} onRefresh={() => void userQuery.refetch()} />
        }
      >
        {/* Avatar + Nom */}
        <View className="items-center mt-2">
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={{ width: 96, height: 96, borderRadius: 9999 }} />
          ) : (
            <View className="items-center justify-center" style={{ width: 96, height: 96, borderRadius: 9999, backgroundColor: 'rgba(24,28,92,0.12)' }}>
              <Text className="text-xl text-typography-default dark:text-typography-white">{(user.username?.[0] ?? 'U').toUpperCase()}</Text>
            </View>
          )}
          <Text className="mt-2 text-lg font-extrabold text-typography-default dark:text-typography-white text-center">
            {`${user.username ?? ''} ${user.surname ?? ''}`.trim() || user.username || 'Utilisateur'}
          </Text>

          {/* Changer/Supprimer photo */}
          <View className="mt-2 flex-row items-center gap-2">
            <Pressable onPress={async () => { await Haptics.selectionAsync(); onPickImage(); }} className="px-3 py-1.5 rounded-md bg-primary-defaultOrange active:opacity-90">
              <Text className="text-primary-defaultBlue font-extrabold">Changer</Text>
            </Pressable>
            {user.imgUrl ? (
              <Pressable onPress={async () => { await Haptics.selectionAsync(); onRemoveImage(); }} className="px-3 py-1.5 rounded-md bg-outline-100 dark:bg-outline-800 active:opacity-90">
                <Text className="text-typography-default dark:text-typography-white">Supprimer</Text>
              </Pressable>
            ) : null}
          </View>
          {Platform.OS === 'web' ? (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={onFileSelected}
            />
          ) : null}
        </View>

        {/* Trois grilles: Solde FCFA, Rôle, État */}
        <View className="mt-4 px-4 flex-row gap-3">
          <View className="flex-1 rounded-xl border border-outline-100 dark:border-outline-800 bg-white dark:bg-outline-900 p-3 items-center shadow-sm relative">
            <Pressable onPress={onDeposit} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-success-500 items-center justify-center active:opacity-90" accessibilityLabel="Faire un dépôt">
              <Ionicons name="add" size={16} color="#ffffff" />
            </Pressable>
            <Text className="text-xxs text-typography-gray">Solde</Text>
            <Text className="text-base font-extrabold text-typography-default dark:text-typography-white">{(user.wallet ?? 0).toFixed(0)} FCFA</Text>
          </View>
          <View className="flex-1 rounded-xl border border-outline-100 dark:border-outline-800 bg-white dark:bg-outline-900 p-3 items-center shadow-sm">
            <Text className="text-xxs text-typography-gray">Rôle</Text>
            <Text className="text-base font-extrabold text-typography-default dark:text-typography-white">{user.role}</Text>
          </View>
          <View className="flex-1 rounded-xl border border-outline-100 dark:border-outline-800 bg-white dark:bg-outline-900 p-3 items-center shadow-sm">
            <Text className="text-xxs text-typography-gray">État</Text>
            <Text className="text-base font-extrabold text-typography-default dark:text-typography-white">{user.isActivated ? 'Activé' : 'Non activé'}</Text>
          </View>
        </View>

        {/* Informations générales ou édition */}
        <View className="px-4 mt-4 gap-3">
          {!editing && (
            <View className="rounded-2xl border border-outline-100 dark:border-outline-800 bg-white dark:bg-outline-900 p-3 gap-2 shadow-sm">
              <InfoRow icon="mail" label="Email" value={user.email} onPress={() => Linking.openURL(`mailto:${user.email}`)} />
              <InfoRow icon="call" label="Téléphone" value={user.phone || '-'} />
              <InfoRow icon="shield-checkmark" label="Rôle" value={user.role} />
              <InfoRow icon="school" label="Niveau" value={String(user.niveauID)} />
            </View>
          )}

          {editing && (
            <View className="rounded-2xl border border-outline-100 dark:border-outline-800 bg-white dark:bg-outline-900 p-4 gap-3 shadow-sm">
              <View>
                <Text className="text-xs text-typography-gray">Email</Text>
                <Text className="text-sm font-semibold text-typography-default dark:text-typography-white">{user.email}</Text>
              </View>
              <View>
                <Text className="text-xs text-typography-gray">Username</Text>
                <TextInput value={username} onChangeText={setUsername} placeholder="Votre username" className={`px-3 py-2 rounded-md border ${usernameValid ? 'border-outline-200 dark:border-outline-800' : 'border-error-500'} bg-white dark:bg-outline-900 text-typography-default dark:text-typography-white`} />
                {!usernameValid && <Text className="text-xxs text-error-500">2 à 50 caractères</Text>}
              </View>
              <View>
                <Text className="text-xs text-typography-gray">Surname</Text>
                <TextInput value={surname} onChangeText={setSurname} placeholder="Votre nom" className={`px-3 py-2 rounded-md border ${surnameValid ? 'border-outline-200 dark:border-outline-800' : 'border-error-500'} bg-white dark:bg-outline-900 text-typography-default dark:text-typography-white`} />
                {!surnameValid && <Text className="text-xxs text-error-500">2 à 50 caractères</Text>}
              </View>
              <View>
                <Text className="text-xs text-typography-gray">Téléphone (9 chiffres)</Text>
                <TextInput value={phone} onChangeText={(t) => setPhone(t.replace(/\D+/g, ''))} placeholder="ex: 651234567" keyboardType="number-pad" className={`px-3 py-2 rounded-md border ${phoneValid ? 'border-outline-200 dark:border-outline-800' : 'border-error-500'} bg-white dark:bg-outline-900 text-typography-default dark:text-typography-white`} />
                {!phoneValid && <Text className="text-xxs text-error-500">Numéro invalide (9 chiffres)</Text>}
              </View>
              <View className="flex-row justify-end gap-2 mt-2">
                <Pressable onPress={() => { if (user){ setUsername(user.username||''); setSurname(user.surname||''); setPhone(user.phone||''); } }} className="px-4 py-2 rounded-md bg-outline-100 dark:bg-outline-800">
                  <Text className="text-typography-default dark:text-typography-white">Réinitialiser</Text>
                </Pressable>
                <Pressable disabled={!formValid || updating} onPress={onSave} className={`px-4 py-2 rounded-md ${!formValid || updating ? 'bg-primary-defaultOrange/60' : 'bg-primary-defaultOrange active:opacity-90'}`}>
                  <Text className="text-primary-defaultBlue font-extrabold">Enregistrer</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* Actions en liste */}
        {!editing && (
          <View className="px-4 mt-4">
            <Pressable onPress={onOpenSettings} className="flex-row items-center justify-between px-3 py-3 rounded-xl border border-outline-100 dark:border-outline-800 bg-white dark:bg-outline-900 mb-2 active:opacity-90">
              <View className="flex-row items-center gap-3">
                <Ionicons name="settings" size={18} color="#6B7280" />
                <Text className="text-sm font-semibold text-typography-default dark:text-typography-white">Paramètres</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </Pressable>
            <Pressable onPress={onRateApp} className="flex-row items-center justify-between px-3 py-3 rounded-xl border border-outline-100 dark:border-outline-800 bg-white dark:bg-outline-900 mb-2 active:opacity-90">
              <View className="flex-row items-center gap-3">
                <Ionicons name="star" size={18} color="#6B7280" />
                <Text className="text-sm font-semibold text-typography-default dark:text-typography-white">{"Noter l'application"}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </Pressable>
            <Pressable onPress={onSupport} className="flex-row items-center justify-between px-3 py-3 rounded-xl border border-outline-100 dark:border-outline-800 bg-white dark:bg-outline-900 mb-2 active:opacity-90">
              <View className="flex-row items-center gap-3">
                <Ionicons name="help-circle" size={18} color="#6B7280" />
                <Text className="text-sm font-semibold text-typography-default dark:text-typography-white">Assistance</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </Pressable>
            <Pressable onPress={onShareApp} className="flex-row items-center justify-between px-3 py-3 rounded-xl border border-outline-100 dark:border-outline-800 bg-white dark:bg-outline-900 mb-2 active:opacity-90">
              <View className="flex-row items-center gap-3">
                <Ionicons name="share-social" size={18} color="#6B7280" />
                <Text className="text-sm font-semibold text-typography-default dark:text-typography-white">{"Partager l'application"}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </Pressable>
            <Pressable onPress={onLogout} className="flex-row items-center justify-between px-3 py-3 rounded-xl border border-error-400 bg-error-50/40 active:opacity-90">
              <View className="flex-row items-center gap-3">
                <Ionicons name="log-out" size={18} color="#ef4444" />
                <Text className="text-sm font-semibold text-error-500">Déconnexion</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ef4444" />
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} className="flex-row items-center justify-between px-2 py-2 rounded-md active:opacity-90">
      <View className="flex-row items-center gap-2">
        <Ionicons name={icon} size={16} color="#6B7280" />
        <Text className="text-xs text-typography-gray">{label}</Text>
      </View>
      <Text className="text-sm font-semibold text-typography-default dark:text-typography-white">{value}</Text>
    </Pressable>
  );
}

function ActionButton({ icon, label, onPress, variant }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; variant?: 'danger' | 'default' }) {
  const isDanger = variant === 'danger';
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-2 px-3 py-2 rounded-xl border ${isDanger ? 'border-error-400 bg-error-50/50' : 'border-outline-100 dark:border-outline-800 bg-outline-50/60 dark:bg-outline-900'} active:opacity-90`}
      accessibilityRole="button"
    >
      <Ionicons name={icon} size={16} color={isDanger ? '#ef4444' : '#6B7280'} />
      <Text className={`text-sm font-semibold ${isDanger ? 'text-error-500' : 'text-typography-default dark:text-typography-white'}`}>{label}</Text>
    </Pressable>
  );
}
