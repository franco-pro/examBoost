import { Ionicons } from '@expo/vector-icons';
import { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Notification } from './types';
import { HStack } from '@/components/ui/hstack';

export default memo(function NotificationItem({
  notification,
  onDelete,
  onToggleRead,
  onPress,
  onOpenLink,
  onOpenDetails,
  onAcceptInvitation,
}: {
  notification: Notification;
  onDelete?: () => void;
  onToggleRead?: () => void;
  onPress?: () => void;
  onOpenDetails?: (id: number, actionType: string) => void;
  onOpenLink?: (id: number, actionType: string) => void;
  onAcceptInvitation?: () => void;
}) {
  const { title, text, type, isRead, created_at, id , competionID} = notification;

  const iconByType: Record<Notification['type'], keyof typeof Ionicons.glyphMap> = {
    "INVITATION": 'information-circle',
    "INVITATION_ACCEPTED": 'checkmark-circle',
    "ADMIN_ALERT": 'warning',
    "COMPETITION_START": 'alert-circle',
    "SYSTEM": 'cog',
    "INVITATION_DECLINED": 'close-circle',
  } as const;

  const iconName = iconByType[type];
  const typeColor: Record<Notification['type'], string> = {
    "INVITATION": '#38bdf8', // text-info-400
    "INVITATION_ACCEPTED": '#22c55e', // text-success-500
    "ADMIN_ALERT": '#f59e0b', // text-warning-500
    "INVITATION_DECLINED": '#ef4444', // text-error-500
    "SYSTEM": '#6b7280', // text-gray-500
    "COMPETITION_START": '#8b5cf6', // text-purple-500
  } as const;

  const time = new Date(created_at);
  const rel = timeAgo(time); 

  // Gestion du texte long: on tronque par défaut et on propose "Voir plus"
  const [expanded, setExpanded] = useState(false);
  const isLong = useMemo(() => (text?.length ?? 0) > 140, [text]);
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
            {!isRead && <View className="w-2 h-2 rounded-full bg-indicator-primary" accessibilityLabel="Non lu" />}
            <Text className={`text-base ${isRead ? 'font-medium text-typography-default/90 dark:text-typography-white/90' : 'font-semibold text-typography-default dark:text-typography-white'}`} numberOfLines={1}>
              {title}
            </Text>
          </View>
          <Text className="mt-0.5 text-typography-bold" numberOfLines={expanded ? undefined : 3}>
            {text}
          </Text>
          {/*  direct pour les compétitions */}
          {(type === "COMPETITION_START") && onOpenLink && (
            <Pressable
              onPress={() => onOpenLink(notification.competionID, "joinRoom")}
              accessibilityRole="button"
              accessibilityLabel="Rejoindre la compétition"
              hitSlop={8}
              className="mt-2 self-start px-2 py-1 rounded-md bg-primary-500 active:opacity-90"
            >
              <Text className="text-xs text-white font-semibold">Rejoindre</Text>
            </Pressable>
          )}

           {(type === "INVITATION") && onAcceptInvitation && onOpenDetails && (
            //Hstack for multiple btns
            <HStack className="mt-2 self-start gap-2">
              <Pressable
                onPress={onAcceptInvitation}// add the user as participant to the competition
                accessibilityRole="button"
                accessibilityLabel="Accepter"
                hitSlop={8}
                className="mt-2 self-start px-2 py-1 rounded-md bg-primary-500 active:opacity-90"
              >
                <Text className="text-xs text-white font-semibold">Accepter 👌</Text>
              </Pressable>

              <Pressable
                onPress={()=> onOpenDetails(id, "openDetails")}
                accessibilityRole="button"
                accessibilityLabel="Details"
                hitSlop={8}
                className="mt-2 self-start px-2 py-1 rounded-md bg-secondary-500 active:opacity-90"
              >
                <Text className="text-xs text-white font-semibold"> Details 👁️ </Text>
              </Pressable>
{/* 
              <Pressable
                onPress={onOpenLink}
                accessibilityRole="button"
                accessibilityLabel="Refusé"
                hitSlop={8}
                className="mt-2 self-start px-2 py-1 rounded-md bg-error-500 active:opacity-90"
              >
                <Text className="text-xs text-white font-semibold">Refusé et supprimé 🚫</Text>
              </Pressable> */}
            </HStack>
          
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
              {onToggleRead && isRead && (
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
                  disabled={id ===undefined || id === null}
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

