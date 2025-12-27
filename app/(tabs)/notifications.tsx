import { useDeleteNotification, useMarkRead, useNotifications, useNotificationsRealtime } from '@/app/features/notifications/hooks';
import type { Notification } from '@/app/features/notifications/types';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';

import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import NotificationSwipeableItem from '@/app/features/notifications/NotificationSwipeableItem';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

export default function NotificationsScreen() {
  // brancher un  userID quand l'auth sera prête
  const userID = 42;
  //rafraîchir hors de cette page
  const { data, isLoading, isRefetching, refetch, isError } = useNotifications(userID, { refetchInterval: false });
  const delOne = useDeleteNotification(userID);
  const markRead = useMarkRead(userID);
  useNotificationsRealtime(userID);

  const navigation = useNavigation();
  const router = useRouter();
  const unreadCount = useMemo(() => (data?.filter((n) => !n.read).length ?? 0), [data]);

  useEffect(() => {
    // Dynamically update the tab badge for the Notifications tab
    navigation.setOptions({ tabBarBadge: unreadCount > 0 ? unreadCount : undefined });
  }, [navigation, unreadCount]);

  const toast = useToast();

  const [selected, setSelected] = useState<Notification | null>(null);
  const modalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['45%', '85%'], []);

  const openDetails = useCallback((n: Notification) => {
    setSelected(n);
    modalRef.current?.present();
  }, []);

  const closeDetails = useCallback(() => {
    modalRef.current?.dismiss();
    setSelected(null);
  }, []);

  const onRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const showToast = useCallback(
    (action: 'success' | 'error' | 'info' | 'warning' | 'muted', title: string, desc?: string) => {
      toast.show({
        placement: 'top',
        duration: 2000,
        render: ({ id }) => (
          <Toast action={action} variant="solid" className="mx-3">
            <ToastTitle bold>{title}</ToastTitle>
            {desc ? <ToastDescription>{desc}</ToastDescription> : null}
          </Toast>
        ),
      });
    },
    [toast]
  );

  const handleOpenLink = useCallback(async (url?: string) => {
    if (!url) return;
    await Haptics.selectionAsync();
    showToast('info', 'Ouverture…');
    await WebBrowser.openBrowserAsync(url);
  }, [showToast]);

  const handleOpenCompetition = useCallback(async () => {
    await Haptics.selectionAsync();
    showToast('info', 'Ouverture…');
    // Utiliser le chemin Expo Router pour éviter l'erreur de typage
    router.push('/(tabs)/competition');
  }, [router, showToast]);

  const renderItem = useCallback(({ item }: { item: Notification }) => (
    <NotificationSwipeableItem
      notification={item}
      onDelete={() =>
        delOne.mutate(item.id, {
          onSuccess: () => showToast('success', 'Notification supprimée'),
          onError: () => showToast('error', "Échec de la suppression"),
        })
      }
      onPress={() => {
        if (!item.read) {
          markRead.mutate({ id: item.id });
        }
        openDetails(item.read ? item : { ...item, read: true });
      }}
      onOpenLink={() => handleOpenCompetition()}
    />
  ), [delOne, markRead, openDetails, showToast]);

  const keyExtractor = useCallback((n: Notification) => n.id, []);

  const Header = (
    <View className="px-4 pt-4 pb-2 bg-background-light dark:bg-background-dark flex-row items-center justify-between">
      <Text className="text-lg font-extrabold text-typography-default dark:text-typography-white">Notifications</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
        <ActivityIndicator size="large" color="#181c5c" />
        <Text className="mt-3 text-typography-gray">Chargement des notifications…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark px-6">
        {Header}
        <View className="mt-10 items-center">
          <Ionicons name="alert-circle" size={42} color="#ef4444" />
          <Text className="mt-3 text-center text-typography-default dark:text-typography-white">
            Une erreur est survenue lors du chargement des notifications.
          </Text>
          <Pressable onPress={onRefresh} className="mt-4 px-4 py-2 rounded-md bg-primary-500">
            <Text className="text-white font-semibold">Réessayer</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const items = data ?? [];

  return (
    <BottomSheetModalProvider>
      <View className="flex-1 bg-background-light dark:bg-background-dark">
        {Header}
        {items.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <Ionicons name="notifications-off" size={48} color="#9CA3AF" />
            <Text className="mt-3 text-typography-gray">Aucune notification pour le moment</Text>
          </View>
        ) : (
          <FlatList<Notification>
            data={items}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={{ paddingVertical: 8 }}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />}
          />
        )}

        {/* */}
        <BottomSheetModal
          ref={modalRef}
          snapPoints={snapPoints}
          backgroundStyle={{ backgroundColor: 'transparent' }}
          handleIndicatorStyle={{ backgroundColor: '#9CA3AF' }}
        >
          <View className="flex-1 rounded-t-2xl bg-background-light dark:bg-background-dark p-4">
            <View className="flex-row items-start gap-3">
              {selected && (
                <Ionicons
                  name={iconFor(selected.type)}
                  size={24}
                  color={colorFor(selected.type)}
                />
              )}
              <View className="flex-1">
                <Text className="text-base font-extrabold text-typography-default dark:text-typography-white" numberOfLines={2}>
                  {selected?.title}
                </Text>
                <Text className="mt-1 text-xs text-typography-gray">{selected ? relativeTime(selected.createdAt) : ''}</Text>
              </View>
              <Pressable onPress={closeDetails} className="-mr-2 -mt-2 p-2 rounded-full active:opacity-80">
                <Ionicons name="close" size={20} color="#9CA3AF" />
              </Pressable>
            </View>

            <Text className="mt-4 text-typography-default dark:text-typography-white">{selected?.body}</Text>

            <View className="mt-6 flex-row items-center gap-3">
              {selected?.link && (
                <Pressable
                  onPress={() => (selected?.type === 'warning' ? handleOpenCompetition() : handleOpenLink(selected?.link))}
                  className="px-3 py-2 rounded-md bg-primary-500 active:opacity-90"
                  accessibilityRole="button"
                  accessibilityLabel={selected?.type === 'warning' ? 'Rejoindre la compétition' : 'Ouvrir le lien associé'}
                >
                  <Text className="text-white font-semibold">
                    {selected?.type === 'warning' ? 'Rejoindre la compétition' : 'Ouvrir'}
                  </Text>
                </Pressable>
              )}

              {selected && (
                <Pressable
                  onPress={() => {
                    void Haptics.selectionAsync();
                    if (selected.read) return;
                    markRead.mutate(
                      { id: selected.id },
                      {
                        onSuccess: () => showToast('success', 'Marquée comme lue'),
                        onError: () => showToast('error', 'Échec de la mise à jour'),
                      }
                    );
                    setSelected((s) => (s ? { ...s, read: true } : s));
                  }}
                  disabled={!!selected?.read}
                  className="px-3 py-2 rounded-md bg-outline-50 dark:bg-outline-800 active:opacity-90"
                >
                  <Text className="text-typography-default dark:text-typography-white font-semibold">
                    Marquer lu
                  </Text>
                </Pressable>
              )}

              {selected && (
                <Pressable
                  onPress={() => {
                    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    delOne.mutate(selected.id, {
                      onSuccess: () => showToast('success', 'Notification supprimée'),
                      onError: () => showToast('error', "Échec de la suppression"),
                    });
                    closeDetails();
                  }}
                  className="px-3 py-2 rounded-md bg-error-400 active:opacity-90 ml-auto"
                >
                  <Text className="text-white font-semibold">Supprimer</Text>
                </Pressable>
              )}
            </View>
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
}

function relativeTime(iso: string) {
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `il y a ${diff}s`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `il y a ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  const day = Math.floor(h / 24);
  return `il y a ${day}j`;
}

function iconFor(type: Notification['type']): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case 'info':
      return 'information-circle';
    case 'success':
      return 'checkmark-circle';
    case 'warning':
      return 'warning';
    case 'error':
      return 'alert-circle';
  }
}

function colorFor(type: Notification['type']): string {
  switch (type) {
    case 'info':
      return '#38bdf8'; // info-400
    case 'success':
      return '#22c55e'; // success-500
    case 'warning':
      return '#f59e0b'; // warning-500
    case 'error':
      return '#ef4444'; // error-500
  }
}
