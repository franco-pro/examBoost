
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
import { FlatList, ImageBackground, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import UsersResult from "./components-ui/online-competitions/usersResult";

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

        
    return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
              source={require('../../assets/others/congrat.jpeg')}
              style={{ flex: 1 }}
              resizeMode="cover"
        >
        <Box>
          <View className="">
            
          <Text className="text-2xl text-white text-center mb-3">
            {competitionName}
          </Text>
    
          <HStack className="justify-center items-end mb-8 space-x-6">
            {top3[1] && (
              <VStack className="items-center mt-[50px] mr-[7%]">
                <Avatar size="lg">
                  {top3[1].imgUrl ? (
                    <AvatarImage source={{ uri: top3[1].imgUrl }} />
                  ) : (
                    <AvatarFallbackText>{top3[1].username.split(" ").map((n) => n[0]).join("")}</AvatarFallbackText>
                  )}
                </Avatar>
                <Text className="mt-2 text-white">{top3[1].username}</Text>
                <Text className="text-sm text-white">{top3[1].score}</Text>
                <Text className="text-lg text-white">2-🥈</Text>
              </VStack>
            )}
    
            {top3[0] && (
              <VStack className="items-center mt-[10px]">
                <Text className="text-2xl">👑</Text>
                <Avatar size="xl" className="border-4 border-yellow-400">
                  {top3[0].imgUrl ? (
                    <AvatarImage source={{ uri: top3[0].imgUrl }} />
                  ) : (
                    <AvatarFallbackText>{top3[0].username.split(" ").map((n) => n[0]).join("")}</AvatarFallbackText>
                  )}
                </Avatar>
                <Text className="mt-2 text-white">{top3[0].username}</Text>
                <Text className="text-sm text-white">{top3[0].score}</Text>
                <Text size='xl' className='text-primary-defaultOrange'> + {roomResult?.competitionInfo.winnerPrice}💰 </Text>

              </VStack>
            )}
    
            {top3.length > 2 && top3[2] ? (
              <VStack className="items-center mt-[50px] ml-[7%]">
                <Avatar size="lg">
                  {top3[2].imgUrl ? (
                    <AvatarImage source={{ uri: top3[2].imgUrl }} />
                  ) : (
                    <AvatarFallbackText>{top3[2].username.split(" ").map((n) => n[0]).join("")}</AvatarFallbackText>
                  )}
                </Avatar>
                <Text className="mt-2 text-white">{top3[2].username}</Text>
                <Text className="text-sm text-white">{top3[2].score}</Text>
                <Text className="text-lg text-white">3-🥉</Text>
              </VStack>
            ): null
          
          }
          </HStack>
          </View>
                <HStack space="md" className='mb-4 mt-[5px]'>
            <Text size="xl" className="text-white ml-[20px]">
                {t("mycompetition.competition.result_screen.rangking")}
            </Text>

            <Switch
              defaultValue={showResult}
              onValueChange={onValueChange}
              trackColor={{ false: '#181c5c', true: '#ff894f' }}
              thumbColor="#181c5c"
              ios_backgroundColor="#ff894f"
            />

          </HStack>

          {
            !showResult && (
              others.length > 0 ?
              <FlatList
            data={others}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <HStack className="bg-neutral-900 rounded-lg p-3 items-center justify-between mb-2">
                <HStack className="items-center m-[5px] space-x-2">
                  <Text className="text-white">{index + 4}</Text>
                  <Avatar size="md" className="ml-[5px]">
                        <AvatarFallbackText>
                            {item.username.split(" ").map((n) => n[0]).join("")}
                         </AvatarFallbackText>
                    {item.imgUrl ? (
                      <AvatarImage source={{ uri: item.imgUrl }} />
                    ) : null}
                  </Avatar>
                  <Text className="text-white ml-[4px]">{item.username}</Text>
                </HStack>
                <Text className="text-sky-400" size="xl">{item.score}</Text>
              </HStack>
            )}
            className="mt-[7px]"
            />
            : <Alert action="info" variant="solid">
                 <AlertIcon as={InfoIcon} />
                 <AlertText>{t("mycompetition.competition.result_screen.no_more_users")}</AlertText>
             </Alert>
            )
          } 

          {
            showResult && (
              <View className="justify-center items-center">
                   <UsersResult room={roomResult} />
              </View>
             
            )
          }
        

        </Box>
        </ImageBackground>
        
    </SafeAreaView>

      );
}
