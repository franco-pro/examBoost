import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useGetProfile, useUpdateProfileMutation } from "../features/profiles/hook.rq";
import { useSelector } from "react-redux";
import { RootState } from "../hooks/redux/store";

export default function UserInformationsScreen() {
  const user = useSelector((s: RootState) => s.user.user)
  const userID = user?.id;
  const [isEditing, setIsEditing] = useState(false);
  const { data: profile } = useGetProfile(String(userID) ?? "1");
  const [form, setForm] = useState({
    username: "",
    surname: "",
    email: "",
    phone: "",
    // city: "Douala",
  });

  useEffect(() => {
    if (!profile) return
    
    setForm({
      username: profile?.username ?? "",
      surname: profile?.surname ?? "",
      email: profile?.email ?? "",
      phone: profile?.phone ?? "",
    });
  },[profile])
const uploadProfileMutation = useUpdateProfileMutation(String(userID) || "1", form)

  const router = useRouter();

  

  const handleSave = async () => {
    try {
      console.log(form);
      // mutation update profile
      await uploadProfileMutation.mutateAsync();

      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 50,
        }}
      >
        {/* Header */}

        <View className="px-6 pt-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
          >
            <Ionicons name="arrow-back" size={20} />
          </TouchableOpacity>
        </View>


        {/* Informations */}

        <View className="mx-5 mt-6">
          <Text className="text-lg font-bold mb-4">
            Informations personnelles
          </Text>

          {/* Username */}

          <View className="bg-white rounded-3xl p-4 mb-4">
            <Text className="text-gray-500 mb-2">Nom utilisateur</Text>
            <TextInput
              editable={isEditing}
              value={form.username}
              onChangeText={(text) =>
                setForm({
                  ...form,
                  username: text,
                })
              }
              className="text-lg font-semibold"
            />
          </View>

          {/* Surname */}

          <View className="bg-white rounded-3xl p-4 mb-4">
            <Text className="text-gray-500 mb-2">Nom</Text>

            <TextInput
              editable={isEditing}
              value={form.surname}
              onChangeText={(text) =>
                setForm({
                  ...form,
                  surname: text,
                })
              }
              className="text-lg font-semibold"
            />
          </View>

          {/* Email */}

          <View className="bg-white rounded-3xl p-4 mb-4">
            <Text className="text-gray-500 mb-2">Email</Text>

            <TextInput
              editable={isEditing}
              value={form.email}
              keyboardType="email-address"
              onChangeText={(text) =>
                setForm({
                  ...form,
                  email: text,
                })
              }
              className="text-lg font-semibold"
            />
          </View>

          {/* Phone */}

          <View className="bg-white rounded-3xl p-4 mb-4">
            <Text className="text-gray-500 mb-2">Téléphone</Text>

            <TextInput
              editable={isEditing}
              value={form.phone}
              keyboardType="phone-pad"
              onChangeText={(text) =>
                setForm({
                  ...form,
                  phone: text,
                })
              }
              className="text-lg font-semibold"
            />
          </View>
        </View>

        {/* Actions */}

        <View className="mx-5 mt-5 gap-3">
          {!isEditing ? (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              className="bg-blue-600 h-14 rounded-2xl items-center justify-center"
            >
              <Text className="text-white font-bold text-base">
                Modifier les informations
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                onPress={handleSave}
                className="bg-green-600 h-14 rounded-2xl items-center justify-center"
              >
                <Text className="text-white font-bold text-base">
                  Sauvegarder
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsEditing(false)}
                className="bg-red-500 h-14 rounded-2xl items-center justify-center"
              >
                <Text className="text-white font-bold text-base">Annuler</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
