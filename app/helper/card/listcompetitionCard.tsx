import Competition from "@/app/hooks/services/competitions/competition.entity";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated, TouchableOpacity, View, Text } from "react-native";


const TYPE_SHORT: Record<Competition["type"], string> = {
  PAID_REGISTRATION_AS_WINNER_PRICE: "Payant/Prix",
  FREE_REGISTRATION_WITH_WINNER_PRICE: "Gratuit/Prix",
  PAID_REGISTRATION_WITH_WINNER_PRICE: "Payant+Prix",
  TOTAL_FREE_NO_PRICE_TO_WIN: "Gratuit",
};

export const C = {
    // Header zone (dark blue theme)
    blue: "#181c5c",
    blueDark: "#0f1240",
    blueLight: "#252a7e",
    border: "#2d3480",
    mutedHeader: "#8892b0",
    white: "#ffffff",
  
    // Orange accent
    orange: "#ff894f",
    orangeDim: "#fff4ee",
    orangeBorder: "#ffd4b8",
  
    // Body zone (white theme)
    bodyBg: "#f5f6fb",
    cardBg: "#ffffff",
    cardBorder: "#e8eaf0",
    cardShadow: "#181c5c",
  
    // Text on white
    textPrimary: "#181c5c",
    textSecondary: "#5a6480",
    textMuted: "#9ba5c0",
    divider: "#eef0f8",
  
    // Status — adapted for white background
    statusUpcomingBg: "#fff4ee",
    statusUpcomingText: "#e06b2a",
    statusUpcomingDot: "#ff894f",
    statusUpcomingAccent: "#ff894f",
  
    statusOngoingBg: "#edfaf4",
    statusOngoingText: "#1a9e66",
    statusOngoingDot: "#22c77e",
    statusOngoingAccent: "#22c77e",
  
    statusCompletedBg: "#f1f3f8",
    statusCompletedText: "#6b7594",
    statusCompletedDot: "#9ba5c0",
    statusCompletedAccent: "#9ba5c0",
  
    statusCancelledBg: "#fef1f1",
    statusCancelledText: "#c0392b",
    statusCancelledDot: "#e05252",
    statusCancelledAccent: "#e05252",
  };

const STATUT_CONFIG = {
    UPCOMING: {
      bg: C.statusUpcomingBg,
      text: C.statusUpcomingText,
      dot: C.statusUpcomingDot,
      accent: C.statusUpcomingAccent,
      label: "À venir",
    },
    ONGOING: {
      bg: C.statusOngoingBg,
      text: C.statusOngoingText,
      dot: C.statusOngoingDot,
      accent: C.statusOngoingAccent,
      label: "En cours",
    },
    COMPLETED: {
      bg: C.statusCompletedBg,
      text: C.statusCompletedText,
      dot: C.statusCompletedDot,
      accent: C.statusCompletedAccent,
      label: "Terminé",
    },
    CANCELLED: {
      bg: C.statusCancelledBg,
      text: C.statusCancelledText,
      dot: C.statusCancelledDot,
      accent: C.statusCancelledAccent,
      label: "Annulé",
    },
  };


function TypeTag({ type }: { type: Competition["type"] }) {
  const isPaid =
    type === "PAID_REGISTRATION_AS_WINNER_PRICE" ||
    type === "PAID_REGISTRATION_WITH_WINNER_PRICE";
  return (
    <View
      style={{
        backgroundColor: isPaid ? C.orangeDim : C.statusCompletedBg,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderWidth: 1,
        borderColor: isPaid ? C.orangeBorder : C.cardBorder,
      }}
    >
      <Text
        style={{
          color: isPaid ? C.orange : C.textSecondary,
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 0.4,
        }}
      >
        {TYPE_SHORT[type].toUpperCase()}
      </Text>
    </View>
  );
}

