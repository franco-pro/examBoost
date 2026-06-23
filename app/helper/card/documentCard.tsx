import { TouchableOpacity, View, Text, Linking } from "react-native";
import { TYPE_META, DocType , styles, T} from "@/app/dev-admin/pages/document.style";
import { Document } from "@/app/hooks/entities/document";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAppSelector } from "@/app/hooks/redux/redux.hooks";



 const formatDate = (d: Date) => d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  
  
export const DocumentCard = ({ doc }: { doc: Document }) => {
    const meta = TYPE_META[doc.type];
    // const {documentsList} = useAppSelector(state => state.documents);
    const documentsList: Document[] = [
      {
        id: 1,
        name: "Controle_Analyse_1.pdf",
        format: "pdf",
        url: "https://example.com/documents/controle-analyse-1.pdf",
        subject: "Analyse Mathématique",
        isValidated: true,
        type: "CONTROLE CONTINU",
        correctionId: 101,
        user: {
          id: 1,
          username: "jdoe",
          surname: "Doe",
          imgUrl: "https://example.com/users/jdoe.jpg",
          wallet: 2500,
        },
        niveauID: 1,
        created_at: new Date("2025-01-10T08:00:00"),
        updated_at: new Date("2025-01-15T10:30:00"),
      },
      {
        id: 2,
        name: "TD_Programmation_Web.docx",
        format: "docx",
        url: "https://example.com/documents/td-programmation-web.docx",
        subject: "Programmation Web",
        isValidated: false,
        type: "TD",
        user: {
          id: 2,
          username: "asmith",
          surname: "Smith",
          imgUrl: "https://example.com/users/asmith.jpg",
          wallet: 1800,
        },
        niveauID: 2,
        created_at: new Date("2025-02-05T09:15:00"),
        updated_at: new Date("2025-02-05T09:15:00"),
      },
      {
        id: 3,
        name: "Examen_Reseaux_S1.pdf",
        format: "pdf",
        url: "https://example.com/documents/examen-reseaux-s1.pdf",
        subject: "Réseaux Informatiques",
        isValidated: true,
        type: "EXAMEN SEMESTRE",
        correctionId: 102,
        user: {
          id: 3,
          username: "mbappe",
          surname: "Ngono",
          imgUrl: "https://example.com/users/ngono.jpg",
          wallet: 3200,
        },
        niveauID: 3,
        created_at: new Date("2025-03-12T14:00:00"),
        updated_at: new Date("2025-03-13T08:20:00"),
      },
      {
        id: 4,
        name: "Evaluation_BDD.pdf",
        format: "pdf",
        url: "https://example.com/documents/evaluation-bdd.pdf",
        subject: "Bases de Données",
        isValidated: false,
        type: "EVALUATION",
        user: {
          id: 4,
          username: "alice",
          surname: "Kamga",
          imgUrl: "https://example.com/users/alice.jpg",
          wallet: 950,
        },
        niveauID: 2,
        created_at: new Date("2025-04-08T11:45:00"),
        updated_at: new Date("2025-04-08T11:45:00"),
      },
      {
        id: 5,
        name: "Correction_Algorithmique.pdf",
        format: "pdf",
        url: "https://example.com/documents/correction-algorithmique.pdf",
        subject: "Algorithmique",
        isValidated: true,
        type: "CORRECTION",
        user: {
          id: 5,
          username: "bmartin",
          surname: "Martin",
          imgUrl: "https://example.com/users/bmartin.jpg",
          wallet: 4100,
        },
        niveauID: 1,
        created_at: new Date("2025-05-01T16:20:00"),
        updated_at: new Date("2025-05-02T09:00:00"),
      },
      {
        id: 6,
        name: "Examen_Blanc_Physique.pdf",
        format: "pdf",
        url: "https://example.com/documents/examen-blanc-physique.pdf",
        subject: "Physique Générale",
        isValidated: true,
        type: "EXAMEN BLANC",
        correctionId: 103,
        user: {
          id: 6,
          username: "karl",
          surname: "Moukouri",
          imgUrl: "https://example.com/users/karl.jpg",
          wallet: 1500,
        },
        niveauID: 3,
        created_at: new Date("2025-05-15T13:30:00"),
        updated_at: new Date("2025-05-16T08:00:00"),
      },
    ];
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
                niveauID: doc.niveauID,
                correctionId: doc.type != "CORRECTION" ? documentsList.find(data => (data.correctionId === doc.correctionId && data.id != doc.id))?.id : null,
                subject_docID : doc.type == "CORRECTION" ? documentsList.find(data => (data.correctionId === doc.correctionId && data.id != doc.id))?.id : null,
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
                        >
                    <Text style={[styles.openBtnText, { color: T.blue }]}>Afficher</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };