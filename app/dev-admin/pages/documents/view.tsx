import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Image,
} from "react-native";
import { useState } from "react";
import {styles} from "./view.style";
import { Ionicons } from "@expo/vector-icons";

type DocType =
  | "CONTROLE CONTINU"
  | "EXAMEN SEMESTRE"
  | "TD"
  | "EXAMEN"
  | "EXAMEN BLANC"
  | "EVALUATION"
  | "CORRECTION";

const ALL_TYPES: DocType[] = [
  "CONTROLE CONTINU",
  "EXAMEN SEMESTRE",
  "TD",
  "EXAMEN",
  "EXAMEN BLANC",
  "EVALUATION",
  "CORRECTION",
];

const TYPE_META: Record<DocType, { icon: string; color: string; bg: string }> = {
  "CONTROLE CONTINU": { icon: "📝", color: "#1565C0", bg: "#E3F2FD" },
  "EXAMEN SEMESTRE":  { icon: "📘", color: "#6A1B9A", bg: "#F3E5F5" },
  TD:                 { icon: "🔬", color: "#1B5E20", bg: "#E8F5E9" },
  EXAMEN:             { icon: "📋", color: "#E65100", bg: "#FFF3E0" },
  "EXAMEN BLANC":     { icon: "📄", color: "#BF360C", bg: "#FBE9E7" },
  EVALUATION:         { icon: "✅", color: "#880E4F", bg: "#FCE4EC" },
  CORRECTION:         { icon: "🔑", color: "#004D40", bg: "#E0F2F1" },
};

const FORMAT_ICON: Record<string, string> = {
  pdf: "📕",
  docx: "📘",
  pptx: "📙",
  xlsx: "📗",
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};


const ReadOnlyField = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: string;
}) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.readonlyBox}>
      {icon && <Text style={styles.readonlyIcon}>{icon}</Text>}
      <Text style={styles.readonlyText}>{value}</Text>
      <View style={styles.lockIcon}>
        <Text style={{ fontSize: 10 }}>🔒</Text>
      </View>
    </View>
  </View>
);

/** Champ éditable */
const EditableField = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={"#8b90bb"}
    />
  </View>
);

