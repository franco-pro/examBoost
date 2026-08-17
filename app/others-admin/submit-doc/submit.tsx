import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";

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

import { ChevronDownIcon, CircleIcon } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/app/hooks/redux/store";
import apiClient from "@/app/api/apiClient";
import { useRouter } from "expo-router";
import {
  RadioGroup,
  RadioIndicator,
  RadioLabel,
  Radio,
  RadioIcon,
} from "@/components/ui/radio";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

export default function Submit() {
  const navigation = useRouter();

  const [docFile, setDocFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [correctionFile, setCorrectionFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const [subject, setSubject] = useState("");
  const [niveauID, setNiveauId] = useState<number | null>(null);
  const [niveauScolaire, setNiveauScolaire] = useState<"SECONDARY" | "SUP">(
    "SECONDARY",
  );

  const [allLevels, setAllLevels] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [fileType, setFileType] = useState("EXAMEN");
  const { t } = useTranslation("teacher");
  const user = useSelector((state: RootState) => state.user.user);
  const userID = user?.id;
  // console.log("users:", user)

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

  const handleChangeLevel = () => {
    setNiveauScolaire(niveauScolaire)
    setNiveauId(null)
  }

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
        alert(`${t("teacher.error.select_subject")}`);
        return;
      }

      if (user && !user.canSubmitDoc) {
        Alert.alert(`${t("teacher.error.no_canSubmit")}`);
        return;
      }
      setLoading(true);

      const docBase64 = await fileToBase64(docFile.uri);

      let correctionBase64 = null;

      if (correctionFile) {
        correctionBase64 = await fileToBase64(correctionFile.uri);
      }

      if (!userID) {
        console.log("une ereur avec l'ID du user: ", userID);
      }

      const payload = {
        base64Encode: docBase64,
        correctionBase64,
        subject,
        niveauID,
        fileType,
        userID,
      };

      console.log("URL:", apiClient.defaults.baseURL + "/document");
      // console.log("payload:", {subject,niveauID,fileType, userID})

      await apiClient.post("/document", payload);
      alert(`${t("teacher.error.send_success")}`);

      setDocFile(null);
      setCorrectionFile(null);
      setSubject("");
      setNiveauId(null);
      setFileType("");
    } catch (error) {
      console.log("l'erreur:", error);
      alert(`${t("teacher.error.send_error")} : ${JSON.stringify(error)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFileType(niveauScolaire=='SECONDARY'?"EVALUTION":"EXAMEN"),
      setNiveauId(null)
  },[niveauScolaire])

  return (
    <ScrollView
      className="flex-1 bg-background-light dark:bg-background-dark"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <View className="px-5 pt-24 pb-8 bg-primary-defaultBlue rounded-b-[32px] items-center relative">
        <View className="bouton retour absolute top-[90px] left-5">
          <TouchableOpacity
            className="flex-row items-center mb-6"
            onPress={() => navigation.back()}
          >
            <Ionicons name="arrow-back" size={24} color={"white"} />
            {/* <Text className="ml-2 text-lg font-semibold text-gray-800">
              Retour
            </Text> */}
          </TouchableOpacity>
        </View>
        <Text className="text-white text-3xl font-extrabold">
          {t("teacher.title")}
        </Text>

        <Text className="text-white/70 mt-2 text-sm leading-5">
          {t("teacher.subtitle")}
        </Text>
      </View>

      {/* CARD */}
      <View className="mx-4 -mt-6 bg-white dark:bg-outline-900 rounded-[28px] p-5 shadow-sm border border-outline-100 dark:border-outline-800">
        {/* SUBJECT */}
        <FormControl className="mb-5">
          <FormControlLabel>
            <FormControlLabelText>
              {t("teacher.form.name")}
            </FormControlLabelText>
          </FormControlLabel>

          <TextInput
            placeholder={t("teacher.form.placeHolder")}
            value={subject}
            onChangeText={setSubject}
            className="mt-2 border border-outline-200 dark:border-outline-700 rounded-2xl px-4 py-4 text-typography-black dark:text-white"
          />
        </FormControl>

        {/* NIVEAU */}
        <View className="flex flex-row justify-center items-center py-5">
          <FormControl className="flex justify-between flex-row">
            <FormControlLabel>
              <FormControlLabelText className="text-lg">
                {t("teacher.form.cycle")}{" "}
                <Text className="text-red-500">*</Text>
              </FormControlLabelText>
            </FormControlLabel>
            <RadioGroup
              value={niveauScolaire}
              onChange={setNiveauScolaire}
              className="flex-1 justify-center items-center flex-row gap-5"
            >
              <Radio value={"SECONDARY"} isInvalid={false} isDisabled={false}>
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel>{t("teacher.form.secondary")}</RadioLabel>
              </Radio>

              <Radio value={"SUP"} isInvalid={false} isDisabled={false}>
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel>{t("teacher.form.higher")}</RadioLabel>
              </Radio>
            </RadioGroup>
          </FormControl>
        </View>
        <FormControl className="mb-5">
          <FormControlLabel>
            <FormControlLabelText>
              {t("teacher.form.level")}
            </FormControlLabelText>
          </FormControlLabel>

          <Select
            onValueChange={(value) => setNiveauId(Number(value))}
            key={`Niveau-${niveauScolaire}`}
          >
            <SelectTrigger
              variant="outline"
              size="lg"
              className="mt-2 rounded-2xl border-outline-200 dark:border-outline-700"
            >
              <SelectInput placeholder={t("teacher.form.placeHolder2")} />
              <SelectIcon as={ChevronDownIcon} className="mr-3" />
            </SelectTrigger>

            <SelectPortal>
              <SelectBackdrop />
              <SelectContent
                className="rounded-3xl "
                style={{ maxHeight: 300, width: "100%" }}
              >
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>

                <ScrollView
                  style={{ width: "100%" }}
                  showsVerticalScrollIndicator={true}
                >
                  {allLevels
                    .filter((level) => level.categorie === niveauScolaire)
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((level, index) => (
                      <SelectItem
                        key={index}
                        label={level.name}
                        value={String(level.id)}
                      />
                    ))}
                </ScrollView>
              </SelectContent>
            </SelectPortal>
          </Select>
        </FormControl>

        {/* TYPE */}
        <FormControl className="mb-6">
          <FormControlLabel>
            <FormControlLabelText>
              {t("teacher.form.type")}
            </FormControlLabelText>
          </FormControlLabel>

          <Select
            onValueChange={(value) => setFileType(value)}
            key={`Type-${niveauScolaire}`}
          >
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

                {allType
                  .filter((item) => {
                    const exclureItemsSecondaire = [
                      "CC",
                      "CONTROLE CONTINU",
                      "EXAMEN SEMESTRE",
                    ];
                    const exclureItemSup = ["EXAMEN BLANC", "EVALUATION"];
                    if (niveauScolaire === "SECONDARY") {
                      return !exclureItemsSecondaire.includes(item);
                    } else {
                      return !exclureItemSup.includes(item);
                    }
                  })
                  .slice()
                  .map((item, index) => (
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
            {docFile
              ? `✅ ${t("teacher.form.select_subject")}`
              : t("teacher.form.add_subject")}
          </Text>

          <Text className="mt-1 text-xs text-red-500 text-center">
            {docFile ? "" : t("teacher.form.warning")}
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
                {t("teacher.form.add_correction")}
              </Text>

              <Text className="text-xs text-red-300 mt-1">
                {correctionFile ? "" : t("teacher.form.warning2")}
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
                {t("teacher.form.button")}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
