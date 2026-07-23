

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#F9FAFB" },
  
    // Header
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingTop: 44,
      paddingBottom: 14,
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderBottomColor: "#F3F4F6",
    },
    backBtn: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: "#F3F4F6",
      alignItems: "center", justifyContent: "center",
    },
    headerTitle: { fontSize: 18, fontWeight: "800", color: "#181c5c", textAlign: "center" },
    headerSub: { fontSize: 12, color: "#9CA3AF", textAlign: "center", marginTop: 1 },
  
    // Liste
    list: { padding: 16, paddingBottom: 100 },
  
    // Card
    card: {
      flexDirection: "row",
      backgroundColor: "#fff",
      borderRadius: 16,
      marginBottom: 12,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    cardAccent: { width: 5 },
    cardBody: { flex: 1, padding: 14 },
    cardTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    cardName: { fontSize: 16, fontWeight: "700", color: "#181c5c" },
    cardRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  
    examBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      backgroundColor: "#FFF7ED",
      borderWidth: 1,
      borderColor: "#FED7AA",
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: 50,
    },
    examBadgeText: { fontSize: 10, fontWeight: "700", color: "#F97316" },
  
    categorieChip: {
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 50,
      borderWidth: 1,
      marginBottom: 10,
    },
    categorieText: { fontSize: 12, fontWeight: "600" },
  
    datesRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    dateItem: { flexDirection: "row", alignItems: "center", gap: 4 },
    dateText: { fontSize: 11, color: "#9CA3AF" },
  
    // Empty
    empty: { alignItems: "center", marginTop: 80, gap: 10 },
    emptyText: { fontSize: 15, color: "#9CA3AF", fontWeight: "500" },
  
    // FAB
    fab: {
      position: "absolute",
      bottom: 32, right: 24,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: "#F97316",
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 50,
      shadowColor: "#F97316",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 8,
    },
    fabText: { color: "#fff", fontWeight: "700", fontSize: 15 },

      overlay: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
        },
        sheet: {
          backgroundColor: "#fff",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxHeight: "85%",
          paddingTop: 12,
        },
        handle: {
          width: 40, height: 4,
          backgroundColor: "#E5E7EB",
          borderRadius: 2,
          alignSelf: "center",
          marginBottom: 8,
        },
  });

  export const CATEGORIE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    SECOND:      { bg: "#FFF7ED", text: "#F97316", border: "#FED7AA" },
    SUP: { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0" },
  };