import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import { useDeleteUserMutation } from '@/app/features/user/hooks.rq';
import { setCurrentUserId } from '@/app/hooks/redux/session/session.slice';
import type { AppDispatch, RootState } from '@/app/hooks/redux/store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useAppSelector } from '../hooks/redux/redux.hooks';

export default function SettingsScreen() {
  const router = useRouter();
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const {user} = useAppSelector(s => s.user);
  const userID = user?.id ?? 0;
  const deleteUserMutation = useDeleteUserMutation();

  const showToast = (action: 'success' | 'error' | 'info' | 'warning' | 'muted', title: string, desc?: string) =>
    toast.show({
      placement: 'top',
      duration: 2200,
      render: () => (
        <Toast action={action} variant="solid" className="mx-3">
          <ToastTitle bold>{title}</ToastTitle>
          {desc ? <ToastDescription>{desc}</ToastDescription> : null}
        </Toast>
      ),
    });

  const doDeleteAccount = async () => {
    try {
      await deleteUserMutation.mutateAsync({ userID });
      dispatch(setCurrentUserId(undefined));
      showToast('success', 'Compte supprimé');
      router.replace('/(tabs)' as any);
    } catch (e: any) {
      showToast('error', 'Suppression échouée', e?.message || 'Réessayez plus tard');
    }
  };

  const onDeleteAccount = () => {
    if (Platform.OS === 'web') {
      const ok = typeof window !== 'undefined' ? window.confirm('Cette action est définitive. Voulez-vous vraiment supprimer votre compte ?') : false;
      if (ok) void doDeleteAccount();
      return;
    }

    Alert.alert(
      'Supprimer le compte',
      'Cette action est définitive. Voulez-vous vraiment supprimer votre compte ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            void doDeleteAccount();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Top bar sécurisé par SafeArea */}
      <View className="px-4 pt-5 pb-4 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} accessibilityLabel="Retour">
          <Ionicons name="arrow-back" size={22} color="#181c5c" />
        </Pressable>
        <Text className="text-lg font-extrabold text-typography-default dark:text-typography-white">Paramètres</Text>
        <Pressable onPress={() => router.push('/(tabs)/profile' as any)} accessibilityLabel="Aller au profil">
          <Text className="text-primary-defaultBlue font-semibold">Profil</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4 mt-4">
          <SettingsItem icon="language" label="Langue" onPress={() => router.push('/settings/language' as any)} />
          <SettingsItem icon="color-palette" label="Apparence" onPress={() => router.push('/settings/appearance' as any)} />
          <SettingsItem icon="information-circle" label="À propos de ExamBoost" onPress={() => router.push('/settings/about' as any)} />
          <SettingsItem icon="wallet" label="Faire un retrait" onPress={() => router.push('/settings/withdraw' as any)} />
          <SettingsItem icon="key" label="Changer le mot de passe" onPress={() => router.push('/settings/password' as any)} />
            {
            user?.role.toLowerCase() == "superadmin" ? (
              <SettingsItem icon="shield-checkmark" label="Admin Dashboard" onPress={() => router.push("/dev-admin/pages")} />
            ) : null
            }          
          <SettingsItem icon="trash" label="Supprimer mon compte" onPress={onDeleteAccount} danger />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsItem({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={() => {
        console.log('[settings] press:', label);
        onPress();
      }}
      hitSlop={10}
      accessibilityRole="button"
      className={`flex-row items-center justify-between px-3 py-3 rounded-xl border ${
        danger ? 'border-error-300 dark:border-error-500' : 'border-outline-100 dark:border-outline-800'
      } bg-white dark:bg-outline-900 mb-2 active:opacity-90`}
    >
      <View className="flex-row items-center gap-3">
        <Ionicons name={icon} size={18} color={danger ? '#ef4444' : '#6B7280'} />
        <Text className={`text-sm font-semibold ${danger ? 'text-error-500' : 'text-typography-default dark:text-typography-white'}`}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={danger ? '#ef4444' : '#9CA3AF'} />
    </Pressable>
  );
}
