import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { updateBalanceUser } from "@/app/hooks/redux/users/users.slice";
import { useSoundAud } from "@/app/hooks/useSound.hook";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Image } from '@/components/ui/image';
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageBackground, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuizResultScreen() {
    // simple unique user
    const {roomResult} = useAppSelector(state => state.rooms);
    const {t} = useTranslation("competition")
    const user = roomResult && roomResult.users ? roomResult.users[0]: null;
    const [competition_totalPoint, setPoint] = useState(0); 
    const router = useRouter()
    const navigation = useNavigation();
    const {play} = useSoundAud();
    const dispatch = useAppDispatch();

    useFocusEffect(
      useCallback(() => {
        if (roomResult && Array.isArray(roomResult.questions)) {
          let total = 0;
          roomResult.questions.forEach((q) => {
            total += Number(q.points);
          });
          setPoint(total);

          if(roomResult.competitionInfo.winnerPrice != 0 && 
            roomResult.competitionInfo.type !== "TOTAL_FREE_NO_PRICE_TO_WIN"
          ){
              play("TopUpSuccess");
              dispatch(updateBalanceUser(roomResult.competitionInfo.winnerPrice));
          }
      }
    
        const unsubscribe = navigation.addListener("beforeRemove", (e) => {
        
            console.log("Navigation vers une autre page :", e.data.action.type);
        });
    
        return () => {
          unsubscribe();
        };
      }, [navigation])
    );
    
function goToResult(){
    router.replace('/competitions-screen/components-ui/online-competitions/competitionResult')
}
return (
  <SafeAreaView className="flex-1 bg-[#0F172A]">
    <ImageBackground
      source={require('../../../../assets/others/congrat.jpeg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* Overlay sombre basé sur la couleur principale (#2E5DA6) */}
      <View className="flex-1 bg-[#2E5DA6]/85 px-5 justify-between py-6">
        
        {/* Header & Nom du salon */}
        <View className="items-center mt-4">
          <View className="bg-white/10 px-4 py-1.5 rounded-full border border-white/20 mb-2 flex-row items-center space-x-1.5">
            <Ionicons name="ribbon-outline" size={14} color="#38BDF8" />
            <Text className="text-white font-medium text-xs tracking-wider uppercase ml-1">
              {roomResult?.roomName || "Résultat"}
            </Text>
          </View>
          <Text className="text-white text-2xl font-black text-center tracking-tight">
            {t("mycompetition.competition.result_screen.congratulation")}
          </Text>
        </View>

        {/* Section Centrale : Trophée + Nom du Vainqueur */}
        <View className="items-center my-auto">
          {/* Aura lumineuse sous le trophée avec la couleur secondaire (#E8720C) */}
          <View className="relative items-center justify-center">
            <View className="absolute w-48 h-48 bg-[#E8720C]/30 rounded-full blur-2xl" />
            <Image
              source={require('../../../../assets/others/trophy2.png')}
              alt="Trophée"
              className="w-56 h-56 resize-mode-contain"
            />
          </View>

          {/* Carte Utilisateur */}
          <View className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/15 items-center w-full mt-2 shadow-lg">
            <View className="flex-row items-center justify-center mb-1">
              <Ionicons name="sparkles" size={18} color="#FFD700" />
              <Text className="text-white text-xl font-bold text-center ml-1.5">
                {user?.username} {user?.surname}
              </Text>
            </View>
            <Text className="text-blue-100/80 text-xs text-center">
              {t("mycompetition.competition.result_screen.congratulation")}
            </Text>
          </View>
        </View>

        {/* Section Statistiques (Score & Gain) */}
        <View className="flex-row justify-between mb-6 gap-3">
          
          {/* Carte Score */}
          <View className="flex-1 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 items-center">
            <View className="flex-row items-center mb-1.5">
              <Ionicons name="checkmark-circle-outline" size={16} color="#34D399" />
              <Text className="text-blue-200 text-xs font-medium ml-1">
                {t("mycompetition.competition.result_screen.yr_score")}
              </Text>
            </View>
            <View className="flex-row items-baseline">
              <Text className="text-emerald-400 text-2xl font-black">
                {user?.score ?? 0}
              </Text>
              <Text className="text-white/60 text-sm font-semibold">
                /{competition_totalPoint}
              </Text>
            </View>
          </View>

          {/* Carte Gain */}
          <View className="flex-1 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 items-center">
            <View className="flex-row items-center mb-1.5">
              <Ionicons name="wallet-outline" size={16} color="#E8720C" />
              <Text className="text-blue-200 text-xs font-medium ml-1">
                {t("mycompetition.competition.result_screen.gain")}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="cash" size={22} color="#FFD700" />
              <Text className="text-[#E8720C] text-2xl font-black ml-1.5">
                {roomResult ? roomResult.competitionInfo.winnerPrice : 0}
              </Text>
            </View>
          </View>

        </View>

        {/* Bouton d'action principal */}
        <TouchableOpacity
          className="w-full bg-[#E8720C] active:bg-[#d6650a] py-4 rounded-2xl shadow-lg flex-row justify-center items-center"
          onPress={goToResult}
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-bold mr-2">
            {t("mycompetition.competition.result_screen.othersResult")}
          </Text>
          <Ionicons name="flame" size={20} color="#FFFFFF" />
        </TouchableOpacity>

      </View>
    </ImageBackground>
  </SafeAreaView>
);
}
