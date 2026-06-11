import React, { useEffect, useState } from "react";
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
import { DocAdminHTTP } from "../hooks/services/document/doc.admin.http";

type GainDetail = {
  count: number;
  price: number;
  subtotal: number;
};

type ApiResponse = {
  dashboard: {
    totalDocSubmit: number;
    totalValidated: number;
    totalGain: number;
    totalStudent?: number;
    totalCommission?: number;
    last30Days: {
      docsSent: number;
      docsValidated: number;
      gain: number;
      gainDetail: Record<string, GainDetail>;
    };
    nextPaymentDate: string; // ISO string
  };
  documents: {
    id: string;
    name: string;
    type: string;
    subject: string;
    isValidated: boolean;
    createdAt: string; // ISO string
    niveau: { id: string; name: string };
  }[];
};


const DOC_CONFIG = {
  "CONTROLE CONTINU": { color: "#6366F1", bg: "#EEF2FF", iconName: "document-text-outline", short: "CC" },
  "EXAMEN SEMESTRE":  { color: "#0EA5E9", bg: "#E0F2FE", iconName: "book-outline", short: "ES" },
  "TD":               { color: "#10B981", bg: "#D1FAE5", iconName: "clipboard-outline", short: "TD" },
  "EXAMEN":           { color: "#F59E0B", bg: "#FEF3C7", iconName: "document-outline", short: "EX" },
  "EXAMEN BLANC":     { color: "#F97316", bg: "#FFF7ED", iconName: "reader-outline", short: "EB" },
  "EVALUATION":       { color: "#EC4899", bg: "#FDF2F8", iconName: "pencil-outline", short: "EV" },
  "CORRECTION":       { color: "#8B5CF6", bg: "#F5F3FF", iconName: "checkmark-circle-outline", short: "CR" },
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};

const formatGain = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k FCFA` : `${n} FCFA`;

const formatNextPayment = (isoDate: string) => {
  const d = new Date(isoDate);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" }) + " 00h";
};

function StatCard({ label, value, accent, sub }: any) {
  return (
    <View style={[styles.statCard, { borderTopColor: accent }]}>
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
    </View>
  );
}

function InfoCard({ label, value, accent, legend, iconName }: any) {
  return (
    <View style={[styles.statCard, { borderTopColor: accent, flex: 1 }]}>
      <Ionicons name={iconName} size={18} color={accent} style={{ marginBottom: 4 }} />
      <Text style={[styles.statValue, { color: accent, fontSize: 13 }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
      {legend ? <Text style={[styles.statSub, { fontStyle: "italic" }]}>{legend}</Text> : null}
    </View>
  );
}

function DocRow({ item }: any) {
  const cfg = DOC_CONFIG[item.type as keyof typeof DOC_CONFIG] || { color: "#64748B", bg: "#F1F5F9", iconName: "folder-outline", short: "??" };
  return (
    <View style={styles.docRow}>
      {/* Icône */}
      <View style={[styles.docIconWrap, { backgroundColor: cfg.bg }]}>
        <Ionicons name={cfg.iconName as any} size={20} color={cfg.color} />
        <Text style={[styles.docIconShort, { color: cfg.color }]}>{cfg.short}</Text>
      </View>

      {/* Infos */}
      <View style={styles.docInfo}>
        <Text style={styles.docName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.docMeta}>
          <Text style={styles.docLevel}>{item.niveau.name}</Text>
          <Text style={styles.docDot}>·</Text>
          <Text style={styles.docDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <Text style={[styles.docTypeBadge, { color: cfg.color, backgroundColor: cfg.bg }]}>
          {item.type}
        </Text>
      </View>

      <View style={[styles.statusDot, { backgroundColor: item.isValidated ? "#10B981" : "#F59E0B" }]} />
    </View>
  );
}

export default function DocAdmin() {
  const [filter, setFilter] = useState("TOUS");
  const types = ["TOUS", ...Object.keys(DOC_CONFIG)];
  const { user } = useAppSelector(s => s.user);
  const isPartner = user?.role?.toLowerCase() === "partner";
  const [dashboard, setDashboard] = useState<ApiResponse["dashboard"] | null>(null);
  const [documents, setDocuments] = useState<ApiResponse["documents"]>([]);
  const [loadDone, setLoadDone] = useState(false);

  useEffect(() => {
      const fetchData = async () => {
        if (!user) router.replace("/login");

        if ((dashboard === null || documents.length === 0 && !loadDone)) {
          const dataApi = await DocAdminHTTP().getDocs(user?.id ?? 0);
          if (dataApi && !dataApi.error) {
            setDashboard(dataApi.data.dashboard);
            setDocuments(dataApi.data.documents);
          }

          setLoadDone(true);
        }
      };

      fetchData();
  }, [user, dashboard, documents]);


  const validationRate = (dashboard && dashboard.totalValidated && dashboard.totalDocSubmit)  ? Math.round((dashboard.totalValidated / dashboard.totalDocSubmit) * 100): 0;
  const pending = dashboard ? dashboard.totalDocSubmit - dashboard.totalValidated: 0;

  // Gain 30j : format "+N*prix FCFA" par type depuis gainDetail
  const gainLabel = dashboard?.last30Days?.gainDetail
  ? Object.entries(dashboard.last30Days.gainDetail)
      .map(([, v]) => {
        const gainDetail = v as GainDetail;
        return `+${gainDetail.count}*${gainDetail.price}`;
      })
      .join(" ")
  : "";
  const gainDisplay = gainLabel ? `${gainLabel} FCFA` : `${dashboard ? dashboard.last30Days.gain: 0} FCFA`;

  const filtered = filter === "TOUS" ? documents : documents.filter((d: any) => d.type === filter);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <View>
        {/* HEADER */}
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

        <View style={styles.dashboard}>

          <View style={styles.statsRow}>
            <StatCard
              label="Soumis"
              value={dashboard?.totalDocSubmit ?? 0}
              accent="#6366F1"
            />
            <StatCard
              label="Validés"
              value={dashboard?.totalValidated ?? 0}
              accent="#10B981"
              sub={`${validationRate}%`}
            />
            <StatCard
              label="Gains"
              value={formatGain(dashboard?.totalGain ?? 0)}
              accent="#F59E0B"
            />
          </View>

          <View style={[styles.statsRow, { marginTop: 10 }]}>
            <InfoCard
              label="30 derniers jours"
              value={`${dashboard?.last30Days?.docsValidated ?? 0} docs`}
              accent="#0EA5E9"
              legend="Docs envoyés"
              iconName="calendar-outline"
            />
            <InfoCard
              label="Gains calculés"
              value={gainDisplay}
              accent="#10B981"
              legend={`${dashboard?.last30Days?.docsValidated ?? 0} validés`}
              iconName="calculator-outline"
            />
            <InfoCard
              label="Prochain paiement"
              value={formatNextPayment(dashboard ? dashboard.nextPaymentDate: "")}
              accent="#F97316"
              legend="Date de virement"
              iconName="time-outline"
            />
          </View>

          {isPartner && (
            <View style={[styles.statsRow, { marginTop: 10 }]}>
              <StatCard label="Étudiants" value={dashboard?.totalStudent} accent="#0EA5E9" />
              <StatCard label="Commission" value={formatGain(dashboard?.totalCommission ?? 0)} accent="#EC4899" />
            </View>
          )}

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Taux de validation</Text>
              <Text style={styles.progressPct}>{isNaN(validationRate) ? 0: validationRate}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${validationRate}%` }]} />
            </View>
            <View style={styles.progressFooter}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#10B981" }]} />
                <Text style={styles.legendText}>{dashboard?.totalValidated} validés</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#F59E0B" }]} />
                <Text style={styles.legendText}>{pending} en attente</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Liste des documents</Text>
            <Text style={styles.listCount}>{filtered.length}</Text>
          </View>

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
                  {cfg && (
                    <Ionicons
                      name={cfg.iconName as any}
                      size={14}
                      color={active ? "#fff" : cfg.color}
                      style={{ marginRight: 4 }}
                    />
                  )}
                  <Text style={[styles.filterText, active && styles.filterTextActive]}>
                    {t === "TOUS" ? "Tous" : cfg?.short ?? t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Docs */}
          {filtered.map((item: any) => (
            <DocRow key={item.id} item={item} />
          ))}

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={() => {router.push("/others-admin/submit-doc/submit")}}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}