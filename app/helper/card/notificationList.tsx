import { NotificationAdmin } from "@/app/hooks/redux/notifications/notifications.slice";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Box } from "@/components/ui/box";
import { Badge, BadgeText } from "@/components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallbackText,
} from "@/components/ui/avatar";
import { VStack } from "@/components/ui/vstack";

function formatDate(date: Date) {
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ExpandableText({ text, limit = 100 }: { text: string; limit?: number }) {
    const [expanded, setExpanded] = useState(false);
    const isLong = text.length > limit;
    const displayed = expanded || !isLong ? text : text.slice(0, limit) + "…";
  
    return (
      <View>
        <Text className="text-sm text-gray-600 leading-5">{displayed}</Text>
        {isLong && (
          <Pressable onPress={() => setExpanded((v) => !v)} className="mt-1">
            <HStack className="items-center" space="xs">
              <Text className="text-xs font-semibold text-blue-500">
                {expanded ? "Voir moins" : "Voir plus"}
              </Text>
              <Ionicons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={12}
                color="#3B82F6"
              />
            </HStack>
          </Pressable>
        )}
      </View>
    );
  }


export const NotificationCard = ({ item }: { item: NotificationAdmin }) => {
  return (
    <Pressable className="mx-4 mb-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
      {/* Header */}
      <HStack className="justify-between items-start">
        <HStack space="sm" className="flex-1">
          <Avatar size="md">
            <AvatarImage
              source={{
                uri:
                  item.sender?.imgUrl ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(
                      `${item.sender?.username ?? ""} ${item.sender?.surname ?? ""}`
                    ),
              }}
            />
            <AvatarFallbackText>
              {item.sender?.username} {item.sender?.surname}
            </AvatarFallbackText>
          </Avatar>

          <VStack className="flex-1">
            <Text className="font-semibold text-gray-900">
              {item.sender?.username} {item.sender?.surname}
            </Text>

            <Text className="text-xs text-gray-500">
              @{item.sender?.username}
            </Text>

            <Badge
              action={item.isRead ? "success" : "warning"}
              className={`mt-2 self-start ${
                item.isRead
                  ? "bg-green-50 border-green-200"
                  : "bg-orange-50 border-orange-200"
              }`}
            >
              <BadgeText
                className={
                  item.isRead ? "text-green-700" : "text-orange-700"
                }
              >
                {item.isRead ? "Lu" : "Non lu"}
              </BadgeText>
            </Badge>
          </VStack>
        </HStack>

        <Text className="text-xs text-gray-400">
          {formatDate(item.created_at)}
        </Text>
      </HStack>

      {/* Titre */}
      <Text className="mt-4 text-base font-bold text-blue-700">
        {item.title}
      </Text>

      {/* Message */}
      <ExpandableText text={item.text} limit={150} />

      {/* Type */}
      <HStack className="mt-4">
        <Badge className="bg-blue-50 border-blue-100">
          <BadgeText className="text-blue-700">{item.type}</BadgeText>
        </Badge>
      </HStack>

      {/* Receiver */}
      <Box className="mt-4 rounded-xl bg-orange-50 px-3 py-3 border border-orange-100">
        <Text className="mb-2 text-xs font-medium uppercase tracking-wide text-orange-700">
          Destinataire
        </Text>

        <HStack space="sm" className="items-center">
          <Avatar size="sm">
            <AvatarImage
              source={{
                uri:
                  item.receiver?.imgUrl ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(
                      `${item.receiver?.username ?? ""} ${
                        item.receiver?.surname ?? ""
                      }`
                    ),
              }}
            />
            <AvatarFallbackText>
              {item.receiver?.username} {item.receiver?.surname}
            </AvatarFallbackText>
          </Avatar>

          <VStack>
            <Text className="font-medium text-gray-900">
              {item.receiver?.username} {item.receiver?.surname}
            </Text>

            <Text className="text-xs text-gray-500">
              @{item.receiver?.username}
            </Text>
          </VStack>
        </HStack>
      </Box>
    </Pressable>
  );
};
