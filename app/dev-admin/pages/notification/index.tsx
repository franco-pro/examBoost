import { useCallback, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { router, useFocusEffect } from "expo-router";
import { NotificationCard } from "@/app/helper/card/notificationList";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { getAdminNotification } from "@/app/hooks/redux/notifications/notification.thunks";


export interface NotificationAdmin {
  id: number;
  title: string;
  text: string;
  sendMode: string; // "general" | "specific"
  users: {
    id: number;
    username: string;
    surname: string;
    imgUrl: string;
    phone: any;
  }[];
  created_at: Date;
}


function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center px-10 mt-20">
      <View className="w-16 h-16 rounded-full bg-blue-50 items-center justify-center mb-4">
        <Ionicons name="notifications-off-outline" size={30} color="#93C5FD" />
      </View>
      <Text className="text-base font-bold text-gray-700 text-center mb-1">
        Aucune notification envoyée
      </Text>
      <Text className="text-sm text-gray-400 text-center">
        Appuyez sur « Diffusion » pour envoyer votre première notification.
      </Text>
    </View>
  );
}


export default function NotificationList() {

  const {notificationsAdmin: notifications} = useAppSelector(state => state.notifications);
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
        if(notifications.length == 0){
            dispatch(getAdminNotification());
        }
        
    }, [notifications])
  )
    
  return (
    <View  className="flex-1 bg-gray-50 pt-[40px] pb-[10px] px-4">
          <TouchableOpacity
            className="flex-row items-center mb-6"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
            <Text className="ml-2 text-lg font-semibold text-gray-800">Retour</Text>
          </TouchableOpacity>

      <View className="bg-white pt-5 pl-4 pb-4 border-b border-gray-100 shadow-sm">
        <HStack className="items-center" space="sm">
          <View className="w-9 h-9 rounded-full bg-blue-50 items-center justify-center">
            <Ionicons name="notifications" size={18} color="#3B82F6" />
          </View>
          <VStack>
            <Text className="text-lg font-bold text-gray-900 tracking-tight">
              Notifications
            </Text>
            <Text className="text-xs text-gray-400">
              {notifications.length === 0
                ? "Aucune diffusion"
                : `${notifications.length} diffusion${notifications.length > 1 ? "s" : ""}`}
            </Text>
          </VStack>
        </HStack>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 110 }}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <NotificationCard item={item} />}
      />

      <TouchableOpacity
        style={style.fab}
        onPress={() => router.push("/dev-admin/pages/notification/sendNotification")}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={22} color="#fff" />
        <Text style={style.fabText}>Diffusion</Text>
      </TouchableOpacity>
    </View>
  );
}

const style = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F97316",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 50,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  fabText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});