import { Alert, useWindowDimensions, View } from 'react-native'
import { Text } from '@/components/ui/text'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { Heading } from '@/components/ui/heading'
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control'
import { Input, InputField } from '@/components/ui/input'
import { Button, ButtonText } from '@/components/ui/button'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { authService } from '@/app/api/authService'
import { Spinner } from '@/components/ui/spinner'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function ResetSubmit() {
  const { width } = useWindowDimensions()
  const { code } = useLocalSearchParams()
  const codeString = code as string
  console.log("type of otp:", code, "type of codeString:", typeof(codeString))

  const [password, setPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
    const navigation = useRouter()
  const handleSubmit = async() => {
    setIsLoading(true)
    try {
      if (password === newPassword) {
        const datas = await authService.resetPassword({
          codeToken: codeString,
          newPassword: password,
        });
        console.log("datas reset pass:", datas);
        setIsLoading(false);
        if (navigation.canDismiss()) {
          navigation.dismissAll();
        }
        setTimeout(() => {
          navigation.replace("/(auth)/login");
          Alert.alert("Success", "Mot de passe changé avec succes !");
        }, 2000);
      } else {
        setIsLoading(false)
        Alert.alert(
          "Erreur",
          "Vos mots de passe ne correspondent pas, re-vérifier svp!",
        );
      }
    } catch (e:any) {
      setIsLoading(false)
      console.log("error2:", e.response.data);
            Alert.alert("Erreur", e.response?.data?.message || "something wrong!");
    }
        }
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 0 }}
      enableOnAndroid={true}
      extraHeight={80}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      className="bg-white"
    >
      <SafeAreaView className="flex-1 bg-white gap-10">
        <View className="iconContainer items-center">
          <View className="icon  justify-center items-center bg-white rounded-full shadow-xl  w-48 h-48">
            <Ionicons name="key" size={width * 0.3} color={"#3f51b5"} />
          </View>
        </View>
        <View className="content gap-10">
          <View className="header">
            <Heading className="text-3xl font-montserrat text-primary-custom-300 text-center">
              Renitialiser votre mot de passe
            </Heading>
            <Text className="text-center font-poppins text-lg font-thin">
              Créez un nouveau mot de passe sécurisé pour votre compte ExamBoost
            </Text>
          </View>
          <FormControl className="mx-4 gap-5">
            <View className="newPassword">
              <FormControlLabel>
                <FormControlLabelText>
                  Nouveau mot de passe <Text className="text-red-500">*</Text>
                </FormControlLabelText>
              </FormControlLabel>
              <Input size={"xl"}>
                <InputField
                  className="placeholder:text-gray-300 text-md"
                  type="password"
                  placeholder="Entrer votre nouveau mot de passe"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                  }}
                />
              </Input>
            </View>
            <View className="confirmPassword">
              <FormControlLabel>
                <FormControlLabelText>
                  Confirmer le mot de passe
                  <Text className="text-red-500">*</Text>
                </FormControlLabelText>
              </FormControlLabel>
              <Input size={"xl"}>
                <InputField
                  className="placeholder:text-gray-300 text-md"
                  type="password"
                  placeholder="Entrer votre nouveau mot de passe"
                  secureTextEntry={true}
                  value={newPassword}
                  onChangeText={(value) => {
                    setNewPassword(value);
                  }}
                />
              </Input>
            </View>
            <Button
              onPress={handleSubmit}
              className="bg-primary-custom-300"
              size={"xl"}
            >
              <ButtonText className="text-white text-lg">
                {isLoading ? (
                  <Spinner size={"large"} color={"white"} />
                ) : (
                  "Confirmer"
                )}
              </ButtonText>
            </Button>
          </FormControl>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}