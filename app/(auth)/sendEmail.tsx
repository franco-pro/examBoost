import { Alert, useWindowDimensions, View } from "react-native";
import { Text } from "@/components/ui/text";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Heading } from "@/components/ui/heading";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { authService } from "@/app/api/authService";
import { Spinner } from "@/components/ui/spinner";


export default function SendEmail() {
  const { width, height } = useWindowDimensions();
  const navigation = useRouter()
   const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const emailTrim = email.trim()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleSendEmail = async () => {
    setIsLoading(true)
    if (!emailTrim) {
      setIsLoading(false)
      Alert.alert("Erreur", "Veuillez entrer votre adresse email.");
      return;
    }

    if (!emailRegex.test(emailTrim)) {
      setIsLoading(false);
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide.");
      return;
    }
    try {
      const datas = await authService.forgetPassword({ email:emailTrim });
      console.log("datas password:", datas)
      if (datas) {
        setTimeout(() => {
          setIsLoading(false);
          if (navigation.canDismiss()) {
            navigation.dismissAll();
          }
          navigation.replace({
            pathname: "/(auth)/sendOtp",
            params: { email },
          });
        }, 2000);
      } else {
        setIsLoading(false);
        Alert.alert("Erreur", "l'email n'existe pas !");
      }
    } catch (error:any) {
      setIsLoading(false)
      console.log("error 1:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Une erreur est survenue. Veuillez réessayer.";

      Alert.alert("Erreur", errorMessage);
    }
  }
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 0 }}
      enableOnAndroid={true}
      extraScrollHeight={80}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      className="bg-white"
    >
      <SafeAreaView className="flex-1 bg-white items-center h-full">
        <View className="image">
          <Image
            source={require("../assets/images/otp-illustration.jpg")}
            style={{ width: width, height: height * 0.4 }}
          />
        </View>
        <View className="content gap-10">
          <View className="header">
            <Heading className="text-3xl font-montserrat text-primary-custom-300 text-center">
              Réinitialiser votre mot de passe
            </Heading>
            <Text className="text-center font-poppins text-lg text-poppins px-10 font-thin">
              Entrez votre adresse email pour recevoir un code de vérification à
              4 chiffres
            </Text>
          </View>
          <FormControl className="px-5 gap-5">
            <View className="form">
              <FormControlLabel>
                <FormControlLabelText className="text-lg font-poppins">
                  Adresse email <Text className="text-red-500">*</Text>
                </FormControlLabelText>
              </FormControlLabel>
              <Input size={"xl"} className="">
                <InputField
                  placeholder="votre adresse email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="  px-4 font-poppins text-lg placeholder:text-gray-300"
                  type="text"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                  }}
                />
              </Input>
            </View>
            <Button
              onPress={handleSendEmail}
              className="bg-primary-custom-300"
              size="xl"
              variant="solid"
            >
              <ButtonText>
                {isLoading ? (
                  <Spinner size={"large"} color={"white"} />
                ) : (
                  "Recevoir le code"
                )}
              </ButtonText>
            </Button>
          </FormControl>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}
