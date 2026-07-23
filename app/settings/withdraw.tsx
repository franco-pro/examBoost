import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WithdrawScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Top bar */}
      <View className="px-4 pt-5 pb-4 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} accessibilityLabel="Retour">
          <Ionicons name="arrow-back" size={22} color="#181c5c" />
        </Pressable>
        <Text className="text-lg font-extrabold text-typography-default dark:text-typography-white">Retrait</Text>
        <View style={{ width: 22 }} />
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="construct" size={48} color="#9CA3AF" />
        <Text className="mt-3 text-base font-extrabold text-typography-default dark:text-typography-white">Fonctionnalité non disponible</Text>
        <Text className="mt-1 text-xs text-typography-gray text-center">Cette fonctionnalité sera bientôt disponible. Revenez plus tard.</Text>
        <Pressable onPress={() => router.back()} className="mt-4 px-4 py-2 rounded-md bg-primary-defaultOrange active:opacity-90">
          <Text className="text-primary-defaultBlue font-extrabold">Retour</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
