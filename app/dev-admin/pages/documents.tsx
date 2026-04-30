import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useMemo } from "react";
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
} from "react-native";
import { Document } from "@/app/hooks/entities/document";
import { DocumentCard } from "@/app/helper/card/documentCard";


const DOCS: Document[] = [
  {
    id: 1,
    name: "Mathématiques – Séries numériques",
    format: "pdf",
    url: "https://example.com/doc1.pdf",
    subject: "Mathématiques",
    isValidated: true,
    type: "EXAMEN SEMESTRE",
    created_at: new Date("2025-03-10"),
    updated_at: new Date("2025-03-12"),
  },
  {
    id: 2,
    name: "Physique – Lois de Newton",
    format: "pdf",
    url: "https://example.com/doc2.pdf",
    subject: "Physique",
    isValidated: false,
    type: "TD",
    created_at: new Date("2025-03-15"),
    updated_at: new Date("2025-03-15"),
  },
  {
    id: 3,
    name: "Bac Blanc – Littérature",
    format: "docx",
    url: "https://example.com/doc3.docx",
    subject: "Français",
    isValidated: true,
    type: "EXAMEN BLANC",
    created_at: new Date("2025-02-20"),
    updated_at: new Date("2025-02-22"),
  },
  {
    id: 4,
    name: "CC1 – Algorithmique",
    format: "pdf",
    url: "https://example.com/doc4.pdf",
    subject: "Informatique",
    isValidated: false,
    type: "CONTROLE CONTINU",
    created_at: new Date("2025-04-01"),
    updated_at: new Date("2025-04-01"),
  },
  {
    id: 5,
    name: "Correction Bac 2024",
    format: "pdf",
    url: "https://example.com/doc5.pdf",
    subject: "Mathématiques",
    isValidated: true,
    type: "CORRECTION",
    created_at: new Date("2025-01-05"),
    updated_at: new Date("2025-01-06"),
  },
  {
    id: 6,
    name: "Évaluation Chimie Organique",
    format: "pdf",
    url: "https://example.com/doc6.pdf",
    subject: "Chimie",
    isValidated: false,
    type: "EVALUATION",
    created_at: new Date("2025-04-10"),
    updated_at: new Date("2025-04-10"),
  },
  {
    id: 7,
    name: "Examen final – Histoire",
    format: "pdf",
    url: "https://example.com/doc7.pdf",
    subject: "Histoire",
    isValidated: true,
    type: "EXAMEN",
    created_at: new Date("2025-03-28"),
    updated_at: new Date("2025-03-30"),
  },
];

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

  const filtered = useMemo(() => {
    return DOCS.filter((d) => {
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
  }, [activeType, validFilter, search]);

  const countForType = (t: DocType | "ALL") =>
    t === "ALL"
      ? DOCS.length
      : DOCS.filter((d) => d.type === t).length;

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
              Tous ({DOCS.length})
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
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>Aucun document</Text>
            <Text style={styles.emptyText}>
              Modifiez les filtres pour afficher des résultats.
            </Text>
          </View>
        ) : (
          filtered.map((doc) => <DocumentCard key={doc.id} doc={doc} />)
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
