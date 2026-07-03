import React, { memo } from "react";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface packProps {
  id: string | number;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  remainingDays: number;
  isSubscribed?: boolean;
}

export default memo(function PackCard({
  pack,
  onPress,
  onPressCTA,
}: {
  pack: packProps;
  onPress?: () => void;
  onPressCTA?: () => void;
}) {
  const { name, description, price, durationDays, remainingDays } = pack;

  const canContinue = !!pack.isSubscribed;
  const canBuy = !pack.isSubscribed;
  const ctaLabel = canContinue
    ? "Continuer"
    : canBuy
      ? "Acheter"
      : "Indisponible";

  // Calcul dynamique du pourcentage restant de la barre de progression
  const progressPercentage =
    durationDays > 0
      ? Math.min(Math.max((remainingDays / durationDays) * 100, 0), 100)
      : 0;

  // Fonctions de formatage locales (Remplacez par vos fonctions globales si nécessaire)
  const formatDays = (days: number) => `${days} Jours`;
  const formatPriceXOF = (amount: number) => `${amount.toLocaleString()} XAF`;

  return (
    <Pressable
      onPress={onPress}
      className="rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 shadow-sm active:opacity-98 m-2"
      accessibilityRole="button"
      accessibilityLabel={`Pack ${name}`}
    >
      {/* 1. HEADER : Dégradé + Icônes en arrière-plan */}
      <LinearGradient
        colors={["#1D35D9", "#3B59F4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="relative w-full h-36 flex-row items-center justify-between px-5 overflow-hidden"
      >
        {/* Grand cercle transparent avec l'icône de gauche */}
        <View className="absolute -left-5 -top-5 w-40 h-40 rounded-full bg-white/10 items-center justify-center">
          <View className="w-24 h-24 rounded-full border border-white/10 items-center justify-center">
            <Ionicons
              name={canContinue ? "star" : "layers"}
              size={32}
              color="white"
            />
          </View>
        </View>

        {/* Deuxième icône livre transparente en filigrane à droite */}
        <View className="absolute -right-4 bottom-1 opacity-10 rotate-12">
          <Ionicons name="book" size={100} color="white" />
        </View>

        {/* Textes du Header (Alignés à droite) */}
        <View className="flex-1 items-end pl-28 z-10 py-5 pr-5">
          <View
            className={`px-2.5 py-0.5 rounded-full mb-1 flex-row items-center gap-1 ${canContinue ? "bg-emerald-500" : "bg-amber-500"}`}
          >
            <Ionicons
              name={canContinue ? "checkmark-circle" : "eye"}
              size={10}
              color="white"
            />
            <Text className="text-white text-[10px] font-black uppercase tracking-wider">
              {canContinue ? "Actif" : "Non Payé"}
            </Text>
          </View>

          <Text
            className="text-white text-lg font-black text-right"
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text
            className="text-white/80 text-xs text-right mt-0.5 leading-4"
            numberOfLines={2}
          >
            {description}
          </Text>
        </View>
      </LinearGradient>

      {/*  BODY  */}
      <View className="p-4 gap-4 parent">
        <View className="duree flex-row items-center justify-between gap-3">
          <View className="flex-1 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100/70 dark:border-zinc-800 flex-row items-center gap-3">
            <View className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 items-center justify-center">
              <Ionicons name="time" size={16} color="#3B59F4" />
            </View>
            <View>
              <Text className="text-[10px] text-zinc-400 font-bold uppercase">
                Durée
              </Text>
              <Text className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100">
                {formatDays(durationDays)}
              </Text>
            </View>
          </View>

          <View className="price flex-1 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100/70 dark:border-zinc-800 flex-row items-center gap-3">
            <View className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 items-center justify-center">
              <Ionicons name="wallet" size={16} color="#F59E0B" />
            </View>
            <View>
              <Text className="text-[10px] text-zinc-400 font-bold uppercase">
                Prix
              </Text>
              <Text className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100">
                {formatPriceXOF(price)}
              </Text>
            </View>
          </View>
        </View>

        {/* Barre de progression */}
        {canContinue && (
          <View className="w-full gap-1.5 px-0.5">
            <View className="flex-row justify-between items-center">
              <Text className="text-zinc-400 dark:text-zinc-500 text-xs font-bold">
                Validité du pack
              </Text>
              <Text className="text-zinc-800 dark:text-zinc-200 text-xs font-black">
                {remainingDays > 0
                  ? `${remainingDays} jours restants`
                  : "Expiré"}
              </Text>
            </View>

            <View className="flex-row items-center gap-3">
              {/* Fond de la barre */}
              <View className="flex-1 h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                {/* Barre verte dynamique */}
                <View
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </View>
              {/* Pourcentage à droite */}
              <Text className="text-emerald-500 text-xs font-black w-8 text-right">
                {Math.round(progressPercentage)}%
              </Text>
            </View>
          </View>
        )}

        {/* Ligne du bas */}
        <View className="mt-1 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex-row items-center justify-between">
          <Text className="text-zinc-400 dark:text-zinc-500 text-xs font-medium">
            {canContinue ? "Contenu débloqué" : "Accès non disponible"}
          </Text>

          <Pressable
            onPress={ctaLabel === "Indisponible" ? undefined : onPressCTA}
            className={`px-5 py-2.5 rounded-full flex-row items-center gap-1.5 shadow-sm active:scale-95 transition-transform ${
              canContinue
                ? "bg-secondary-custom-400 dark:bg-secondary-custom-400"
                : "bg-secondary-custom-400"
            }`}
          >
            <Text
              className={`text-sm font-black ${canContinue ? "text-white dark:text-zinc-900" : "text-white"}`}
            >
              {ctaLabel}
            </Text>
            <Ionicons
              name={canContinue ? "arrow-forward" : "cart"}
              size={14}
              color={canContinue ? (canContinue ? "#FFF" : "#000") : "white"}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
});
