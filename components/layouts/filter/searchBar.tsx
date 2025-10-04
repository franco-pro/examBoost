import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

export default function Filter() {
  const { t } = useTranslation("competition"); // ou "transaction" selon ton namespace

  return (
    <View className="my-4 flex-row items-center bg-gray-100 rounded-full px-4 py-2">
      <Ionicons name="search" size={20} color="#9ca3af" className="mr-2" />
      <TextInput
        placeholder={t("participation.search_placeholder")}
        className="flex-1 text-gray-700 p-2 border-0"
        underlineColorAndroid="transparent"
        style={{ outlineWidth: 0 }}
      />
    </View>
  );
}
