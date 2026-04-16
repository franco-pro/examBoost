//new page dev administration

import { RootState } from "@/app/redux/store";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { JSX, useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useSelector } from "react-redux";

export default function DevAdmin() {
    const router = useRouter();
    const [hasSearchFocus, setSerachFocus]= useState(false);
    const loading = false;
    const { user, accessToken, others } = useSelector(
        (state: RootState) => state.user
      );

      const statistique: {
        nom: string;
        chiffre: string;
        icone: JSX.Element;
        bgColor: string;
        textColor: string;
      }[] = [
        {
          nom: "Examens créés",
          chiffre: "+" + 200,
          icone: <Ionicons name="trophy-outline" size={28} color="#f97316" />,
          bgColor: "bg-orange-100",
          textColor: "text-orange-600",
        },
        {
          nom: "Users inscrits",
          chiffre: "+2889",
          icone: <FontAwesome5 name="users" size={25} color="#3b82f6" />,
          bgColor: "bg-blue-100",
          textColor: "text-blue-600",
        },
      ];


  const actions = [
    {
      icone: <FontAwesome5 name="users" size={35} color="#181c5c" />,
      text: "Utilisateurs",
      other: "Gérer les utilisateurs inscrits sur la plateforme",
      link: "../competitions-screen/creation" as const,
      docToApprove: false,

    },
    {
      icone: <Ionicons name="trophy-outline" size={28} color="#f97316" />,
      text: "Competitions",
      other: "Gérer les compétitions en cours et passées",
      link: "../competitions-screen/participation" as const,
    docToApprove: false,
    },
    {
        icone: <Ionicons name="trophy-outline" size={28} color="#f97316" />,
        text: "Packages & Niveaux",
        other: "Gérer les packs et niveux",
        link: "../competitions-screen/participation" as const,
        docToApprove: false,
      },
      {
        icone: <Ionicons name="checkmark-done-circle-outline" size={28} color="#f97316" />,
        text: "Finances & comptabilité",
        other: "Gérer les paiements et les transactions",
        link: "../competitions-screen/participation" as const,
        docToApprove: false,
      },

      {
        icone: <Ionicons name="checkmark-done-circle-outline" size={28} color="#f97316" />,
        text: "Documents",
        other: "Gérer les documents soumis par les profs",
        link: "../competitions-screen/participation" as const,
        docToApprove: true,
      },
  ];

    useEffect(() => {
        console.log("user:", user);
        console.log("accessToken:", accessToken);
        console.log("others:", others);
     })

     
    return (
        <View className="flex-1 bg-gray-50 pt-[40px] pb-[50px] px-4">
            <TouchableOpacity
                className="flex-row items-center mb-4"
                onPress={() => router.back()}
            >
            <Ionicons name="arrow-back" size={24} color="#181c5c" />
                <Text className="ml-2 text-lg font-semibold text-gray-800">Retour</Text>
            </TouchableOpacity>
            <View className="bg-white p-4 rounded-2xl mb-4 ">
                <Text className="text-lg font-semibold">Welcome, Admin </Text>
                <Text className="text-gray-500 mt-1">
                    Administrer le systeme ExamBoost ici...
                </Text>
            </View>

            {
                !hasSearchFocus && (
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
                        <TouchableOpacity
                    className={` ml-[10px] w-[90%] bg-blue-100 p-4 rounded-xl mb-3 items-center shadow-sm`}
                    >
                    <View className="mb-2">
                        <Ionicons
                            name="checkmark-done-circle-outline"
                            size={28}
                            color="#22c55e"
                        />
                    </View>
                    <Text className={`font-semibold text-center text-emerald-600`}>
                        Montant encaissé
                    </Text>
                    <Text className={`text-xl font-bold mt-1 text-emerald-600`}>
                        120000 XAF
                    </Text>
                    </TouchableOpacity>
                </View>
                )
            }

            <ScrollView>
                <View>
                {!loading &&
                    statistique.length != 0 &&
                    actions.map((act, index) => (
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

                {loading && statistique.length == 0 && (
                    <View className="justify-center items-center">
                    <VStack>
                        <Spinner size="large" color="blue" />
                        <Text>Please wait...</Text>
                    </VStack>
                    </View>
                )}
                </View>
      </ScrollView>
        </View>
    );
}