import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import type { Pack } from './types';
import { Ionicons } from '@expo/vector-icons';
import { packProps } from '@/app/api/packService';

export default memo(function PackDetailSheet({
  pack,
  onClose,
  onPrimary,
}: {
  pack: packProps | null;
  onClose?: () => void;
  onPrimary?: (p: Pack) => void;
}) {
  if (!pack) return null;
  const { name, description, coverUrl, price } = pack;
  return (
    <View className="flex-1 rounded-t-2xl bg-background-light dark:bg-background-dark p-4">
      <View className="flex-row items-start gap-3">
        {coverUrl ? (
          <Image source={{ uri: coverUrl }} className="w-12 h-12 rounded-md" contentFit="cover" />
        ) : (
          <View className="w-12 h-12 rounded-md bg-outline-50 dark:bg-outline-900 items-center justify-center">
            <Ionicons name="image" size={18} color="#9CA3AF" />
          </View>
        )}
        <View className="flex-1">
          <Text className="text-base font-extrabold text-typography-default dark:text-typography-white" numberOfLines={2}>
            {name}
          </Text>
          <View className="mt-1 flex-row items-center gap-3">
            {/* {typeof rating === 'number' && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="star" size={14} color="#f59e0b" />
                <Text className="text-xs text-typography-default dark:text-typography-white">{rating.toFixed(1)}</Text>
              </View>
            )} */}
            {/* {typeof modulesCount === 'number' && (
              <Text className="text-xs text-typography-gray">{modulesCount} modules</Text>
            )} */}
            {/* {typeof estimatedTimeMin === 'number' && (
              <Text className="text-xs text-typography-gray">~{Math.round(estimatedTimeMin / 60)}h</Text>
            )} */}
          </View>
        </View>
        <Pressable onPress={onClose} className="-mr-2 -mt-2 p-2 rounded-full active:opacity-80">
          <Ionicons name="close" size={20} color="#9CA3AF" />
        </Pressable>
      </View>

      <Text className="mt-4 text-typography-default dark:text-typography-white">{description}</Text>

      <View className="mt-4 flex-row items-center gap-2">
        {price != null && (
          <Text className="text-base font-bold text-typography-default dark:text-typography-white">{price}€</Text>
        )}
        {/* {oldPrice != null && (
          <Text className="text-xs line-through text-typography-gray">{oldPrice}€</Text>
        )} */}
      </View>

      <View className="mt-6 flex-row items-center gap-3">
        {/* <Pressable
          onPress={() => pack && onPrimary?.(pack)}
          className="px-4 py-2 rounded-md bg-primary-500 active:opacity-90"
          accessibilityRole="button"
          accessibilityLabel={isSubscribed ? 'Continuer le pack' : 'Acheter le pack'}
        >
          <Text className="font-extrabold" style={{ color: '#181c5c' }}>{isSubscribed ? 'Continuer' : 'Acheter maintenant'}</Text>
        </Pressable> */}
      </View>
    </View>
  );
});
