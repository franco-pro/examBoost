import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { styles } from "./packs.style";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { createPack, updatePack } from "@/app/hooks/redux/packs/pack.thunks";

type CategoryType = "SECONDARY" | "SUP";

type PackType =
  | "CONTROLE CONTINU"
  | "EXAMEN SEMESTRE"
  | "TD"
  | "EXAMEN"
  | "EXAMEN BLANC"
  | "EVALUATION";

const SUP_TYPES: PackType[] = ["CONTROLE CONTINU", "EXAMEN SEMESTRE", "TD"];
const SECONDARY_TYPES: PackType[] = ["EXAMEN", "EXAMEN BLANC", "EVALUATION"];

interface PackFormData {
  name: string;
  price: string;
  description: string;
  duration: string;
  categorie: CategoryType;
  type: PackType | "";
  durationDays: string;
  isActive: boolean;
}


const Label = ({ text, required }: { text: string; required?: boolean }) => (
  <View style={styles.labelRow}>
    <Text style={styles.label}>{text}</Text>
    {required && <Text style={styles.required}>*</Text>}
  </View>
);

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <View style={styles.fieldGroup}>
    <Label text={label} required={required} />
    {children}
  </View>
);

const StyledInput = ({
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  multiline = false,
  numberOfLines,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "decimal-pad";
  multiline?: boolean;
  numberOfLines?: number;
}) => (
  <TextInput
    style={[styles.input, multiline && styles.inputMultiline]}
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor="#8B9CB0"
    keyboardType={keyboardType}
    multiline={multiline}
    numberOfLines={numberOfLines}
    textAlignVertical={multiline ? "top" : "center"}
  />
);

