import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import NotificationItem from './NotificationItem';
import type { Notification } from './types';

export default function NotificationSwipeableItem({
  notification,
  onDelete,
  onOpenDetails,
  onToggleRead,
  onPress,
  onOpenLink,
  onAcceptInvitation,
}: {
  notification: Notification;
  onDelete?: () => void;
  onOpenDetails?: (id: number, actionType: string) => void;
  onToggleRead?: () => void;
  onPress?: () => void;
  onOpenLink?: (id: number, actionType: string) => void;
  onAcceptInvitation?: (id: number, actionType: string) => void;
}) {
  const ref = useRef<Swipeable>(null);

  const close = () => ref.current?.close();

  const LeftAction = () => (
    <View className="flex-1 flex-row items-center bg-outline-50 dark:bg-outline-800 px-4">
      <Ionicons name={notification.isRead ? 'mail-unread' : 'mail-open'} size={22} color="#181c5c" />
      <Text className="ml-2 text-typography-default dark:text-typography-white font-semibold">
        {notification.isRead ? 'Marquer non lu' : 'Marquer lu'}
      </Text>
    </View>
  );

  const RightAction = () => (
    <View className="flex-1 flex-row justify-end items-center bg-error-400 px-4">
      <Text className="mr-2 text-white font-semibold">Supprimer</Text>
      <Ionicons name="trash" size={22} color="#FFFFFF" />
    </View>
  );

  return (
    <Swipeable
      ref={ref}
      renderLeftActions={
        onToggleRead
          ? () => (
              <Pressable
                onPress={() => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onToggleRead();
                  close();
                }}
                className="h-full"
              >
                <LeftAction />
              </Pressable>
            )
          : undefined
      }
      renderRightActions={
        onDelete
          ? () => (
              <Pressable
                onPress={() => {
                  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  onDelete();
                  close();
                }}
                className="h-full"
              >
                <RightAction />
              </Pressable>
            )
          : undefined
      }
      overshootLeft={false}
      overshootRight={false}
      friction={2}
    >
      <NotificationItem
        notification={notification}
        onDelete={() => {
          void Haptics.selectionAsync();
          onDelete?.();
          close();
        }}
        onToggleRead={() => {
          void Haptics.selectionAsync();
          onToggleRead?.();
        }}
        onPress={onPress}
        onOpenLink={onOpenLink ? () => onOpenLink(notification.competionID, "joinRoom") : undefined}
        onOpenDetails={onOpenDetails ? () => onOpenDetails(notification.competionID, "openDetails") : undefined}
        onAcceptInvitation={onAcceptInvitation ? () => onAcceptInvitation(notification.competionID, "acceptInvit") : undefined}
      />
    </Swipeable>
  );
}
