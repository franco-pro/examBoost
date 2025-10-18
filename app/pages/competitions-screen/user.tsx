import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { JSX } from "react";
import { ScrollView } from "react-native-gesture-handler";

export default function User() {
  const router = useRouter();
  type RoutePath =
    | "../pages/competitions-screen/user"
    | "../pages/competitions-screen/participant";
  const statistique: {
    nom: string;
    chiffre: number;
    icone: JSX.Element;
    bgColor: string;
    textColor: string;
  }[] = [
    {
      nom: "Nombre terminees",
      chiffre: 12,
      icone: <Ionicons name="trophy-outline" size={28} color="#f97316" />,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
    },
    {
      nom: "Total particpant",
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
    statut: "UPCOMING" | "ONGOING" | "COMPLETED";
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

  function timePassed(deadline: string, date: string): string {
    const date1 = new Date(deadline);
    const date2 = new Date(date);

    if (date1 < date2) {
      return "Time passed to register";
    } else {
      // Calcul de la différence
      const diffMs = date2.getTime() - date1.getTime(); // .getTime() renvoie un number
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHrs = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      return `${diffDays} days ${diffHrs} hr to register`;
    }
  }
  return (
    
    <View className="flex-1 bg-gray-50 pt-[40px] pb-[50px] px-4">
      {/* Back Button */}
      <TouchableOpacity
        className="flex-row items-center mb-4"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#181c5c" />
        <Text className="ml-2 text-lg font-semibold text-gray-800">Retour</Text>
      </TouchableOpacity>
      <View className="bg-white p-4 rounded-2xl mb-4 ">
        <Text className="text-lg font-semibold">Bonjour Jean 👋</Text>
        <Text className="text-gray-500 mt-1">
          Retrouvez ici toutes vos compétitions créées et leur statut actuel
        </Text>
      </View>

      {/* Barre de recherche */}
      <View className="my-4 flex-row items-center bg-gray-100 rounded-full px-4 py-2">
        <Ionicons name="search" size={20} color="#9ca3af" className="mr-2" />
        <TextInput
          placeholder="Rechercher une compétition"
          className="flex-1 text-gray-700 p-2 border-0"
          underlineColorAndroid="transparent"
          style={{
            outlineWidth: 0, // supprime le contour au focus
          }}
        />
      </View>
      <View className="flex-row flex-wrap justify-between">
        {statistique.map((stat, index) => (
          <TouchableOpacity
            key={index}
            className={`w-[48%] ${stat.bgColor} p-4 rounded-xl mb-3 items-center shadow-sm`}
          >
            <View className="mb-2">{stat.icone}</View>
            <Text className={`font-semibold text-center ${stat.textColor}`}>
              {stat.nom}
            </Text>
            <Text className={`text-xl font-bold mt-1 ${stat.textColor}`}>
              {stat.chiffre}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-lg font-semibold my-4">Mes competitions</Text>
      <TouchableOpacity className="flex-row items-center bg-success-400 ml-auto px-4 py-2 rounded-full mb-4" onPress={()=>{router.push("./createCompetition")}}>
        <Text className="text-white font-semibold mr-2">
          Créer une compétition
        </Text>
        <Ionicons name="chevron-forward" size={22} color="#ffffff" />
      </TouchableOpacity>

      <ScrollView className="mt-2">
        {competitions.map((comp, index) => {
          return (
            <TouchableOpacity
              key={index}
              className="bg-white rounded-2xl flex-row p-4 mb-3 shadow-sm items-center"
              // onPress={() => router.push(act.link)}
            >
              <View className="ml-3 pr-2 flex-1">
                {/* Nom de la compétition et deadline */}
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-semibold">{comp.name}</Text>
                  <Text className="text-xs text-gray-400">
                    {timePassed(comp.registration_deadline, comp.date)}
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
                      {comp.users.length} joined
                    </Text>
                  </View>
                  <View
                    className={`rounded-full px-3 py-1 ${
                      comp.statut === "UPCOMING"
                        ? "bg-green-200"
                        : comp.statut === "ONGOING"
                        ? "bg-yellow-200"
                        : "bg-gray-300"
                    }`}
                  >
                    <Text className="text-xs font-semibold text-black">
                      {comp.statut}
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
