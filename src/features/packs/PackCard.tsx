import { formatDays, formatPriceXOF, isNewSince } from '@/src/utils/format';
import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Pack } from './types';

export default memo(function PackCard({
  pack,
  onPress,
  onPressCTA,
}: {
  pack: Pack;
  onPress?: () => void;
  onPressCTA?: () => void;
}) {
  const {
    title,
    description,
    price,
    durationDays,
    isActive,
    createdAt,
  } = pack;

  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl overflow-hidden bg-background-light dark:bg-background-dark border border-outline-100 dark:border-outline-800 transition-all duration-150 web:hover:-translate-y-0.5 active:opacity-95"
      accessibilityRole="button"
      accessibilityLabel={`Pack ${title}`}
    >
      {/* Header icône avec gradient web-only et glow conditionnel */}
      <View className="relative w-full h-36 items-center justify-center border-b border-outline-100 dark:border-outline-800" style={{ backgroundColor: 'rgba(25, 28, 92, 0.09)' }}>
        {/* Pastille icône */}
        <View
          className={`${isActive ? 'ring-2 ring-primary-defaultOrange/40' : 'ring-1 ring-primary-defaultOrange/30'} w-14 h-14 rounded-full bg-primary-defaultOrange items-center justify-center`}
        >
          <Ionicons name={isActive ? 'star' : 'layers'} size={24} color="#181c5c" />
        </View>
        {/* Gradient subtil bleu en haut (toutes plateformes) */}
        <View className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[rgba(24,28,92,0.30)] to-transparent pointer-events-none" />
      </View>

      <View className="p-3 gap-2">
        <View className="flex-row items-center gap-2">
          {typeof isActive === 'boolean' ? (
            <View className={`px-2 py-0.5 rounded-md ${isActive ? 'bg-success-500' : 'bg-error-500/80'}`}>
              <Text className={`${isActive ? 'text-white' : 'text-white'} text-xxs font-bold`}>
                {isActive ? 'Actif' : 'Inactif'}
              </Text>
            </View>
          ) : null}
          {isNewSince(createdAt) ? (
            <View className="px-2 py-0.5 rounded-md bg-info-500">
              <Text className="text-white text-xxs font-bold">Nouveau</Text>
            </View>
          ) : null}
        </View>

        <Text className="text-base font-extrabold text-typography-default dark:text-typography-white" numberOfLines={1}>
          {title}
        </Text>
        <Text className="text-sm text-typography-default/90 dark:text-typography-white/90" numberOfLines={2}>
          {description}
        </Text>

        <View className="flex-row items-center gap-3">
          {typeof durationDays === 'number' ? (
            <View className="flex-row items-center gap-1">
              <Ionicons name="time" size={14} color="#6B7280" />
              <Text className="text-xs text-typography-gray">{formatDays(durationDays)}</Text>
            </View>
          ) : null}
        </View>

        <View className="mt-1 flex-row items-center justify-between">
          <View className="flex-row items-baseline gap-2">
            {price != null ? (
              <Text className="text-base font-extrabold text-typography-default dark:text-typography-white">{formatPriceXOF(price)}</Text>
            ) : null}
          </View>

          <Pressable
            onPress={onPressCTA}
            className={`px-4 py-2 rounded-full bg-primary-defaultOrange active:opacity-90 web:hover:brightness-105 flex-row items-center gap-1`}
            accessibilityRole="button"
            accessibilityLabel={`Pack ${title} · ${price != null ? formatPriceXOF(price) : ''} · ${typeof durationDays === 'number' ? formatDays(durationDays) : ''}`}
            hitSlop={8}
          >
            <Text className="text-primary-defaultBlue text-sm font-extrabold">{isActive ? 'Continuer' : 'Acheter'}</Text>
          </Pressable>
        </View>

      </View>
    </Pressable>
  );
});