function StatusBadge({ statut }: { statut: Competition["statut"] }) {
  const cfg = STATUT_CONFIG[statut];
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: cfg.bg,
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 4,
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: cfg.dot,
          marginRight: 5,
        }}
      />
      <Text style={{ color: cfg.text, fontSize: 11, fontWeight: "700" }}>
        {cfg.label}
      </Text>
    </View>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
}) {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Ionicons name={icon} size={15} color={C.textMuted} />
      <Text style={{ color: C.textMuted, fontSize: 10, marginTop: 2 }}>
        {label}
      </Text>
      <Text
        style={{
          color: C.textPrimary,
          fontSize: 11,
          fontWeight: "700",
          marginTop: 2,
          textAlign: "center",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function formatCFA(amount: number) {
  if (amount === 0) return "Gratuit";
  return amount.toLocaleString("fr-FR") + " credits";
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
export function CompetitionCard({
    item,
    onPress,
  }: {
    item: Competition;
    onPress: (id: number) => void;
  }) {
    const scale = useRef(new Animated.Value(1)).current;
    const cfg = STATUT_CONFIG[item.statut];
   
    const onPressIn = () =>
      Animated.spring(scale, {
        toValue: 0.975,
        useNativeDriver: true,
        speed: 40,
      }).start();
    const onPressOut = () =>
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
      }).start();
   
    return (
      <Animated.View style={{ transform: [{ scale }], marginBottom: 12 }}>
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={() => onPress(item.id)}
          style={{
            backgroundColor: C.cardBg,
            borderRadius: 14,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: C.cardBorder,
            shadowColor: C.cardShadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.07,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          {/* Left accent bar */}
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              backgroundColor: cfg.accent,
            }}
          />
   
          <View style={{ padding: 14, paddingLeft: 18 }}>
            {/* Row 1: name + status */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 6,
              }}
            >
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text
                  style={{
                    color: C.textPrimary,
                    fontSize: 15,
                    fontWeight: "800",
                    letterSpacing: 0.2,
                    lineHeight: 20,
                  }}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
   
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 5,
                    gap: 10,
                  }}
                >
                  <View
                    style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                  >
                    <Ionicons
                      name={
                        item.isPublic ? "earth-outline" : "lock-closed-outline"
                      }
                      size={12}
                      color={C.textMuted}
                    />
                    <Text style={{ color: C.textMuted, fontSize: 11 }}>
                      {item.isPublic ? "Public" : "Privé"}
                    </Text>
                  </View>
   
                  {item.isManagedByIA && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 3,
                        backgroundColor: "#eef0ff",
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 6,
                      }}
                    >
                      <Ionicons name="flash" size={11} color={C.blue} />
                      <Text
                        style={{ color: C.blue, fontSize: 10, fontWeight: "700" }}
                      >
                        IA
                      </Text>
                    </View>
                  )}
                </View>
              </View>
   
              <StatusBadge statut={item.statut} />
            </View>
   
            {/* Description */}
            <Text
              style={{
                color: C.textSecondary,
                fontSize: 12,
                lineHeight: 17,
                marginBottom: 12,
              }}
              numberOfLines={2}
            >
              {item.description}
            </Text>
   
            {/* Divider */}
            <View
              style={{
                height: 1,
                backgroundColor: C.divider,
                marginBottom: 12,
              }}
            />
   
            {/* Info grid */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <InfoItem
                icon="calendar-outline"
                label="Date"
                value={formatDate(item.date)}
              />
              <InfoItem
                icon="time-outline"
                label="Clôture"
                value={formatDate(item.registration_deadline)}
              />
              <InfoItem
                icon="people-outline"
                label="Inscrits"
                value={String(item.suscribers.length)}
              />
            </View>
   
            {/* Footer */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TypeTag type={item.type} />
   
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                {item.entryFee > 0 && (
                  <View
                    style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                  >
                    <Ionicons
                      name="ticket-outline"
                      size={13}
                      color={C.textSecondary}
                    />
                    <Text style={{ color: C.textSecondary, fontSize: 12 }}>
                      {formatCFA(item.entryFee)}
                    </Text>
                  </View>
                )}
                {item.winnerPrice > 0 && (
                  <View
                    style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                  >
                    <Ionicons name="trophy-outline" size={13} color={C.orange} />
                    <Text
                      style={{
                        color: C.orange,
                        fontSize: 13,
                        fontWeight: "700",
                      }}
                    >
                      {formatCFA(item.winnerPrice)}
                    </Text>
                  </View>
                )}
                {item.winnerPrice === 0 && item.entryFee === 0 && (
                  <View
                    style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={14}
                      color={C.statusOngoingText}
                    />
                    <Text
                      style={{
                        color: C.statusOngoingText,
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      Entièrement gratuit
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }