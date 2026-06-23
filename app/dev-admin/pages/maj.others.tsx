import React, { useCallback } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Box } from "@/components/ui/box";
import { ButtonText, Button } from "@/components/ui/button";
import { Pressable } from "@/components/ui/pressable";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { useFocusEffect } from "expo-router";
import { getAllOthers } from "@/app/hooks/redux/others/others.thunks";
import { Others } from "@/app/hooks/services/others/others.entitie";
import { setSelectedOther } from "@/app/hooks/redux/others/others.slice";
import { Ionicons } from "@expo/vector-icons";


// const data: Others[] = [
//     {
//       id: 1,
//       newUpdate: true,
//       update_link_ios: "https://apps.store.com/",
//       update_link_android: "https://play.store.com/",
//       text: "Veuillez effectuer la mise à jour.",
//       version_available: "2.1.0",
//       features: "Correction des bugs de connexion et amélioration des performances.",
//       updateDeadline: new Date("2026-08-30"),
//       createAt: null,
//       updateAt: null,
//     },
//     {
//       id: 2,
//       newUpdate: false,
//       update_link_ios: "",
//       update_link_android: "",
//       text: "Veuillez effectuer la mise à jour.",
//       version_available: "2.2.0",
//       features: "Ajout du système de notifications push.",
//       updateDeadline: new Date("2026-09-15"),
//       createAt: null,
//       updateAt: null,
//     },
//   ];

export default function OthersListScreen() {
  const {othersList: data} = useAppSelector(state => state.others);
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
        if(data.length == 0){
            dispatch(getAllOthers());
        }
    }, [])
  )

  const renderItem = ({ item }: { item: Others }) => (
    <Box className="mx-4 mb-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
      {/* Version */}
      <Box className="mb-2 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-blue-700">
          Version {item.version_available}
        </Text>

        {item.newUpdate && (
          <Box className="rounded-full bg-orange-100 px-3 py-1">
            <Text className="text-xs font-medium text-orange-600">
              Nouvelle MAJ
            </Text>
          </Box>
        )}
      </Box>

      {/* Description */}
      <Text
        numberOfLines={3}
        className="mb-3 text-sm leading-5 text-slate-600"
      >
        {item.features}
      </Text>

      {/* Deadline */}
      <Box className="mb-4 rounded-lg bg-blue-50 p-3">
        <Text className="text-xs text-blue-500">
          Date limite de mise à jour
        </Text>

        <Text className="font-semibold text-blue-800">
          {new Date(item.updateDeadline).toLocaleDateString("fr-FR")}
        </Text>
      </Box>

      {/* Bouton Modifier */}
      <Button
        className="rounded-xl bg-orange-500"
        onPress={() =>navigateToForm(true, item)
        }
      >
        <ButtonText>Modifier</ButtonText>
      </Button>
    </Box>
  );

  const navigateToForm = (isModeEdit: boolean, dataChoosed?: Others) => {
        if(isModeEdit && dataChoosed){
            dispatch(setSelectedOther(dataChoosed))
            router.push(`/dev-admin/pages/maj/maj.form`);
        }else{
          router.push(`/dev-admin/pages/maj/maj.form`);
        }
        
  }

  function doRefresh(){
    dispatch(getAllOthers())
  }
  return (
  <View className="flex-1 bg-gray-50 pt-[40px] pb-[10px] px-4">
     <TouchableOpacity
        className="flex-row items-center mb-6"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={"gray"} />
        <Text className="ml-2 text-lg font-semibold text-gray-800">Retour</Text>
      </TouchableOpacity>
      
     {
      (Array.isArray(data) && data.length !== 0) ? (
        <Box className="bg-slate-50">
          <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: 100,
          }}
          />
        </Box>
      
      )
      :
        (<Box className="flex-1 items-center justify-center bg-slate-50">
          <Text className="text-lg font-semibold text-slate-700">
            Aucune mise à jour disponible.
          </Text>
          <Text className="mt-2 text-center text-sm text-slate-500">
            Vous pouvez créer une nouvelle mise à jour en cliquant sur le bouton
            ci-dessous.
          </Text>

          <Button
            className="mt-6 rounded-xl bg-blue-600"
            onPress={() => navigateToForm(false)}
          >
            <ButtonText>Créer une mise à jour</ButtonText>
          </Button>
        </Box>)
      }
      

     
     {/* FAB */}
     <Pressable
        onPress={() => navigateToForm(false)}
        className="absolute bottom-6 right-6 h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-lg"
      >
        <Text className="text-3xl font-bold text-white">+</Text>
      </Pressable>
    </View>
  );
}