import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import {
  AlertCircleIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  Icon,
} from "@/components/ui/icon";

import { Button, ButtonText } from "@/components/ui/button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Divider } from "@/components/ui/divider";
import { Center } from "@/components/ui/center";
import { useRouter } from "expo-router";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { RootState } from "@/app/hooks/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginUser } from "@/app/hooks/redux/users/users.slice";
import GoogleAuth from "./googleAuth";
import { setItem } from "../utils/asyncStorage";

export default function Login() {
  const {height } = Dimensions.get("window");
  const [inputValue, setInputValue] = useState<string>("");
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [passType, setPassType] = useState<"password" | "text">("password");

  const { request, promptAsync } = GoogleAuth();
  const requestGoogle = request;
  const socialsBtns = [
    {
      name: "Google",
      icon: require("../assets/icons/google.png"),
      action: () => promptAsync(),
      requestAction: requestGoogle,
    },
    {
      name: "Facebook",
      icon: require("../assets/icons/facebook.png"),
      action: () => {},
      requestAction: "",
    },
    {
      name: "Linkedin",
      icon: require("../assets/icons/linkedin.png"),
      action: () => {},
      requestAction: "",
    },
  ];

  const navigation = useRouter();
  const dispatch = useDispatch<any>();
  const { loading, error } = useSelector(
    (state: RootState) => state.user
  );
  const [isLoading, setIsLoading] = useState(loading);
  const [err, setErr] = useState(error);
  const handleSubmit = async () => {
    setIsLoading(true);
    const result = await dispatch(
      loginUser({ email: inputValue, password: passwordValue })
    );
    
    if (loginUser.fulfilled.match(result)) {
      await setItem('accessToken', result.payload.accessToken)
      await setItem('refreshToken', result.payload.refreshToken)
      dispatch(loginSuccess({
        user: result.payload.user,
        accessToken: result.payload.accessToken,
        refreshToken: result.payload.refreshToken
      }))
      console.log("connexion reussie:", result.payload);
      setTimeout(() => {
        navigation.replace("/(tabs)");
      }, 2000);
    } else {
      setIsLoading(false);
      setErr(result);
      console.log("erreur:", result);
    }
  };
  const switchSignUp = () => {
    navigation.navigate("/(auth)/register");
  };
  const handleForgotPassword = () => {
    navigation.push("/(auth)/sendEmail");
  };
  const changeTypePassword = () => {
    if (passType === "password") {
      setPassType("text");
    } else {
      setPassType("password");
    }
  };
  return (
    // <Text>hello</Text>
    <GestureHandlerRootView>
      <SafeAreaView className="flex-1 relative bg-white border-4">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            <View className="images w-full  relative">
              <Image
                source={require("../assets/images/student.jpg")}
                className="w-full absolute"
                style={{
                  width: "100%",
                  height: height * 0.4,
                  position: "absolute",
                }}
                contentFit="cover"
              />
            </View>
            <KeyboardAwareScrollView
              className="flex-1  rounded-2xl "
              contentContainerStyle={{ flexGrow: 0 }}
              extraScrollHeight={40}
              enableOnAndroid={true}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="bg-white p-3 rounded-t-[40px] shadow-2xl mt-64 ">
                {/* header form */}
                <View className="header items-center justify-center mb-6">
                  <Heading className="font-montserrat text-3xl text-primary-custom-300">
                    Se connecter
                  </Heading>
                  <Text className="font-poppins text-lg text-secondary-custom-300 text-center">
                    Bon retour parmi nous !
                  </Text>
                </View>
                <FormControl className="flex-1 gap-2">
                  <View className="names w-full">
                    <FormControlLabel>
                      <FormControlLabelText>
                        Email ou Telephone{" "}
                        <Text className="text-red-500">*</Text>
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Input size={"lg"} className="my-1" isRequired={true}>
                      <InputField
                        className="placeholder:text-gray-300"
                        type="text"
                        keyboardType="email-address"
                        value={inputValue.toLowerCase()}
                        placeholder="Entrer votre email ou numero de telephone"
                        onChangeText={(text) => {
                          setInputValue(text);
                        }}
                      ></InputField>
                    </Input>
                    <FormControlError>
                      <FormControlErrorIcon
                        as={AlertCircleIcon}
                        className="text-red-500"
                      />
                      <FormControlErrorText className="text-red-500">
                        Email , numero ou mot de passe incorrect
                      </FormControlErrorText>
                    </FormControlError>
                  </View>
                  <View className="password w-full">
                    <FormControlLabel>
                      <FormControlLabelText>
                        Mot de passe <Text className="text-red-500">*</Text>
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Input size={"lg"} className="my-1" isRequired={true}>
                      <InputField
                        className="placeholder:text-gray-300"
                        type={passType}
                        value={passwordValue}
                        placeholder="Entrer votre mot de passe"
                        onChangeText={(text) => {
                          setPasswordValue(text);
                        }}
                      ></InputField>
                      <Button
                        variant={"solid"}
                        size={"md"}
                        className=" bg-white"
                        onPress={() => changeTypePassword()}
                      >
                        <ButtonText>
                          {passType === "password" ? (
                            <Icon className="border" as={EyeIcon} size={"lg"} />
                          ) : (
                            <Icon
                              className="border"
                              as={EyeOffIcon}
                              size={"lg"}
                            />
                          )}
                        </ButtonText>
                      </Button>
                    </Input>
                    <FormControlError>
                      <FormControlErrorIcon
                        as={AlertCircleIcon}
                        className="text-red-500"
                      />
                      <FormControlErrorText className="text-red-500">
                        Le mot de passe doit avoir aumoins 8 caracteres
                      </FormControlErrorText>
                    </FormControlError>
                  </View>
                  <View className="forgotPassword flex-row justify-between items-center mt-2">
                    <Checkbox
                      size={"md"}
                      isDisabled={false}
                      isInvalid={false}
                      value="Se Souvenir de moi"
                    >
                      <CheckboxIndicator>
                        <CheckboxIcon as={CheckIcon} />
                      </CheckboxIndicator>
                      <CheckboxLabel>Se souvenir de moi</CheckboxLabel>
                    </Checkbox>
                    <Button variant={"link"} onPress={handleForgotPassword}>
                      <ButtonText className="text-primary-custom-300 font-bold">
                        Mot de passe oublie?
                      </ButtonText>
                    </Button>
                  </View>
                  <Button
                    className="w-full  mt-4 bg-primary-custom-300"
                    size="xl"
                    variant={"solid"}
                    onPress={handleSubmit}
                  >
                    <ButtonText>
                      {isLoading ? (
                        <Spinner size={"large"} color={"white"} />
                      ) : (
                        "se connecter"
                      )}
                    </ButtonText>
                  </Button>
                  {err?.error?.message && (
                    <Text style={{ color: "red" }}>
                      {Array.isArray(err.payload)
                        ? err.payload[0]
                        : err.payload}
                    </Text>
                  )}
                </FormControl>
                <Center className="mt-10 flex-row items-center justify-center gap-2 w-2/3 mx-auto">
                  <Divider />
                  <Text className="text-gray-400">Se connecter avec</Text>
                  <Divider />
                </Center>
                <Center className="social-btns flex-row gap-2 ">
                  {socialsBtns.map((btn, index) => (
                    <Button
                      key={index}
                      className=" my-2 bg-white rounded-full  shadow-md w-16 h-16"
                      size="xl"
                      onPress={btn.action}
                      disabled={!btn.requestAction}
                    >
                      <Image
                        source={btn.icon}
                        style={{ width: 40, height: 40, borderRadius: 100 }}
                      />
                    </Button>
                  ))}
                </Center>
                <Center className="sign in mt-3 flex-row">
                  <Text className="text-gray-400">
                    Vous n&rsquo;avez pas un compte?{" "}
                  </Text>
                  <Button onPress={switchSignUp} variant={"link"}>
                    <ButtonText className="text-primary-custom-300 font-bold">
                      S&rsquo;inscrire
                    </ButtonText>
                  </Button>
                </Center>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
