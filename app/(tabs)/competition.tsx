import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { JSX } from "react";
import { useTranslation } from "react-i18next";
import CardStat from "@/components/layouts/statistique/cardStat";

export default function Competition() {
  const router = useRouter();
  const { t } = useTranslation("competition"); // hook pour traduire les textes

  const statistics = [
    {
      nom: t("accueil.statistics.created_competitions"),
      chiffre: 12,
      icone: <Ionicons name="trophy-outline" size={28} color="#f97316" />,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
    },
    {
      nom: t("accueil.statistics.total_participations"),
      chiffre: 8,
      icone: <FontAwesome5 name="users" size={25} color="#3b82f6" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      nom: t("accueil.statistics.total_wins"),
      chiffre: 4,
      icone: (
        <MaterialCommunityIcons
          name="progress-clock"
          size={28}
          color="#10b981"
        />
      ),
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      nom: t("accueil.statistics.total_deposits"),
      chiffre: 5,
      icone: (
        <Ionicons
          name="checkmark-done-circle-outline"
          size={28}
          color="#22c55e"
        />
      ),
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600",
    },
  ];

  const actions = [
    {
      icone: <FontAwesome5 name="users" size={35} color="#181c5c" />,
      text: t("accueil.actions.my_creations.title"),
      other: t("accueil.actions.my_creations.description"),
      link: "../pages/competitions-screen/user" as const,
    },
    {
      icone: <FontAwesome5 name="users" size={35} color="#181c5c" />,
      text: t("accueil.actions.my_participations.title"),
      other: t("accueil.actions.my_participations.description"),
      link: "../pages/competitions-screen/participation" as const,
    },
  ];

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* ===== Header ===== */}
      <View className="bg-white p-4 rounded-2xl mb-4">
        <Text className="text-lg font-semibold">{t("accueil.greeting")}</Text>
        <Text className="text-gray-500 mt-1">{t("accueil.subtitle")}</Text>
      </View>

      {/* ===== Stats ===== */}
      <View className="flex-row flex-wrap justify-between">
        {statistics.map((stat, index) => (
          <CardStat
            bgColor={stat.bgColor}
            textColor={stat.textColor}
            nom={stat.nom}
            chiffre={stat.chiffre}
            key={index}
            icone={stat.icone}
          />
        ))}
      </View>

      {/* ===== Actions ===== */}
      <Text className="text-lg font-semibold my-4">
        {t("accueil.actions_title")}
      </Text>

      <View>
        {actions.map((act, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white rounded-2xl flex-row p-4 mb-3 shadow-sm items-center"
            onPress={() => router.push(act.link)}
          >
            <View className="bg-blue-50 p-3 rounded-full">{act.icone}</View>
            <View className="ml-3 flex-1">
              <Text className="text-lg font-semibold">{act.text}</Text>
              <Text className="text-gray-500">{act.other}</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
