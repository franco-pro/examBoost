//new page dev administration

import { getHomeData } from "@/app/hooks/redux/dev-admin/dev-admin.thunks";
import { getAllNiveaux } from "@/app/hooks/redux/niveaux/niveaux.thunks";
import { useAppDispatch } from "@/app/hooks/redux/redux.hooks";
import { useAppSelector } from "@/app/redux/redux.hooks";
import { RootState } from "@/app/redux/store";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { JSX, useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useSelector } from "react-redux";
enum AdminActions {
    USERS = "users",
    COMPETITIONS = "competitions",
    PACKS_NIVEAUX = "packs_niveaux",
    FINANCES = "finances",
    DOCUMENTS = "documents",
    NOTIF = "notif",
    MAJ= "maj"
}
export default function DevAdmin() {
    const router = useRouter();
    const [hasSearchFocus, setSerachFocus]= useState(false);
    const loading = false;
    const { user, accessToken, others } = useSelector(
        (state: RootState) => state.user
      );
    const { competitions, totalUsers, documents, accountWallet } = useAppSelector((state)=> state.devadmin);
    const {niveauxList} = useAppSelector((state)=> state.niveaux);

    const dispatch = useAppDispatch();

    useFocusEffect(
        useCallback(()=>{
            if(competitions.total === 0 || totalUsers.total === 0 || documents.total === 0 || accountWallet.totalBalance === 0){
                dispatch(getHomeData());
            }
                

            return ()=>{
                // dispatch(getAllNiveaux());
            }
        }, [])
    )
      const statistique: {
        nom: string;
        chiffre: string;
        icone: JSX.Element;
        bgColor: string;
        textColor: string;
      }[] = [
        {
          nom: "Examens créés",
          chiffre: "+"+competitions.total.toString().toLocaleString("fr-FR"),
          icone: <Ionicons name="trophy-outline" size={28} color="#f97316" />,
          bgColor: "bg-orange-100",
          textColor: "text-orange-600",
        },
        {
          nom: "Users inscrits",
          chiffre: "+"+totalUsers.total.toString().toLocaleString("fr-FR"),
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
      link: "/dev-admin/pages/users" as const,
      docToApprove: false,
      navigationAction : AdminActions.USERS
    },
    {
      icone: <Ionicons name="trophy-outline" size={28} color="#f97316" />,
      text: "Competitions",
      other: "Gérer les compétitions en cours et passées",
      link: "/dev-admin/pages/competitions" as const,
      docToApprove: false,
      navigationAction : AdminActions.COMPETITIONS
    },
    {
        icone: <Ionicons name="analytics-sharp" size={28} color="#181c5c" />,
        text: "Packages & Niveaux",
        other: "Gérer les packs et niveux",
        link: "/dev-admin/pages/packs-niveaux/" as const,
        docToApprove: false,
        navigationAction: AdminActions.PACKS_NIVEAUX
      },
      {
        icone: <Ionicons name="cash" size={28} color="#f97316" />,
        text: "Finances & comptabilité",
        other: "Gérer les paiements et les transactions",
        link: "/dev-admin/pages/finances" as const,
        docToApprove: false,
        navigationAction: AdminActions.FINANCES
      },

      {
        icone: <Ionicons name="documents" size={28} color="#181c5c" />,
        text: "Documents",
        other: "Gérer les documents soumis par les profs",
        link: "/dev-admin/pages/documents" as const,
        docToApprove: true,
        navigationAction: AdminActions.DOCUMENTS
      },

      {
        icone: <Ionicons name="notifications" size={28} color="#181c5c" />,
        text: "Notifications",
        other: "Envoyer des notifications aux utilisateurs du système",
        link: "/dev-admin/pages/notification" as const,
        navigationAction: AdminActions.NOTIF
      },

      {
        icone: <Ionicons name="settings" size={28} color="#181c5c" />,
        text: "Mise à jour",
        other: "Notifier les utilisateurs MAJ et gerer les alertes de MAJ.  ",
        link: "/dev-admin/pages/maj.others" as const,
        navigationAction: AdminActions.MAJ
      },
  ];

   const makeNavigation = (where: AdminActions, link: any)=>{
    switch(where){
        case AdminActions.USERS:
            router.push(link);
            break;
        case AdminActions.COMPETITIONS:
            router.push(link);
            break;
        case AdminActions.PACKS_NIVEAUX:
            router.push(link);
            break;
        case AdminActions.FINANCES:
            router.push(link);
            break;
        case AdminActions.DOCUMENTS:
            router.push(link);
            break;
        case AdminActions.NOTIF:
            router.push(link);
            break;
        case AdminActions.MAJ:
            router.push(link);
            break;
        default:
            router.push(link);
    }
   }

    // useEffect(() => {
    //     console.log("competitions", competitions);
    //     console.log("niveaux", niveauxList);

    //  }, [competitions, totalUsers, documents, accountWallet, niveauxList])

     
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
                        {"+"+accountWallet.competition.toString().toLocaleString("fr-FR")+" FCFA"}
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
                        onPress={() => makeNavigation(act.navigationAction, act.link) }
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

