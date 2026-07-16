import { useEffect, useRef, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../hooks/redux/store";
import { useTranslation } from "react-i18next";
import { getAllNiveaux } from "../hooks/redux/niveaux/niveaux.thunks";
import BottomSheet from "@gorhom/bottom-sheet";
import LevelBottomSheet from "./utils/levelBottomSheet";

export default function UserInformationsScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const {t} = useTranslation("setting")
  const dispatch = useDispatch<AppDispatch>()
  const {niveauxList}= useSelector((state:RootState)=>state.niveaux)
  const user = useSelector((s: RootState) => s.user.user)
  const userID = user?.id;
  const [isEditing, setIsEditing] = useState(false);
  const { data: profile } = useGetProfile(String(userID) ?? "1");
  const [form, setForm] = useState({
    username: "",
    surname: "",
    email: "",
    phone: "",
    niveauID: 0
    // city: "Douala",
  });

  const selectedLevel = niveauxList.find((niveau) => niveau.id === form.niveauID);

  //fonction d'ouverture
  const openLevels = () => {
    bottomSheetRef.current?.expand();
  };

  useEffect(() => {
    if (!profile) return    
    setForm({
      username: profile?.username ?? "",
      surname: profile?.surname ?? "",
      email: profile?.email ?? "",
      phone: profile?.phone ?? "",
      niveauID: profile?.niveauID??""
    });
  },[profile])

  useEffect(() => {
    dispatch(getAllNiveaux())
  },[])
const uploadProfileMutation = useUpdateProfileMutation(String(userID))

  const router = useRouter();

  
const initialLevel = profile?.niveauID
const levelChanged = initialLevel !== form.niveauID
  const handleSave = async () => {
    try {
      console.log("form and levels value:", form, "initial level:", initialLevel, "levelchanged:", levelChanged);
      // mutation update profile
      await uploadProfileMutation.mutateAsync({...form, levelChanged});
      setIsEditing(false);
      if (form.niveauID !== selectedLevel?.id) {
        router.replace("/(auth)/login")
      }
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
            <Text className="text-gray-500 mb-2">
              {t("setting.change_datas.firstname")}
            </Text>
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
            <Text className="text-gray-500 mb-2">
              {t("setting.change_datas.surname")}
            </Text>

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
            <Text className="text-gray-500 mb-2">
              {t("setting.change_datas.email")}
            </Text>

            <TextInput
              editable={false}
              value={form.email}
              keyboardType="email-address"
              onChangeText={(text) =>
                setForm({
                  ...form,
                  email: text,
                })
              }
              className="text-lg text-gray-500 font-semibold"
            />
          </View>

          {/* Phone */}

          <View className="bg-white rounded-3xl p-4 mb-4">
            <Text className="text-gray-500 mb-2">
              {t("setting.change_datas.number")}
            </Text>

            <TextInput
              editable={false}
              value={form.phone}
              keyboardType="phone-pad"
              onChangeText={(text) =>
                setForm({
                  ...form,
                  phone: text,
                })
              }
              className="text-lg font-semibold text-gray-500"
            />
          </View>

          {/* niveaux */}
          <View className="bg-white rounded-3xl p-4 mb-4">
            <Text className="text-gray-500 mb-2">
              {t("setting.change_datas.level")}
            </Text>

            <TouchableOpacity
              onPress={openLevels}
              disabled={!isEditing}
              className={`h-14 rounded-2xl px-4 justify-center ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-semibold">
                  {selectedLevel?.name ?? "Choisir un niveau"}
                </Text>

                <Ionicons name="chevron-down" size={20} />
              </View>
            </TouchableOpacity>
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
                {t("setting.change_datas.editText")}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                onPress={handleSave}
                className="bg-green-600 h-14 rounded-2xl items-center justify-center"
              >
                <Text className="text-white font-bold text-base">
                  {t("setting.change_datas.save")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsEditing(false)}
                className="bg-red-500 h-14 rounded-2xl items-center justify-center"
              >
                <Text className="text-white font-bold text-base">
                  {t("setting.change_datas.cancel")}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
      <LevelBottomSheet
        ref={bottomSheetRef}
        data={niveauxList}
        selected={form.niveauID}
        onSelect={(item) => {
          setForm({
            ...form,
            niveauID: item.id,
          });

          bottomSheetRef.current?.close();
        }}
      />
    </SafeAreaView>
  );
}


