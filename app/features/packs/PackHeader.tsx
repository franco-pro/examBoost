import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default memo(function PackHeader({
  value,
  onChangeSearch,
  onOpenFilters,
  onOpenSort,
  onBack,
  backLabel,
  title = 'Packs',
}: {
  value: string;
  onChangeSearch: (v: string) => void;
  onOpenFilters?: () => void;
  onOpenSort?: () => void;
  onBack?: () => void;
  backLabel?: string;
  title?: string;
}) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="bg-background-light dark:bg-background-dark">
      <View className="px-4 pt-0 pb-3">
        {onBack ? (
          <View className="mt-1 mb-2">
            <Pressable onPress={onBack} className="flex-row items-center gap-1 active:opacity-80" accessibilityLabel={backLabel ?? 'Retour'}>
              <Ionicons name="chevron-back" size={18} color="#6B7280" />
              <Text className="text-sm text-typography-gray">{backLabel ?? 'Retour'}</Text>
            </Pressable>
          </View>
        ) : null}

        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-extrabold text-typography-default dark:text-typography-white">{title}</Text>
          <View className="flex-row items-center gap-2">
            {/* <Pressable onPress={onOpenSort} className="px-3 py-2 rounded-md bg-primary-defaultOrange active:opacity-90" accessibilityLabel="Trier">
              <View className="flex-row items-center gap-1">
                <Ionicons name="swap-vertical" size={16} color="#181c5c" />
                <Text className="text-xs font-extrabold text-primary-defaultBlue">Trier</Text>
              </View>
            </Pressable> */}
            {/* <Pressable onPress={onOpenFilters} className="px-3 py-2 rounded-md bg-primary-defaultOrange active:opacity-90" accessibilityLabel="Filtres">
              <View className="flex-row items-center gap-1">
                <Ionicons name="funnel" size={16} color="#181c5c" />
                <Text className="text-xs font-extrabold text-primary-defaultBlue">Filtres</Text>
              </View>
            </Pressable> */}
          </View>
        </View>

        <View className="mt-3 flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center gap-2 px-3 py-2 rounded-full bg-white dark:bg-outline-900 border border-outline-100 dark:border-outline-800">
            <Ionicons name="search" size={16} color="#6B7280" />
            <TextInput
              value={value}
              onChangeText={onChangeSearch}
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-typography-default dark:text-typography-white"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
});
