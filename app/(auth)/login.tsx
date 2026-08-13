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
import { useTranslation } from "react-i18next";

export default function Login() {
  const {t}=useTranslation("login")
  const { height } = Dimensions.get("window");
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
  const { loading, error } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(loading);
  const [err, setErr] = useState(error);
  const handleSubmit = async () => {
    setIsLoading(true);
    const result = await dispatch(
      loginUser({ identifier: inputValue, password: passwordValue }),
    );

    if (loginUser.fulfilled.match(result)) {
      await setItem("accessToken", result.payload.accessToken);
      await setItem("refreshToken", result.payload.refreshToken);
      dispatch(
        loginSuccess({
          user: result.payload.user,
          accessToken: result.payload.accessToken,
          refreshToken: result.payload.refreshToken,
        }),
      );
      setTimeout(() => {
        navigation.replace("/(tabs)");
      }, 2000);
    } else {
      setIsLoading(false);
      setErr(result);
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
                  <Heading className="font-montserrat text-3xl text-primary-custom-300 capitalize">
                    {t("login.title")}
                  </Heading>
                  <Text className="font-poppins text-lg text-secondary-custom-300 text-center">
                    {t("login.subtitle")}
                  </Text>
                </View>
                <FormControl className="flex-1 gap-2">
                  <View className="names w-full">
                    <FormControlLabel>
                      <FormControlLabelText>
                        {t("login.email_phone")}
                        {"  "}
                        <Text className="text-red-500">*</Text>
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Input size={"lg"} className="my-1" isRequired={true}>
                      <InputField
                        className="placeholder:text-gray-300"
                        type="text"
                        keyboardType="email-address"
                        value={inputValue.toLowerCase()}
                        // placeholder="Entrer votre email ou numero de telephone"
                        onChangeText={(text) => {
                          setInputValue(text);
                        }}
                      ></InputField>
                    </Input>
                  </View>
                  <View className="password w-full">
                    <FormControlLabel>
                      <FormControlLabelText>
                        {t("login.password")}
                        {"  "} <Text className="text-red-500">*</Text>
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Input size={"lg"} className="my-1" isRequired={true}>
                      <InputField
                        className="placeholder:text-gray-300"
                        type={passType}
                        value={passwordValue}
                        // placeholder="Entrer votre mot de passe"
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
                            <Icon className="" as={EyeIcon} size={"lg"} />
                          ) : (
                            <Icon className="" as={EyeOffIcon} size={"lg"} />
                          )}
                        </ButtonText>
                      </Button>
                    </Input>
                  </View>
                  <View className="forgotPassword flex-row justify-between items-center mt-2">
                    <Checkbox
                      size={"md"}
                      isDisabled={false}
                      isInvalid={false}
                      value={t("login.remember")}
                    >
                      <CheckboxIndicator>
                        <CheckboxIcon as={CheckIcon} />
                      </CheckboxIndicator>
                      <CheckboxLabel>{t("login.remember")}</CheckboxLabel>
                    </Checkbox>
                    <Button variant={"link"} onPress={handleForgotPassword}>
                      <ButtonText className="text-primary-custom-300 font-bold">
                        {t("login.forgotPassword")}
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
                        <Text className="capitalize">{t("login.button")}</Text>
                      )}
                    </ButtonText>
                  </Button>
                  <Text style={{ color: "red" }}>
                    {(() => {
                      console.log("load payload 1:", err?.payload);
                      if (!err || !err?.payload) {
                        console.log("load payload 1:", err?.payload);
                        return "";
                      }
                      if (
                        Array.isArray(err?.payload) &&
                        err.payload[0] !==
                          "Le mot de passe doit contenir au moins un chiffre" &&
                        err.payload[0] !==
                          "Le numéro de téléphone doit contenir au moins 9 caractères" &&
                        err.payload[0] !==
                          "Le mot de passe doit contenir au moins 4 caractères"
                      ) {
                        return t("register.error.fillInput");
                      }
                      console.log("log payload:", err.payload);
                      if (Array.isArray(err.payload)) {
                        if (
                          err.payload.includes(
                            "Le mot de passe doit contenir au moins un chiffre",
                          )
                        ) {
                          return t("login.error.password");
                        }
                        if (
                          err.payload.includes(
                            "Le mot de passe doit contenir au moins 4 caractères",
                          )
                        ) {
                          return t("login.error.password");
                        }
                        if (
                          err.payload.includes(
                            "Le prenom  doit contenir au moins 3 caractères",
                          )
                        ) {
                          return t("register.error.errorPrenom");
                        }

                        // Si aucune traduction ne correspond, on affiche le premier message brut du tableau
                        return (
                          err.payload.message[0] ||
                          `Une erreur est survenue: ${err.payload}`
                        );
                      }

                      if (err.payload === "Wrong credentials !") {
                        return t("login.error.credentials");
                      }

                      if (err.payload === "Check your password !!") {
                        return t("login.error.password");
                      }

                      return (
                        err.payload.message ||
                        `Une erreur est survenue f: ${err.payload}`
                      );
                    })()}
                  </Text>
                </FormControl>
                <View className="social">
                  {/* <Center className="mt-10 flex-row items-center justify-center gap-2 w-2/3 mx-auto">
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
                  </Center> */}
                  <Center className="sign in mt-3 flex-row">
                    <Text className="text-gray-400">
                      {t("login.no_account")}{" "}
                    </Text>
                    <Button onPress={switchSignUp} variant={"link"}>
                      <ButtonText className="text-primary-custom-300 font-bold">
                        {t("login.register")}
                      </ButtonText>
                    </Button>
                  </Center>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
