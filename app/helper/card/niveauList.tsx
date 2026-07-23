import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity, View, Text } from "react-native";
import { styles, CATEGORIE_COLORS } from 'app/dev-admin/pages/packs-niveaux/style';
import Niveau from "@/app/hooks/services/niveaux/niveau.entity";

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "short", year: "numeric",
    });
  }

export function NiveauCard({ item }: { item: Niveau }) {
    const colors = CATEGORIE_COLORS[item.categorie] ?? { bg: "#F9FAFB", text: "#6B7280", border: "#E5E7EB" };
  
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.75}
        onPress={() =>
          router.push({
            pathname: "/dev-admin/pages/packs-niveaux/createNiveaux",
            params: {
              id: item.id,
              name: item.name,
              categorie: item.categorie,
              isExamClass: String(item.isExamClass),
            },
          })
        }
      >
        {/* Bande gauche colorée */}
        <View style={[styles.cardAccent, { backgroundColor: colors.text }]} />
  
        <View style={styles.cardBody}>
          {/* Ligne principale */}
          <View style={styles.cardTop}>
            <Text style={styles.cardName}>{item.name}</Text>
  
            <View style={styles.cardRight}>
              {item.isExamClass && (
                <View style={styles.examBadge}>
                  <Ionicons name="ribbon-outline" size={11} color="#F97316" />
                  <Text style={styles.examBadgeText}>Examen</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </View>
          </View>
  
          {/* Catégorie chip */}
          <View style={[styles.categorieChip, { backgroundColor: colors.bg, borderColor: colors.border }]}>
            <Text style={[styles.categorieText, { color: colors.text }]}>{item.categorie}</Text>
          </View>
  
          {/* Dates */}
          <View style={styles.datesRow}>
            <View style={styles.dateItem}>
              <Ionicons name="calendar-outline" size={11} color="#9CA3AF" />
              <Text style={styles.dateText}>Créé le {formatDate(item.created_at)}</Text>
            </View>
            {item.updated_at !== item.created_at && (
              <View style={styles.dateItem}>
                <Ionicons name="refresh-outline" size={11} color="#9CA3AF" />
                <Text style={styles.dateText}>Modifié le {formatDate(item.updated_at)}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }