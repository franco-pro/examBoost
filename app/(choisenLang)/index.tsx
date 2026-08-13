import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioIcon,
  RadioLabel,
} from "@/components/ui/radio";
import { ArrowRightIcon, CircleIcon } from "@/components/ui/icon";
import { BASE_URL } from "../api/apiClient";
import { useState } from "react";

export default function Index() {
  const navigation = useRouter();
  const { t, i18n } = useTranslation();

  // On s'assure d'avoir une valeur par défaut propre ("fr" ou "en")
  const [selected, setSelected] = useState<"fr" | "en">(
    (i18n.language?.split("-")[0] as "fr" | "en") || "fr",
  );

  const changeLanguage = async (lang: "fr" | "en") => {
    try {
      await AsyncStorage.setItem("language", lang);
      await i18n.changeLanguage(lang);
      setSelected(lang); // Met à jour le bouton radio sélectionné
    } catch (error) {
      console.log("erreur changement de langue: ", error);
    }
  };

  const handleNext = async () => {
    // Remplacement de .navigate() par .replace() pour l'onboarding
    navigation.replace("/(onboarding)");
  };

  return (
    <SafeAreaView className="flex-1 relative">
      <View className="flex-1 justify-between items-center bg-gray-200">
        <View className="header mt-10">
          <Text className="font-semibold text-2xl text-center">
            Bienvenue sur{" "}
            <Text className="text-secondary-custom-400">Examboost.</Text>
          </Text>
          <Text className="font-medium text-xl text-center mt-2">
            Choisissez votre langue favorite
          </Text>
        </View>

        <View className="btns gap-4 w-full px-10 items-center justify-center">
          {/* CORRECTIF : Les propriétés Value et OnChange vont ICI sur le groupe parent */}
          <RadioGroup
            value={selected}
            onChange={(lang) => changeLanguage(lang as "fr" | "en")}
          >
            {/* Option Anglais */}
            <Radio value="en" size="md">
              {/* CORRECTIF : L'indicateur est placé AVANT le label */}
              <RadioIndicator >
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel>Anglais</RadioLabel>
            </Radio>

            {/* Option Français */}
            <Radio value="fr" size="md">
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel>Français</RadioLabel>
            </Radio>
          </RadioGroup>
        </View>

        <View className="footer gap-10">
          <Text className="text-center font-light text-base mx-5">
            Votre langue favorite peut être modifiée à n`importe quel moment
            dans les paramètres
          </Text>

          <Button
            onPress={handleNext}
            variant="solid"
            size="xl"
            action="primary"
            className="w-[200px] mx-auto mb-10 rounded-xl bg-primary-custom-300 items-center justify-center"
          >
            <ButtonText>Suivant</ButtonText>
            <ButtonIcon as={ArrowRightIcon} />
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
