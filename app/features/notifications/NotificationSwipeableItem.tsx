import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useMemo, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import NotificationItem from './NotificationItem';
import { isEphemeralNotification } from './types';
import type { Notification } from './types';

export default function NotificationSwipeableItem({
  notification,
  onDelete,
  onOpenDetails,
  onToggleRead,
  onOpenLink,
  onAcceptInvitation,
}: {
  notification: Notification;
  onDelete?: () => void;
  onOpenDetails?: (id: number, actionType: string) => void;
  onToggleRead?: () => void;
  onOpenLink?: (id: number, actionType: string) => void;
  onAcceptInvitation?: () => void;
}) {
  const { t } = useTranslation('notification');
  const ref = useRef<Swipeable>(null);

  const isEphemeral = useMemo(() => isEphemeralNotification(notification), [notification]);

  const close = () => ref.current?.close();

  const LeftAction = () => (
    <View className="flex-1 flex-row items-center bg-outline-50 dark:bg-outline-800 px-4">
      <Ionicons
        name={notification.isRead ? 'mail-unread-outline' : 'mail-open-outline'}
        size={22}
        color="#181c5c"
      />
      <Text className="ml-2 text-typography-default dark:text-typography-white font-semibold">
        {notification.isRead ? t('notification.mark_unread') : t('notification.mark_read')}
      </Text>
    </View>
  );

  const RightAction = () => (
    <View className="flex-1 flex-row justify-end items-center bg-error-400 px-4">
      <Text className="mr-2 text-white font-semibold">{t('notification.delete')}</Text>
      <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
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
        !isEphemeral && onDelete
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
        isEphemeral={isEphemeral}
        onDelete={
          isEphemeral
            ? undefined
            : () => {
                void Haptics.selectionAsync();
                onDelete?.();
                close();
              }
        }
        onToggleRead={() => {
          void Haptics.selectionAsync();
          onToggleRead?.();
        }}
        onOpenLink={onOpenLink ? () => onOpenLink(notification.competionID, 'joinRoom') : undefined}
        onOpenDetails={onOpenDetails ? () => onOpenDetails(notification.competionID, 'openDetails') : undefined}
        onAcceptInvitation={onAcceptInvitation}
      />
    </Swipeable>
  );
}