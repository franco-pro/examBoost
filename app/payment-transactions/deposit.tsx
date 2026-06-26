import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../hooks/redux/redux.hooks";

export default function Deposit() {
  const { t } = useTranslation("competition");

  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [operator, setOperator] = useState<"MTN" | "ORANGE" | null>(null);
  const [loading, setLoading] = useState(false);
  const  {user} = useAppSelector((state) => state.user);
  const orangeUSSD = "#150*50#";
  const mtnUSSD = "*126#";
  const isPhoneValid = /^6\d{8}$/.test(phone);

  const isFormValid =
    isPhoneValid &&
    Number(amount) > 0 &&
    operator !== null;

  const handleDeposit = async () => {
    if (!isFormValid) return;
    console.log("data", { phone, amount, operator, userID: user?.id ?? 0});
    setLoading(true);

    try {
      // await api.deposit({
      //    phone,
      //    amount,
      //    operator,
      // });

      await new Promise((resolve) => setTimeout(resolve, 3000));
    } finally {
      setLoading(false);
    }
  };

  return (
<KeyboardAvoidingView
    className="flex-1 bg-gray-50 px-5 pt-12"
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Tout ton contenu actuel ici */}
           {/* Header */}

      <TouchableOpacity
        className="flex-row items-center mb-8"
        onPress={() => router.back()}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="gray"
        />

        <Text className="ml-2 text-lg font-semibold text-gray-700">
          {t("mycompetition.back")}
        </Text>
      </TouchableOpacity>

      {/* Title */}

      <Text className="text-3xl font-bold text-gray-800">
        Recharge Mobile Money
      </Text>

      <Text className="text-gray-500 mt-2">
        Effectuez votre recharge de compte rapidement et en toute sécurité.
      </Text>

      {/* Security Banner */}

      <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mt-6 mb-8 flex-row items-center">

        <MaterialCommunityIcons
          name="shield-lock"
          size={30}
          color="#3b82f6"
        />

        <View className="ml-3 flex-1">

          <Text className="font-bold text-blue-600">
            Transaction 100 % sécurisé
          </Text>

          <Text className="text-blue-500 text-sm mt-1">
            Vos transactions sont protégées et chiffrées.
          </Text>

        </View>

      </View>

      {/* Phone */}

      <View className="mb-6">

        <Text className="font-medium text-gray-700 mb-2">
          Numéro de téléphone
        </Text>

        <TextInput
          keyboardType="phone-pad"
          maxLength={9}
          placeholder="6*********"
          value={phone}
          onChangeText={setPhone}
          className={`h-14 rounded-xl px-4 border text-base
          ${
            phone.length === 0
              ? "bg-white border-gray-200"
              : isPhoneValid
              ? "bg-green-50 border-green-500"
              : "bg-red-50 border-red-500"
          }`}
        />

        {phone.length > 0 && !isPhoneValid && (
          <Text className="text-red-500 text-sm mt-2">
            Le numéro doit commencer par 6 et contenir exactement 9 chiffres.
          </Text>
        )}

        {isPhoneValid && (
          <Text className="text-green-600 text-sm mt-2">
            ✓ Numéro valide
          </Text>
        )}

      </View>

      {/* Operator */}

      <View className="mb-6">

        <Text className="font-medium text-gray-700 mb-3">
          Choisissez votre opérateur
        </Text>

        <View className="flex-row">

          {/* MTN */}

          <TouchableOpacity
            onPress={() => setOperator("MTN")}
            className={`flex-1 mr-2 rounded-2xl p-4 border-2 items-center relative
            ${
              operator === "MTN"
                ? "border-yellow-400 bg-yellow-50"
                : "border-gray-200 bg-white"
            }`}
          >

            {operator === "MTN" && (
              <View className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                <Ionicons
                  name="checkmark"
                  size={14}
                  color="white"
                />
              </View>
            )}

            <Image
              source={require("../../assets/images/momo_mtna.png")}
              className="w-30 h-20 mb-3"
              resizeMode="contain"
            />

            <Text className="font-semibold">
              MTN
            </Text>

          </TouchableOpacity>

          {/* Orange */}

          <TouchableOpacity
            onPress={() => setOperator("ORANGE")}
            className={`flex-1 ml-2 rounded-2xl p-4 border-2 items-center relative
            ${
              operator === "ORANGE"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 bg-white"
            }`}
          >

            {operator === "ORANGE" && (
              <View className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                <Ionicons
                  name="checkmark"
                  size={14}
                  color="white"
                />
              </View>
            )}

            <Image
              source={require("../../assets/images/orange.jpeg")}
              className="w-30 h-24 mb-3"
              resizeMode="contain"
            />

            <Text className="font-semibold">
              Orange
            </Text>

          </TouchableOpacity>

        </View>

      </View>

      {/* Amount */}

      <View className="mb-8">

        <Text className="font-medium text-gray-700 mb-2">
          Montant (FCFA)
        </Text>

        <TextInput
          keyboardType="numeric"
          placeholder="5000"
          value={amount}
          onChangeText={setAmount}
          className="h-14 bg-white border border-gray-200 rounded-xl px-4 text-base"
        />

      </View>

      {/* Deposit */}

      <TouchableOpacity
        disabled={!isFormValid || loading}
        onPress={handleDeposit}
        className={`h-14 rounded-xl items-center justify-center
        ${
          isFormValid
            ? "bg-orange-500"
            : "bg-gray-300"
        }`}
      >

        <Text className="text-white text-lg font-bold">
          Procéder à la recharge
        </Text>

      </TouchableOpacity>

      </ScrollView>
    </TouchableWithoutFeedback>
   

      {/* Loader */}

      {loading && (

        <View className="absolute inset-0 bg-black/30 justify-center items-center">

          <View className="bg-white rounded-3xl px-8 py-8 w-[85%] items-center">

            <ActivityIndicator
              size="large"
              color="#f97316"
            />

            <Text className="mt-5 text-xl font-bold text-blue-500">
              Paiement en cours...
            </Text>

            <Text className="text-center text-gray-500 mt-3">
              Une demande de confirmation a été envoyée sur votre téléphone.
            </Text>

            <Text className="text-center text-gray-400 mt-2 text-sm">
              Veuillez valider la transaction Mobile Money.
            </Text>

          </View>

        </View>

      )}

    </KeyboardAvoidingView>
  );
}