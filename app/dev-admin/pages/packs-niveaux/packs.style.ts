import { StyleSheet } from "react-native";

const GOLD = "#B8892A";
const DARK_BG = "#F5F0E8";
const CARD_BG = "#FFFDF7";
const BORDER = "#E4D9C3";
const TEXT_PRIMARY = "#2C2416";
const TEXT_MUTED = "#7A6A52";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  header: {
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: CARD_BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    position: "relative",
    overflow: "hidden",
  },
  headerAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: GOLD,
  },
  headerSub: {
    fontSize: 12,
    color: GOLD,
    fontWeight: "600",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: TEXT_PRIMARY,
    letterSpacing: -0.5,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },

  // Section
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
    gap: 8,
  },
  sectionIcon: { fontSize: 16 },
  sectionText: {
    fontSize: 13,
    fontWeight: "700",
    color: GOLD,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER,
    marginLeft: 8,
  },

  // Fields
  fieldGroup: { marginBottom: 14 },
  labelRow: { flexDirection: "row", alignItems: "center", marginBottom: 7 },
  label: { fontSize: 13, fontWeight: "600", color: TEXT_MUTED },
  required: { color: GOLD, marginLeft: 3, fontSize: 14, fontWeight: "700" },
  input: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: TEXT_PRIMARY,
  },
  inputMultiline: {
    minHeight: 100,
    paddingTop: 12,
  },

  // Row layout
  row: { flexDirection: "row", gap: 12 },
  rowHalf: { flex: 1 },

  // Category toggle
  categoryToggle: {
    flexDirection: "row",
    gap: 10,
  },
  categoryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    backgroundColor: CARD_BG,
  },
  categoryBtnActive: {
    backgroundColor: "#1A2535",
    borderColor: GOLD,
  },
  categoryBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT_MUTED,
  },
  categoryBtnTextActive: {
    color: GOLD,
  },

  // Chips
  chipGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD_BG,
  },
  chipSelected: {
    backgroundColor: "#1A2A14",
    borderColor: "#4CAF50",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_MUTED,
  },
  chipTextSelected: {
    color: "#6BCB77",
  },

  // Switch
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  switchSub: {
    fontSize: 12,
    color: TEXT_MUTED,
  },

  // Submit
  submitBtn: {
    marginTop: 28,
    backgroundColor: GOLD,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  submitText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0D1117",
    letterSpacing: 0.5,
  },
});



export const styleList = StyleSheet.create({
  root: { flex: 1, backgroundColor: DARK_BG },

  header: {
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: CARD_BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerAccent: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: 3,
    backgroundColor: GOLD,
  },
  headerSub: {
    fontSize: 12,
    color: GOLD,
    fontWeight: "600",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: TEXT_PRIMARY,
    letterSpacing: -0.5,
  },
  headerCount: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 2,
    marginBottom: 14,
  },

  // Filter tabs
  filterRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#EDE5D4",
  },
  filterTabActive: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_MUTED,
  },
  filterTabTextActive: {
    color: "#FFFDF7",
  },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 14 },

  // Card
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
    shadowColor: "#B8A080",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  cardInactive: {
    opacity: 0.55,
  },
  cardAccent: {
    height: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  cardHeaderRight: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  inactivePill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#FDECEA",
    borderWidth: 1,
    borderColor: "#E57373",
  },
  inactivePillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#C62828",
    letterSpacing: 0.5,
  },
  categoryPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#EDE5D4",
    borderWidth: 1,
    borderColor: BORDER,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: TEXT_MUTED,
  },

  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  packName: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    lineHeight: 22,
    marginBottom: 4,
  },
  packPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: GOLD,
    letterSpacing: -0.3,
  },
  packPriceFree: {
    color: "#1B5E20",
  },

  typeBadge: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  typeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  // Expanded
  expandedSection: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 13,
    color: "#6B5A3E",
    lineHeight: 20,
    marginBottom: 14,
  },
  metaGrid: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaIcon: { fontSize: 18 },
  metaLabel: {
    fontSize: 10,
    color: TEXT_MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },

  // Footer
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#F5F0E8",
  },
  expandHint: {
    fontSize: 11,
    color: TEXT_MUTED,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: TEXT_MUTED, fontWeight: "600" },
});