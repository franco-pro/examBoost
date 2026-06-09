import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import apiClient from "../api/apiClient";

import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";

import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";

import { ChevronDownIcon } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../hooks/redux/store";

export default function Enseignant() {
  const [docFile, setDocFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [correctionFile, setCorrectionFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const [subject, setSubject] = useState("");
  const [niveauID, setNiveauId] = useState<number | null>(null);

  const [allLevels, setAllLevels] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [fileType, setFileType] = useState("EXAMEN");

  const user = useSelector((state: RootState) => state.user.user)
  const userID = user?.id

  const allType = [
    "CONTROLE CONTINU",
    "EXAMEN SEMESTRE",
    "TD",
    "EXAMEN",
    "EXAMEN BLANC",
    "EVALUATION",
  ];

  const getLevels = async () => {
    try {
      const response = await apiClient.get("/niveaux");
      setAllLevels(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLevels();
  }, []);

  const pickFile = async (type: "EXAMEN" | "CORRECTION") => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];

    if (type === "EXAMEN") {
      setDocFile(file);
    } else {
      setCorrectionFile(file);
    }
  };

  const fileToBase64 = async (uri: string) => {
    return await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  };

  const handleSubmit = async () => {
    try {
      if (!docFile) {
        alert("Veuillez sélectionner une épreuve");
        return;
      }

      setLoading(true);

      const docBase64 = await fileToBase64(docFile.uri);

      let correctionBase64 = null;

      if (correctionFile) {
        correctionBase64 = await fileToBase64(correctionFile.uri);
      }

      if (!userID) {
        console.log("une ereur avec l'ID du user: ", userID)
      }

      const payload = {
        base64Encode: docBase64,
        correctionBase64,
        subject,
        niveauID,
        fileType,
        userID
      };

      // console.log("URL:", apiClient.defaults.baseURL + "/document");

      await apiClient.post("/document", payload);
      alert("Documents envoyés avec succès");

      setDocFile(null);
      setCorrectionFile(null);
      setSubject("");
      setNiveauId(null);
      setFileType("EXAMEN");
    } catch (error) {
      console.log(error);
      alert("Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background-light dark:bg-background-dark"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View className="px-5 pt-10 pb-8 bg-primary-defaultBlue rounded-b-[32px] items-center">
        <Text className="text-white text-3xl font-extrabold">
          Portail Enseignant
        </Text>

        <Text className="text-white/70 mt-2 text-sm leading-5">
          Envoyez des épreuves et leurs corrections aux élèves et étudiants.
        </Text>
      </View>

      {/* CARD */}
      <View className="mx-4 -mt-6 bg-white dark:bg-outline-900 rounded-[28px] p-5 shadow-sm border border-outline-100 dark:border-outline-800">
        {/* SUBJECT */}
        <FormControl className="mb-5">
          <FormControlLabel>
            <FormControlLabelText>Nom du sujet</FormControlLabelText>
          </FormControlLabel>

          <TextInput
            placeholder="Ex: Epreuve de Mathématiques"
            value={subject}
            onChangeText={setSubject}
            className="mt-2 border border-outline-200 dark:border-outline-700 rounded-2xl px-4 py-4 text-typography-black dark:text-white"
          />
        </FormControl>

        {/* NIVEAU */}
        <FormControl className="mb-5">
          <FormControlLabel>
            <FormControlLabelText>Niveau scolaire</FormControlLabelText>
          </FormControlLabel>

          <Select onValueChange={(value) => setNiveauId(Number(value))}>
            <SelectTrigger
              variant="outline"
              size="lg"
              className="mt-2 rounded-2xl border-outline-200 dark:border-outline-700"
            >
              <SelectInput placeholder="Sélectionner un niveau" />
              <SelectIcon as={ChevronDownIcon} className="mr-3" />
            </SelectTrigger>

            <SelectPortal>
              <SelectBackdrop />

              <SelectContent className="rounded-3xl">
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>

                {allLevels.map((level, index) => (
                  <SelectItem
                    key={index}
                    label={level.name}
                    value={String(level.id)}
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </FormControl>

        {/* TYPE */}
        <FormControl className="mb-6">
          <FormControlLabel>
            <FormControlLabelText>Type de document</FormControlLabelText>
          </FormControlLabel>

          <Select onValueChange={(value) => setFileType(value)}>
            <SelectTrigger
              variant="outline"
              size="lg"
              className="mt-2 rounded-2xl border-outline-200 dark:border-outline-700"
            >
              <SelectInput placeholder={fileType} />
              <SelectIcon as={ChevronDownIcon} className="mr-3" />
            </SelectTrigger>

            <SelectPortal>
              <SelectBackdrop />

              <SelectContent className="rounded-3xl">
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>

                {allType.map((item, index) => (
                  <SelectItem key={index} label={item} value={item} />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </FormControl>

        {/* DOCUMENT */}
        <TouchableOpacity
          onPress={() => pickFile("EXAMEN")}
          activeOpacity={0.8}
          className="border-2 border-dashed border-primary-custom-300 dark:border-primary-700 rounded-3xl p-5 items-center justify-center bg-primary-custom-200 dark:bg-primary-900/20"
        >
          <View className="w-16 h-16 rounded-full bg-primary-custom-100 dark:bg-primary-800 items-center justify-center">
            <Ionicons name="document-text-outline" size={28} color="#181c5c" />
          </View>

          <Text className="mt-4 text-base font-bold text-typography-black dark:text-white">
            {docFile ? `✅ Épreuve sélectionnée` : "Ajouter une épreuve"}
          </Text>

          <Text className="mt-1 text-xs text-red-500 text-center">
            {docFile ? "" : "Format PDF uniquement"}
          </Text>

          {docFile && (
            <View className="mt-4 px-4 py-2 rounded-full bg-success-100">
              <Text className="text-success-700 text-xs font-bold">
                ✅ {docFile.name}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* CORRECTION */}
        <TouchableOpacity
          onPress={() => pickFile("CORRECTION")}
          activeOpacity={0.8}
          className="mt-5 border bg-primary-custom-200  border-primary-custom-400 border-dashed dark:border-outline-700 rounded-3xl p-5"
        >
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-2xl bg-primary-custom-100 items-center justify-center">
              <Ionicons
                name="checkmark-done-outline"
                size={24}
                color="#0013ff"
              />
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-sm font-bold text-typography-black dark:text-white">
                Ajouter une correction
              </Text>

              <Text className="text-xs text-red-300 mt-1">
                {correctionFile ? "" : "Facultatif"}
              </Text>
            </View>
          </View>

          {correctionFile && (
            <View className="mt-4 px-4 py-2 rounded-full bg-success-100 justify-center items-center">
              <Text className="text-success-700 text-xs font-bold ">
                ✅ {correctionFile.name}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* BUTTON */}
        <TouchableOpacity
          disabled={loading}
          onPress={handleSubmit}
          activeOpacity={0.8}
          className="mt-8 bg-primary-defaultOrange rounded-2xl py-5 items-center justify-center"
        >
          {loading ? (
            <ActivityIndicator color="#181c5c" />
          ) : (
            <View className="flex-row items-center">
              <Ionicons name="cloud-upload-outline" size={20} color="#181c5c" />

              <Text className="ml-2 text-primary-defaultBlue font-extrabold text-base">
                Envoyer les documents
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
