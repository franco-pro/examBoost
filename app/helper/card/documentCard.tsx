import { TouchableOpacity, View, Text, Linking } from "react-native";
import { TYPE_META, DocType , styles, T} from "@/app/dev-admin/pages/document.style";
import { Document } from "@/app/hooks/entities/document";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAppSelector } from "@/app/hooks/redux/redux.hooks";



 const formatDate = (d: Date) => d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  
  
 export const DocumentCard = ({ doc }: { doc: Document }) => {
  const meta = TYPE_META[doc.type];
  const { documentsList } = useAppSelector((state) => state.documents);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={() =>
        router.push({
          pathname: "/dev-admin/pages/documents/view",
          params: {
            id: doc.id,
            name: doc.name,
            url: doc.url,
            format: doc.format,
            subject: doc.subject,
            type: doc.type,
            niveauID: doc.niveauID,
            correctionId:
              doc.type != "CORRECTION"
                ? documentsList.find(
                    (data) =>
                      data.correctionId === doc.correctionId && data.id !== doc.id
                  )?.id
                : null,
            subject_docID:
              doc.type == "CORRECTION"
                ? documentsList.find(
                    (data) =>
                      data.correctionId === doc.correctionId && data.id !== doc.id
                  )?.id
                : null,
            ownerName: doc.user ? doc.user.username : null,
            ownerSurname: doc.user ? doc.user.surname : null,
            ownerSolde: doc.user ? doc.user.wallet : null,
            ownerAvatar: doc.user ? doc.user.imgUrl : null,
            isValidated: String(doc.isValidated),
            created_at: String(doc.created_at),
          },
        })
      }
    >
      <View style={[styles.cardStripe, { backgroundColor: meta.color }]} />

      <View style={styles.cardInner}>
        <View style={styles.cardTopRow}>
          <View style={[styles.typeBadge, { backgroundColor: meta.bg }]}>
            {/* Remplacement du <Text>{meta.icon}</Text> par l'icône Ionicons */}
            <Ionicons
              name={meta.icon}
              size={14}
              color={meta.color}
              style={{ marginRight: 4 }}
            />
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
            <Text style={styles.cardMetaText}>{doc.format.toUpperCase()}</Text>
            <Text style={styles.cardMetaDot}>·</Text>
            <Text style={styles.cardMetaText}>
              {" "}
              {formatDate(new Date(doc.created_at))}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.openBtn, { backgroundColor: T.blueFade }]}
          >
            <Text style={[styles.openBtnText, { color: T.blue }]}>Afficher</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};