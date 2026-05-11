import { TouchableOpacity, View, Text, Linking } from "react-native";
import { TYPE_META, DocType , styles, T} from "@/app/dev-admin/pages/document.style";
import { Document } from "@/app/hooks/entities/document";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";



 const formatDate = (d: Date) => d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  
  
export const DocumentCard = ({ doc }: { doc: Document }) => {
    const meta = TYPE_META[doc.type];
  
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.88}
        onPress={() => router.push({
            pathname: "/dev-admin/pages/documents/view",
            params: {
                id: doc.id,
                name: doc.name,
                url: doc.url,
                format: doc.format,
                subject: doc.subject,
                type: doc.type,
                ownerName: doc.user ? doc.user.username: null,
                ownerSurname: doc.user? doc.user.surname: null,
                ownerSolde: doc.user ? doc.user.wallet:null,
                ownerAvatar: doc.user ? doc.user.imgUrl : null,
                isValidated: String(doc.isValidated),
                created_at: doc.created_at.toISOString(),
            },
        })}
      >
        <View style={[styles.cardStripe, { backgroundColor: meta.color }]} />
  
        <View style={styles.cardInner}>
          <View style={styles.cardTopRow}>
            <View style={[styles.typeBadge, { backgroundColor: meta.bg }]}>
              <Text style={styles.typeBadgeIcon}>{meta.icon}</Text>
              <Text style={[styles.typeBadgeText, { color: meta.color }]}>
                {meta.label}
              </Text>
            </View>
  
            <View
              style={[
                styles.statusPill,
                doc.isValidated ? styles.statusValid : styles.statusPending,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: doc.isValidated ? T.success : T.orange },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: doc.isValidated ? T.success : T.orange },
                ]}
              >
                {doc.isValidated ? "Validé" : "En attente"}
              </Text>
            </View>
          </View>
  
          <Text style={styles.cardName} numberOfLines={2}>
            {doc.name}
          </Text>
  
          <Text style={styles.cardSubject}>{doc.subject}</Text>
  
          <View style={styles.cardBottomRow}>
            <View style={styles.cardMeta}>
              <Text style={styles.cardMetaText}>
                {doc.format.toUpperCase()}
              </Text>
              <Text style={styles.cardMetaDot}>·</Text>
              <Text style={styles.cardMetaText}> {formatDate(doc.created_at)}</Text>
            </View>
  
                <TouchableOpacity
                        style={[styles.openBtn, { backgroundColor: T.blueFade }]}
                        //TODO onPress={() => Linking.openURL(doc.url)}
                        >
                    <Text style={[styles.openBtnText, { color: T.blue }]}>Afficher</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };