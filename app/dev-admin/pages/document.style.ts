import {StyleSheet} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from "react";

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

export const TYPE_META: Record<
  DocType,
  { label: string; icon: IoniconsName; color: string; bg: string }
> = {
  "CONTROLE CONTINU": { label: "CC",   icon: "pencil-outline",            color: "#1565C0", bg: "#E3F2FD" },
  "EXAMEN SEMESTRE":  { label: "ES",   icon: "book-outline",              color: "#6A1B9A", bg: "#F3E5F5" },
  "TD":               { label: "TD",   icon: "flask-outline",             color: "#1B5E20", bg: "#E8F5E9" },
  "EXAMEN":           { label: "EX",   icon: "clipboard-outline",         color: "#E65100", bg: "#FFF3E0" },
  "EXAMEN BLANC":     { label: "EB",   icon: "document-text-outline",     color: "#BF360C", bg: "#FBE9E7" },
  "EVALUATION":       { label: "EV",   icon: "checkmark-circle-outline",  color: "#880E4F", bg: "#FCE4EC" },
  "CORRECTION":       { label: "COR",  icon: "key-outline",               color: "#004D40", bg: "#E0F2F1" },
};

  export type DocType =
  | "CONTROLE CONTINU"
  | "EXAMEN SEMESTRE"
  | "TD"
  | "EXAMEN"
  | "EXAMEN BLANC"
  | "EVALUATION"
  | "CORRECTION";

 export const T = {
    blue: "#181c5c",
    orange: "#ff894f",
    blueDark: "#0f1240",
    blueLight: "#252a7a",
    blueFade: "#f0f1fa",
    blueMid: "#e8eaf6",
    orangeLight: "#fff1eb",
    orangeFade: "#ffe8dc",
    white: "#ffffff",
    bg: "#f4f5fb",
    card: "#ffffff",
    border: "#e2e4f0",
    text: "#0f1240",
    textMid: "#4a4f8a",
    textMuted: "#8b90bb",
    success: "#1a7f4b",
    successBg: "#e6f7ee",
    danger: "#c62828",
    dangerBg: "#fdecea",
  };

  export const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: T.bg },
  
    // Header
    header: {
      backgroundColor: T.white,
      paddingTop: 20,
      paddingBottom: 20,
      paddingHorizontal: 20,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: 16,
    },
    headerSub: {
      fontSize: 11,
      fontWeight: "600",
      color: T.orange,
      letterSpacing: 1.8,
      textTransform: "uppercase",
      marginBottom: 3,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "800",
      color: T.white,
      letterSpacing: -0.5,
    },
    headerCount: {
      alignItems: "center",
      backgroundColor: "rgba(255,137,79,0.15)",
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: "rgba(255,137,79,0.35)",
    },
    headerCountNum: {
      fontSize: 20,
      fontWeight: "800",
      color: T.orange,
      lineHeight: 24,
    },
    headerCountLabel: {
      fontSize: 9,
      fontWeight: "600",
      color: "rgba(255,255,255,0.55)",
      letterSpacing: 0.5,
    },
  
    // Search
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(245, 144, 50, 0.1)",
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: "rgba(31, 10, 10, 0.15)",
      gap: 8,
    },
    searchIcon: { fontSize: 15 },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: "rgba(17, 17, 17, 0.15)",
      padding: 0,
    },
    searchClear: {
      fontSize: 13,
      color: "rgba(255,255,255,0.5)",
      paddingHorizontal: 4,
    },
  
    // Type filter
    typeFilterWrap: {
      backgroundColor: T.white,
      borderBottomWidth: 1,
      borderBottomColor: T.border,
    },
    typeFilterScroll: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      gap: 7,
      flexDirection: "row",
    },
    typeChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 20,
      borderWidth: 1.5,
      borderColor: T.border,
      backgroundColor: T.bg,
    },
    typeChipActive: {
      backgroundColor: T.blue,
      borderColor: T.blue,
    },
    typeChipIcon: { fontSize: 12 },
    typeChipText: {
      fontSize: 11,
      fontWeight: "700",
      color: T.textMid,
    },
    typeChipTextActive: {
      color: T.white,
    },
  
    // Validation filter
    validFilterWrap: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: T.white,
      borderBottomWidth: 1,
      borderBottomColor: T.border,
      gap: 8,
    },
    validFilterLabel: {
      fontSize: 11,
      fontWeight: "700",
      color: T.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginRight: 4,
    },
    validChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: T.border,
      backgroundColor: T.bg,
    },
    validChipActive: {
      backgroundColor: T.orange,
      borderColor: T.orange,
    },
    validChipText: {
      fontSize: 11,
      fontWeight: "700",
      color: T.textMid,
    },
    validChipTextActive: {
      color: T.white,
    },
  
    // List
    scroll: { flex: 1 },
    scrollContent: { padding: 14, gap: 10 },
  
    // Card
    card: {
      backgroundColor: T.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: T.border,
      flexDirection: "row",
      overflow: "hidden",
      shadowColor: "#181c5c",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 6,
      elevation: 2,
    },
    cardStripe: {
      width: 4,
    },
    cardInner: {
      flex: 1,
      padding: 14,
      gap: 6,
    },
    cardTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    typeBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    typeBadgeIcon: { fontSize: 11 },
    typeBadgeText: {
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 0.5,
    },
    statusPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: 20,
    },
    statusValid: { backgroundColor: T.successBg },
    statusPending: { backgroundColor: T.orangeLight },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    statusText: {
      fontSize: 10,
      fontWeight: "700",
    },
    cardName: {
      fontSize: 14,
      fontWeight: "700",
      color: T.text,
      lineHeight: 20,
      marginTop: 2,
    },
    cardSubject: {
      fontSize: 12,
      color: T.textMuted,
      fontWeight: "500",
    },
    cardBottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 4,
    },
    cardMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    cardMetaText: {
      fontSize: 11,
      color: T.textMuted,
      fontWeight: "500",
    },
    cardMetaDot: {
      color: T.border,
      fontWeight: "700",
    },
    openBtn: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 7,
    },
    openBtnText: {
      fontSize: 11,
      fontWeight: "700",
    },
  
    // Empty
    empty: {
      alignItems: "center",
      paddingVertical: 64,
      gap: 8,
    },
    emptyIcon: { fontSize: 48 },
    emptyTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: T.text,
    },
    emptyText: {
      fontSize: 13,
      color: T.textMuted,
      textAlign: "center",
      paddingHorizontal: 40,
    },
  });