import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import type { Pack } from './types';

export default memo(function PackFeatured({
  pack,
  onPressCTA,
}: {
  pack: Pack;
  onPressCTA?: () => void;
}) {
  return (
    <View className="px-4 pt-3 pb-2 bg-background-light dark:bg-background-dark">
      <View className="rounded-2xl overflow-hidden bg-primary-0/20 dark:bg-primary-900/20 border border-outline-100 dark:border-outline-800">
        {pack.coverUrl ? (
          <Image source={{ uri: pack.coverUrl }} className="w-full h-40" contentFit="cover" />
        ) : (
          <View className="w-full h-40 bg-outline-50 dark:bg-outline-900" />
        )}
        <View className="p-4 gap-2">
          <Text className="text-lg font-extrabold text-typography-default dark:text-typography-white" numberOfLines={1}>
            {pack.title}
          </Text>
          <Text className="text-sm text-typography-gray" numberOfLines={2}>
            {pack.description}
          </Text>
          <View className="mt-2 flex-row items-center gap-3">
            {pack.price != null ? (
              <Text className="text-base font-bold text-typography-default dark:text-typography-white">{pack.price}€</Text>
            ) : null}
            <Pressable
              onPress={onPressCTA}
              className="ml-auto px-4 py-2 rounded-md bg-primary-defaultOrange active:opacity-90"
              accessibilityRole="button"
              accessibilityLabel="Découvrir le pack"
            >
              <Text className="font-extrabold text-primary-defaultBlue">Découvrir</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
});
