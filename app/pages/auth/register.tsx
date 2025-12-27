import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  useWindowDimensions,
  Alert,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/hooks/redux/store";
import { registerUser } from "@/app/hooks/redux/users/users.slice";

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
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
  Icon,
} from "@/components/ui/icon";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { Button, ButtonText } from "@/components/ui/button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Divider } from "@/components/ui/divider";
import { Center } from "@/components/ui/center";
import { useRouter } from "expo-router";
import { setItem } from "@/app/utils/asyncStorage";
import { Spinner } from "@/components/ui/spinner";

export default function Register() {
  const { width, height } = useWindowDimensions();
  const [surname, setSurname] = useState<string>("");
  const [passType, setPassType] = useState<"password" | "text">("password");
  const [phone, setPhone] = useState<string>("");
  const [niveau, setNiveau] = useState<string>("");
  const [emailValue, setEmailValue] = useState<string>("");
  const [username, setUsernameValue] = useState<string>(surname);
  const [passwordValue, setPasswordValue] = useState<string>("");

  const changeTypePassword = () => {
    if (passType === "password") {
      setPassType("text");
    } else {
      setPassType("password");
    }
  };
  const levels = [
    { label: "6eme", value: "1" },
    { label: "5eme", value: "2" },
    { label: "4eme", value: "3" },
    { label: "3eme", value: "4" },
    { label: "2nd A", value: "5" },
    { label: "2nd C", value: "6" },
    { label: "2nd TI", value: "7" },
    { label: "1ere A", value: "8" },
    { label: "1ere C", value: "9" },
    { label: "1ere D", value: "10" },
    { label: "1ere TI", value: "11" },
    { label: "Tle A", value: "12" },
    { label: "Tle C", value: "13" },
    { label: "Tle D", value: "14" },
    { label: "Tle TI", value: "15" },
  ];
  const socialsBtns = [
    { name: "Google", icon: require("../../assets/icons/google.png") },
    { name: "Facebook", icon: require("../../assets/icons/facebook.png") },
    { name: "Linkedin", icon: require("../../assets/icons/linkedin.png") },
  ];
  const navigation = useRouter();
  const dispatch = useDispatch<any>();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.user
  );
  const [isLoading, setIsLoading] = useState(loading);
  const [err, setErr] = useState(error);
  const handleSubmit = async () => {
    setIsLoading(true);
    const phoneWithoutSpace = phone.replace(/\s/g, "");
    const result = await dispatch(
      registerUser({
        username: username,
        surname: surname,
        phone: phoneWithoutSpace,
        email: emailValue,
        niveauID: Number(niveau),
        password: passwordValue,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      console.log("Connexion reussie", result.payload);
      await setItem("accessToken", result.payload.accessToken);
      setTimeout(() => {
        navigation.replace("/pages/auth/login");
      }, 2000);
    } else {
      setIsLoading(false);
      setErr(result);
      console.log("Erreur:", result);
      console.log("Erreur 2:", err);
    }
  };
  const switchSignIn = () => {
    navigation.navigate("/pages/auth/login");
  };
  return (
    <GestureHandlerRootView>
      <SafeAreaView className="flex-1 relative bg-white border-4">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 bg-white">
            <View className="images w-full  relative">
              <Image
                source={require("../../assets/images/student.jpg")}
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
              <View
                className="bg-white p-3 rounded-t-[40px] shadow-2xl "
                style={{ marginTop: height * 0.08 }}
              >
                {/* header form */}
                <View className="header items-center justify-center mb-6">
                  <Heading className="font-montserrat text-3xl text-primary-custom-300">
                    Creer un compte
                  </Heading>
                  <Text className="font-poppins text-lg text-secondary-custom-300 text-center">
                    Rejoignez la communauté ExamBoost
                  </Text>
                </View>
                <FormControl className="flex-1 gap-2">
                  <View className="names w-full">
                    <FormControlLabel>
                      <FormControlLabelText>
                        votre Nom <Text className="text-red-500">*</Text>
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Input size={"lg"} className="my-1" isRequired={true}>
                      <InputField
                        className="placeholder:text-gray-300"
                        type="text"
                        value={surname}
                        placeholder="Entrer votre nom(s) "
                        onChangeText={(text) => {
                          setSurname(text);
                        }}
                      ></InputField>
                    </Input>
                    <FormControlError>
                      <FormControlErrorIcon
                        as={AlertCircleIcon}
                        className="text-red-500"
                      />
                      <FormControlErrorText className="text-red-500">
                        Le mot de passe doit etre aumoins 8
                      </FormControlErrorText>
                    </FormControlError>
                  </View>
                  <View className="username w-full">
                    <FormControlLabel>
                      <FormControlLabelText>
                        Votre Prenom{" "}
                        <Text className="text-gray-400">(optionel)</Text>
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Input size={"lg"} className="my-1" isRequired={false}>
                      <InputField
                        className="placeholder:text-gray-300"
                        type="text"
                        value={username}
                        placeholder="Entrer votre prenom"
                        onChangeText={(text) => {
                          setUsernameValue(text);
                        }}
                      ></InputField>
                    </Input>
                  </View>
                  <View className="email w-full">
                    <FormControlLabel>
                      <FormControlLabelText>
                        Email <Text className="text-red-500">*</Text>
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Input size={"lg"} className="my-1" isRequired={true}>
                      <InputField
                        className="placeholder:text-gray-300"
                        type="text"
                        value={emailValue}
                        placeholder="Entrer votre email"
                        onChangeText={(text) => {
                          setEmailValue(text);
                        }}
                      ></InputField>
                    </Input>
                    <FormControlError>
                      <FormControlErrorIcon
                        as={AlertCircleIcon}
                        className="text-red-500"
                      />
                      <FormControlErrorText className="text-red-500">
                        L`adresse email est incorret
                      </FormControlErrorText>
                    </FormControlError>
                  </View>
                  <View className="phone w-full">
                    <FormControlLabel>
                      <FormControlLabelText>
                        Numero de telephone{" "}
                        <Text className="text-red-500">*</Text>
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Input size={"lg"} className="my-1" isRequired={true}>
                      <InputField
                        className="placeholder:text-gray-300"
                        type="text"
                        value={phone}
                        placeholder="Entrer votre email"
                        onChangeText={(text) => {
                          setPhone(text);
                        }}
                      ></InputField>
                    </Input>
                    <FormControlError>
                      <FormControlErrorIcon
                        as={AlertCircleIcon}
                        className="text-red-500"
                      />
                      <FormControlErrorText className="text-red-500">
                        Le numero de telephone est incorrect
                      </FormControlErrorText>
                    </FormControlError>
                  </View>
                  <View className="niveau">
                    <FormControlLabel>
                      <FormControlLabelText>
                        Niveau scolaire <Text className="text-red-500">*</Text>
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Select onValueChange={(value) => setNiveau(value)}>
                      <SelectTrigger
                        variant="outline"
                        size="lg"
                        className="flex-1 justify-between"
                      >
                        <SelectInput placeholder="Select option" />
                        <SelectIcon className="mr-3" as={ChevronDownIcon} />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          {levels.map((level, index) => (
                            <SelectItem
                              key={index}
                              value={level.value}
                              label={level.label}
                            />
                          ))}
                        </SelectContent>
                      </SelectPortal>
                    </Select>
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
                        "S'inscrire"
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
                <Center className="mt-10 flex-row items-center justify-center gap-2">
                  <Divider />
                  <Text className="text-gray-400">
                    S&rsquo;inregistrer avec
                  </Text>
                  <Divider />
                </Center>
                <Center className="social-btns flex-row gap-2 ">
                  {socialsBtns.map((btn, index) => (
                    <Button
                      key={index}
                      className=" my-2 bg-white rounded-full  shadow-md w-16 h-16"
                      size="xl"
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
                    Vous avez deja un compte?{" "}
                  </Text>
                  <Button onPress={switchSignIn} variant={"link"}>
                    <ButtonText className="text-primary-custom-300 font-bold">
                      Se connecter
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
