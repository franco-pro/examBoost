import { UserOnline } from "@/app/hooks/entities/user.online.entity";
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Image } from '@/components/ui/image';
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";

interface OnlineUsersProps {
    user: UserOnline[];
    max: number
}
export default function OnlineUsers({user, max}: OnlineUsersProps) {
 const date = new Date().toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
  return (
    //check if the list contain user
    <Card size="lg" variant="elevated" className="p-5 shadow-xl w-[48%] max-w-[50%] absolute top-0 right-0 rounded-lg  h-64 m-3">
    <Text className="text-sm font-normal mb-2 text-typography-700">
        {date}
    </Text>
    <VStack className="mb-1">
      <Heading size="md" className="mb-1">
        Connected User ({user.filter(user => user.isConnected).length})/{max}
      </Heading>
    </VStack>
    <ScrollView className="mt-3">
    {
     user.length === 0 ? (
      <View className="justify-center items-center">
            <VStack>
                <Image
                      size="xl"
                      alt="image"
                      source={require('../../../../../assets/others/nodata.png')}
                  />
            <Text className="text-sm font-normal mb-2 text-typography-700">
              No user connected
            </Text>

            </VStack>
       </View>
       
     ) : user.map((u, index) => (
      <Box key={index} className="flex-row mb-4 items-center">
        <Avatar className="mr-3">
          <AvatarFallbackText>
            {u.username ? u.username.split(" ").map((n) => n[0]).join(""): null}
          </AvatarFallbackText>
          {u.imgUrl ? (
            <AvatarImage source={{ uri: u.imgUrl }} alt="image" />
          ) : null}
          {
            u.isConnected ? (
                <AvatarBadge />
            ): null
          }
        </Avatar>
        
        <VStack>
          <Heading size="sm" className="mb-1">
            {u.username}
          </Heading>
          <Text size="sm">Score: 
          <Text size="sm" className="text-primary-defaultBlue"> {u.score} </Text> 
            {
                u.isWinner ? (
                    <Text className="text-xs text-green-600 font-medium"> 🏆</Text>
                ): null
            }
          </Text>
        </VStack>
      </Box>
    ))}
  </ScrollView>
    </Card>
  );

}   
