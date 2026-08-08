import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { styleList as packStyles } from "./packs.style";
import { styles } from "./style";
import { PackCard } from "@/app/helper/card/packCard";
import { router, useFocusEffect, useRouter } from "expo-router";
import { useAppDispatch } from "@/app/hooks/redux/redux.hooks";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { getPacks } from "@/app/hooks/redux/packs/pack.thunks";

type CategoryType = "SECONDARY" | "SUP";

type PackType =
  | "CONTROLE CONTINU"
  | "EXAMEN SEMESTRE"
  | "TD"
  | "EXAMEN"
  | "EXAMEN BLANC"
  | "EVALUATION";

interface Pack {
  id: number;
  name: string;
  price: number;
  description: string;
  duration?: number;
  categorie: CategoryType;
  type: PackType;
  durationDays: number;
  isActive: boolean;
}


export default function PackListScreen() {
  const [filter, setFilter] = useState<"ALL" | CategoryType>("ALL");
  const {packs, loading} = useAppSelector(state => state.packs);

  const filtered = packs.filter(
    (p: any) => filter === "ALL" || p.categorie === filter
  );
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
       if(packs.length === 0){
         dispatch(getPacks());
       }
    }, [])
  )

  return (
    <View style={packStyles.root} className="flex-1 bg-gray-50 pt-[40px] pb-[50px] px-4">
      {/* Header */}
      <TouchableOpacity
        className="flex-row items-center mb-4"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#181c5c" />
        <Text className="ml-2 text-lg font-semibold text-gray-800">Retour</Text>
      </TouchableOpacity>
      <View style={packStyles.header} className="bg-white rounded-2xl mb-4 ">
        <View style={packStyles.headerAccent} />
        <Text style={packStyles.headerSub}>Catalogue</Text>
        <Text style={packStyles.headerTitle}>Nos packs</Text>
        <Text style={packStyles.headerCount}>
          {packs.length} pack{packs.length > 1 ? "s" : ""} disponible
          {packs.length > 1 ? "s" : ""}
        </Text>

        {/* Filter tabs */}
        <View style={packStyles.filterRow}>
          {(["ALL", "SECONDARY", "SUP"] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[packStyles.filterTab, filter === f && packStyles.filterTabActive]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                    packStyles.filterTabText,
                  filter === f && packStyles.filterTabTextActive,
                ]}
              >
                {f === "ALL" ? "Tous" : f === "SECONDARY" ? "Secondaire" : "Supérieur"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        style={packStyles.scroll}
        contentContainerStyle={packStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={packStyles.emptyState}>
            <Text style={packStyles.emptyIcon}><Ionicons name="alert-sharp" size={24} color="black" /></Text>
            <Text style={packStyles.emptyText}>Aucun pack trouvé</Text>
          </View>
        ) : (
          filtered.map((pack: Pack) => (
            <PackCard
              key={pack.id}
              pack={{ ...pack, duration: pack.duration ?? 0 }}
            />
          ))
        )}
        <View style={{ height: 40 }} />
        
           
      </ScrollView>
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => {
                         router.push("/dev-admin/pages/packs-niveaux/createPacks")
                    }}
                    activeOpacity={0.85}
                >
                    <Ionicons name="add" size={28} color="#fff" />
                    <Text style={styles.fabText}>Ajouter</Text>
                 </TouchableOpacity>
    </View>
  );
}
