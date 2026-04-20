// components/UserCard.tsx

import User from "@/app/hooks/entities/user";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Badge } from "lucide-react-native";
import {Text} from "react-native";

export function UserCard({ user }: { user: User }) {
  return (
    <Box className="bg-white mx-4 my-2 p-4 rounded-2xl shadow-sm">
      <HStack className="items-center gap-3">
        <Avatar size="md">
          <AvatarImage source={{ uri: user.imgUrl }} />
          <AvatarFallbackText>{user.surname}</AvatarFallbackText>
        </Avatar>

        <VStack className="flex-1">
          <Text className="font-semibold text-gray-900">{user.surname}</Text>
          <Text className="text-sm text-gray-500">{user.username}</Text>
        </VStack>

        <Badge>
          <Text>{user.role}</Text>
        </Badge>

        <VStack className="items-end">
          <Text className="font-bold text-green-600">
            {user.wallet}
          </Text>
          <Text className="text-xs text-gray-400">Solde</Text>
        </VStack>
      </HStack>
    </Box>
  );
}