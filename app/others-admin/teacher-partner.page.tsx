import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from "react-native";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "../redux/redux.hooks";

const stats = {
  totalStudent: 30,
  totalDocSubmit: 128,
  totalValidated: 94,
  totalGain: 47500,
  totalCommission: 600
};

const docs = [
  { id: "1", type: "CONTROLE CONTINU", name: "CC Analyse S3", subject: "Mathématiques", isValidated: true, created_at: "2025-05-10", niveaux: { name: "Licence 2" } },
  { id: "2", type: "EXAMEN SEMESTRE", name: "Examen Final S2", subject: "Physique", isValidated: false, created_at: "2025-05-08", niveaux: { name: "Licence 1" } },
  { id: "3", type: "TD", name: "TD Algorithmique #4", subject: "Informatique", isValidated: true, created_at: "2025-05-07", niveaux: { name: "Licence 3" } },
  { id: "4", type: "EXAMEN", name: "Exam Chimie Organique", subject: "Chimie", isValidated: false, created_at: "2025-05-06", niveaux: { name: "Terminale S" } },
  { id: "5", type: "EXAMEN BLANC", name: "Blanc BAC Blanc #2", subject: "Français", isValidated: true, created_at: "2025-05-05", niveaux: { name: "Terminale A" } },
  { id: "6", type: "EVALUATION", name: "Éval. Histoire Géo", subject: "Histoire-Géo", isValidated: false, created_at: "2025-05-04", niveaux: { name: "3ème" } },
  { id: "7", type: "CORRECTION", name: "Correction TD Réseau", subject: "Informatique", isValidated: true, created_at: "2025-05-03", niveaux: { name: "Licence 2" } },
  { id: "8", type: "CONTROLE CONTINU", name: "CC Probabilités", subject: "Mathématiques", isValidated: false, created_at: "2025-05-01", niveaux: { name: "Master 1" } },
];

const DOC_CONFIG = {
  "CONTROLE CONTINU": { color: "#6366F1", bg: "#EEF2FF", icon: "📝", short: "CC" },
  "EXAMEN SEMESTRE":  { color: "#0EA5E9", bg: "#E0F2FE", icon: "📘", short: "ES" },
  "TD":               { color: "#10B981", bg: "#D1FAE5", icon: "📋", short: "TD" },
  "EXAMEN":           { color: "#F59E0B", bg: "#FEF3C7", icon: "📄", short: "EX" },
  "EXAMEN BLANC":     { color: "#F97316", bg: "#FFF7ED", icon: "📃", short: "EB" },
  "EVALUATION":       { color: "#EC4899", bg: "#FDF2F8", icon: "✏️", short: "EV" },
  "CORRECTION":       { color: "#8B5CF6", bg: "#F5F3FF", icon: "✅", short: "CR" },
};

const formatDate = (dateStr: any) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};

