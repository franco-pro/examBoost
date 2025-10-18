import { useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { JSX } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next"; // <- import i18n
import Filter from "@/components/layouts/filter/searchBar";
import CardStat from "@/components/layouts/statistique/cardStat";

export default function AllCompetition() {
  const { t } = useTranslation("competition"); // <- hook i18n
  const router = useRouter();

  const statistique: {
    nom: string;
    chiffre: number;
    icone: JSX.Element;
    bgColor: string;
    textColor: string;
  }[] = [
    {
      nom: t("participation.statistics.completed"), // Nombre terminees
      chiffre: 12,
      icone: <Ionicons name="trophy-outline" size={28} color="#f97316" />,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
    },
    {
      nom: t("participation.statistics.wins"), // Nombre gagnes
      chiffre: 8,
      icone: <FontAwesome5 name="users" size={25} color="#3b82f6" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
  ];

  const competitions: {
    id: number;
    name: string;
    description: string;
    topic: string;
    date: string; // ISO string
    registration_deadline: string; // ISO string
    entryFee: number;
    winnerPrice: number;
    isPublic: boolean;
    isManagedByIA: boolean;
    statut: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
    maxUsers: number;
    minUsers: number;
    roomID: string;
    type:
      | "FREE_REGISTRATION_WITH_WINNER_PRICE"
      | "PAID_REGISTRATION_WITH_WINNER_PRICE"
      | "TOTAL_FREE_NO_PRICE_TO_WIN";
    creatorID: number;
    creatorData: {
      id: number;
      name: string;
    };
    created_at: string; // ISO string
    updated_at: string; // ISO string
    users: {
      id: number;
      name: string;
    }[];
  }[] = [
    {
      id: 1,
      name: "CodeMaster Challenge",
      description:
        "Affronte d'autres développeurs dans un concours de programmation rapide.",
      topic: "Algorithmique",
      date: "2025-10-15T14:00:00Z",
      registration_deadline: "2025-10-10T23:59:00Z",
      entryFee: 0,
      winnerPrice: 50000,
      isPublic: true,
      isManagedByIA: false,
      statut: "UPCOMING",
      maxUsers: 10,
      minUsers: 2,
      roomID: "RM12345",
      type: "FREE_REGISTRATION_WITH_WINNER_PRICE",
      creatorID: 1,
      creatorData: { id: 1, name: "Jean Dev" },
      created_at: "2025-09-20T10:00:00Z",
      updated_at: "2025-09-21T10:00:00Z",
      users: [
        { id: 2, name: "Ange Codeur" },
        { id: 3, name: "Sarah Tech" },
      ],
    },
    {
      id: 2,
      name: "Battle of Architects",
      description:
        "Un concours de conception 3D pour les ingénieurs et architectes.",
      topic: "Architecture",
      date: "2025-10-20T16:00:00Z",
      registration_deadline: "2025-10-18T23:00:00Z",
      entryFee: 2000,
      winnerPrice: 20000,
      isPublic: true,
      isManagedByIA: false,
      statut: "ONGOING",
      maxUsers: 15,
      minUsers: 3,
      roomID: "RM56789",
      type: "PAID_REGISTRATION_WITH_WINNER_PRICE",
      creatorID: 2,
      creatorData: { id: 2, name: "Marie Architecte" },
      created_at: "2025-09-25T09:00:00Z",
      updated_at: "2025-09-26T10:30:00Z",
      users: [
        { id: 4, name: "Lucas Design" },
        { id: 5, name: "Emma Build" },
      ],
    },

    {
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
      isManagedByIA: true,
      statut: "COMPLETED",
      maxUsers: 5,
      minUsers: 2,
      roomID: "RM88888",
      type: "TOTAL_FREE_NO_PRICE_TO_WIN",
      creatorID: 3,
      creatorData: { id: 3, name: "David IA" },
      created_at: "2025-09-10T10:00:00Z",
      updated_at: "2025-09-29T08:00:00Z",
      users: [
        { id: 6, name: "Clara Bot" },
        { id: 7, name: "Noah ML" },
      ],
    },
    {
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
      isManagedByIA: true,
      statut: "COMPLETED",
      maxUsers: 5,
      minUsers: 2,
      roomID: "RM88888",
      type: "TOTAL_FREE_NO_PRICE_TO_WIN",
      creatorID: 3,
      creatorData: { id: 3, name: "David IA" },
      created_at: "2025-09-10T10:00:00Z",
      updated_at: "2025-09-29T08:00:00Z",
      users: [
        { id: 6, name: "Clara Bot" },
        { id: 7, name: "Noah ML" },
      ],
    },
    {
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
      isManagedByIA: true,
      statut: "COMPLETED",
      maxUsers: 5,
      minUsers: 2,
      roomID: "RM88888",
      type: "TOTAL_FREE_NO_PRICE_TO_WIN",
      creatorID: 3,
      creatorData: { id: 3, name: "David IA" },
      created_at: "2025-09-10T10:00:00Z",
      updated_at: "2025-09-29T08:00:00Z",
      users: [
        { id: 6, name: "Clara Bot" },
        { id: 7, name: "Noah ML" },
      ],
    },
    {
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
      isManagedByIA: true,
      statut: "COMPLETED",
      maxUsers: 5,
      minUsers: 2,
      roomID: "RM88888",
      type: "TOTAL_FREE_NO_PRICE_TO_WIN",
      creatorID: 3,
      creatorData: { id: 3, name: "David IA" },
      created_at: "2025-09-10T10:00:00Z",
      updated_at: "2025-09-29T08:00:00Z",
      users: [
        { id: 6, name: "Clara Bot" },
        { id: 7, name: "Noah ML" },
      ],
    },
    {
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
      isManagedByIA: true,
      statut: "COMPLETED",
      maxUsers: 5,
      minUsers: 2,
      roomID: "RM88888",
      type: "TOTAL_FREE_NO_PRICE_TO_WIN",
      creatorID: 3,
      creatorData: { id: 3, name: "David IA" },
      created_at: "2025-09-10T10:00:00Z",
      updated_at: "2025-09-29T08:00:00Z",
      users: [
        { id: 6, name: "Clara Bot" },
        { id: 7, name: "Noah ML" },
      ],
    },
  ];

  function timePassed(date: string): string {
    const date2 = new Date(date);

    if (date2 < new Date()) {
      return "Time passed to register";
    } else {
      // Calcul de la différence
      const diffMs = date2.getTime() - new Date().getTime(); // .getTime() renvoie un number
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHrs = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      return `${diffDays} days ${diffHrs} hr left`;
    }
  }
  return (
    <View className="flex-1 w-full max-w-full  bg-gray-50 p-4 relative" style={{
        position: "relative",
        zIndex: 1, // <-- permet aux enfants d’utiliser un zIndex
      }}>
      {/* Back Button */}
      <TouchableOpacity
        className="flex-row items-center mb-4"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#181c5c" />
        <Text className="ml-2 text-lg font-semibold text-gray-800">
          {t("participation.back")}
        </Text>
      </TouchableOpacity>

      <View className="bg-white p-4 rounded-2xl  ">
        <Text className="text-lg font-semibold">
          {t("participation.greeting")}
        </Text>
        <Text className="text-gray-500 mt-1">
          {t("participation.subtitle")}
        </Text>
      </View>

      {/* Barre de recherche */}
      <Filter />

      {/* Mes participations */}
      <Text className="text-lg font-semibold my-4">
        {t("participation.section_title")}
      </Text>

      <ScrollView
        className="mt-2"
        contentContainerStyle={{ flexGrow: 1 }}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
      >
        {competitions.map((comp, index) => {
          return (
            <TouchableOpacity
              key={index}
              className="bg-white rounded-2xl flex-row p-4 mb-3  items-center"
              style={{
                backgroundColor: "white",
                borderRadius: 16,
                flexDirection: "row",
                padding: 16,
                marginBottom: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
              onPress={() =>
                router.push({
                  pathname: "./information",
                  params: {
                    id: comp.id,
                  },
                })
              }
            >
              <View className="ml-3 pr-2 flex-1">
                {/* Nom de la compétition et deadline */}
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-semibold">{comp.name}</Text>
                  <Text className="text-xs text-gray-400">
                    {comp.statut === "UPCOMING" &&
                      t("participation.labels.time_left", {
                        days: 2,
                        hours: 5,
                      })}
                    {comp.statut !== "UPCOMING" &&
                      t("participation.labels.time_passed")}
                  </Text>
                </View>

                {/* Sujet / date */}
                <Text className="text-gray-500 text-sm mt-1">
                  {new Date(comp.date).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>

                {/* Participants et statut */}
                <View className="flex-row justify-between items-center mt-2">
                  <View className="flex-row items-center">
                    <Ionicons
                      name="people"
                      size={16}
                      color="#4B5563"
                      className="mr-1"
                    />
                    <Text className="text-sm text-gray-700">
                      {comp.users.length} {t("participation.labels.joined")}
                    </Text>
                  </View>
                  <View
                    className={`rounded-full px-3 py-1 ${
                      comp.statut === "UPCOMING"
                        ? "bg-green-200"
                        : comp.statut === "ONGOING"
                        ? "bg-yellow-200"
                        : comp.statut === "CANCELLED"
                        ? "bg-error-300"
                        : "bg-gray-300"
                    }`}
                  >
                    <Text className="text-xs font-semibold text-black">
                      {t(`participation.labels.status.${comp.statut}`)}
                    </Text>
                  </View>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={22} color="#9ca3af" />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
