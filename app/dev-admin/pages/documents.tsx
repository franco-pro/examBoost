import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { DocType, TYPE_META, T, styles } from "./document.style";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Animated,
  Platform,
  Linking,
  Alert,
} from "react-native";
import { Document } from "@/app/hooks/entities/document";
import { DocumentCard } from "@/app/helper/card/documentCard";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { getAllDocs } from "@/app/hooks/redux/documents/document.thunks";
import { getAllNiveaux } from "@/app/hooks/redux/niveaux/niveaux.thunks";
import { Button, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import apiClient from "@/app/api/apiClient";
import { updateSendingStatut } from "@/app/hooks/redux/documents/document.slice";

const ALL_TYPES: DocType[] = [
    "CONTROLE CONTINU",
    "EXAMEN SEMESTRE",
    "TD",
    "EXAMEN",
    "EXAMEN BLANC",
    "EVALUATION",
    "CORRECTION",
  ];


export default function DocumentListScreen() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<DocType | "ALL">("ALL");
  const [validFilter, setValidFilter] = useState<"ALL" | "validated" | "pending">("ALL");
  const {documentsList, isSendingSuspended, loading} = useAppSelector(state => state.documents);
  const {niveauxList} = useAppSelector(state => state.niveaux);
  
  const doGlobalActivation = async ()=>{
    try {
     await apiClient.get(isSendingSuspended ?  '/document/global/activation':'/document/global/suspension');
     dispatch(updateSendingStatut(!isSendingSuspended));
      
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de l'état global :", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la mise à jour de l'état global. Veuillez réessayer plus tard."
      );  
    }

  }
    const handleToggle = () => {
      Alert.alert(
        isSendingSuspended ? "Activer" :"Désactiver",
        isSendingSuspended
          ? "Voulez-vous activer la soumission générale des documents ?":"Voulez-vous désactiver la soumission générale des documents par les profs ?",
        [
          {
            text: "Annuler",
            style: "cancel",
          },
          {
            text: "Confirmer",
            onPress: () => doGlobalActivation(),
          },
        ]
      );
    };
    
    useEffect(()=>{
      if(documentsList.length === 0){
        dispatch(getAllDocs());   
      }
      if(niveauxList.length === 0){
        dispatch(getAllNiveaux());
      }
    },[])   

  // const DOCS: Document[] = [
  //   {
  //     id: 1,
  //     name: "Controle_Analyse_1.pdf",
  //     format: "pdf",
  //     url: "https://example.com/documents/controle-analyse-1.pdf",
  //     subject: "Analyse Mathématique",
  //     isValidated: true,
  //     type: "CONTROLE CONTINU",
  //     correctionId: 101,
  //     user: {
  //       id: 1,
  //       username: "jdoe",
  //       surname: "Doe",
  //       imgUrl: "https://example.com/users/jdoe.jpg",
  //       wallet: 2500,
  //     },
  //     niveauID: 1,
  //     created_at: new Date("2025-01-10T08:00:00"),
  //     updated_at: new Date("2025-01-15T10:30:00"),
  //   },
  //   {
  //     id: 2,
  //     name: "TD_Programmation_Web.docx",
  //     format: "docx",
  //     url: "https://example.com/documents/td-programmation-web.docx",
  //     subject: "Programmation Web",
  //     isValidated: false,
  //     type: "TD",
  //     user: {
  //       id: 2,
  //       username: "asmith",
  //       surname: "Smith",
  //       imgUrl: "https://example.com/users/asmith.jpg",
  //       wallet: 1800,
  //     },
  //     niveauID: 2,
  //     created_at: new Date("2025-02-05T09:15:00"),
  //     updated_at: new Date("2025-02-05T09:15:00"),
  //   },
  //   {
  //     id: 3,
  //     name: "Examen_Reseaux_S1.pdf",
  //     format: "pdf",
  //     url: "https://example.com/documents/examen-reseaux-s1.pdf",
  //     subject: "Réseaux Informatiques",
  //     isValidated: true,
  //     type: "EXAMEN SEMESTRE",
  //     correctionId: 102,
  //     user: {
  //       id: 3,
  //       username: "mbappe",
  //       surname: "Ngono",
  //       imgUrl: "https://example.com/users/ngono.jpg",
  //       wallet: 3200,
  //     },
  //     niveauID: 3,
  //     created_at: new Date("2025-03-12T14:00:00"),
  //     updated_at: new Date("2025-03-13T08:20:00"),
  //   },
  //   {
  //     id: 4,
  //     name: "Evaluation_BDD.pdf",
  //     format: "pdf",
  //     url: "https://example.com/documents/evaluation-bdd.pdf",
  //     subject: "Bases de Données",
  //     isValidated: false,
  //     type: "EVALUATION",
  //     user: {
  //       id: 4,
  //       username: "alice",
  //       surname: "Kamga",
  //       imgUrl: "https://example.com/users/alice.jpg",
  //       wallet: 950,
  //     },
  //     niveauID: 2,
  //     created_at: new Date("2025-04-08T11:45:00"),
  //     updated_at: new Date("2025-04-08T11:45:00"),
  //   },
  //   {
  //     id: 5,
  //     name: "Correction_Algorithmique.pdf",
  //     format: "pdf",
  //     url: "https://example.com/documents/correction-algorithmique.pdf",
  //     subject: "Algorithmique",
  //     isValidated: true,
  //     type: "CORRECTION",
  //     user: {
  //       id: 5,
  //       username: "bmartin",
  //       surname: "Martin",
  //       imgUrl: "https://example.com/users/bmartin.jpg",
  //       wallet: 4100,
  //     },
  //     niveauID: 1,
  //     created_at: new Date("2025-05-01T16:20:00"),
  //     updated_at: new Date("2025-05-02T09:00:00"),
  //   },
  //   {
  //     id: 6,
  //     name: "Examen_Blanc_Physique.pdf",
  //     format: "pdf",
  //     url: "https://example.com/documents/examen-blanc-physique.pdf",
  //     subject: "Physique Générale",
  //     isValidated: true,
  //     type: "EXAMEN BLANC",
  //     correctionId: 103,
  //     user: {
  //       id: 6,
  //       username: "karl",
  //       surname: "Moukouri",
  //       imgUrl: "https://example.com/users/karl.jpg",
  //       wallet: 1500,
  //     },
  //     niveauID: 3,
  //     created_at: new Date("2025-05-15T13:30:00"),
  //     updated_at: new Date("2025-05-16T08:00:00"),
  //   },
  // ];
  const dispatch = useAppDispatch();

  // useFocusEffect(
  //   useCallback(() => {
     

     
  //   }, [])
  // )

  const filtered = useMemo(() => {
    return documentsList.filter((d) => {
      const matchType = activeType === "ALL" || d.type === activeType;
      const matchValid =
        validFilter === "ALL" ||
        (validFilter === "validated" && d.isValidated) ||
        (validFilter === "pending" && !d.isValidated);
      const matchSearch =
        search.trim() === "" ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.subject.toLowerCase().includes(search.toLowerCase());
      return matchType && matchValid && matchSearch;
    });
  }, [documentsList, activeType, validFilter, search]);

  const countForType = (t: DocType | "ALL") =>
    t === "ALL"
      ? documentsList.length
      : documentsList.filter((d) => d.type === t).length;

  return (
    <View className='flex-1 bg-gray-50 pt-[40px] pb-[50px] px-4'>
        <TouchableOpacity
        className="flex-row items-center mb-4"
        onPress={() => router.back()}
        >
        <Ionicons name="arrow-back" size={24} color="#181c5c" />
        <Text className="ml-2 text-lg font-semibold text-gray-800">Retour</Text>
        </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerSub}>Bibliothèque</Text>
            <Text className="text-xl font-semibold">Documents</Text>
          </View>
          <View style={styles.headerCount}>
            <Text className="text-xl font-semibold">{filtered.length}</Text>
            <Text style={styles.headerCountLabel}>résultats</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}><Ionicons name="search" size={24} color="black" /></Text>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Rechercher un document…"
            placeholderTextColor={T.textMuted}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Text style={styles.searchClear}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.typeFilterWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typeFilterScroll}
        >
          <TouchableOpacity
            style={[
              styles.typeChip,
              activeType === "ALL" && styles.typeChipActive,
            ]}
            onPress={() => setActiveType("ALL")}
          >
            <Text
              style={[
                styles.typeChipText,
                activeType === "ALL" && styles.typeChipTextActive,
              ]}
            >
              Tous ({documentsList.length})
            </Text>
          </TouchableOpacity>

          {ALL_TYPES.map((t) => {
            const m = TYPE_META[t];
            const isActive = activeType === t;
            return (
              <TouchableOpacity
                key={t}
                style={[
                  styles.typeChip,
                  isActive && { backgroundColor: m.color, borderColor: m.color },
                ]}
                onPress={() => setActiveType(t)}
              >
                <Text style={styles.typeChipIcon}>{m.icon}</Text>
                <Text
                  style={[
                    styles.typeChipText,
                    isActive && { color: T.white },
                  ]}
                >
                  {m.label} ({countForType(t)})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {activeType !== "ALL" && (
        <View style={styles.validFilterWrap}>
          <Text style={styles.validFilterLabel}>Statut :</Text>
          {(
            [
              { key: "ALL", label: "Tous" },
              { key: "validated", label: <Ionicons name="checkmark" size={24} color="black" /> },
              { key: "pending", label: <Ionicons name="timer" size={24} color="black" /> },
            ] as const
          ).map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.validChip,
                validFilter === key && styles.validChipActive,
              ]}
              onPress={() => setValidFilter(key)}
            >
              <Text
                style={[
                  styles.validChipText,
                  validFilter === key && styles.validChipTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 && !loading ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}><Ionicons name="alert-sharp" size={24} color="black" /></Text>
            <Text style={styles.emptyTitle}>Aucun document</Text>
            <Text style={styles.emptyText}>
              Modifiez les filtres pour afficher des résultats.
            </Text>
          </View>
        ) : filtered.length !== 0 && !loading ? (
          filtered.map((doc) => <DocumentCard key={doc.id} doc={doc} />)
        ): (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}><Ionicons name="hourglass" size={24} color="black" /></Text>
            <Text style={styles.emptyTitle}>Chargement...</Text>
            <Text style={styles.emptyText}>
              Veuillez patienter pendant le chargement des documents.
            </Text>
          </View>
        ) 
        }
        <View style={{ height: 40 }} />
      </ScrollView>

      <Box className="absolute bottom-6 right-6 z-50">
        <Button
          onPress={handleToggle}
          className={`h-16 w-20 rounded-full shadow-lg ${
            isSendingSuspended ?   "bg-green-500" : "bg-orange-500"
          }`}
        >
          <ButtonText className="text-sm font-bold text-white">
            {isSendingSuspended ? "ON" : "OFF"}
          </ButtonText>
        </Button>
      </Box>
    </View>
  );
}
