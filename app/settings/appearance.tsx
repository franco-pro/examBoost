import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function AppearanceScreen() {
  const router = useRouter();
  // Par défaut: système
  const [selected, setSelected] = useState<'light' | 'dark' | 'system'>('system');

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Top bar */}
      <View className="px-4 pt-5 pb-4 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} accessibilityLabel="Retour">
          <Ionicons name="arrow-back" size={22} color="#181c5c" />
        </Pressable>
        <Text className="text-lg font-extrabold text-typography-default dark:text-typography-white">Apparence</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4 mt-2">
          <ThemeItem code="light" label="Clair" selected={selected === 'light'} onPress={() => setSelected('light')} disabled/>
          <ThemeItem code="dark" label="Sombre" selected={selected === 'dark'} onPress={() => setSelected('dark')} disabled/>
          <ThemeItem code="system" label="Système" selected={selected === 'system'} onPress={() => setSelected('system')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ThemeItem({ code, label, selected, onPress, disabled }: { code: 'light' | 'dark' | 'system'; label: string; selected: boolean; onPress: () => void, disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center justify-between px-3 py-3 rounded-xl border mb-2 
        ${disabled ? "opacity-40 border-gray-300 bg-gray-100 dark:bg-neutral-800" : "active:opacity-90"} 
        ${!disabled && selected ? "border-primary-defaultOrange bg-primary-defaultOrange/10" : ""} 
        ${!disabled && !selected ? "border-outline-100 dark:border-outline-800 bg-white dark:bg-outline-900" : ""}
      `}
    >
      <View className="flex-row items-center gap-3">
        <Ionicons
          name={
            code === "light"
              ? "sunny"
              : code === "dark"
                ? "moon"
                : "phone-portrait"
          }
          size={18}
          color={disabled ? "#9CA3AF" : "#6B7280"}
        />
        <Text
          className={`text-sm font-semibold ${disabled ? "text-gray-400" : "text-typography-default dark:text-typography-white"}`}
        >
          {label}
        </Text>
      </View>
      {selected ? (
        <Ionicons
          name="checkmark-circle"
          size={18}
          color={disabled ? "#9CA3AF" : "#f97316"}
        />
      ) : (
        <Ionicons name="ellipse-outline" size={18} color="#9CA3AF" />
      )}
    </Pressable>
  );
}
