import { Ionicons } from '@expo/vector-icons';
import { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HStack } from '@/components/ui/hstack';
import { isEphemeralNotification } from './types';
import type { Notification } from './types';

export default memo(function NotificationItem({
  notification,
  isEphemeral,
  onDelete,
  onToggleRead,
  onPress,
  onOpenLink,
  onOpenDetails,
  onAcceptInvitation,
}: {
  notification: Notification;
  isEphemeral?: boolean;
  onDelete?: () => void;
  onToggleRead?: () => void;
  onPress?: () => void;
  onOpenDetails?: (id: number, actionType: string) => void;
  onOpenLink?: (id: number, actionType: string) => void;
  onAcceptInvitation?: () => void;
}) {
  const { t } = useTranslation('notification');
  const { title, text, type, isRead, created_at, id, competionID } = notification;

  const ephemeral = isEphemeral ?? isEphemeralNotification(notification);

  const iconByType: Record<Notification['type'], keyof typeof Ionicons.glyphMap> = {
    INVITATION: 'information-circle',
    INVITATION_ACCEPTED: 'checkmark-circle',
    ADMIN_ALERT: 'warning',
    COMPETITION_START: 'alert-circle',
    SYSTEM: 'cog',
    INVITATION_DECLINED: 'close-circle',
    COMPETITION_CREATED: 'trophy',
  } as const;

  const typeColor: Record<Notification['type'], string> = {
    INVITATION: '#38bdf8',
    INVITATION_ACCEPTED: '#22c55e',
    ADMIN_ALERT: '#f59e0b',
    INVITATION_DECLINED: '#ef4444',
    SYSTEM: '#6b7280',
    COMPETITION_START: '#8b5cf6',
    COMPETITION_CREATED: '#0ea5e9', 
  } as const;

  const iconName = iconByType[type];
  const color = typeColor[type];

  const time = new Date(created_at);
  const rel = timeAgo(time, t);

  // Gestion du texte long : troncature par défaut avec "Voir plus"
  const [expanded, setExpanded] = useState(false);
  const isLong = useMemo(() => (text?.length ?? 0) > 140, [text]);
  const toggleExpanded = useCallback(() => setExpanded((s) => !s), []);

  return (
    <Pressable
      onPress={onPress}
      className="mx-3 my-1.5 rounded-2xl border border-outline-100 dark:border-outline-800 bg-background-light dark:bg-background-dark px-4 py-3"
      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
      accessibilityRole="button"
      accessibilityLabel={`Notification ${title}`}
      accessibilityHint={t('notification.a11y_open_details')}
      hitSlop={8}
      testID={`notification-item-${id}`}
    >
      <View className="flex-row items-start gap-3">
        <View
          className="w-10 h-10 rounded-full items-center justify-center mt-0.5"
          style={{ backgroundColor: `${color}1A` }}
        >
          <Ionicons name={iconName as any} size={20} color={color} />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            {!isRead && (
              <View
                className="w-2 h-2 rounded-full bg-indicator-primary"
                accessibilityLabel={t('notification.unread')}
              />
            )}
            <Text
              className={`flex-1 text-base ${
                isRead
                  ? 'font-medium text-typography-default/90 dark:text-typography-white/90'
                  : 'font-semibold text-typography-default dark:text-typography-white'
              }`}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>

          <Text className="mt-0.5 text-typography-bold" numberOfLines={expanded ? undefined : 3}>
            {text}
          </Text>

          {ephemeral && (
            <View className="mt-1.5 flex-row items-center gap-1">
              <Ionicons name="time-outline" size={12} color="#9CA3AF" />
              <Text className="text-[11px] italic text-typography-gray">
                {t('notification.ephemeral_notice')}
              </Text>
            </View>
          )}

          {type === 'COMPETITION_START' && onOpenLink && (
            <Pressable
              onPress={() => onOpenLink(competionID, 'joinRoom')}
              accessibilityRole="button"
              accessibilityLabel={t('notification.join_competition')}
              hitSlop={8}
              className="mt-2 self-start flex-row items-center gap-1 px-3 py-1.5 rounded-md bg-primary-500 active:opacity-90"
            >
              <Ionicons name="enter-outline" size={14} color="#FFFFFF" />
              <Text className="text-xs text-white font-semibold">{t('notification.join')}</Text>
            </Pressable>
          )}

          {type === 'INVITATION' && onAcceptInvitation && onOpenDetails && (
            <HStack className="mt-2 self-start gap-2">
              <Pressable
                onPress={onAcceptInvitation}
                accessibilityRole="button"
                accessibilityLabel={t('notification.accept')}
                hitSlop={8}
                className="flex-row items-center gap-1 px-3 py-1.5 rounded-md bg-primary-500 active:opacity-90"
              >
                <Ionicons name="checkmark-outline" size={14} color="#FFFFFF" />
                <Text className="text-xs text-white font-semibold">{t('notification.accept')}</Text>
              </Pressable>

              <Pressable
                onPress={() => onOpenDetails(id, 'openDetails')}
                accessibilityRole="button"
                accessibilityLabel={t('notification.details')}
                hitSlop={8}
                className="flex-row items-center gap-1 px-3 py-1.5 rounded-md bg-secondary-500 active:opacity-90"
              >
                <Ionicons name="eye-outline" size={14} color="#FFFFFF" />
                <Text className="text-xs text-white font-semibold">{t('notification.details')}</Text>
              </Pressable>
            </HStack>
          )}

          {isLong && (
            <Pressable
              onPress={toggleExpanded}
              accessibilityRole="button"
              accessibilityLabel={expanded ? t('notification.see_less') : t('notification.see_more')}
              hitSlop={8}
              className="mt-1.5 self-start px-2 py-0.5 rounded-md bg-outline-50 dark:bg-outline-800 active:opacity-80"
            >
              <Text className="text-xs text-typography-default dark:text-typography-white">
                {expanded ? t('notification.see_less') : t('notification.see_more')}
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
                  accessibilityLabel={t('notification.mark_unread')}
                  hitSlop={8}
                  testID={`notification-toggle-${id}`}
                >
                  <Ionicons name="mail-unread-outline" size={16} color="#374151" />
                </Pressable>
              )}
              {!ephemeral && onDelete && (
                <Pressable
                  onPress={onDelete}
                  disabled={id === undefined || id === null}
                  className="p-2 rounded-md bg-error-400 active:opacity-80"
                  accessibilityRole="button"
                  accessibilityLabel={t('notification.delete')}
                  accessibilityHint={t('notification.a11y_delete')}
                  hitSlop={8}
                  testID={`notification-delete-${id}`}
                >
                  <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
});

function timeAgo(date: Date, t: (key: string, opts?: any) => string) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return t('notification.time_seconds', { count: diff });
  const m = Math.floor(diff / 60);
  if (m < 60) return t('notification.time_minutes', { count: m });
  const h = Math.floor(m / 60);
  if (h < 24) return t('notification.time_hours', { count: h });
  const d = Math.floor(h / 24);
  return t('notification.time_days', { count: d });
}

export {};