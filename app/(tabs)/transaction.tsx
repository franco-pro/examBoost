import SegmentedFilter from "@/components/layouts/filter/SegmentedFilter";
import { Image } from "@/components/ui/image";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { useAppDispatch, useAppSelector } from "../hooks/redux/redux.hooks";
import { getAllTransations } from "../hooks/redux/transactions/transaction.thunks";

export default function Transactions() {
  const [loadDone, setLoadDone] = useState(false);

  const dispatch = useAppDispatch();
  const userId = 1;
  const {
    transactionList: list,
    loading,
    error,
  } = useAppSelector((state) => state.transactions);

  useFocusEffect(
    useCallback(() => {
      if (list && list.length == 0) {
        dispatch(getAllTransations(userId));
        setLoadDone(true);
      }
      if (error) {
        showToast(error, "Error", "error");
        setLoadDone(true);
      }
    }, [list, error])
  );
  const [filter, setFilter] = useState<
    | "ALL"
    | "DEPOSIT"
    | "WITHDRAWAL"
    | "PURCHASE_PACK"
    | "CREATE_COMPETITION"
    | "COMPETITION_FEES"
  >("ALL");

  const filteredTransactions = list
    ? list.filter((tx) => (filter === "ALL" ? true : tx.type === filter))
    : [];

  function showToast(
    message: string,
    title: string,
    type: "success" | "error"
  ) {
    Toast.show({
      type: type,
      text2: message,
      text1: title,
      position: "top",
      visibilityTime: 3500,
    });
  }
  return (
    <View style={{ flex: 1, padding: 16 }} className="bg-gray ">
      <SegmentedFilter
        options={[
          "ALL",
          "WITHDRAWAL",
          "DEPOSIT",
          "PURCHASE_PACK",
          "CREATE_COMPETITION",
          "COMPETITION_FEES",
        ]}
        defaultValue="ALL"
        onChange={(value) =>
          setFilter(
            value as
              | "DEPOSIT"
              | "WITHDRAWAL"
              | "PURCHASE_PACK"
              | "CREATE_COMPETITION"
              | "COMPETITION_FEES"
          )
        }
      />

      <ScrollView className="mt-5">
        {filteredTransactions &&
          filteredTransactions.length != 0 &&
          filteredTransactions.map((game, index) => {
            return (
              <TouchableOpacity
                key={index}
                className="flex-row  mb-2 p-4 bg-white rounded-full"
              >
                <MaterialCommunityIcons
                  name={
                    game?.type === "WITHDRAWAL"
                      ? "arrow-up-circle"
                      : "arrow-down-circle"
                  }
                  size={40}
                  color={game?.type === "DEPOSIT" ? "green" : "red"}
                  style={{ marginRight: 10 }}
                />
                <View className="space-y-3">
                  <Text className="text-xs text-gray-400">
                    {new Date(game?.created_at).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  <Text>{game?.PID}</Text>
                </View>

                <View
                  style={{ marginLeft: "auto" }}
                  className="flex justify-center "
                >
                  <Text
                    className={`${
                      game?.type === "WITHDRAWAL"
                        ? "text-error-500 "
                        : "text-success-500"
                    }`}
                  >
                    {game?.type === "DEPOSIT" ? "+" : "-"}
                    {game?.amount} XAF
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

        {filteredTransactions.length == 0 && !loadDone && loading && (
          <View className="justify-center items-center">
            <VStack>
              <Spinner size="large" color="blue" />
            </VStack>
          </View>
        )}

        {filteredTransactions.length == 0 && loadDone && (
          <View className="justify-center items-center mt-[40%]">
            <VStack className="justify-center items-center">
              <Image
                size="2xl"
                source={require("../assets/images/student.jpg")}
                alt="image"
              />
              <Text>Aucune transaction</Text>
            </VStack>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
