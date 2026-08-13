
import { Room } from "@/app/hooks/entities/rooms.entity";
import { useAppDispatch } from "@/app/hooks/redux/redux.hooks";
import { setRoomNull } from "@/app/hooks/redux/rooms/rooms.slice";
import RoomsHttp from "@/app/hooks/services/rooms-services/rooms";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { InfoIcon } from "@/components/ui/icon";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, ImageBackground, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import UsersResult from "./components-ui/online-competitions/usersResult";
import { Ionicons } from "@expo/vector-icons";

export default function Result() {
  const {roomID} = useLocalSearchParams() as any;
  const router = useRouter();
  const roomsHttp = RoomsHttp();
  const [roomResult, setRoomResult] = useState<Room|null>(null);
  const dispatch = useAppDispatch();
  const [showResult, setValue] = useState(false);
  const {t} = useTranslation("competition");
 
  useFocusEffect(
    useCallback(() => {
      if(roomID){
        //check backup and get the result data
        roomsHttp.getResult(roomID).then((resp: {data: any, error: null})=>{
           if(resp.data && resp.data.backup){
            const response = {
              ...resp.data.backup,
              roomName: resp.data.backup.competitionInfo.name,
              users: resp.data.backup.participants
            } as Room;
            console.log('result', response);
            setRoomResult({
              ...response,
              users: response.users.sort((a, b) => {
                if (b.score === a.score) {
                  return a.totalTimeTaken - b.totalTimeTaken;
                }
                return b.score - a.score;
              }),
            });

           }else{
            showToast("Sauvegarde introuvable pour cette competition");
            router.back();
           }
        }).catch((error)=>{
            showToast("Sauvegarde introuvable pour cette competition");
            router.back();
        });
        
      }else{
          showToast("Impossible d'effectuer cette opération !")
      }
      return () => {
        dispatch(setRoomNull());
      };
    }, [])
  );
  
function showToast(message: string){
    Toast.show({
      type: 'error',
      text1: 'Error!',
      text2: message,
      position: 'top', // Optional: 'top', 'center', 'bottom'
      visibilityTime: 3500, // Optional: duration in milliseconds
      autoHide: true, // Optional: automatically hide after visibilityTime
    });

  }
  // 🧠 Surveille la mise à jour de roomResult (affichera null après reset)
  useEffect(() => {
    // console.log("roomResult mis à jour :", roomResult);
  }, [roomResult])

  function onValueChange(){
    if(showResult){
      setValue(false);
    }else{
      setValue(true);
    }
  }
    const competitionName = roomResult ? roomResult?.roomName : null;
    const data = roomResult && roomResult.users ? roomResult.users : []

    const top3 = data.length > 2 ? data.slice(0, 3): data.slice(0, 2);
    const others = data.length > 2 ? data.slice(3): [];  

    const getInitials = (name: any) => {
      return name ? name.split(" ").map((n: any) => n[0]).join("").toUpperCase() : "";
    };
    return (
      <ScrollView 
          className="flex-1 bg-[#2E5DA6]/85"
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
        <ImageBackground
          source={require('../../assets/others/congrat.jpeg')}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          {/* Overlay sombre avec la couleur principale (#2E5DA6) */}
          <View className="flex-1 bg-[#2E5DA6]/85 px-4 pt-6">
            
            {/* Titre de la Compétition */}
            <Text className="text-3xl text-white font-extrabold text-center mb-10 tracking-tight">
              {competitionName || "Compétition"}
            </Text>
      
            {/* Section PODIUM */}
            <HStack className="justify-center items-end mb-10 relative">
              
              {/* --- PLACE N°2 --- */}
              {top3[1] && (
                <VStack className="items-center w-[30%]" space="xs">
                  <View className="relative">
                    <Avatar size="lg" className="border-2 border-slate-300">
                      {top3[1].imgUrl ? (
                        <AvatarImage source={{ uri: top3[1].imgUrl }} />
                      ) : (
                        <AvatarFallbackText>{getInitials(top3[1].username)}</AvatarFallbackText>
                      )}
                    </Avatar>
                    <View className="absolute -bottom-2 -right-2 bg-slate-300 rounded-full w-7 h-7 items-center justify-center border-2 border-[#2E5DA6]">
                      <Text className="font-bold text-xs text-[#2E5DA6]">2</Text>
                    </View>
                  </View>
                  <Text className="mt-4 text-white font-medium text-center text-sm" numberOfLines={1}>{top3[1].username}</Text>
                  <Text className="text-xs text-slate-300 font-bold">{top3[1].score} pts</Text>
                  
                  {/* Socle du podium avec Médaille Argent */}
                  <View className="w-full h-16 bg-slate-400/40 rounded-t-lg mt-2 items-center justify-center border-t border-slate-300/30">
                    <Ionicons name="medal" size={28} color="#C0C0C0" />
                  </View>
                </VStack>
              )}
      
              {/* --- PLACE N°1 (Vainqueur) --- */}
              {top3[0] && (
                <VStack className="items-center w-[36%] z-10 -mb-2" space="xs">
                  <View className="relative">
                    {/* Couronne au-dessus de l'avatar */}
                    <View className="absolute -top-6 z-20">
                      <Ionicons name="trophy" size={26} color="#FFD700" />
                    </View>
  
                    <Avatar size="xl" className="border-4 border-[#FFD700]">
                      {top3[0].imgUrl ? (
                        <AvatarImage source={{ uri: top3[0].imgUrl }} />
                      ) : (
                        <AvatarFallbackText>{getInitials(top3[0].username)}</AvatarFallbackText>
                      )}
                    </Avatar>
                    
                    <View className="absolute -bottom-3 -right-2 bg-[#FFD700] rounded-full w-8 h-8 items-center justify-center border-2 border-[#2E5DA6]">
                      <Text className="font-bold text-sm text-[#2E5DA6]">1</Text>
                    </View>
                  </View>
  
                  <Text className="mt-5 text-white font-bold text-center text-base" numberOfLines={1}>{top3[0].username}</Text>
                  <Text className="text-sm text-[#FFD700] font-black">{top3[0].score} pts</Text>
                  
                  {/* Prix du vainqueur avec icône cash */}
                  <HStack className="bg-white/10 px-3 py-1 rounded-full items-center mt-1 border border-white/10 space-x-1">
                    <Ionicons name="cash-outline" size={18} color="#E8720C" />
                    <Text className='text-[#E8720C] font-extrabold text-base'>+{roomResult?.competitionInfo.winnerPrice}</Text>
                  </HStack>
  
                  {/* Socle du podium N°1 */}
                  <View className="w-full h-24 bg-[#FFD700]/30 rounded-t-lg mt-2 items-center pt-3 border-t border-[#FFD700]/50">
                    <Ionicons name="ribbon" size={36} color="#FFD700" />
                  </View>
                </VStack>
              )}
      
              {/* --- PLACE N°3 --- */}
              {top3.length > 2 && top3[2] ? (
                <VStack className="items-center w-[30%]" space="xs">
                  <View className="relative">
                    <Avatar size="lg" className="border-2 border-amber-700">
                      {top3[2].imgUrl ? (
                        <AvatarImage source={{ uri: top3[2].imgUrl }} />
                      ) : (
                        <AvatarFallbackText>{getInitials(top3[2].username)}</AvatarFallbackText>
                      )}
                    </Avatar>
                    <View className="absolute -bottom-2 -right-2 bg-amber-700 rounded-full w-7 h-7 items-center justify-center border-2 border-[#2E5DA6]">
                      <Text className="font-bold text-xs text-white">3</Text>
                    </View>
                  </View>
                  <Text className="mt-4 text-white font-medium text-center text-sm" numberOfLines={1}>{top3[2].username}</Text>
                  <Text className="text-xs text-slate-300 font-bold">{top3[2].score} pts</Text>
                  
                  {/* Socle du podium avec Médaille Bronze */}
                  <View className="w-full h-12 bg-amber-900/40 rounded-t-lg mt-2 items-center justify-center border-t border-amber-700/30">
                    <Ionicons name="medal" size={24} color="#CD7F32" />
                  </View>
                </VStack>
              ) : null}
  
            </HStack>
  
            {/* Header de la Liste & Switch */}
            <HStack className='mb-4 items-center justify-between px-3 py-3 bg-white/5 rounded-xl border border-white/10'>
              <HStack className="items-center space-x-2">
                <Ionicons name="stats-chart" size={20} color="#38BDF8" />
                <Text className="text-xl font-bold text-white ml-1"> 
                  {t("mycompetition.competition.result_screen.rangking")} 
                </Text>
              </HStack>
  
              <HStack className="items-center space-x-2">
                  <Text className="text-white/60 text-xs">{t("mycompetition.competition.result_screen.othersResult")} </Text>
                  <Switch
                    defaultValue={showResult}
                    onValueChange={onValueChange}
                    trackColor={{ false: '#1A2F52', true: '#E8720C' }}
                    thumbColor={showResult ? '#FFFFFF' : '#94A3B8'}
                    ios_backgroundColor="#1A2F52"
                  />
              </HStack>
            </HStack>
  
            {/* Liste des autres participants */}
            {!showResult && others.length > 0 && others.map((item, index) => (
              <HStack key={item.id.toString()} className="bg-white/5 backdrop-blur-sm rounded-xl p-3.5 items-center justify-between mb-2.5 border border-white/10">
                      <HStack className="items-center space-x-3">
                        {/* Rang */}
                        <View className="w-8 h-8 rounded-full bg-[#1A2F52] items-center justify-center border border-white/10">
                          <Text className="text-white font-bold text-sm">{index + 4}</Text>
                        </View>
                        
                        {/* Avatar */}
                        <Avatar size="md" className="border border-white/20">
                          {item.imgUrl ? (
                            <AvatarImage source={{ uri: item.imgUrl }} />
                          ) : (
                            <AvatarFallbackText>{getInitials(item.username)}</AvatarFallbackText>
                          )}
                        </Avatar>
                        
                        {/* Nom */}
                        <Text className="text-white text-base font-semibold ml-1" numberOfLines={1}>{item.username}</Text>
                      </HStack>
                      
                      {/* Score */}
                      <View className="items-end">
                          <Text className="text-cyan-300 text-lg font-bold">{item.score}</Text>
                          <Text className="text-white/50 text-[10px]">points</Text>
                      </View>
                    </HStack>
            ))}

            {!showResult && others.length === 0 && (
                <View className="mt-6">
                <Alert action="info" variant="solid" className="bg-[#1A2F52] border border-cyan-500/30 rounded-xl">
                  <AlertIcon as={InfoIcon} className="text-cyan-400" />
                  <AlertText className="text-white ml-2">
                    {t("mycompetition.competition.result_screen.no_more_users")}
                  </AlertText>
                </Alert>
                </View>
            )}
  
            {/* Vue alternative */}
            {showResult && (
              <View className="justify-center items-center flex-1 bg-white/5 rounded-2xl p-4 border border-white/10 mb-6">
                    <UsersResult room={roomResult} />
              </View>
            )}
  
          </View>
        </ImageBackground>
      </ScrollView>
    );
}
