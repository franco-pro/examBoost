import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import i18n from '@/lang/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LanguageScreen() {
  const router = useRouter();
  // Par défaut: Français (réglable plus tard via persistance)
  const [selected, setSelected] = useState(i18n.language);

  const changeLanguage = async (lang: "fr" | "en") => {
    try {
      await AsyncStorage.setItem("language",lang)
      await i18n.changeLanguage(lang)
      setSelected(lang)
    } catch (error) {
      console.log("erreur changement de langue: ", error)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Top bar */}
      <View className="px-4 pt-5 pb-4 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} accessibilityLabel="Retour">
          <Ionicons name="arrow-back" size={22} color="#181c5c" />
        </Pressable>
        <Text className="text-lg font-extrabold text-typography-default dark:text-typography-white">Langue</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4 mt-2">
          <LangItem code="fr" label="Français" selected={selected === 'fr'} onPress={() => changeLanguage("fr")} />
          <LangItem code="en" label="English" selected={selected === 'en'} onPress={() => changeLanguage("en")} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LangItem({ code, label, selected, onPress }: { code: 'fr' | 'en'; label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className={`flex-row items-center justify-between px-3 py-3 rounded-xl border mb-2 active:opacity-90 ${selected ? 'border-primary-defaultOrange bg-primary-defaultOrange/10' : 'border-outline-100 dark:border-outline-800 bg-white dark:bg-outline-900'}`}>
      <View className="flex-row items-center gap-3">
        <Ionicons name={code === 'fr' ? 'flag' : 'globe'} size={18} color="#6B7280" />
        <Text className="text-sm font-semibold text-typography-default dark:text-typography-white">{label}</Text>
      </View>
      {selected ? <Ionicons name="checkmark-circle" size={18} color="#f97316" /> : <Ionicons name="ellipse-outline" size={18} color="#9CA3AF" />}
    </Pressable>
  );
}
