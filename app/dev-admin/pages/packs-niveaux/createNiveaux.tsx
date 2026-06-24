import { toastConfig } from "@/app/config/toast.config";
import { createNiveau, updateNiveau } from "@/app/hooks/redux/niveaux/niveaux.thunks";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { config } from "@/components/ui/gluestack-ui-provider/config";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";

interface NiveauForm {
  name: string;
  categorie: string;
  isExamClass: boolean;
}


const CATEGORIES = ["SUP", "SECOND"];

export default function NiveauFormPage() {
    const { id, name, categorie, isExamClass } = useLocalSearchParams<{
        id?: string; name?: string; categorie?: string; isExamClass?: string;
      }>();

  // const {niveauxList} = useAppSelector(state => state.niveaux);

  const isEdit = !!id;
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<NiveauForm>({
    name: name ?? "",
    categorie: categorie ?? "",
    isExamClass: isExamClass === "true",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<NiveauForm>>({});

  const validate = () => {
    const newErrors: Partial<NiveauForm> = {};
    if (!form.name.trim()) newErrors.name = "Le nom est requis";
    if (!form.categorie.trim()) newErrors.categorie = "La catégorie est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // useEffect(() => {

  // }, [niveauxList]);

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
        if (isEdit) {
          const data = {id, ...form}

          dispatch(updateNiveau({id: Number.parseInt(id), data: data}));
        } else {
          const data = {id, ...form}
       
          dispatch(createNiveau(data));
        }
      router.back();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

   function showToast(message: string, title: string, type: "success"|"error"){
          Toast.show({
            type: type,
            text2: message,
            text1: title,
            position: 'top',
            visibilityTime: 3500,
          }) 
      }

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#181c5c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdit ? "Modifier le niveau" : "Nouveau niveau"}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Champ name */}
        <Text style={styles.label}>Nom du niveau</Text>
        <TextInput
          style={[styles.input, errors.name ? styles.inputError : null]}
          placeholder="Ex: Terminale, CM2, Licence 1..."
          placeholderTextColor="#9CA3AF"
          value={form.name}
          onChangeText={(v) => setForm({ ...form, name: v })}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        {/* Champ catégorie — chips */}
        <Text style={[styles.label, { marginTop: 20 }]}>Catégorie</Text>
        <View style={styles.chipsRow}>
          {CATEGORIES.map((cat) => {
            const selected = form.categorie === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => setForm({ ...form, categorie: cat })}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {/* Ou saisie libre */}
        <TextInput
          style={[styles.input, { marginTop: 10 }, errors.categorie ? styles.inputError : null]}
          placeholder="Ou saisir une catégorie personnalisée..."
          placeholderTextColor="#9CA3AF"
          value={form.categorie}
          onChangeText={(v) => setForm({ ...form, categorie: v })}
        />
        {errors.categorie && <Text style={styles.errorText}>{errors.categorie}</Text>}

        {/* Toggle isExamClass */}
        <View style={styles.switchRow}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchLabel}>Classe d'examen</Text>
            <Text style={styles.switchSub}>
              Active si ce niveau correspond à un examen officiel
            </Text>
          </View>
          <Switch
            value={form.isExamClass}
            onValueChange={(v) => setForm({ ...form, isExamClass: v })}
            trackColor={{ false: "#E5E7EB", true: "#FED7AA" }}
            thumbColor={form.isExamClass ? "#F97316" : "#9CA3AF"}
          />
        </View>

        {/* Bouton submit */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons
                name={isEdit ? "checkmark-circle-outline" : "add-circle-outline"}
                size={20}
                color="#fff"
              />
              <Text style={styles.submitText}>
                {isEdit ? "Mettre à jour" : "Créer le niveau"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
      
      <Toast config={toastConfig} />
      
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#181c5c",
  },
  container: {
    padding: 20,
    paddingBottom: 60,
  },

  // Labels & inputs
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#181c5c",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },

  // Chips catégorie
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  chipSelected: {
    backgroundColor: "#FFF7ED",
    borderColor: "#F97316",
  },
  chipText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  chipTextSelected: {
    color: "#F97316",
    fontWeight: "700",
  },

  // Switch
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  switchInfo: {
    flex: 1,
    marginRight: 12,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#181c5c",
    marginBottom: 2,
  },
  switchSub: {
    fontSize: 12,
    color: "#9CA3AF",
    lineHeight: 16,
  },

  // Submit
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F97316",
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 32,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});