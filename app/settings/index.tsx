import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { useDeleteUserMutation } from "@/app/features/user/hooks.rq";
import { setCurrentUserId } from "@/app/hooks/redux/session/session.slice";
import { deleteUser, logout, userDatas } from "@/app/hooks/redux/users/users.slice";
import type { AppDispatch, RootState } from "@/app/hooks/redux/store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, useWindowDimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Button, ButtonText } from "@/components/ui/button";
import { buildFileUrl } from "../hooks/files/buildRouteFiles";
import { useUploadProfileMutation } from "../features/profiles/hook.rq";
import { useTranslation } from "react-i18next";
import { toastConfig } from "../config/toast.config";
import { disconnectAllSockets } from "../hooks/services/socket/socket.init";
import { useState } from "react";
import FullscreenLoader from "../helper/Dialogs/loaderFullScreen";

export default function SettingsScreen() {
  const {t} = useTranslation("setting")
  const router = useRouter();
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useRouter()
  const { width } = useWindowDimensions()
  const halfWidth = width * 0.9;
  // console.log("width: ", width*0.5)

  const currentUser = useSelector((s: RootState) => s.user.user);
  // const userID = currentUser?.id;
 
  const {user,loading} = useSelector((s: RootState) => s.user);
  const userID = user?.id;
  const [isLoaderShow, setShowLoader] = useState(false);
const logoutHandle = async () => {
  disconnectAllSockets();
  dispatch(logout());
  // await persistor.purge();
  setShowLoader(true);
  setTimeout(() => {
    if (router.canDismiss()) {
      router.dismissAll();
    }
    navigation.replace("/(auth)/login");
    setShowLoader(false);    
  }, 3000);
  };

  const handleDelete = async () => {
    try {
      //unwrap() c'est pour aller dans le catch si jamais un probleme survient
      await dispatch(deleteUser(userID ?? 0)).unwrap();
      Alert.alert("Success", "Votre compte a été supprimé.");
      // setTimeout(() => {
      //   navigation.replace("/(auth)/login");
      // },3000)
    } catch (error) {
      Alert.alert("Erreur", String(error) || "Impossible de supprimer le compte.");
    }
  }

  //securite avant suppression
  const triggerConfirmDelete = () => {
    Alert.alert(
      "Suppression du compte",
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: handleDelete }
      ]
    );
  }

  //securite avant deconnexion
  const triggerConfirmLogout = () => {
    Alert.alert(
      "Se Deconnecter",
      "Êtes-vous sûr de vouloir vous deconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {text:"Se Deconnecter", style:"default", onPress: logoutHandle}
      ]
    );
  }
  
  const uploadMutation = useUploadProfileMutation()

  const pickImage = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
      });

      if (!res.canceled) {
        uploadMutation.mutate({ userID: userID, image: res.assets[0] });
      }
    } catch (error) {
      console.log("une erreur s'est produire :", error)
    }
  }
  const deleteUserMutation = useDeleteUserMutation();

  const showToast = (
    action: "success" | "error" | "info" | "warning" | "muted",
    title: string,
    desc?: string,
  ) =>
    toast.show({
      placement: "top",
      duration: 2200,
      render: () => (
        <Toast action={action} variant="solid" className="mx-3">
          <ToastTitle bold>{title}</ToastTitle>
          {desc ? <ToastDescription>{desc}</ToastDescription> : null}
        </Toast>
      ),
    });



  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      {/* HEADER */}
      <View className="px-5 pt-2 pb-4 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#181c5c" />
        </Pressable>

        <Text className="text-xl font-extrabold text-typography-default dark:text-white">
          {t("setting.title")}
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* PROFIL CARD */}
        <View className="mx-5 mt-2 rounded-3xl bg-primary-defaultBlue p-5">
          <View className="flex-row items-center">
            <View className="h-16 w-16 rounded-full bg-white items-center justify-center">
              {user?.imgUrl ? (
                <Image
                  source={{ uri: (user.imgUrl) }}
                  className="h-16 w-16 rounded-full"
                />
              ) : (
                <Ionicons name="person" size={32} color="#181c5c" />
              )}
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-white text-lg font-bold">
                {user?.surname || "Utilisateur"}
              </Text>

              <Text className="text-white/80">
                {user?.email || "info@examboost.org"}
              </Text>
            </View>

            <Pressable
              onPress={pickImage}
              className="bg-white/20 px-3 py-2 rounded-full "
            >
              <Ionicons name="create-outline" size={18} color="white" />
            </Pressable>
          </View>

          <View className="mt-4 border-t border-white/20 pt-4 flex-row justify-between">
            <View>
              <Text className="text-white/70 text-xs">
                {t("setting.wallet")}
              </Text>

              <Text className="text-white font-bold text-lg">
                {user?.wallet ?? 0} U
              </Text>
            </View>

            <View>
              <Text className="text-white/70 text-xs">
                {t("setting.level")}
              </Text>

              <Text className="text-white font-bold text-lg">
                {user? user?.niveau?.name || console.log("user:", user):"--"}
              </Text>
            </View>
          </View>
        </View>

        {/* COMPTE */}
        <SectionTitle title={t("setting.account")} />

        <View className="mx-5">
          <SettingsItem
            icon="person-circle"
            label={t("setting.profile")}
            color="#2563EB"
            onPress={() => router.push("/settings/profile" as any)}
          />

          <SettingsItem
            icon="wallet"
            label={t("setting.withdraw")}
            color="#16A34A"
            onPress={() => router.push({ pathname: "/payment-transactions/deposit", params: {type: "WITHDRAWAL"}})}
          />

          <SettingsItem
            icon="key"
            label={t("setting.change_pass")}
            color="#F59E0B"
            onPress={() => router.push("/settings/password" as any)}
          />

          <SettingsItem
            icon="school"
            label={"Resutat d'examen OBC"}
            color="#F59E0B"
            onPress={() => router.push("/settings/examen" as any)}
          />

           {
            user?.role.toLowerCase() == "superadmin" ? (
              <SettingsItem  color="#F59E0B" icon="shield-checkmark" label="Admin Dashboard" onPress={() => router.push("/dev-admin/pages")} />
            ) : null
            } 
            {
            user?.role.toLowerCase() == "admin" ? (
              <SettingsItem color="#16A34A" icon="shield-checkmark" label="Admin Dashboard" onPress={() => router.push("/others-admin/teacher-partner.page")} />
            ) : null
            }
        </View>

        {/* PREFERENCES */}
        <SectionTitle title={t("setting.preference")} />

        <View className="mx-5">
          <SettingsItem
            icon="language"
            label={t("setting.language")}
            color="#8B5CF6"
            onPress={() => router.push("/settings/language" as any)}
          />

          <SettingsItem
            icon="color-palette"
            label={t("setting.appearance")}
            color="#EC4899"
            onPress={() => router.push("/settings/appearance" as any)}
          />
        </View>

        {/* SUPPORT */}
        <SectionTitle title={t("setting.support")} />

        <View className="mx-5">
          <SettingsItem
            icon="information-circle"
            label={t("setting.about")}
            color="#06B6D4"
            onPress={() => router.push("/settings/about" as any)}
          />
        </View>

        {/* DANGER ZONE */}
        <SectionTitle title={t("setting.sensitive_zone")} />
        <View className=" gap-5">
          <View className={` m-auto rounded-2xl`} style={{ width: halfWidth }}>
            <Button
              variant={"solid"}
              action={"negative"}
              onPress={() => triggerConfirmLogout()}
            >
              <ButtonText>{t("setting.logout")}</ButtonText>
            </Button>
          </View>
          <View className="mx-5">
            <Pressable
              onPress={triggerConfirmDelete}
              disabled={loading}
              className={`bg-red-50 border border-red-200 rounded-2xl p-4 flex-row items-center justify-between ${loading && "bg-[#ffaaaa]"}`}
            >
              <View className="flex-row items-center">
                <View className="h-10 w-10 rounded-full bg-red-100 items-center justify-center">
                  <Ionicons name="trash" size={18} color="#DC2626" />
                </View>
                  {loading ? (
                    <ActivityIndicator />
                  ) : (
                    <Text
                      className={`ml-3 text-red-600 font-bold`}
                    >
                      {t("setting.delete_account")}
                    </Text>
                  )}
              </View>

              <Ionicons name="chevron-forward" size={18} color="#DC2626" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <FullscreenLoader visible={isLoaderShow} />
      <Toast />
    </SafeAreaView>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <Text className="mx-5 mt-7 mb-3 text-xs uppercase tracking-widest text-typography-gray font-bold">
      {title}
    </Text>
  );
}

function SettingsItem({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 bg-white dark:bg-outline-900 rounded-2xl px-4 py-4 border border-outline-100 dark:border-outline-800 flex-row items-center justify-between"
    >
      <View className="flex-row items-center">
        <View
          className="h-11 w-11 rounded-full items-center justify-center"
          style={{
            backgroundColor: `${color}20`,
          }}
        >
          <Ionicons name={icon} size={20} color={color} />
        </View>

        <Text className="ml-3 text-sm font-semibold text-typography-default dark:text-white">
          {label}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </Pressable>
  );
}
