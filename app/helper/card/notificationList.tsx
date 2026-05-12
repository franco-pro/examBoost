import { NotificationAdmin } from "@/app/dev-admin/pages/notification";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";


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


export function NotificationCard({ item }: { item: NotificationAdmin }) {
    const isGeneral = item.sendMode === "general";
    const userCount = item.users.length;
  
    return (
      <View className="bg-white rounded-2xl mx-5 mb-4 shadow-sm border border-gray-100 overflow-hidden">
        <View
          className={`h-1 w-full ${isGeneral ? "bg-blue-400" : "bg-amber-400"}`}
        />
  
        <View className="p-4">
          <HStack className="items-start justify-between mb-2">
            <HStack className="items-center flex-1 mr-3" space="sm">
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  isGeneral ? "bg-blue-50" : "bg-amber-50"
                }`}
              >
                <Ionicons
                  name={isGeneral ? "people" : "person"}
                  size={15}
                  color={isGeneral ? "#3B82F6" : "#F59E0B"}
                />
              </View>
              <Text
                className="text-sm font-bold text-gray-900 flex-1"
                numberOfLines={1}
              >
                {item.title}
              </Text>
            </HStack>
  
            <View
              className={`px-2 py-1 rounded-full ${
                isGeneral ? "bg-blue-50" : "bg-amber-50"
              }`}
            >
              <Text
                className={`text-[10px] font-semibold ${
                  isGeneral ? "text-blue-500" : "text-amber-500"
                }`}
              >
                {isGeneral ? "Général" : "Spécifique"}
              </Text>
            </View>
          </HStack>
  
          <ExpandableText text={item.text} />
  
          <Divider className="my-3 bg-gray-100" />
  
          <HStack className="items-center justify-between">
            {/* Users count */}
            <HStack className="items-center" space="xs">
              <View className="w-6 h-6 rounded-full bg-gray-100 items-center justify-center">
                <Ionicons name="people-outline" size={13} color="#6B7280" />
              </View>
              <Text className="text-xs text-gray-500 font-medium">
                {userCount === 0
                  ? "Aucun destinataire"
                  : userCount === 1
                  ? "1 destinataire"
                  : `${userCount} destinataires`}
              </Text>
            </HStack>
  
            {/* Date */}
            <HStack className="items-center" space="xs">
              <Ionicons name="time-outline" size={12} color="#9CA3AF" />
              <Text className="text-[11px] text-gray-400">
                {formatDate(item.created_at)}
              </Text>
            </HStack>
          </HStack>
        </View>
      </View>
    );
  }
  