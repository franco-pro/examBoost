import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface OnlineUsersProps {
    user: {
            name: string, 
            avatarUrl: string, 
            score: number, 
            isConnected: boolean,
            isWinner: boolean
        }[];

}
export default function OnlineUsers({user}: OnlineUsersProps) {
  return (
    //check if the list contain user
    <Card size="lg" variant="ghost" className="p-5 shadow-xl w-[48%] max-w-[50%] absolute top-0 right-0 rounded-lg  h-64 m-3">
    <Text className="text-sm font-normal mb-2 text-typography-700">
      Octobre 04, 2025
    </Text>
    <VStack className="mb-6">
      <Heading size="md" className="mb-4">
        Connected User ({user.length})
      </Heading>
    </VStack>
    <ScrollView className="mt-3">
    {
     user.length === 0 ? (
        <Text className="text-sm font-normal mb-2 text-typography-700">
          No user connected
        </Text>
     ) : user.map((u, index) => (
      <Box key={index} className="flex-row mb-4 items-center">
        <Avatar className="mr-3">
          <AvatarFallbackText>
            {u.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallbackText>
          {u.avatarUrl ? (
            <AvatarImage source={{ uri: u.avatarUrl }} alt="image" />
          ) : null}
          {
            u.isConnected ? (
                <AvatarBadge />
            ): null
          }
        </Avatar>
        
        <VStack>
          <Heading size="sm" className="mb-1">
            {u.name}
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
