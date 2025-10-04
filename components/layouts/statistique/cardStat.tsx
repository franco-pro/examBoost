import { JSX } from "react";
import { View,TouchableOpacity,Text } from "react-native";
interface cardStatProps<T extends string> {
   nom: string;
    chiffre: number;
    icone: JSX.Element;
    bgColor: string;
    textColor: string;
   
}

export default function CardStat<T extends string>({
nom,
    chiffre,
    icone,
    bgColor,
    textColor,
    
}: cardStatProps<T>){

    return (
 <TouchableOpacity
           
            className={`w-[48%] ${bgColor} p-4 rounded-xl mb-3 items-center shadow-sm`}
          >
            <View className="mb-2">{icone}</View>
            <Text className={`font-semibold text-center ${textColor}`}>
              {nom}
            </Text>
            <Text className={`text-xl font-bold mt-1 ${textColor}`}>
              {chiffre}
            </Text>
          </TouchableOpacity>
    );
}

