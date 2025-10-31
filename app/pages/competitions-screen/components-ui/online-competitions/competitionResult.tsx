import { useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { InfoIcon } from "@/components/ui/icon";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UsersResult from "./usersResult";

interface LeaderboardProps {
  competitionName: string;
  data: Array<{
    id: number;
    name: string;
    score: number;
    avatarUrl?: string;
  }>;
}

const Leaderboard = () => {
  const {roomResult } = useAppSelector((state) => state.rooms);

  const [showResult, setValue] = useState(false);

  function onValueChange(){
    if(showResult){
      setValue(false);
    }else{
      setValue(true);
    }
  }

    const competitionName = "General Knowledge Quiz";
    const data = [
      { id: 1, username: "John Doe", score: 1500, imgUrl: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png" },
      { id: 2, username: "Jane Smith", score: 1450, imgUrl: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png" },
      { id: 3, username: "Alice Johnson", score: 1400, imgUrl: "https://gluestack.github.io/public-blog-video-assets/john.png" },
      { id: 4, username: "Connor Sarah", score: 1350, imgUrl: "https://gluestack.github.io/public-blog-video-assets/john.png" },
      { id: 5, username: "Steph Greps", score: 1300, imgUrl: "https://gluestack.github.io/public-blog-video-assets/john.png" },
      { id: 6, username: "Hit Karl", score: 1250, imgUrl: "https://gluestack.github.io/public-blog-video-assets/john.png" },
      { id: 7, username: "Doobit", score: 1200, imgUrl: "https://gluestack.github.io/public-blog-video-assets/john.png" },
    ];
    const top3 = data.length > 2 ? data.slice(0, 3): data.slice(0, 2);
    const others = data.length > 2 ? data.slice(3): [];
  
    return (
    <SafeAreaView style={{ flex: 1 }}>
        
        <Box className="flex-1 p-4 bg-sky-100">
          <View className="">
            
          <Text className="text-2xl font-bold text-center mb-6">
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
                <Text className="mt-2 font-semibold">{top3[1].username}</Text>
                <Text className="text-sm text-gray-500">{top3[1].score}</Text>
                <Text className="text-lg">2-🥈</Text>
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
                <Text className="mt-2 font-bold">{top3[0].username}</Text>
                <Text className="text-sm text-gray-500">{top3[0].score}</Text>
                <Text size='xl' className='text-primary-defaultOrange'> + 45 000 💰 </Text>

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
                <Text className="mt-2 font-semibold">{top3[2].username}</Text>
                <Text className="text-sm text-gray-500">{top3[2].score}</Text>
                <Text className="text-lg">3-🥉</Text>
              </VStack>
            ): null
          
          }
          </HStack>
          </View>
                <HStack space="md" className='mb-4 mt-[5px]'>
            <Text size="xl">Classement</Text>

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
                    {item.imgUrl ? (
                      <AvatarImage source={{ uri: item.imgUrl }} />
                    ) : (
                      <AvatarFallbackText>{item.username[0]}</AvatarFallbackText>
                    )}
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
                 <AlertText>No more participants to show !</AlertText>
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
        
    </SafeAreaView>

      );
    };

export default Leaderboard;
