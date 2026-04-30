import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { TouchableOpacity, View, Text, FlatList } from "react-native";
import { styles, CATEGORIE_COLORS } from "./style";
import { NiveauCard } from "@/app/helper/card/niveauList";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { getAllNiveaux } from "@/app/hooks/redux/niveaux/niveaux.thunks";

export default function NiveauxPage(){
    const {niveauxList:niveaux} = useAppSelector((state)=> state.niveaux);
    const dispatch = useAppDispatch();

    useFocusEffect(
        useCallback(() => {
             dispatch(getAllNiveaux());
        }, [])
    )

    return(
        <View className="flex-1 bg-gray-50 pt-[40px] pb-[50px] px-4">

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color="#181c5c" />
                    </TouchableOpacity>
                        <View>
                            <Text style={styles.headerTitle}>Niveaux</Text>
                            <Text style={styles.headerSub}>{niveaux.length} niveaux enregistrés</Text>
                        </View>
                      <View style={{ width: 36 }} />
                 </View>

        <FlatList
            data={niveaux}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <NiveauCard item={item} />}
            ListEmptyComponent={
            <View style={styles.empty}>
                <Ionicons name="layers-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyText}>Aucun niveau pour l'instant</Text>
            </View>
            }
        />

                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => {
                         router.push("/dev-admin/pages/packs-niveaux/createNiveaux")
                    }}
                    activeOpacity={0.85}
                >
                    <Ionicons name="add" size={28} color="#fff" />
                    <Text style={styles.fabText}>Ajouter</Text>
                 </TouchableOpacity>
        </View>
    )
}
