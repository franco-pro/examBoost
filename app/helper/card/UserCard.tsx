// components/UserCard.tsx

import { User } from "@/app/features/user/types";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

interface UserCardProps {
  user: User;
  onPress: () => void;
}

export function UserCard({ user, onPress }: UserCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Box className="bg-white mx-4 my-2 p-4 rounded-2xl shadow-sm">
        <HStack className="items-center gap-3">
          <Avatar size="md">
             {user.imgUrl ? (
                          <AvatarImage source={{ uri: user.imgUrl }} />
                        ) : 
                        <AvatarFallbackText>{user.username}</AvatarFallbackText>
                        
                        }
          </Avatar>

          <VStack className="flex-1">
            <Text className="font-semibold text-gray-900">{user.surname}</Text>
            <Text className="text-sm text-gray-500">{user.username}</Text>
          </VStack>

          {user.role.toLowerCase() === "admin" && (
            <Ionicons name="bulb" size={24} color="yellow" />
          )}

          {user.role.toLowerCase() === "superadmin" && (
            <Ionicons name="code-slash" size={24} color="green" />
          )}

          <VStack className="items-end">
            <Text className="font-bold text-green-600">{Number(user.wallet).toLocaleString("fr-FR")} FCFA</Text>
            <Text className="text-xs text-gray-400">Solde</Text>
            <Ionicons name="chevron-forward" size={24} color="black" />
          </VStack>
        </HStack>
      </Box>
    </TouchableOpacity>
  );
}