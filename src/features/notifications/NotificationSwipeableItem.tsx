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
  onToggleRead,
  onPress,
  onOpenLink,
}: {
  notification: Notification;
  onDelete: () => void;
  onToggleRead: () => void;
  onPress?: () => void;
  onOpenLink?: () => void;
}) {
  const ref = useRef<Swipeable>(null);

  const close = () => ref.current?.close();

  const LeftAction = () => (
    <View className="flex-1 flex-row items-center bg-outline-50 dark:bg-outline-800 px-4">
      <Ionicons name={notification.read ? 'mail-unread' : 'mail-open'} size={22} color="#181c5c" />
      <Text className="ml-2 text-typography-default dark:text-typography-white font-semibold">
        {notification.read ? 'Marquer non lu' : 'Marquer lu'}
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
      renderLeftActions={() => (
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
      )}
      renderRightActions={() => (
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
      )}
      overshootLeft={false}
      overshootRight={false}
      friction={2}
    >
      <NotificationItem
        notification={notification}
        onDelete={() => {
          void Haptics.selectionAsync();
          onDelete();
          close();
        }}
        onToggleRead={() => {
          void Haptics.selectionAsync();
          onToggleRead();
        }}
        onPress={onPress}
        onOpenLink={onOpenLink}
      />
    </Swipeable>
  );
}
