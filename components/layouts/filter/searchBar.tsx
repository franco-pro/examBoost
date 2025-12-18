import { setSearchResults } from "@/app/hooks/redux/competitions-suscriptions/subscription.slice";
import { setSearchResultsComp } from "@/app/hooks/redux/competitions/competitions.slice";
import { useAppDispatch } from "@/app/hooks/redux/redux.hooks";
import Competition from "@/app/hooks/services/competitions/competition.entity";
import { filterByCompetitionName, filterByCompetitionStatut, filterByCompetitionType } from "@/app/services/compeititonService/search_filter";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

interface FilterProps {
  list: Competition[];
  foundIn: "competitions" | "subscriptions";
}

export default function Filter({ list, foundIn }: FilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useAppDispatch();
  const {t} = useTranslation("competition");

  function filterFunc(text: string, searchType: "type" | "name" | "status") {
    if(searchType === "name"){
      if(text.length === 0){
        // Si le texte de recherche est vide, réinitialiser les résultats de recherche
        dispatch(foundIn == "subscriptions" ? setSearchResults([]): setSearchResultsComp([]) );
        setShowFilters(false);
        return;
      }
      const rslt = filterByCompetitionName(text, list);
      if(rslt.found){
        dispatch(foundIn == "subscriptions" ? setSearchResults(rslt.finalList): setSearchResultsComp(rslt.finalList) );

      }
    }else if(searchType === "status"){
      // Implémenter le filtrage par statut si nécessaire
      // ONGOING, COMPLETED, UPCOMING, CANCELED
      if(text === "ONGOING" || text === "COMPLETED" || text === "UPCOMING" || text === "CANCELLED"){
        const rslt = filterByCompetitionStatut(text, list);
        if(rslt.found){
          dispatch(foundIn == "subscriptions" ? setSearchResults(rslt.finalList): setSearchResultsComp(rslt.finalList) );
        }
      }
  }else if(searchType === "type"){
      // Implémenter le filtrage par type si nécessaire
      const rslt = filterByCompetitionType(text as "PAID_REGISTRATION_AS_WINNER_PRICE"|
                                                   "FREE_REGISTRATION_WITH_WINNER_PRICE"|
                                                   "PAID_REGISTRATION_WITH_WINNER_PRICE"|
                                                   "TOTAL_FREE_NO_PRICE_TO_WIN", list);
      if(rslt.found){
        dispatch(foundIn == "subscriptions" ? setSearchResults(rslt.finalList): setSearchResultsComp(rslt.finalList) );
      }                                                   
    }

    setShowFilters(false);
}


  return (
    <View className="relative my-4">
      {/* Barre de recherche */}
      <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          placeholder={t("mycompetition.searchBar.searchLabel")}
          className="flex-1 text-gray-700 p-2"
          underlineColorAndroid="transparent"
          style={{ outlineWidth: 0 }}
          onChangeText={(text) => filterFunc(text, "name")}
        />

        {/* Bouton filtre */}
        <TouchableOpacity onPress={() => setShowFilters(true)}>
          <Ionicons name="filter" size={22} color="#4b5563" />
        </TouchableOpacity>
      </View>

      {/* Menu de filtres en z-index (Modal) */}
      <Modal
        visible={showFilters}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilters(false)}
      >
        <Pressable
          className="flex-1 bg-black/30"
          onPress={() => setShowFilters(false)}
        >
          <ScrollView
            className="absolute h-[200px] right-4 top-16 bg-white  rounded-2xl p-4 shadow-lg w-60"
            style={{ elevation: 10 }}
          >
            
            <Text className="text-gray-900 font-semibold mb-3">{t("mycompetition.searchBar.filters")}</Text>

            {/* Statut */}
            <Pressable 
              className="py-3 border-b border-gray-200"
              onPress={() => filterFunc("ONGOING", "status")}
            >
              <Text className="text-gray-700">{t("mycompetition.searchBar.status.ongoing")}</Text>
            </Pressable>

            <Pressable 
            className="py-3 border-b border-gray-200"
            onPress={() => filterFunc("COMPLETED", "status")}

            >
              <Text className="text-gray-700">{t("mycompetition.searchBar.status.completed")}</Text>
            </Pressable>

            <Pressable 
            className="py-3 border-b border-gray-200"
            onPress={() => filterFunc("CANCELLED", "status")}

            >
              <Text className="text-gray-700">{t("mycompetition.searchBar.status.cancelled")}</Text>
            </Pressable>

            <Pressable 
            className="py-3 border-b border-gray-200"
            onPress={() => filterFunc("UPCOMING", "status")}
            >
              <Text className="text-gray-700">{t("mycompetition.searchBar.status.upcoming")}</Text>
            </Pressable>

            {/* filtre type */}
            <Pressable 
            className="py-3 border-b border-gray-200"
            onPress={() => filterFunc("PAID_REGISTRATION_WITH_WINNER_PRICE", "type")}                        
            >
              <Text className="text-gray-700">Type : Golden A</Text>
            </Pressable>
            <Pressable 
            className="py-3 border-b border-gray-200"
            onPress={() => filterFunc("FREE_REGISTRATION_WITH_WINNER_PRICE", "type")}                        
            >
              <Text className="text-gray-700">Type : Golden B</Text>
            </Pressable>
            <Pressable 
            className="py-3 border-b border-gray-200"
            onPress={() => filterFunc("PAID_REGISTRATION_AS_WINNER_PRICE", "type")}            
            >
              <Text className="text-gray-700">Type : Golden C</Text>
            </Pressable>
            <Pressable 
            className="py-3 border-b border-gray-200"
            onPress={() => filterFunc("TOTAL_FREE_NO_PRICE_TO_WIN", "type")}
            >
              <Text className="text-gray-700">Type : Golden D</Text>
            </Pressable>

            
            <Pressable 
            className="py-3 border-b border-gray-200"
            onPress={() => filterFunc("", "name")}
            >
              <Text className="text-gray-700">{t("mycompetition.searchBar.all")}</Text>
            </Pressable>

          </ScrollView>
        </Pressable>
      </Modal>
    </View>
  );
}
