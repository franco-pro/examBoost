import { Pack } from "@/app/dev-admin/pages/packs-niveaux/pack.entity";
import { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { styleList as packStyles } from "@/app/dev-admin/pages/packs-niveaux/packs.style";
import { useRouter } from "expo-router";

type PackType =
  | "CONTROLE CONTINU"
  | "EXAMEN SEMESTRE"
  | "TD"
  | "EXAMEN"
  | "EXAMEN BLANC"
  | "EVALUATION";

const formatPrice = (price: number) =>
  price === 0 ? "Gratuit" : `${price.toLocaleString()} credits`;

const TYPE_CONFIG: Record<
  PackType,
  { color: string; bg: string; label: string }
> = {
  "CONTROLE CONTINU": { color: "#1565C0", bg: "#DBEAFE", label: "CC" },
  "EXAMEN SEMESTRE":  { color: "#6A1B9A", bg: "#EDE7F6", label: "ES" },
  TD:                 { color: "#1B5E20", bg: "#DCFCE7", label: "TD" },
  EXAMEN:             { color: "#E65100", bg: "#FEF3C7", label: "EX" },
  "EXAMEN BLANC":     { color: "#BF360C", bg: "#FFE8D6", label: "EB" },
  EVALUATION:         { color: "#880E4F", bg: "#FCE4EC", label: "EV" },
};

interface PackCardProps {
  pack: Pack;
}

export const PackCard = ({ pack }: PackCardProps) => {
  const [expanded, setExpanded] = useState(true);
  const typeConf = TYPE_CONFIG[pack.type];
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[packStyles.card, !pack.isActive && packStyles.cardInactive]}
      onPress={
        () =>
                  router.push({
                    pathname: "/dev-admin/pages/packs-niveaux/createPacks",
                    params: {
                      ...pack,
                      isActive: pack.isActive ? "true" : "false",
                    },
                  })
      }
      activeOpacity={0.9}
    >
      <View style={[packStyles.cardAccent, { backgroundColor: typeConf.color }]} />

      <View style={packStyles.cardHeader}>
        <View style={[packStyles.badge, { backgroundColor: typeConf.bg }]}>
          <Text style={[packStyles.badgeText, { color: typeConf.color }]}>
            {typeConf.label}
          </Text>
        </View>

        <View style={packStyles.cardHeaderRight}>
          {!pack.isActive && (
            <View style={packStyles.inactivePill}>
              <Text style={packStyles.inactivePillText}>Inactif</Text>
            </View>
          )}
          <View style={packStyles.categoryPill}>
            <Text style={packStyles.categoryPillText}>
              {pack.categorie === "SUP" ? "🎓 Sup" : "🏫 Sec"}
            </Text>
          </View>
        </View>
      </View>

      <View style={packStyles.cardBody}>
        <Text style={packStyles.packName} numberOfLines={expanded ? undefined : 2}>
          {pack.name}
        </Text>
        <Text style={[packStyles.packPrice, pack.price === 0 && packStyles.packPriceFree]}>
          {formatPrice(pack.price)}
        </Text>
      </View>

      <View style={[packStyles.typeBadge, { borderColor: typeConf.color + "44" }]}>
        <Text style={[packStyles.typeText, { color: typeConf.color }]}>
          {pack.type}
        </Text>
      </View>

      {expanded && (
        <View style={packStyles.expandedSection}>
          <View style={packStyles.divider} />

          <Text style={packStyles.descriptionText}>{pack.description}</Text>

          <View style={packStyles.metaGrid}>
            <MetaItem icon="📅" label="Accès" value={`${pack.durationDays} jours`} />
            {pack.duration !== undefined && (
              <MetaItem icon="⏱" label="Session" value={`${pack.duration} min`} />
            )}
          </View>
        </View>
      )}

      <View style={packStyles.cardFooter} >
        <Text style={packStyles.expandHint}>
          Modifier
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const MetaItem = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <View style={packStyles.metaItem}>
    <Text style={packStyles.metaIcon}>{icon}</Text>
    <View>
      <Text style={packStyles.metaLabel}>{label}</Text>
      <Text style={packStyles.metaValue}>{value}</Text>
    </View>
  </View>
);
