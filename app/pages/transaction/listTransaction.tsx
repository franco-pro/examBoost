import { View, Text, Button } from "react-native";
import { useTranslation } from "react-i18next";

export default function ListTransaction() {
  const { t, i18n } = useTranslation("transaction");

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{t("title")}</Text>
      <Text>{t("description")}</Text>
      <Button title={t("start")} onPress={() => {}} />

      {/* Changer de langue */}
      <Button
        title="Switch to English"
        onPress={() => i18n.changeLanguage("en")}
      />
      <Button
        title="Basculer en Français"
        onPress={() => i18n.changeLanguage("fr")}
      />
    </View>
  );
}