export default function DocumentView() {
  const router = useRouter();
  const {
    id,
    name: initialName,
    url,
    format,
    subject: initialSubject,
    type: initialType,
    isValidated: initialValidated,
    created_at,
    ownerName,
    ownerSurname,
    ownerAvatar,
    ownerSolde
  } = useLocalSearchParams<{
    id: string;
    name: string;
    url: string;
    format: string;
    subject: string;
    type: string;
    isValidated: string;
    created_at: string;
    ownerName?: string;
    ownerSurname?: string;
    ownerAvatar?: string;
    ownerSolde?: string;
  }>();

  // Champs éditables
  const [name, setName] = useState(initialName ?? "");
  const [subject, setSubject] = useState(initialSubject ?? "");
  const [type, setType] = useState<DocType>((initialType as DocType) ?? "EXAMEN");
  const [isValidated, setIsValidated] = useState(initialValidated === "true");

  const typeMeta = TYPE_META[type];
  const fmtIcon = FORMAT_ICON[format?.toLowerCase()] ?? "📎";
  const isDirty =
    name !== (initialName ?? "") ||
    subject !== (initialSubject ?? "") ||
    type !== (initialType as DocType) ||
    isValidated !== (initialValidated === "true");

  const handleSave = () => {
    if (!name.trim() || !subject.trim()) {
      Alert.alert("Champs requis", "Le nom et la matière ne peuvent pas être vides.");
      return;
    }
    Alert.alert("Succès", "Document mis à jour avec succès.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const deleteDoc = ()=> {
    //alert before delete
    Alert.alert(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: () => {
          // TODO call delete api
          Alert.alert("Document supprimé", "Le document a été supprimé avec succès.", [
            { text: "OK", onPress: () => router.back() },
          ]);
        } },
      ]
    )
  }

  return (
    <View style={styles.root} className="flex-1 bg-gray-50 pt-[40px] pb-[50px] px-4">
        <TouchableOpacity
          className="flex-row items-center mb-4"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#181c5c" />
          <Text className="ml-2 text-lg font-semibold text-gray-800">Retour</Text>
        </TouchableOpacity>
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <Text style={styles.headerSub}>Document</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {name || "Sans titre"}
          </Text>
        </View>
        {isDirty && <View style={styles.dirtyDot} />}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* details file  */}
        <View style={styles.previewCard}>
          <View style={[styles.previewIconWrap, { backgroundColor: typeMeta.bg }]}>
            <Text style={styles.previewIcon}>{fmtIcon}</Text>
          </View>
          <View style={styles.previewInfo}>
            <Text style={styles.previewFormat}>
              {format?.toUpperCase() ?? "—"}
            </Text>
            <Text style={styles.previewId}>ID #{id}</Text>
          </View>
          <View
            style={[
              styles.validPill,
              {
                backgroundColor: isValidated ? "#e6f7ee" : "#fff1eb",
              },
            ]}
          >
            <View
              style={[
                styles.validDot,
                { backgroundColor: isValidated ? "#1a7f4b": "#ff894f" },
              ]}
            />
            <Text
              style={[
                styles.validText,
                { color: isValidated ? "#1a7f4b" : "#ff894f" },
              ]}
            >
              {isValidated ? "Validé" : "En attente"}
            </Text>
          </View>
        </View>

        {/* oiwner bloc*/}
        {(ownerName || ownerSurname) && (
          <View style={styles.submitterCard}>
            <View style={styles.submitterLeft}>
              {ownerAvatar ? (
                <Image
                  source={{ uri: ownerAvatar }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitials}>
                    {(ownerSurname?.[0] ?? "").toUpperCase()}
                    {(ownerName?.[0] ?? "").toUpperCase()}
                  </Text>
                </View>
              )}
              <View>
                <Text style={styles.submitterRole}>Soumis par</Text>
                <Text style={styles.submitterName}>
                  {ownerSurname} {ownerName}
                </Text>
                <Text style={styles.submitterName}>
                   {ownerSolde ? `Solde: ${ownerSolde} crédits` : "—"}
                </Text>
              </View>
            </View>
            <View style={styles.submitterBadge}>
              <Text style={styles.submitterBadgeText}>Auteur</Text>
            </View>
          </View>
        )}

        {/*info en lecture seule */}
        <SectionTitle label="Informations" />

        <ReadOnlyField
          label="URL du fichier"
          value={url ?? "—"}
          icon="🔗"
        />
        <ReadOnlyField
          label="Date de création"
          value={created_at ? formatDate(created_at) : "—"}
          icon="📅"
        />

        <SectionTitle label="Modifier" accent />

        <EditableField
          label="Nom du document"
          value={name}
          onChange={setName}
          placeholder="Nom du document…"
        />

        <EditableField
          label="Matière"
          value={subject}
          onChange={setSubject}
          placeholder="Ex : Mathématiques"
        />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Type</Text>
          <View style={styles.typeGrid}>
            {ALL_TYPES.map((t) => {
              const m = TYPE_META[t];
              const isActive = type === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeChip,
                    isActive && {
                      backgroundColor: m.bg,
                      borderColor: m.color,
                    },
                  ]}
                  onPress={() => setType(t)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.typeChipIcon}>{m.icon}</Text>
                  <Text
                    style={[
                      styles.typeChipText,
                      isActive && { color: m.color, fontWeight: "700" },
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Statut de validation</Text>
          <View style={styles.switchCard}>
            <View>
              <Text style={styles.switchLabel}>
                {isValidated ? "Document validé" : "En attente de validation"}
              </Text>
              <Text style={styles.switchSub}>
                {isValidated
                  ? "Visible et accessible aux élèves"
                  : "Non visible — en cours de révision"}
              </Text>
            </View>
            <Switch
              value={isValidated}
              onValueChange={setIsValidated}
              trackColor={{ false: "#e2e4f0", true: "#ff894f" }}
              thumbColor={"#ffffff"}
            />
          </View>
        </View>

        {/* ── Bouton save ── */}
        <TouchableOpacity
          style={[styles.saveBtn, !isDirty && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!isDirty}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>
            {isDirty ? "Enregistrer les modifications" : "Aucune modification"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-600 rounded-lg px-4 py-3 items-center"
          onPress={deleteDoc}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>
            Supprimer le document
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}


const SectionTitle = ({
  label,
  accent,
}: {
  label: string;
  accent?: boolean;
}) => (
  <View style={styles.sectionRow}>
    <Text style={[styles.sectionLabel, accent && { color: "#ff894f" }]}>
      {label}
    </Text>
    <View style={[styles.sectionLine, accent && { backgroundColor: "#ff894f" + "33" }]} />
  </View>
);


