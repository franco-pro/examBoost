import { useEffect, useState } from "react";
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
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../hooks/redux/redux.hooks";
import Toast from "react-native-toast-message";
import { toastConfig } from "../config/toast.config";
import apiClient from "../api/apiClient";
import { connectNotificationsSocket } from "../hooks/services/socket/socket.init";
import { updateBalanceUser, updateDepositAction } from "../hooks/redux/users/users.slice";
import { addTransaction, updateTransactionStatus } from "../hooks/redux/transactions/transactions.slice";
import { Transaction } from "../hooks/entities/transaction";
import { playSound } from "../helper/audio/audio.manager";

export default function Deposit() {
  const { t } = useTranslation("deposit");
  const {type} = useLocalSearchParams<{ type: string }>();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [operator, setOperator] = useState<"MTN" | "ORANGE" | null>('ORANGE');
  const [loading, setLoading] = useState(false);
  const  {user} = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const isPhoneValid = /^6\d{8}$/.test(phone);
  const isAmountValid = (type === "WITHDRAWAL" && Number(amount) >= 1000) || (type === "DEPOSIT" && Number(amount) >= 100);
  const isFormValid =
    isPhoneValid &&
    Number(amount) > 0 &&
    isAmountValid
    ;

    function showToast(message: string, title: string, type: "success"|"error"){
      Toast.show({
        type: type,
        text2: message,
        text1: title,
        position: 'top',
        visibilityTime: 3500,
      }) 
  }

    const socketPay = async () => {
      const socket = await connectNotificationsSocket(user?.id ?? 0);
      if(!socket) return;
      socket.off("payment-ended");

      socket.on("payment-ended", (data: {status: string, amout: number, transaction: Transaction})=> {
        if(data.status.toUpperCase() === "COMPLETED"){
            dispatch(updateBalanceUser((user?.wallet ?  (Number(user?.wallet) + Number(data.amout)): data.amout)));
            dispatch(updateDepositAction("COMPLETED"));
            playSound("TopUpSuccess");
          showToast(t("deposit.pay_done.text", {amount: data.amout}), t("deposit.pay_done.title"), "success");
      
        }else{
          dispatch(updateDepositAction("FAILED"));
          showToast(t("deposit.pay_failed.text"), t("deposit.pay_failed.title"), "error");

        }
        dispatch(addTransaction(data.transaction));
        
        setTimeout(() => {
          router.replace("/(tabs)")
        }, 7580);
      });

    }


  function checkOperator(){
    const phone_number = phone.trim();

    if (/^6(9\d|5[5-9]|4[0-4]|8[6-9])\d{6}$/.test(phone_number)) {
      setOperator("ORANGE")
    }
    if (/^6(7\d|5[0-4]|8[0-4])\d{6}$/.test(phone_number)) {
      setOperator('MTN')
    }else{
      setOperator('ORANGE')
    }

    return;
  }

  const handleDeposit = async () => {
    if (!isFormValid) return;

    checkOperator();

    if(type === "DEPOSIT"){
      setLoading(true);

      try {
  
        const dto = {
          amount: Number(amount),
          customerName: user?.username + " " + user?.surname,
          userID: user && user.id,
          customerEmail: user && user.email,
          operator: operator,
          customerPhone: phone
        }
  
        const response = await apiClient.post("/payment", dto);
        if(response.data && response.data.success){
            setLoading(false);
            socketPay();
            // await InAppBrowser.open(response.data.pay_url);
            // await WebBrowser.openBrowserAsync(response.data.pay_url);
            router.replace({
              pathname: '/payment-transactions/webview',
              params: {
                payUrl: response.data.pay_url,
              },
            });
        }
      } catch(error: any) {
        showToast("Impossible d'effectuer une recharge pour le moment.", "Error", "error");
        console.log('error', error);
      } 
    }else{
      if(Number(amount) < 1000) {
        
        showToast(t("withdrawal.error.invalid_amount"), t("withdrawal.error.title"), "error");
        return;
      }
      
      setLoading(true);
      let transactionID: number = 0;

      const userWallet = user && user.wallet;

      if(userWallet && Number(userWallet) < Number(amount)){
        setLoading(false);

        showToast(t("withdrawal.error.insufficient_balence"), t("withdrawal.error.title"), "error");
        return;
      }

        const dto = {
          amount: Number(amount),
          customerName: user?.username + " " + user?.surname,
          userID: user && user.id,
          customerEmail: user && user.email,
          operator: operator === "MTN" ? "mtn_momo":"orange_money",
          customerPhone: phone
        }
        try {
          
           const response = await apiClient.post("/payment/payout", dto);

            if(response.data && response.data.success){
              transactionID = response.data.transaction.id;
              dispatch(updateBalanceUser((user?.wallet ?  (Number(user?.wallet) - Number(amount)): 0))).payload;
              playSound("WithdrawSuccess");
              showToast(t("withdrawal.pay_done.text", {amount: amount}), t("withdrawal.pay_done.title"), "success");
              console.log('response user reduicing', user?.wallet);
              dispatch(addTransaction(response.data.transaction));
              setLoading(false);

              router.replace("/(tabs)");
          }
          setLoading(false);
        } catch (error: any) {
          setLoading(false);
          dispatch(updateDepositAction("FAILED"));
          dispatch(updateTransactionStatus({transactionId: transactionID, newStatut: "FAILED"}));

          // dispatch(updateBalanceUser((user?.wallet ?  (Number(user?.wallet) + Number(amount)): 0))); // if the transaction failed, we add back the amount to the user wallet 
          
          showToast("Impossible d'effecter un retrait pour le moment", "Error", "error");
          console.log('Payement error :', error)
        } 
        

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
          contentContainerStyle={{paddingTop:30}}
        >

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
            {t("deposit.back")}
          </Text>
        </TouchableOpacity>


        <Text className="text-3xl font-bold text-gray-800">
          {type === "DEPOSIT" ? t("deposit.first_title"):t("withdrawal.first_title") }

        </Text>

        <Text className="text-gray-500 mt-2">
                 {type === "DEPOSIT" ? t("deposit.sub_text"):t("withdrawal.sub_text") }


        </Text>


        <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mt-6 mb-8 flex-row items-center">

          <MaterialCommunityIcons
            name="shield-lock"
            size={30}
            color="#3b82f6"
          />

          <View className="ml-3 flex-1">

            <Text className="font-bold text-blue-600">
            {t("deposit.other_text1")}  
            </Text>

            <Text className="text-blue-500 text-sm mt-1">
              {t("deposit.other_text2")}
            </Text>

          </View>

        </View>


        <View className="mb-6">

          <Text className="font-medium text-gray-700 mb-2">
            {t("deposit.form.tel")}
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
              {t("deposit.form.tel_error")}

            </Text>
          )}

          {isPhoneValid && (
            <Text className="text-green-600 text-sm mt-2">
            
              {t("deposit.form.tel_valid")}

            </Text>
          )}

        </View>


        <View className="mb-8">

          <Text className="font-medium text-gray-700 mb-2">
            
            {t("deposit.form.amount")}

          </Text>

          <TextInput
            keyboardType="numeric"
            placeholder="5000"
            value={amount}
            onChangeText={setAmount}
            className="h-14 bg-white border border-gray-200 rounded-xl px-4 text-base"
          />

          {type === "WITHDRAWAL" && Number(amount) < 1000 && (
            <Text className="text-red-600 text-sm mt-2">
            
              {t("withdrawal.error.invalid_amount")}

            </Text>
          )}

        </View>


        <TouchableOpacity
          disabled={!isFormValid || loading }
          onPress={handleDeposit}
          className={`h-14 rounded-xl items-center justify-center
          ${
            isFormValid
              ? "bg-orange-500"
              : "bg-gray-300"
          }`}
        >

          <Text className="text-white text-lg font-bold">
          {type === "DEPOSIT" ? t("deposit.form.btnText"):t("withdrawal.form.btnText")}
          </Text>

        </TouchableOpacity>

        </ScrollView>
      </TouchableWithoutFeedback>
    


        {loading && (

          <View className="absolute inset-0 bg-black/30 justify-center items-center">

            <View className="bg-white rounded-3xl px-8 py-8 w-[85%] items-center">

              <ActivityIndicator
                size="large"
                color="#f97316"
              />

              <Text className="mt-5 text-xl font-bold text-blue-500">
                
                {t("deposit.loading.first_title")}

              </Text>

              <Text className="text-center text-gray-500 mt-3">
              {t("deposit.loading.second_title")}
              </Text>

              <Text className="text-center text-gray-400 mt-2 text-sm">
              {t("deposit.loading.third_title")}
              </Text>

            </View>

          </View>
        )}
        <Toast config={toastConfig} />  

  </KeyboardAvoidingView>
  );
 }
