import { View, Text, Pressable, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { Config } from '../config/version';

export default function AboutScreen() {
  const router = useRouter();
  const appName = Constants.expoConfig?.name ?? 'ExamBoost';
  const version = Config.APP_VERSION;

  const open = (url: string) => Linking.openURL(url);

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Top bar */}
      <View className="px-4 pt-5 pb-4 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} accessibilityLabel="Retour">
          <Ionicons name="arrow-back" size={22} color="#181c5c" />
        </Pressable>
        <Text className="text-lg font-extrabold text-typography-default dark:text-typography-white">À propos</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* En-tête app */}
        <View className="px-4 mt-4 items-center">
          <View className="w-16 h-16 rounded-2xl bg-primary-defaultOrange items-center justify-center">
            <Ionicons name="school" size={28} color="#0b63a3" />
          </View>
          <Text className="mt-3 text-lg font-extrabold text-typography-default dark:text-typography-white">{appName}</Text>
          <Text className="text-xs text-typography-gray">Version {version}</Text>
        </View>

        {/* Description */}
        <View className="px-4 mt-4">
          <Text className="text-sm text-typography-default dark:text-typography-white">
            ExamBoost est une application dédiée à l’apprentissage et à la réussite de vos examens. Retrouvez vos
            packs, sujets et notifications dans une expérience moderne et rapide.
          </Text>
        </View>

        {/* Liens utiles */}
        <View className="px-4 mt-4 gap-2">
          <AboutItem icon="globe" label="Site web" onPress={() => open('https://examboost.org')} />
          <AboutItem icon="document-text" label="Conditions d’utilisation" onPress={() => open('https://examboost.org/fr/terms')} />
          <AboutItem icon="shield-checkmark" label="Politique de confidentialité" onPress={() => open('https://examboost.org/fr/privacy')} />
          <AboutItem icon="mail" label="Contact support" onPress={() => open('mailto:info@examboost.org')} />
        </View>

        {/* Infos techniques */}
        <View className="px-4 mt-4">
          <View className="rounded-2xl border border-outline-100 dark:border-outline-800 bg-white dark:bg-outline-900 p-3">
            <Text className="text-xs text-typography-gray">Informations</Text>
            <Text className="mt-1 text-sm text-typography-default dark:text-typography-white">Canal: {Constants.executionEnvironment ?? 'web'}</Text>
            <Text className="text-sm text-typography-default dark:text-typography-white">Version : {version}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AboutItem({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center justify-between px-3 py-3 rounded-xl border border-outline-100 dark:border-outline-800 bg-white dark:bg-outline-900 active:opacity-90">
      <View className="flex-row items-center gap-3">
        <Ionicons name={icon} size={18} color="#6B7280" />
        <Text className="text-sm font-semibold text-typography-default dark:text-typography-white">{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
    </Pressable>
  );
}
