import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import SegmentedFilter from "@/components/layouts/filter/SegmentedFilter";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const transactions = [
  {
    id: 1,
    type: "withdraw",
    amount: 50,
    created_at: "2025-09-01T09:20:00",
    PID: 1001,
  },
  {
    id: 2,
    type: "deposit",
    amount: 120,
    created_at: "2025-09-02T11:45:00",
    PID: 1002,
  },
  {
    id: 3,
    type: "purchase pack",
    amount: 200,
    created_at: "2025-09-03T14:10:00",
    PID: 1003,
  },
  {
    id: 4,
    type: "competition fees",
    amount: 30,
    created_at: "2025-09-04T16:00:00",
    PID: 1004,
  },
  {
    id: 5,
    type: "withdraw",
    amount: 75,
    created_at: "2025-09-05T10:30:00",
    PID: 1005,
  },
  {
    id: 6,
    type: "deposit",
    amount: 300,
    created_at: "2025-09-06T12:00:00",
    PID: 1006,
  },
  {
    id: 7,
    type: "create competition",
    amount: 500,
    created_at: "2025-09-07T18:20:00",
    PID: 1007,
  },
  {
    id: 8,
    type: "withdraw",
    amount: 60,
    created_at: "2025-09-08T08:15:00",
    PID: 1008,
  },
  {
    id: 9,
    type: "deposit",
    amount: 400,
    created_at: "2025-09-09T09:40:00",
    PID: 1009,
  },
  {
    id: 10,
    type: "competition fees",
    amount: 45,
    created_at: "2025-09-10T13:25:00",
    PID: 1010,
  },
  {
    id: 11,
    type: "withdraw",
    amount: 90,
    created_at: "2025-09-11T19:10:00",
    PID: 1011,
  },
  {
    id: 12,
    type: "deposit",
    amount: 150,
    created_at: "2025-09-12T07:55:00",
    PID: 1012,
  },
  {
    id: 13,
    type: "purchase pack",
    amount: 220,
    created_at: "2025-09-13T17:30:00",
    PID: 1013,
  },
  {
    id: 14,
    type: "withdraw",
    amount: 110,
    created_at: "2025-09-14T20:45:00",
    PID: 1014,
  },
  {
    id: 15,
    type: "deposit",
    amount: 280,
    created_at: "2025-09-15T06:25:00",
    PID: 1015,
  },
  {
    id: 16,
    type: "create competition",
    amount: 600,
    created_at: "2025-09-16T11:35:00",
    PID: 1016,
  },
  {
    id: 17,
    type: "competition fees",
    amount: 40,
    created_at: "2025-09-17T15:50:00",
    PID: 1017,
  },
  {
    id: 18,
    type: "withdraw",
    amount: 65,
    created_at: "2025-09-18T09:10:00",
    PID: 1018,
  },
  {
    id: 19,
    type: "deposit",
    amount: 500,
    created_at: "2025-09-19T22:00:00",
    PID: 1019,
  },
  {
    id: 20,
    type: "purchase pack",
    amount: 350,
    created_at: "2025-09-20T14:45:00",
    PID: 1020,
  },
];
export default function Transactions() {
  const [filter, setFilter] = useState<
    | "all"
    | "withdraw"
    | "deposit"
    | "purchase pack"
    | "create competition"
    | "competition fees"
  >("all");

  const filteredTransactions = transactions.filter((tx) =>
    filter === "all" ? true : tx.type === filter
  );

  return (
    <View style={{ flex: 1, padding: 16 }} className="bg-gray ">
      <SegmentedFilter
        options={[
          "all",
          "withdraw",
          "deposit",
          "purchase pack",
          "create competition",
          "competition fees",
        ]}
        defaultValue="all"
        onChange={(value) =>
          setFilter(
            value as
              | "all"
              | "withdraw"
              | "deposit"
              | "purchase pack"
              | "create competition"
              | "competition fees"
          )
        }
      />

      <ScrollView className="mt-5">
        {filteredTransactions.map((game, index) => {
          return (
            <TouchableOpacity
              key={index}
              className="flex-row  mb-2 p-4 bg-white rounded-full"
            >
              <MaterialCommunityIcons
                name={
                  game?.type === "withdraw"
                    ? "arrow-up-circle"
                    : "arrow-down-circle"
                }
                size={40}
                color={game?.type === "deposit" ? "green" : "red"}
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
                {" "}
                <Text
                  className={`${
                    game?.type === "withdraw"
                      ? "text-error-500 "
                      : "text-success-500"
                  }`}
                >
                  {game?.type === "deposit" ? "+" : "-"}
                  {game?.amount} XAF
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
