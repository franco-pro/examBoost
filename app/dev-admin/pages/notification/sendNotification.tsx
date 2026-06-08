import { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FormControl, FormControlLabel, FormControlLabelText, FormControlHelper, FormControlHelperText } from "@/components/ui/form-control";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Pressable } from "@/components/ui/pressable";
import { Divider } from "@/components/ui/divider";
import SpecificNotification from "@/app/helper/Dialogs/specificNotification";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { EmitEventNotif } from "@/app/hooks/services/socket/notifications.gateway";

export default function SendNotification() {
  const [isGeneralNotif, setIsGeneralNotif] = useState(true);
  const [notifText, setNotifText] = useState("");
  const [notifTitle, setNotifTitle] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) router.back();
  }, [user]);

  const doSending =async ()=>{
    if(notifText.length != 0 && notifTitle.length != 0){
        console.log('send notfi')
        const eventNotf = EmitEventNotif(dispatch);
        eventNotf.notificationAdmin(
                              {
                                receiverId: null,
                                adminId: user ? user.id: 0, 
                                text: notifText,
                                title: notifTitle,
                                type: "ADMIN_ALERT"
                              }
                            )
        await new Promise((resolve)=> setTimeout(resolve, 2000))
        setNotifText("");
        setNotifTitle("");

        Alert.alert(
            "Notification Envoyée",
            "La notification a été envoyé a tous les utilisateurs.",
            [
                { text: "OK", onPress: () => {router.back()}, style: "cancel"}
            ]
        )
    }else{
        //alert fill the different text entry
        Alert.alert(
            "Champs incomplets",
            "Veuillez remplir à la fois le titre et le message avant d'envoyer la notification.",
            [
                { text: "OK", onPress: () => {}, style: "cancel"}
            ]
        )
    }
  }

  return (
    <KeyboardAvoidingView
        className='flex-1 w-full max-w-full bg-gray-50 pt-[40px] pb-[50px] px-4'
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0} 
    >

        <TouchableOpacity
            className="flex-row items-center mb-4"
            onPress={() => router.back()}
            >
            <Ionicons name="arrow-back" size={24} color="#181c5c" />
            <Text className="ml-2 text-lg font-semibold text-gray-800">Retour</Text>
        </TouchableOpacity>

      <View className="bg-white pt-5 pl-4 pb-4 shadow-sm border-b border-gray-100">
        <HStack className="items-center" space="sm">
          <View className="w-9 h-9 rounded-full bg-blue-50 items-center justify-center">
            <Ionicons name="notifications" size={18} color="#3B82F6" />
          </View>
          <VStack>
            <Text className="text-lg font-bold text-gray-900 tracking-tight">
              Envoyer une notification
            </Text>
            <Text className="text-xs text-gray-400">
              Diffusez un message à vos utilisateurs
            </Text>
          </VStack>
        </HStack>
      </View>

      <ScrollView
        ref={scrollRef}
        className="mt-2"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
         >
        <VStack space="xl">

          <View className="bg-white rounded-2xl p-1 shadow-sm border border-gray-100 flex-row">
            <Pressable
              onPress={() => setIsGeneralNotif(true)}
              className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl ${
                isGeneralNotif ? "bg-blue-500" : "bg-transparent"
              }`}
            >
              <Ionicons
                name="people"
                size={16}
                color={isGeneralNotif ? "#fff" : "#9CA3AF"}
              />
              <Text
                className={`text-sm font-semibold ${
                  isGeneralNotif ? "text-white" : "text-gray-400"
                }`}
              >
                Général
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setIsGeneralNotif(false)}
              className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl ${
                !isGeneralNotif ? "bg-blue-500" : "bg-transparent"
              }`}
            >
              <Ionicons
                name="person"
                size={16}
                color={!isGeneralNotif ? "#fff" : "#9CA3AF"}
              />
              <Text
                className={`text-sm font-semibold ${
                  !isGeneralNotif ? "text-white" : "text-gray-400"
                }`}
              >
                Spécifique
              </Text>
            </Pressable>
          </View>

          <View
            className={`flex-row items-center gap-2 px-3 py-2 rounded-xl ${
              isGeneralNotif ? "bg-blue-50" : "bg-amber-50"
            }`}
          >
            <Ionicons
              name={isGeneralNotif ? "globe-outline" : "person-circle-outline"}
              size={15}
              color={isGeneralNotif ? "#3B82F6" : "#F59E0B"}
            />
            <Text
              className={`text-xs font-medium ${
                isGeneralNotif ? "text-blue-600" : "text-amber-600"
              }`}
            >
              {isGeneralNotif
                ? "Cette notification sera envoyée à tous les utilisateurs"
                : "Sélectionnez un utilisateur spécifique après la rédaction"}
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <VStack space="lg">

              {/* Title Field */}
              <FormControl>
                <FormControlLabel>
                  <HStack className="items-center" space="xs">
                    <Ionicons name="text" size={13} color="#6B7280" />
                    <FormControlLabelText className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Titre
                    </FormControlLabelText>
                  </HStack>
                </FormControlLabel>
                <Input
                  variant="outline"
                  size="md"
                  className="mt-1 rounded-xl border-gray-200 bg-gray-50"
                >
                  <InputSlot className="pl-3">
                    <Ionicons name="bookmark-outline" size={16} color="#9CA3AF" />
                  </InputSlot>
                  <InputField
                    placeholder="Ex : Mise à jour importante…"
                    value={notifTitle}
                    onChangeText={setNotifTitle}
                    placeholderTextColor="#D1D5DB"
                    className="text-gray-800 text-sm"
                  />
                </Input>
              </FormControl>

              <Divider className="bg-gray-100" />

              {/* Message Field */}
              <FormControl>
                <FormControlLabel>
                  <HStack className="items-center" space="xs">
                    <Ionicons name="chatbubble-ellipses-outline" size={13} color="#6B7280" />
                    <FormControlLabelText className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Message
                    </FormControlLabelText>
                  </HStack>
                </FormControlLabel>
                <Textarea
                  size="md"
                  className="mt-1 rounded-xl border-gray-200 bg-gray-50 min-h-[110px]"
                >
                  <TextareaInput
                    placeholder="Rédigez votre message ici…"
                    value={notifText}
                    onChangeText={setNotifText}
                    placeholderTextColor="#D1D5DB"
                    className="text-gray-800 text-sm p-3"
                  />
                </Textarea>
                <FormControlHelper>
                  <HStack className="items-center mt-1" space="xs">
                    <Ionicons name="information-circle-outline" size={12} color="#9CA3AF" />
                    <FormControlHelperText className="text-xs text-gray-400">
                      Soyez clair et concis pour un meilleur engagement
                    </FormControlHelperText>
                  </HStack>
                </FormControlHelper>
              </FormControl>
            </VStack>
          </View>

          {/* Action Buttons */}
          <VStack space="md">
            {isGeneralNotif ? (
              <Pressable
                className="bg-blue-500 rounded-2xl py-4 flex-row items-center justify-center gap-3 shadow-md shadow-blue-200"
                onPress={() => {doSending}}
              >
                <Ionicons name="send" size={18} color="#fff" />
                <Text className="text-white font-bold text-sm">
                  Envoyer à tout le monde
                </Text>
              </Pressable>
            ) : (
              <Pressable
                className="bg-primary-defaultOrange rounded-2xl py-4 flex-row items-center justify-center gap-3 shadow-md shadow-blue-200"
                onPress={() => setOpenModal(true)}
              >
                <Ionicons name="person-add" size={18} color="#fff" />
                <Text className="text-white font-bold text-sm">
                  Choisir un utilisateur
                </Text>
              </Pressable>
            )}

            {/* Character count / status row */}
            <HStack className="justify-between px-1">
              <HStack className="items-center" space="xs">
                <Ionicons
                  name={notifTitle && notifText ? "checkmark-circle" : "ellipse-outline"}
                  size={13}
                  color={notifTitle && notifText ? "#22C55E" : "#D1D5DB"}
                />
                <Text className="text-xs text-gray-400">
                  {notifTitle && notifText ? "Prêt à envoyer" : "Complétez les champs"}
                </Text>
              </HStack>
              <Text className="text-xs text-gray-400">
                {notifText.length} caractères
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </ScrollView>

      <SpecificNotification
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setIsGeneralNotif(true);
        }}
        userDetails={{
          username: user ? user.username : "",
          id: user ? user.id : 0,
        }}
        notifDetail={{ title: notifTitle, text: notifText }}
      />
    </KeyboardAvoidingView>
  );
}