import { memo } from 'react';
import { View } from 'react-native';

export const PackCardSkeleton = memo(function PackCardSkeleton() {
  return (
    <View className="rounded-xl overflow-hidden bg-outline-50 dark:bg-outline-900 animate-pulse">
      <View className="w-full h-36 bg-outline-100 dark:bg-outline-800" />
      <View className="p-3 gap-2">
        <View className="h-4 w-2/3 bg-outline-100 dark:bg-outline-800 rounded" />
        <View className="h-3 w-full bg-outline-100 dark:bg-outline-800 rounded" />
        <View className="h-3 w-4/5 bg-outline-100 dark:bg-outline-800 rounded" />
        <View className="mt-2 h-7 w-24 bg-outline-100 dark:bg-outline-800 rounded" />
      </View>
    </View>
  );
});

export const PackGridSkeleton = memo(function PackGridSkeleton() {
  return (
    <View className="p-2">
      <View className="mb-3">
        <View className="h-8 w-40 bg-outline-100 dark:bg-outline-800 rounded" />
      </View>
      <View className="gap-3">
        <PackCardSkeleton />
        <PackCardSkeleton />
        <PackCardSkeleton />
      </View>
    </View>
  );
});
