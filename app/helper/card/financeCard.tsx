import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

interface WalletCardProps {
    item: CardItem;
    value: number;
}

export interface AccountWallet {
    totalBalance: number;
    competition: number;
    packs: number;
    userWithdrawals: number;
    netBalance: number;
    commission: number;
    usersCurrentBalance: number;
}

export interface CardItem {
    label: string;
    key: keyof AccountWallet;
    icon: keyof typeof Ionicons.glyphMap;
    accent: "orange" | "blue";
    description: string;
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

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
export const WalletCard = ({ item, value }: WalletCardProps) => {
    const isOrange = item.accent === "orange";
  
    return (
      <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-1 min-w-[45%]">
        {/* Icon badge */}
        <View
          className={`w-10 h-10 rounded-xl items-center justify-center mb-3 ${
            isOrange ? "bg-orange-50" : "bg-blue-50"
          }`}
        >
          <Ionicons
            name={item.icon}
            size={20}
            color={isOrange ? "#ff894f" : "#181c5c"}
          />
        </View>
  
        {/* Label */}
        <Text className="text-gray-500 text-xs font-medium mb-1" numberOfLines={1}>
          {item.label}
        </Text>
  
        {/* Value */}
        <Text
          className={`text-base font-bold ${
            isOrange ? "text-defaultOrange" : "text-defaultBlue"
          }`}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {formatCurrency(value)}
        </Text>
  
        {/* Description */}
        <Text className="text-gray-400 text-xs mt-1 leading-4" numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    );
  };