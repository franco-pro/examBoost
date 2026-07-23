import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AccountWallet, CardItem, formatCurrency, WalletCard } from "@/app/helper/card/financeCard";
import { useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { router } from "expo-router";


const CARDS: CardItem[] = [
  {
    label: "Total des dépôts",
    key: "totalBalance",
    icon: "wallet-outline",
    accent: "blue",
    description: "Cumul de tous les dépôts effectués",
  },
  {
    label: "Balance nette",
    key: "netBalance",
    icon: "trending-up-outline",
    accent: "orange",
    description: "Dépôts moins retraits",
  },
  {
    label: "Balance utilisateurs",
    key: "usersCurrentBalance",
    icon: "people-outline",
    accent: "blue",
    description: "Solde actuel de tous les comptes",
  },
  {
    label: "Compétitions",
    key: "competition",
    icon: "trophy-outline",
    accent: "orange",
    description: "Volume généré via les compétitions",
  },
  {
    label: "Packs",
    key: "packs",
    icon: "cube-outline",
    accent: "blue",
    description: "Revenus issus des packs",
  },
  {
    label: "Commissions",
    key: "commission",
    icon: "cash-outline",
    accent: "orange",
    description: "Total des commissions perçues",
  },
  {
    label: "Retraits utilisateurs",
    key: "userWithdrawals",
    icon: "arrow-up-circle-outline",
    accent: "blue",
    description: "Total des retraits effectués",
  },
];



const Header = ({ netBalance }: { netBalance: number }) => (
  <View className="bg-primary-defaultBlue px-6 pt-14 pb-8 rounded-b-3xl">
            <TouchableOpacity
            className="flex-row items-center mb-4"
            onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={24} color="orange" />
                <Text className="ml-2 text-lg font-semibold text-white">Retour</Text>
            </TouchableOpacity>

    {/* Top label */}
    <Text className="text-white/60 text-sm font-medium tracking-widest uppercase mb-1">
      Tableau de bord
    </Text>
    <Text className="text-white text-2xl font-bold mb-6">
      Finances du compte
    </Text>

    {/* Hero balance card */}
    <View className="bg-primary-defaultOrange rounded-2xl p-5 border border-white/20">
      <View className="flex-row items-center gap-2 mb-2">
        <Ionicons name="stats-chart-outline" size={16} color="rgba(255,255,255,0.6)" />
        <Text className="font-bold text-xs font-medium uppercase tracking-wider">
          Balance nette
        </Text>
      </View>
      <Text
        className={`text-3xl font-bold ${
          netBalance >= 0 ? "text-white" : "text-defaultOrange"
        }`}
      >
        {formatCurrency(netBalance)}
      </Text>
      <View className="mt-3 flex-row items-center gap-1">
        <Ionicons
          name={netBalance >= 0 ? "arrow-up-outline" : "arrow-down-outline"}
          size={14}
          color={netBalance >= 0 ? "#4ade80" : "#ff894f"}
        />
        <Text
          className={`text-xs font-medium ${
            netBalance >= 0 ? "text-green-400" : "text-defaultOrange"
          }`}
        >
          {netBalance >= 0 ? "Solde positif" : "Solde négatif"}
        </Text>
      </View>
    </View>
  </View>
);



const SummaryRow = ({
  wallet,
}: {
  wallet: AccountWallet;
}) => (
  <View className="mx-6 mb-6 bg-primary-defaultBlue rounded-2xl p-4">
    <Text className="text-white text-xs font-medium uppercase tracking-wider mb-3">
      Résumé rapide
    </Text>
    <View className="flex-row justify-between">
      <View className="items-center">
        <Ionicons name="arrow-down-circle-outline" size={20} color="#4ade80" />
        <Text className="text-white/60 text-xs mt-1">Dépôts</Text>
        <Text className="text-white text-sm font-semibold">
          {formatCurrency(wallet.totalBalance)}
        </Text>
      </View>
      <View className="w-px bg-white/10" />
      <View className="items-center">
        <Ionicons name="arrow-up-circle-outline" size={20} color="#ff894f" />
        <Text className="text-white/60 text-xs mt-1">Retraits</Text>
        <Text className="text-white text-sm font-semibold">
          {formatCurrency(wallet.userWithdrawals)}
        </Text>
      </View>
      <View className="w-px bg-white/10" />
      <View className="items-center">
        <Ionicons name="people-circle-outline" size={20} color="#a5b4fc" />
        <Text className="text-white/60 text-xs mt-1">Utilisateurs</Text>
        <Text className="text-indigo-300 text-sm font-semibold">
          {formatCurrency(wallet.usersCurrentBalance)}
        </Text>
      </View>
    </View>
  </View>
);


export default function AccountWalletScreen() {
  // Split cards into pairs for the 2-column grid (exclude netBalance shown in header)
  const {accountWallet} = useAppSelector(state => state.devadmin);
  const wallet = accountWallet as AccountWallet;

  const gridCards = CARDS.filter((c) => c.key !== "netBalance" && c.key !== "usersCurrentBalance");

  const rows: CardItem[][] = [];
  for (let i = 0; i < gridCards.length; i += 2) {
    rows.push(gridCards.slice(i, i + 2));
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <Header netBalance={wallet.netBalance} />

      <View className="mt-6">
        <SummaryRow wallet={wallet} />
      </View>

      <View className="px-6 mb-4">
        <Text className="text-defaultBlue text-base font-bold">
          Détails par catégorie
        </Text>
        <Text className="text-gray-400 text-xs mt-0.5">
          Ventilation complète des flux financiers
        </Text>
      </View>

      <View className="px-6 gap-3">
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row gap-3">
            {row.map((card) => (
              <WalletCard
                key={card.key}
                item={card}
                value={wallet[card.key] as number}
              />
            ))}
            {row.length === 1 && <View className="flex-1" />}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}