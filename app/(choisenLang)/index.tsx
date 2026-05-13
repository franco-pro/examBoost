import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { ArrowRightIcon, CircleIcon } from "@/components/ui/icon";

export default function Index() {
  const navigation = useRouter();
  const { t, i18n } = useTranslation();
  const changeLanguage = async (lang: "fr" | "en") => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem("lang", lang);
  };

  const languages = [
    { code: "en", name: "English", flag: "us" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ];

  const handleNext = () => {
    if (i18n.language) {
      console.log("la valeur de la langue:", i18n.language);
      navigation.navigate("/(onboarding)");
    } else {
      console.log("something wrong");
    }
  };
  const testBackend = async () => {
    try {
      const url = "http://192.168.1.101:3000";
      console.log("TEST URL:", url);

      const res = await fetch(url);
      const text = await res.text();

      console.log("STATUS:", res.status);
      console.log("BODY:", text);
    } catch (error) {
      console.log("FETCH TEST ERROR:", error);
    }
  };
  return (
    <SafeAreaView className="flex-1 relative">
      <View className="flex-1 justify-between items-center  bg-gray-200">
        <View className="header mt-10">
          <Text className=" font-semibold text-2xl">
            Bienvenue sur{" "}
            <Text className=" text-secondary-custom-400">Examboost.</Text>
          </Text>
          <Text className=" font-medium text-xl">
            Choisissez votre langue favorite
          </Text>
        </View>
        <View className="btns gap-2">
          <RadioGroup>
            <Radio
              value="en"
              onChange={(isSelected) => isSelected && changeLanguage("en")}
              size="md"
            >
              <RadioLabel>Anglais</RadioLabel>
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
            </Radio>
            <Radio
              value="fr"
              size="md"
              onChange={(isSelected) => isSelected && changeLanguage("fr")}
            >
              <RadioLabel>Français</RadioLabel>
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
            </Radio>
          </RadioGroup>
        </View>
        <Button onPress={()=>testBackend()}>test</Button>

        <View className="footer gap-10">
          <Text className=" text-center font-light text-base  mx-5  ">
            Votre langue favorite peut etre modifiée a n`importe quel moment
            dans parametre
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
