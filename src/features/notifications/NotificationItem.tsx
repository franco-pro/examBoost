import { Ionicons } from '@expo/vector-icons';
import { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Notification } from './types';

export default memo(function NotificationItem({
  notification,
  onDelete,
  onToggleRead,
  onPress,
  onOpenLink,
}: {
  notification: Notification;
  onDelete?: () => void;
  onToggleRead?: () => void;
  onPress?: () => void;
  onOpenLink?: () => void;
}) {
  const { title, body, type, read, createdAt, id } = notification;

  const iconByType: Record<Notification['type'], keyof typeof Ionicons.glyphMap> = {
    info: 'information-circle',
    success: 'checkmark-circle',
    warning: 'warning',
    error: 'alert-circle',
  } as const;

  const iconName = iconByType[type];
  const typeColor: Record<Notification['type'], string> = {
    info: '#38bdf8', // text-info-400
    success: '#22c55e', // text-success-500
    warning: '#f59e0b', // text-warning-500
    error: '#ef4444', // text-error-500
  } as const;

  const time = new Date(createdAt);
  const rel = timeAgo(time);

  // Gestion du texte long: on tronque par défaut et on propose "Voir plus"
  const [expanded, setExpanded] = useState(false);
  const isLong = useMemo(() => (body?.length ?? 0) > 140, [body]);
  const toggleExpanded = useCallback(() => setExpanded((s) => !s), []);

  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-3 bg-background-light dark:bg-background-dark border-b border-outline-100 dark:border-outline-800"
      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
      accessibilityRole="button"
      accessibilityLabel={`Notification ${title}`}
      accessibilityHint="Appuyer pour afficher les détails"
      hitSlop={8}
      testID={`notification-item-${id}`}
    >
      <View className="flex-row items-start gap-3">
        <View className="mt-0.5">
          <Ionicons name={iconName as any} size={22} color={typeColor[type]} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            {!read && <View className="w-2 h-2 rounded-full bg-indicator-primary" accessibilityLabel="Non lu" />}
            <Text className={`text-base ${read ? 'font-medium text-typography-default/90 dark:text-typography-white/90' : 'font-semibold text-typography-default dark:text-typography-white'}`} numberOfLines={1}>
              {title}
            </Text>
          </View>
          <Text className="mt-0.5 text-typography-gray" numberOfLines={expanded ? undefined : 3}>
            {body}
          </Text>
          {/*  direct pour les compétitions */}
          {type === 'warning' && onOpenLink && (
            <Pressable
              onPress={onOpenLink}
              accessibilityRole="button"
              accessibilityLabel="Rejoindre la compétition"
              hitSlop={8}
              className="mt-2 self-start px-2 py-1 rounded-md bg-primary-500 active:opacity-90"
            >
              <Text className="text-xs text-white font-semibold">Rejoindre</Text>
            </Pressable>
          )}
          {isLong && (
            <Pressable
              onPress={toggleExpanded}
              accessibilityRole="button"
              accessibilityLabel={expanded ? 'Réduire le texte' : 'Voir plus'}
              hitSlop={8}
              className="mt-1 self-start px-2 py-0.5 rounded-md bg-outline-50 dark:bg-outline-800 active:opacity-80"
            >
              <Text className="text-xs text-typography-default dark:text-typography-white">
                {expanded ? 'Voir moins' : 'Voir plus'}
              </Text>
            </Pressable>
          )}
          <View className="mt-2 flex-row items-center gap-4">
            <Text className="text-xs text-typography-gray">{rel}</Text>
            <View className="flex-row items-center gap-2 ml-auto">
              {onToggleRead && read && (
                <Pressable
                  onPress={onToggleRead}
                  className="p-2 rounded-md bg-outline-50 dark:bg-outline-800 active:opacity-80"
                  accessibilityRole="button"
                  accessibilityLabel={'Marquer comme non lu'}
                  hitSlop={8}
                  testID={`notification-toggle-${id}`}
                >
                  <Ionicons name="mail-unread" size={16} color="#374151" />
                </Pressable>
              )}
              {onDelete && (
                <Pressable
                  onPress={onDelete}
                  className="p-2 rounded-md bg-error-400 active:opacity-80"
                  accessibilityRole="button"
                  accessibilityLabel="Supprimer"
                  accessibilityHint="Supprime cette notification"
                  hitSlop={8}
                  testID={`notification-delete-${id}`}
                >
                  <Ionicons name="trash" size={16} color="#FFFFFF" />
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
});

function timeAgo(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `il y a ${diff}s`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `il y a ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.floor(h / 24);
  return `il y a ${d}j`;
}

export { };

