import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity, View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Information() {
  const router = useRouter();

  const information = {
    id: 3,
    name: "IA Coding Marathon",
    description:
      "Une compétition en intelligence artificielle sur la vision par ordinateur.",
    topic: "Intelligence Artificielle",
    date: "2025-09-28T09:00:00Z",
    registration_deadline: "2025-09-25T22:00:00Z",
    entryFee: 0,
    winnerPrice: 0,
    isPublic: true,
    statut: "COMPLETED",
    maxUsers: 5,
    minUsers: 2,
    creatorData: { id: 3, name: "David IA" },
  };

  const colors = {
    defaultBlue: "#181c5c",
    defaultOrange: "#ff894f",
  };

  return (
    <View className="bg-gray-50 pt-[40px] pb-[100px] px-4"
>
      {/* Bouton Retour */}
      <TouchableOpacity
        className="flex-row items-center mb-6"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.defaultBlue} />
        <Text className="ml-2 text-lg font-semibold text-gray-800">Retour</Text>
      </TouchableOpacity>

      {/* --- Première carte avec dégradé --- */}
      <LinearGradient
        colors={[colors.defaultBlue, colors.defaultOrange]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-6 rounded-2xl mb-5 mt-5 shadow-lg items-center"
        style={{ minHeight: 260 }}
      >
        <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center mb-4">
          <Ionicons name="code-slash-outline" size={40} color="white" />
        </View>

        <Text className="text-2xl font-bold text-center text-white mb-2">
          {information.name}
        </Text>

        <Text className="text-white/90 text-center mb-4">
          {information.description}
        </Text>

        <View className="border-t border-white/30 my-3 w-full" />

        <Text className="text-center text-white">
          <Text className="font-semibold">Thème :</Text> {information.topic}
        </Text>
        <Text className="text-center text-white mt-2">
          <Text className="font-semibold">Date :</Text>{" "}
          {new Date(information.date).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </LinearGradient>

      {/* --- Deuxième carte : Détails rapides --- */}
      <View className="bg-white rounded-2xl py-4 px-5 mt-2 shadow-md border border-gray-100">
        <Text
          className="text-lg font-semibold mb-3"
          style={{ color: colors.defaultBlue }}
        >
          Détails du concours
        </Text>

        <View className="flex-row justify-between mb-3">
          <View className="flex-row items-center">
            <Ionicons
              name="person-circle-outline"
              size={22}
              color={colors.defaultBlue}
            />
            <Text className="ml-2 text-gray-700 font-medium">
              {information.creatorData.name}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons
              name="trophy-outline"
              size={22}
              color={colors.defaultOrange}
            />
            <Text className="ml-2 text-gray-700 font-medium">
              {information.winnerPrice} FCFA
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={20} color="#2e86de" />
            <Text className="ml-2 text-gray-700">
              {new Date(information.registration_deadline).toLocaleDateString(
                "fr-FR",
                { day: "2-digit", month: "long", year: "numeric" }
              )}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#10b981"
            />
            <Text className="ml-2 text-gray-700">{information.statut}</Text>
          </View>
        </View>
      </View>
<ScrollView>
      {/* --- Troisième carte : Informations supplémentaires --- */}
      <View className="mt-5 bg-white rounded-2xl p-4 shadow-md border border-gray-100 mb-10">
        <View className="flex-row items-center mb-3">
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={colors.defaultBlue}
          />
          <Text
            className="ml-2 text-lg font-semibold"
            style={{ color: colors.defaultBlue }}
          >
            Informations supplémentaires
          </Text>
        </View>

        <View className="border-t border-gray-200 " />

        <View className="mt-2 space-y-3">
          {/* Chaque ligne d'infos sous forme de row */}
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ionicons name="cash-outline" size={20} color={colors.defaultOrange} />
              <Text className="ml-2 text-gray-700">Frais de participation</Text>
            </View>
            <Text className="font-semibold text-gray-800">
              {information.entryFee === 0 ? "Gratuit" : `${information.entryFee} XAF`}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ionicons name="people-outline" size={20} color={colors.defaultBlue} />
              <Text className="ml-2 text-gray-700">Participants minimum</Text>
            </View>
            <Text className="font-semibold text-gray-800">
              {information.minUsers}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ionicons name="people-circle-outline" size={20} color={colors.defaultOrange} />
              <Text className="ml-2 text-gray-700">Participants maximum</Text>
            </View>
            <Text className="font-semibold text-gray-800">
              {information.maxUsers}
            </Text>
          </View>
        </View>
      </View>

         <TouchableOpacity className="flex-row items-center bg-primary-defaultBlue self-start px-4 py-2 rounded-full ml-auto">
                <Text className="text-white text-xs font-semibold mr-2">
                 Rejoindre la competition
                </Text>
                <Ionicons name="chevron-forward" size={22} color="#ffffff" />
              </TouchableOpacity>
              </ScrollView>
    </View>
  );
}
