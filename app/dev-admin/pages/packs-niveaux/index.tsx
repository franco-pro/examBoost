import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";


export default function PacksNiveau(){
    const [showForm, setShowForm] = useState(false);
    
    const options : {
        title: string;
        text: string;
        direction: "packs" | "niveaux",
        icon: React.ReactNode;
    }[] = [
            {
                title: "Gestion des packs",
                text: "Gérez les packs et niveaux de l'application.",
                direction: "packs",
                icon: <Ionicons name="layers-outline" size={28} color="#4b5563" />
            },
            {
                title: "Gestion des niveaux",
                text: "Gérez les niveaux de l'application.",
                direction: "niveaux",
                icon: <Ionicons name="barbell-outline" size={28} color="#4b5563" />
            }
        ]

        function makeNavigation(where: "packs" | "niveaux"){
            switch(where){
                case "packs":
                    return router.replace("/dev-admin/pages/packs-niveaux/packs");
                case "niveaux":
                    return router.replace("/dev-admin/pages/packs-niveaux/niveaux");
            }
        }

        return(
            <View className="flex-1 bg-gray-50 pt-[40px] pb-[50px] px-4">
                    <TouchableOpacity
                        className="flex-row items-center mb-4"
                        onPress={() => router.back()}
                    >
                    <Ionicons name="arrow-back" size={24} color="#181c5c" />
                        <Text className="ml-2 text-lg font-semibold text-gray-800">Retour</Text>
                    </TouchableOpacity>
                  {
                    options.map((act, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            className="bg-white rounded-2xl flex-row p-4 mb-3 shadow-sm items-center"
                                            onPress={() => makeNavigation(act.direction) }
                                        >
                                            <View className="bg-blue-50 p-3 rounded-full">{act.icon}</View>
                                            <View className="ml-3 flex-1">
                                                <Text className="text-lg font-semibold">{act.title}</Text>
                                                <Text className="text-gray-500">{act.text}</Text>
                                            </View>
                                            <Ionicons name="chevron-forward" size={22} color="#9ca3af" />
                                        </TouchableOpacity>
                                        ))
                  }
            </View>

        )

    }
