import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../api/apiClient';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import LogoHeaderComponent from '@/components/personalizedComponents/logoApplication';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CandidateData {
  id: number;
  nom_du_candidat: string;
  matricule: string;
  sexe: string;
  date_de_naissance: string;
  lieu_de_naissance: string;
  abreviation_examen: string;
  abreviation_serie: string;
  décision: string;
  mention: string;
  annee: number;
}

interface ApiResponse {
  status: string;
  message: string;
  timestamp: string;
  data: CandidateData[];
  count: number;
  annee: number;
}

export default function ExamResultScreen() {
  const [matricule, setMatricule] = useState('');
  const [year, setYear] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<CandidateData | null>(null);
  const {t} = useTranslation("examen");

  const handleFetchResult = async () => {
    if (!matricule.trim() || !year.trim()) {
      setErrorMessage("Veuillez remplir le matricule et l'année.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiClient.post('/others/exam-result', {
        matricule: matricule.trim(),
        year: year.trim(),
      });

      const json: ApiResponse = response.data;

      if (json.data && json.data.length > 0) {
        setResult(json.data[0]);
      } else {
        setErrorMessage(
          json.message || 'Aucun résultat trouvé pour ces informations.'
        );
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Impossible de contacter le serveur. Veuillez rééchanger ultérieurement.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setMatricule('');
    setYear('');
    setErrorMessage(null);
  };

  const isAdmis = result?.décision?.toUpperCase().includes('ADMIS');
  const decisionColorClass = isAdmis ? 'text-emerald-600' : 'text-red-600';
  const decisionBgClass = isAdmis
    ? 'bg-emerald-50 border-emerald-200'
    : 'bg-red-50 border-red-200';

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark dark:text-white">
      <View className="px-4 pt-5 pb-4 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} accessibilityLabel="Retour">
          <Ionicons name="arrow-back" size={22} color="#181c5c" />
        </Pressable>
        <Text className="text-lg font-extrabold text-typography-default dark:text-typography-white">
          <LogoHeaderComponent />
        </Text>
        <View style={{ width: 22 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-2xl font-extrabold text-center text-typography-default dark:text-typography-white">
          {t("form.pageTitle")}
        </Text>

        {!result && (
          <View className="space-y-6 mt-[10px]">
            <View
              className="p-5 rounded-2xl shadow-sm border border-blue-100"
              style={{ backgroundColor: "#2E5DA6" }}
            >
              <Text className="text-xl font-bold text-white mb-2">
                {t("form.title")}
              </Text>
              <Text className="text-blue-50 text-sm leading-5">
                {t("form.text.main")}{" "}
                <Text className="font-bold text-white">
                  {t("form.text.subtext1")}
                </Text>
                {t("form.text.text_link")}
                <Text className="font-bold text-white">
                  {t("form.text.subtext2")}
                </Text>{" "}
                {t("form.text.end")}
              </Text>
            </View>

            <View
              className="flex-row items-center border p-4 mt-4 rounded-xl space-x-3"
              style={{ backgroundColor: "#FFF7ED", borderColor: "#FDBA74" }}
            >
              <Ionicons name="warning-outline" size={24} color="#E8720C" />
              <Text
                className="text-xs flex-1 leading-4"
                style={{ color: "#9A3412" }}
              >
                {t("form.warning")}
              </Text>
            </View>

            {/* Formulaire */}
            <View className="bg-white mt-[7px] p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <View className="mb-2">
                <Text className="text-xs font-semibold text-slate-500 uppercase mb-1">
                  {t("form.text.subtext1")}
                </Text>
                <View className="flex-row items-center border border-slate-200 rounded-xl px-3 bg-slate-50">
                  <Ionicons name="card-outline" size={20} color="#2E5DA6" />
                  <TextInput
                    className="flex-1 py-3 px-2 text-slate-800"
                    placeholder="Ex: 23304031***"
                    value={matricule}
                    onChangeText={setMatricule}
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              <View className="mb-2">
                <Text className="text-xs font-semibold text-slate-500 uppercase mb-1">
                  {t("form.text.subtext2")}
                </Text>
                <View className="flex-row items-center border border-slate-200 rounded-xl px-3 bg-slate-50">
                  <Ionicons name="calendar-outline" size={20} color="#2E5DA6" />
                  <TextInput
                    className="flex-1 py-3 px-2 text-slate-800"
                    placeholder="Ex: 2026"
                    value={year}
                    onChangeText={setYear}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {errorMessage && (
                <View className="flex-row items-center bg-red-50 border border-red-200 p-3 rounded-xl space-x-2">
                  <Ionicons
                    name="alert-circle-outline"
                    size={20}
                    color="#dc2626"
                  />
                  <Text className="text-red-700 text-xs flex-1">
                    {errorMessage}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                className="py-4 mt-[7px] rounded-xl items-center flex-row justify-center space-x-2 shadow-sm active:opacity-90"
                style={{ backgroundColor: "#E8720C" }}
                onPress={handleFetchResult}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="search-outline" size={20} color="#ffffff" />
                    <Text className="text-white font-bold text-base">
                      {t("form.searchBtn")}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {result && (
          <View className="space-y-6">
            <View
              className={`p-6 rounded-2xl border mt-[7px] items-center shadow-sm ${decisionBgClass}`}
            >
              <Ionicons
                name={
                  isAdmis ? "checkmark-circle-outline" : "close-circle-outline"
                }
                size={56}
                color={isAdmis ? "#059669" : "#dc2626"}
              />
              <Text className="text-xs font-semibold uppercase tracking-widest text-slate-500 mt-2">
                {t("form.result.finalDecision")}
              </Text>
              <Text
                className={`text-3xl font-extrabold mt-1 uppercase ${decisionColorClass}`}
              >
                {result.décision}
              </Text>
            </View>

            <View className="flex-row justify-center items-center mt-[5px]">
              <Image
                source={require("@/assets/images/app_sec.png")}
                style={{ width: 160, height: 150 }}
                resizeMode="contain"
              />
            </View>

            <View className="bg-white rounded-2xl mt-[2px] p-5 border border-slate-100 shadow-sm space-y-4">
              <Text
                className="text-base font-bold border-b border-slate-100 pb-3"
                style={{ color: "#2E5DA6" }}
              >
                {t("form.result.details.text")}
              </Text>

              <DetailRow
                label={t("form.result.details..name")}
                value={result.nom_du_candidat}
              />
              <DetailRow
                label={t("form.text.subtext1")}
                value={result.matricule}
              />
              <DetailRow
                label={t("form.result.details.sex")}
                value={result.sexe}
              />
              <DetailRow
                label={t("form.result.details.bornDate")}
                value={`${result.date_de_naissance} à ${result.lieu_de_naissance}`}
              />
              <DetailRow
                label={t("form.result.details.exam")}
                value={result.abreviation_examen}
              />
              <DetailRow
                label={t("form.result.details.serie")}
                value={result.abreviation_serie}
              />

              {/* Décision en taille normale */}
              <View className="flex-row justify-between items-center py-2 border-b border-slate-50">
                <Text className="text-xs text-slate-500 font-medium">
                  {t("form.result.details.decision")}
                </Text>
                <Text
                  className={`text-sm font-bold uppercase ${decisionColorClass}`}
                >
                  {result.décision}
                </Text>
              </View>

              <DetailRow
                label={t("form.result.details.mention")}
                value={result.mention}
              />
              <DetailRow
                label={t("form.text.subtext2")}
                value={result.annee.toString()}
                isLast
              />
            </View>

            {/* Bouton "Obtenir un autre résultat" avec la couleur Primaire (#2E5DA6) */}
            <TouchableOpacity
              className="py-4 rounded-xl mt-[5px] items-center flex-row justify-center space-x-2 shadow-sm active:opacity-90"
              style={{ backgroundColor: "#2E5DA6" }}
              onPress={handleReset}
            >
              <Ionicons name="refresh-outline" size={20} color="#ffffff" />
              <Text className="text-white font-bold text-base">
                {t("form.result.btnText")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View className={`flex-row justify-between items-center py-2 ${!isLast ? 'border-b border-slate-50' : ''}`}>
      <Text className="text-xs text-slate-500 font-medium">{label}</Text>
      <Text className="text-sm font-semibold text-slate-800 text-right flex-1 ml-4">
        {value}
      </Text>
    </View>
  );
}