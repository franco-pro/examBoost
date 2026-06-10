import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { useChangePasswordMutation } from "@/app/features/user/hooks.rq";

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PasswordScreen() {
  const router = useRouter();
  const toast = useToast();

 
  const changePasswordMutation = useChangePasswordMutation();
  const changingPassword = changePasswordMutation.isPending;

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const valid = useMemo(() => {
    if (currentPwd.trim().length === 0) return false;
    if (newPwd.length < 6) return false;
    if (newPwd !== confirmPwd) return false;
    return true;
  }, [currentPwd, newPwd, confirmPwd]);

  const showToast = (
    action: "success" | "error" | "info" | "warning" | "muted",
    title: string,
    desc?: string,
  ) =>
    toast.show({
      placement: "top",
      duration: 2000,
      render: () => (
        <Toast action={action} variant="solid" className="mx-3">
          <ToastTitle bold>{title}</ToastTitle>
          {desc ? <ToastDescription>{desc}</ToastDescription> : null}
        </Toast>
      ),
    });

  async function onSave() {
    await Haptics.selectionAsync();
    if (!valid) {
      showToast("error", "Échec de la mise à jour", "Vérifiez les champs");
      return;
    }
    try {
      await changePasswordMutation.mutateAsync({
        password: currentPwd,
        newPassword: newPwd,
      });

      showToast("success", "Mot de passe mis à jour");
      router.back();
    } catch (e: any) {
      showToast(
        "error",
        "Échec de la mise à jour",
        e?.message || "Vérifiez les informations",
      );
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark dark:text-white">
      {/* Top bar */}
      <View className="px-4 pt-5 pb-4 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} accessibilityLabel="Retour">
          <Ionicons name="arrow-back" size={22} color="#181c5c" />
        </Pressable>
        <Text className="text-lg font-extrabold text-typography-default dark:text-typography-white">
          Changer le mot de passe
        </Text>
        <View style={{ width: 22 }} />
      </View>

      {/* content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        <View className="px-4 mt-2 gap-5">
          {/* Mot de passe actuel */}
          <View className="gap-3">
            <Text className="text-xs text-typography-gray">
              Mot de passe actuel
            </Text>
            <View
              className={`flex-row items-center  px-3 py-4 rounded-md border border-outline-100 dark:border-outline-800 bg-white dark:bg-outline-900 ${currentPwd.length > 0 && "border-blue-600"}`}
            >
              <Ionicons name="lock-closed" size={18} color="#6B7280" />
              <TextInput
                value={currentPwd}
                onChangeText={setCurrentPwd}
                placeholder="••••••"
                secureTextEntry={!showPwd}
                style={{ outlineStyle: "none", outlineWidth: 0 } as any}
                className={`flex-1 ml-2 text-typography-default dark:text-typography-white`}
              />
              <Pressable
                onPress={() => setShowPwd((s) => !s)}
                accessibilityLabel={showPwd ? "Masquer" : "Afficher"}
              >
                <Ionicons
                  name={showPwd ? "eye-off" : "eye"}
                  size={18}
                  color="#6B7280"
                />
              </Pressable>
            </View>
            {/* {currentPwd.length === 0 ? (
              <Text className="text-xs text-error-500 ">Requis</Text>
            ) : null} */}
          </View>
          {/* Nouveau mot de passe */}
          <View className="gap-3">
            <Text className="text-xs text-typography-gray">
              Nouveau mot de passe
            </Text>
            <View
              className={`flex-row items-center px-3 py-4 rounded-md border ${newPwd.length === 0 && "border-outline-200"} ${newPwd.length >= 6 ? "border-outline-200 dark:border-outline-800" : "border-error-500"}  bg-white dark:bg-outline-900`}
            >
              <Ionicons name="key" size={18} color="#6B7280" />
              <TextInput
                value={newPwd}
                onChangeText={setNewPwd}
                placeholder="Au moins 6 caractères"
                secureTextEntry={!showPwd}
                style={{ outlineStyle: "none", outlineWidth: 0 } as any}
                className={`flex-1 ml-2 text-typography-default dark:text-typography-white`}
              />
              <Pressable
                onPress={() => setShowPwd((s) => !s)}
                accessibilityLabel={showPwd ? "Masquer" : "Afficher"}
              >
                <Ionicons
                  name={showPwd ? "eye-off" : "eye"}
                  size={18}
                  color="#6B7280"
                />
              </Pressable>
            </View>
            {newPwd.length > 0 && newPwd.length < 6 ? (
              <Text className="text-xxs text-error-500">
                Minimum 6 caractères
              </Text>
            ) : null}
          </View>
          {/* confirmer mot de passe  */}
          <View className="gap-3">
            <Text className="text-xs text-typography-gray">
              Confirmer le mot de passe
            </Text>
            <View
              className={`flex-row items-center px-3 py-4 rounded-md border ${confirmPwd.length === 0 && "border-outline-200"} ${confirmPwd && confirmPwd === newPwd ? "border-outline-200 dark:border-outline-800" : "border-error-500"}   bg-white dark:bg-outline-900`}
            >
              <Ionicons name="checkmark-circle" size={18} color="#6B7280" />
              <TextInput
                value={confirmPwd}
                onChangeText={setConfirmPwd}
                placeholder="Répétez le nouveau mot de passe"
                secureTextEntry={!showPwd}
                style={{ outlineStyle: "none", outlineWidth: 0 } as any}
                className={`flex-1 ml-2 text-typography-default dark:text-typography-white`}
              />
              <Pressable
                onPress={() => setShowPwd((s) => !s)}
                accessibilityLabel={showPwd ? "Masquer" : "Afficher"}
              >
                <Ionicons
                  name={showPwd ? "eye-off" : "eye"}
                  size={18}
                  color="#6B7280"
                />
              </Pressable>
            </View>
            {confirmPwd.length > 0 && confirmPwd !== newPwd ? (
              <Text className="text-xs text-error-500">
                Les mots de passe ne correspondent pas
              </Text>
            ) : null}
          </View>

          <View className="flex-row items-center justify-between mt-2 ">
            <Pressable
              disabled={!valid || changingPassword}
              onPress={onSave}
              className={`px-4 py-3 flex-1 rounded-md flex-row items-center justify-center gap-2 text-white ${!valid || changingPassword ? "bg-primary-defaultOrange/30" : "bg-primary-defaultOrange active:opacity-90"}`}
            >
              {changingPassword ? (
                <ActivityIndicator size="small" color="#181c5c" />
              ) : (
                <Ionicons name="save" size={16} color="#181c5c" />
              )}
              <Text className="text-primary-defaultBlue font-extrabold">
                {changingPassword ? "Enregistrement..." : "Enregistrer"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
