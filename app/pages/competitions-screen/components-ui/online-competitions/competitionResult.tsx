import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { FlatList } from "react-native";

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
    const competitionName = "General Knowledge Quiz";
    const data = [
      { id: 1, name: "John Doe", score: 1500, avatarUrl: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png" },
      { id: 2, name: "Jane Smith", score: 1450, avatarUrl: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png" },
      { id: 3, name: "Alice Johnson", score: 1400, avatarUrl: "https://gluestack.github.io/public-blog-video-assets/john.png" },
      { id: 4, name: "Connor Sarah", score: 1350, avatarUrl: "https://gluestack.github.io/public-blog-video-assets/john.png" },
      { id: 5, name: "Steph Greps", score: 1300, avatarUrl: "https://gluestack.github.io/public-blog-video-assets/john.png" },
      { id: 6, name: "Hit Karl", score: 1250, avatarUrl: "https://gluestack.github.io/public-blog-video-assets/john.png" },
      { id: 7, name: "Doobit", score: 1200, avatarUrl: "https://gluestack.github.io/public-blog-video-assets/john.png" },
    ];
    const top3 = data.slice(0, 3);
    const others = data.slice(3);
  
    return (
        <Box className="flex-1 bg-sky-100 p-4">
            
          <Text className="text-2xl font-bold text-center mb-6">
            {competitionName}
          </Text>
    
          <HStack className="justify-center items-end mb-8 space-x-6">
            {top3[1] && (
              <VStack className="items-center mt-[50px]">
                <Avatar size="lg">
                  {top3[1].avatarUrl ? (
                    <AvatarImage source={{ uri: top3[1].avatarUrl }} />
                  ) : (
                    <AvatarFallbackText>{top3[1].name.split(" ").map((n) => n[0]).join("")}</AvatarFallbackText>
                  )}
                </Avatar>
                <Text className="mt-2 font-semibold">{top3[1].name}</Text>
                <Text className="text-sm text-gray-500">{top3[1].score}</Text>
                <Text className="text-lg">2-🥈</Text>
              </VStack>
            )}
    
            {top3[0] && (
              <VStack className="items-center mt-[10px]">
                <Text className="text-2xl">👑</Text>
                <Avatar size="xl" className="border-4 border-yellow-400">
                  {top3[0].avatarUrl ? (
                    <AvatarImage source={{ uri: top3[0].avatarUrl }} />
                  ) : (
                    <AvatarFallbackText>{top3[0].name.split(" ").map((n) => n[0]).join("")}</AvatarFallbackText>
                  )}
                </Avatar>
                <Text className="mt-2 font-bold">{top3[0].name}</Text>
                <Text className="text-sm text-gray-500">{top3[0].score}</Text>
                <Text size='xl' className='text-primary-defaultOrange'> + 45 000 💰 </Text>

              </VStack>
            )}
    
            {top3[2] && (
              <VStack className="items-center mt-[50px]">
                <Avatar size="lg">
                  {top3[2].avatarUrl ? (
                    <AvatarImage source={{ uri: top3[2].avatarUrl }} />
                  ) : (
                    <AvatarFallbackText>{top3[2].name.split(" ").map((n) => n[0]).join("")}</AvatarFallbackText>
                  )}
                </Avatar>
                <Text className="mt-2 font-semibold">{top3[2].name}</Text>
                <Text className="text-sm text-gray-500">{top3[2].score}</Text>
                <Text className="text-lg">3-🥉</Text>
              </VStack>
            )}
          </HStack>
    
          <FlatList
            data={others}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <HStack className="bg-neutral-900 rounded-lg p-3 items-center justify-between mb-2">
                <HStack className="items-center space-x-2">
                  <Text className="text-white">{index + 4}</Text>
                  <Avatar size="sm">
                    {item.avatarUrl ? (
                      <AvatarImage source={{ uri: item.avatarUrl }} />
                    ) : (
                      <AvatarFallbackText>{item.name[0]}</AvatarFallbackText>
                    )}
                  </Avatar>
                  <Text className="text-white">{item.name}</Text>
                </HStack>
                <Text className="text-sky-400">{item.score}</Text>
              </HStack>
            )}
          />
        </Box>
      );
    };

export default Leaderboard;