const ChipGroup = <T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: T[];
  selected: T | "";
  onSelect: (v: T) => void;
}) => (
  <View style={styles.chipGroup}>
    {options.map((opt) => (
      <TouchableOpacity
        key={opt}
        style={[styles.chip, selected === opt && styles.chipSelected]}
        onPress={() => onSelect(opt)}
        activeOpacity={0.75}
      >
        <Text
          style={[
            styles.chipText,
            selected === opt && styles.chipTextSelected,
          ]}
        >
          {opt}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default function CreatePackScreen() {
 const { id, name, categorie, description, duration, type, durationDays, price, isActive  } = useLocalSearchParams() as {
        id?: string; name?: string; categorie?: string; description?: string; duration?: number; type?: string; durationDays?: number; price?: number; isActive?: string;
      };
 const existingPack =  { id, name, categorie, description, duration, type, durationDays, price, isActive }
  const dispatch = useAppDispatch();
  const {packs} = useAppSelector(state => state.packs);

  const isEditMode = !!existingPack?.id;
  const [operationDone, setOperationDone] = useState(false);

  const [form, setForm] = useState<PackFormData>({
    name:        existingPack?.name        ?? "",
    price:       existingPack?.price?.toString() ?? "",
    description: existingPack?.description ?? "",
    duration:    existingPack?.duration?.toString() ?? "",
    categorie:   (existingPack?.categorie ?? "SECONDARY") as any,
    type:        (existingPack?.type ?? "") as any,
    durationDays: existingPack?.durationDays?.toString() ?? "30",
    isActive:    (existingPack?.isActive ?? true) as any,
  });

  const set = <K extends keyof PackFormData>(key: K, val: PackFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const typeOptions = form.categorie === "SUP" ? SUP_TYPES : SECONDARY_TYPES;

  // Reset type when category changes
  const handleCategoryChange = (cat: CategoryType) => {
    setForm((prev) => ({ ...prev, categorie: cat, type: "" }));
  };

  useEffect(() => {
      //TODO Avoid showing alert on initial load, only show it after a create/update action
      if(operationDone){
        //alert with message and button to go back 
        Alert.alert(
          "Operation Effectuée✓",

        )

        Alert.alert(
          "Operation Effectuée✓", 
          `L'opération sur le pack "${form.name}" a été éffectué avec succès.`,
          [
            {
              text: "Ok", 
              style: "cancel",
              onPress: () => {
                router.back();
              }
            }
          ]
        );
      }

  }, [packs])

  const handleSubmit = () => {
    if (!form.name || !form.description || !form.type) {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs obligatoires.");
      return;
    }
        if (isEditMode) {
         
          dispatch(updatePack({ id: Number(existingPack?.id) ?? 0, data:{ ...form} })).finally(() => setOperationDone(true));
        } else {
          dispatch(createPack(form)).finally(() => setOperationDone(true));
        }
    
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <Text style={styles.headerSub}>Gestion des packs</Text>
        <Text style={styles.headerTitle}>Créer un pack</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Section: Informations générales ── */}
        <SectionTitle title="Informations générales" icon="📋" />

        <Field label="Nom du pack" required>
          <StyledInput
            value={form.name}
            onChangeText={(v) => set("name", v)}
            placeholder="Ex : Pack Examen Final Terminale"
          />
        </Field>

        <View style={styles.row}>
          <View style={styles.rowHalf}>
            <Field label="Prix (FCFA)" required={false}>
              <StyledInput
                value={form.price}
                onChangeText={(v) => set("price", v)}
                placeholder="0"
                keyboardType="decimal-pad"
              />
            </Field>
          </View>
          <View style={styles.rowHalf}>
            <Field label="Durée d'accès (jours)" required={false}>
              <StyledInput
                value={form.durationDays}
                onChangeText={(v) => set("durationDays", v)}
                placeholder="30"
                keyboardType="numeric"
              />
            </Field>
          </View>
        </View>

        <Field label="Description" required>
          <StyledInput
            value={form.description}
            onChangeText={(v) => set("description", v)}
            placeholder="Décrivez le contenu du pack…"
            multiline
            numberOfLines={4}
          />
        </Field>

        <Field label="Durée de session (min)" required={false}>
          <StyledInput
            value={form.duration}
            onChangeText={(v) => set("duration", v)}
            placeholder="Ex : 90"
            keyboardType="numeric"
          />
        </Field>

        {/* ── Section: Catégorie ── */}
        <SectionTitle title="Catégorie" icon="🎓" />

        <Field label="Niveau scolaire" required>
          <View style={styles.categoryToggle}>
            <TouchableOpacity
              style={[
                styles.categoryBtn,
                form.categorie === "SECONDARY" && styles.categoryBtnActive,
              ]}
              onPress={() => handleCategoryChange("SECONDARY")}
            >
              <Text
                style={[
                  styles.categoryBtnText,
                  form.categorie === "SECONDARY" && styles.categoryBtnTextActive,
                ]}
              >
                🏫 Secondaire
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.categoryBtn,
                form.categorie === "SUP" && styles.categoryBtnActive,
              ]}
              onPress={() => handleCategoryChange("SUP")}
            >
              <Text
                style={[
                  styles.categoryBtnText,
                  form.categorie === "SUP" && styles.categoryBtnTextActive,
                ]}
              >
                🎓 Supérieur
              </Text>
            </TouchableOpacity>
          </View>
        </Field>

        <Field label="Type d'évaluation" required>
          <ChipGroup<PackType>
            options={typeOptions}
            selected={form.type}
            onSelect={(v) => set("type", v)}
          />
        </Field>

        {/* ── Section: Statut ── */}
        <SectionTitle title="Statut" icon="⚙️" />

        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchLabel}>Pack actif</Text>
            <Text style={styles.switchSub}>
              {form.isActive ? "Visible pour les élèves" : "Masqué aux élèves"}
            </Text>
          </View>
          <Switch
            value={form.isActive}
            onValueChange={(v) => set("isActive", v)}
            trackColor={{ false: "#2D3748", true: "#C9A84C" }}
            thumbColor={form.isActive ? "#fff" : "#8B9CB0"}
          />
        </View>

        {/* ── Submit ── */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.submitText}>Enregistrer le pack</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const SectionTitle = ({ title, icon }: { title: string; icon: string }) => (
  <View style={styles.sectionTitle}>
    <Text style={styles.sectionIcon}>{icon}</Text>
    <Text style={styles.sectionText}>{title}</Text>
    <View style={styles.sectionLine} />
  </View>
);