const formatGain = (n: any) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k FCFA` : `${n} FCFA`;

function StatCard({ label, value, accent, sub }: any) {
  return (
    <View style={[styles.statCard, { borderTopColor: accent }]}>
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
    </View>
  );
}

function DocRow({ item }: any) {
  const cfg = DOC_CONFIG[item.type as keyof typeof DOC_CONFIG] || { color: "#64748B", bg: "#F1F5F9", icon: "📁", short: "??" };
  return (
    <View style={styles.docRow}>
      {/* Icône */}
      <View style={[styles.docIconWrap, { backgroundColor: cfg.bg }]}>
        <Text style={styles.docIconEmoji}>{cfg.icon}</Text>
        <Text style={[styles.docIconShort, { color: cfg.color }]}>{cfg.short}</Text>
      </View>

      {/* Infos */}
      <View style={styles.docInfo}>
        <Text style={styles.docName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.docMeta}>
          <Text style={styles.docLevel}>{item.niveaux.name}</Text>
          <Text style={styles.docDot}>·</Text>
          <Text style={styles.docDate}>{formatDate(item.created_at)}</Text>
        </View>
        <Text style={[styles.docTypeBadge, { color: cfg.color, backgroundColor: cfg.bg }]}>
          {item.type}
        </Text>
      </View>

      {/* Statut */}
      <View style={[styles.statusDot, { backgroundColor: item.isValidated ? "#10B981" : "#F59E0B" }]} />
    </View>
  );
}

export default function DocAdmin() {
  const [filter, setFilter] = useState("TOUS");
  const types = ["TOUS", ...Object.keys(DOC_CONFIG)];
  const {user}  = useAppSelector(s => s.user);
  const validationRate = Math.round((stats.totalValidated / stats.totalDocSubmit) * 100);
  const pending = stats.totalDocSubmit - stats.totalValidated;
  const isPartner = user?.role?.toLowerCase() === "partner";
  const filtered = filter === "TOUS" ? docs : docs.filter((d) => d.type === filter);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
      <TouchableOpacity
        className="flex-row items-center mb-6"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={"white"} />
        <Text className="ml-2 text-lg font-semibold text-gray-800">Retour</Text>
      </TouchableOpacity>
        <View>
          <Text style={styles.headerSub}>Administration</Text>
          <Text style={styles.headerTitle}>Documents</Text>
        </View>
        <Avatar size="md" className="border-2 border-orange-400">
          <AvatarImage source={{ uri: user?.imgUrl }} alt={user?.name ?? "User"} />
          <AvatarFallbackText className="text-white font-bold bg-indigo-500">
            {user?.name ?? "A"}
          </AvatarFallbackText>
        </Avatar>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── DASHBOARD (≈38%) ── */}
        <View style={styles.dashboard}>

          {/* Stat cards row */}
          <View style={styles.statsRow}>
            <StatCard
              label="Soumis"
              value={stats.totalDocSubmit}
              accent="#6366F1"
            />
            <StatCard
              label="Validés"
              value={stats.totalValidated}
              accent="#10B981"
              sub={`${validationRate}%`}
            />
            <StatCard
              label="Gains"
              value={formatGain(stats.totalGain)}
              accent="#F59E0B"
            />
          </View>
        {isPartner && (
            <View style={[styles.statsRow, { marginTop: 10 }]}>
                <StatCard label="Étudiants" value={stats.totalStudent} accent="#0EA5E9" icon="👥" />
                <StatCard label="Commission" value={formatGain(stats.totalCommission)} accent="#EC4899" icon="💰" />
            </View>
        )}

          {/* Progress bar */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Taux de validation</Text>
              <Text style={styles.progressPct}>{validationRate}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${validationRate}%` }]} />
            </View>
            <View style={styles.progressFooter}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#10B981" }]} />
                <Text style={styles.legendText}>{stats.totalValidated} validés</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#F59E0B" }]} />
                <Text style={styles.legendText}>{pending} en attente</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── SECTION LISTE ── */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Liste des documents</Text>
            <Text style={styles.listCount}>{filtered.length}</Text>
          </View>

          {/* Filtres horizontaux */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterContent}
          >
            {types.map((t) => {
              const cfg = DOC_CONFIG[t as keyof typeof DOC_CONFIG];
              const active = filter === t;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setFilter(t)}
                  style={[
                    styles.filterChip,
                    active && { backgroundColor: cfg ? cfg.color : "#0F172A", borderColor: cfg ? cfg.color : "#0F172A" },
                  ]}
                >
                  {cfg && <Text style={styles.filterEmoji}>{cfg.icon}</Text>}
                  <Text style={[styles.filterText, active && styles.filterTextActive]}>
                    {t === "TOUS" ? "Tous" : cfg?.short ?? t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Docs */}
          {filtered.map((item) => (
            <DocRow key={item.id} item={item} />
          ))}

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={() => {router.push("/submit-doc/submit")}}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
