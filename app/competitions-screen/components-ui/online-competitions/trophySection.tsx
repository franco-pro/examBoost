import { useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Image } from '@/components/ui/image';
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuizResultScreen() {
    // simple unique user
    const {roomResult} = useAppSelector(state => state.rooms);

    const user = roomResult && roomResult.users ? roomResult.users[0]: null;
    const [competition_totalPoint, setPoint] = useState(0); 
    const router = useRouter()
    const navigation = useNavigation();
    
    useFocusEffect(
      useCallback(() => {
        if (roomResult && Array.isArray(roomResult.questions)) {
          let total = 0;
          roomResult.questions.forEach((q) => {
            total += Number(q.points);
          });
          setPoint(total);
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
  <SafeAreaView style={{ flex: 1 }}>
    
    <ImageBackground
      source={require('../../../../assets/others/congrat.jpeg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <VStack
        className="flex-1 justify-center items-center bg-[#0B042D]/80 px-6"
      >
        {/* Header */}
        <Text className="text-white text-2xl font-semibold mb-3">
          {roomResult?.roomName}
        </Text>
        <Image
            size="xl"
            source={
                require('../../../../assets/others/trophy2.png')
            }
            alt="image"
            className="h-[40%] w-[400px]"
            />


        <Text className="text-white text-xl font-bold mb-2 mt-4">
          Congratulations {user?.username} {user?.surname} !
        </Text>
        <Text className="text-gray-300 text-center mb-6 px-4">
          You’ve completed the quiz successfully! Keep up the great work.
        </Text>

        <VStack className="items-center mb-6">
          <Text className="text-gray-300 mb-1 text-sm">YOUR SCORE</Text>
          <Text className="text-green-400 text-3xl font-bold">{user?.score}/{competition_totalPoint} </Text>

          <Text className="text-gray-300 mt-4 mb-1 text-sm">EARNED COINS</Text>
          <HStack className="items-center">
            <Text className="text-yellow-400 text-2xl mr-2">🪙</Text>
            <Text className="text-white text-2xl font-semibold">{roomResult?.competitionInfo.winnerPrice} </Text>
          </HStack>
        </VStack>

        {/* Buttons */}
        <HStack className="w-full justify-between mt-4">

          <Button
            className="flex-1 ml-2 bg-primary-defaultOrange w-[30%]"
            onPress={goToResult}
          >
            <Text className="text-white font-semibold">Autres Resultats 🔥</Text>
          </Button>
        </HStack>

      </VStack>
     </ImageBackground>
    </SafeAreaView>
    
  );
}
