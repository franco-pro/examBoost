import { Alert, useWindowDimensions, View } from "react-native";
import { Text } from "@/components/ui/text";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Spinner } from "@/components/ui/spinner";

export default function SendOtp() {
  const { width, height } = useWindowDimensions();
  const navigation = useRouter();
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState(["", "", "", "",""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<(any| null)[]>([]);
  const handleChange = (value: string, index: number) => {
    const newOtp = [ ...otp ];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      inputRef.current[index + 1]?.focus();
    }
    };
    
    const handlerKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRef.current[index-1]?.focus()
        }
    }

  const handleSubmit = () => {
      setIsLoading(true)
        const code = otp.join("")
        console.log("code otp:", code)
    if (otp.every((val)=> val !=="")) {
        setIsLoading(false)
      setTimeout(() => {
            navigation.navigate({
              pathname: "/(auth)/resetSubmit",
              params: { code },
            });
          }, 2000);
    } else {
      setIsLoading(false)
      Alert.alert("Erreur","Completez l'opt a 5 chiffres !")
        }
    }
  return (
    <SafeAreaView className="flex-1 bg-white w-full gap-10">
      <View className="iconContainer items-center">
        <View className="icon  justify-center items-center bg-white rounded-full shadow-xl  w-48 h-48">
          <Ionicons name="lock-closed" size={width * 0.3} color={"#3f51b5"} />
        </View>
      </View>
      <View className="content px-5 flex-1 items-center gap-4">
        <View>
          <Heading className="text-3xl font-montserrat text-primary-custom-300 text-center">
            Vérification du code
          </Heading>
          <Text className="text-center font-poppins text-lg font-thin">
            Nous avons envoyé un code de vérification a ce mail :{" "}
            <Text className="font-poppins font-bold text-lg">{email}</Text>
          </Text>
        </View>

        <View className="optInputs gap-4 flex-row w-full items-center justify-center">
          {otp.map((digit, index) => (
            <Input
              key={index}
              size={"md"}
              className="w-16 h-16  border-gray-600 bg-gray-200 rounded-lg "
            >
              <InputField
                ref={(ref) => {
                  inputRef.current[index] = ref;
                }}
                value={digit}
                maxLength={1}
                onChangeText={(value) => {
                  handleChange(value, index);
                }}
                onKeyPress={(e) => {
                  handlerKeyPress(e, index);
                }}
                keyboardType="number-pad"
                className="text-center text-3xl  font-bold "
              />
            </Input>
          ))}
        </View>
        <Button
          className="w-full bg-primary-custom-300 "
          size="xl"
          onPress={handleSubmit}
        >
          <ButtonText className="text-white text-lg">
            {isLoading ? (
              <Spinner size={"large"} color={"white"} />
            ) : (
              "Suivant"
            )}
          </ButtonText>
        </Button>
        <View className="resend flex-row justify-center items-center space-x-2">
          <Text className="text-center font-poppins">
            Vous n&rsquo;avez pas reçu le code?
          </Text>
          <Button variant="link" onPress={()=>{}}>
            <ButtonText className="text-primary-custom-300 font-semibold">
              Renvoyer
            </ButtonText>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
