import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  Switch,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

const { width } = Dimensions.get("window");

export default function CreateCompetitionForm() {
  const [maxUsers, setMaxUsers] = useState<number>(0);
  const [minUsers, setMinUsers] = useState<number>(0);
  const [entryFee, setEntryFee] = useState<number>(0);
  const [useIA, setUseIA] = useState(false);
  const [competitionType, setCompetitionType] = useState<"PRIVE" | "PUBLIC">(
    "PRIVE"
  );
  // Déclarations
  const [winnerPrice, setWinnerPrice] = useState<number>(0);
  const [usePercentage, setUsePercentage] = useState(false);
  const [percentage, setPercentage] = useState<number>(0);

  //calcul la somme du gagnant si l'option pourcentage est choisie
  const percentageAmount = Math.round(maxUsers * entryFee * (percentage / 100));

  // Détermine si on doit afficher la checkbox pourcentage
  const showPercentageCheckbox = competitionType === "PRIVE";

  // Calcul du montant à afficher dans l'input du prix du gagnant
  const displayedWinnerPrice = usePercentage ? percentageAmount : winnerPrice;

  // Validation min
  const minWinnerPrice = competitionType === "PRIVE" ? 8000 : 15000;
  const [step, setStep] = useState(1);
  const totalSteps = 2;
  const progress = useRef(new Animated.Value(0)).current;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: new Date(),
    registration_deadline: new Date(),
    entryFee: "",
    winnerPrice: "",
    minUsers: "",
    maxUsers: "",
    topic: "",
  });

  const router = useRouter();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentField, setCurrentField] = useState(null);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (step - 1) / (totalSteps - 1),
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [step]);

  const handleNext = () => step < totalSteps && setStep(step + 1);
  const handleBack = () => step > 1 && setStep(step - 1);
  const handleSubmit = () => {
    console.log("Données envoyées :", formData);
    alert("Compétition créée avec succès !");
  };

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }

    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        [currentField]: selectedDate,
      }));
    }

    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
  };

  const openCalendar = (field) => {
    setCurrentField(field);
    setShowDatePicker(true);
  };

  return (
    <View className="flex-1 bg-gray-50 pt-[40px] w-full max-w-full  pb-[50px] px-4">
      <TouchableOpacity
        className="flex-row items-center mb-4"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#181c5c" />
        <Text className="ml-2 text-lg font-semibold text-gray-800">Retour</Text>
      </TouchableOpacity>

      {/* 🏆 Header stylé */}
      <View className="bg-[#181c5c] py-10 px-6 rounded-3xl items-center shadow-lg">
        <Ionicons name="trophy" size={50} color="#ffb347" />
        <Text className="text-white text-3xl font-bold mt-2">
          Nouvelle Compétition
        </Text>
        <Text className="text-gray-200 text-sm mt-1 ">
          Créez votre événement et définissez les règles, les dates et les prix.
        </Text>
      </View>

      {/* 🧾 Conteneur du formulaire */}

      <ScrollView
        className="mt-2"
        contentContainerStyle={{ flexGrow: 1 }}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
      >
        <View className="bg-white mt-6 p-6 rounded-2xl shadow-lg">
          <Text className="text-2xl font-bold mb-4 text-[#181c5c] text-center">
            Étape {step} / {totalSteps}
          </Text>

          {/* Barre de progression */}
          <View className="w-full h-2 bg-gray-200 rounded-full mb-6">
            <Animated.View
              style={{
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, width - 100],
                }),
                height: 8,
                backgroundColor: "#ff894f",
                borderRadius: 4,
              }}
            />
          </View>

          {/* === ÉTAPE 1 === */}
          {step === 1 && (
            <View>
              <Text className="mb-1 font-semibold">Nom de la compétition</Text>
              <TextInput
                className="border border-gray-300 p-2 rounded mb-4"
                placeholder="Ex: Hackathon 2025"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
              />

              <Text className="mb-1 font-semibold">Description</Text>
              <TextInput
                className="border border-gray-300 p-2 rounded mb-4"
                multiline
                placeholder="Décrivez la compétition..."
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
              />

              <Text className="mb-1 font-semibold">Thème</Text>
              <TextInput
                className="border border-gray-300 p-2 rounded mb-4"
                placeholder="Ex: Intelligence Artificielle"
                value={formData.topic}
                onChangeText={(text) =>
                  setFormData({ ...formData, topic: text })
                }
              />

              <Text className="mb-1 font-semibold">Date de la compétition</Text>
              <TouchableOpacity
                className="border border-gray-300 p-3 rounded mb-4 flex-row items-center"
                onPress={() => openCalendar("date")}
              >
                <Ionicons name="calendar" size={20} color="#181c5c" />
                <Text className="ml-2 text-gray-700">
                  {formData.date.toLocaleDateString("fr-FR")}
                </Text>
              </TouchableOpacity>

              <Text className="mb-1 font-semibold">
                Date limite d'inscription
              </Text>
              <TouchableOpacity
                className="border border-gray-300 p-3 rounded mb-4 flex-row items-center"
                onPress={() => openCalendar("registration_deadline")}
              >
                <Ionicons name="calendar-outline" size={20} color="#181c5c" />
                <Text className="ml-2 text-gray-700">
                  {formData.registration_deadline.toLocaleDateString("fr-FR")}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* === ÉTAPE 2 === */}
          {step === 2 && (
            <View>
              {/* Select type competition */}
              <Text className="mb-1 font-semibold">Type de compétition</Text>
              <Picker
                selectedValue={competitionType}
                onValueChange={(itemValue) => setCompetitionType(itemValue)}
                className="border border-gray-300 p-2 rounded mb-4"
              >
                <Picker.Item label="Privée" value="PRIVE" />
                <Picker.Item label="Publique" value="PUBLIC" />
              </Picker>

              {/* Nombre minimale d'utilisateurs */}
              <Text className="mb-1 font-semibold">
                Nombre minimale de participants
              </Text>
              <TextInput
                keyboardType="numeric"
                placeholder="Min participants"
                value={minUsers.toString()}
                onChangeText={(text) => setMinUsers(Number(text))}
                className="border border-gray-300 p-2 rounded mb-4"
              />
              {/* Nombre max d'utilisateurs */}
              <Text className="mb-1 font-semibold">
                Nombre maximum de participants
              </Text>
              <TextInput
                keyboardType="numeric"
                placeholder="Max participants"
                value={maxUsers.toString()}
                onChangeText={(text) => setMaxUsers(Number(text))}
                className="border border-gray-300 p-2 rounded mb-4"
              />

              {/* Montant d'inscription */}
              <Text className="mb-1 font-semibold">Montant d'inscription</Text>
              <TextInput
                keyboardType="numeric"
                placeholder="Montant"
                value={entryFee.toString()}
                onChangeText={(text) => setEntryFee(Number(text))}
                className="border border-gray-300 p-2 rounded mb-4"
              />

              {/* Checkbox pourcentage */}
              {showPercentageCheckbox && (
                <View className="mb-4">
                  <View className="mb-4 flex-row items-center">
                    <Switch
                      value={usePercentage}
                      onValueChange={(val) => {
                        setUsePercentage(val);
                        if (val) {
                          setWinnerPrice(percentageAmount); // mise à jour automatique si on active le pourcentage
                        }
                      }}
                    />
                    <Text className=" ml-2 font-semibold">
                      la somme du gagnant est en pourcentage sur la somme finale
                    </Text>
                  </View>
                  {usePercentage && (
                    <View>
                      <Text className="mb-1 font-semibold">
                        Pourcentage du montant
                      </Text>
                      <TextInput
                        keyboardType="numeric"
                        placeholder="Ex: 10"
                        className="border border-gray-300 p-2 rounded mb-4"
                        value={percentage.toString()}
                        onChangeText={(text) => setPercentage(Number(text))}
                      />
                    </View>
                  )}
                </View>
              )}

              {/* Montant du gagnant */}
              <Text className="mb-1 font-semibold">Prix du gagnant</Text>
              <TextInput
                keyboardType="numeric"
                placeholder={`Montant minimum ${minWinnerPrice}`}
                value={displayedWinnerPrice.toString()}
                onChangeText={(text) =>
                  !usePercentage && setWinnerPrice(Number(text))
                }
                className="border border-gray-300 p-2 rounded mb-4"
                editable={!usePercentage} // readonly si on utilise le pourcentage
              />
              {/* Checkbox IA */}
              {displayedWinnerPrice >= minWinnerPrice && (
                <View className="flex-row items-center mb-4">
                  <Switch value={useIA} onValueChange={setUseIA} />
                  <Text className="ml-2">Questions générées par l'IA</Text>
                </View>
              )}
            </View>
          )}

          {/* Affichage du calendrier */}
          {showDatePicker && (
            <DateTimePicker
              value={formData[currentField] || new Date()}
              mode="date"
              display="calendar"
              onChange={handleDateChange}
            />
          )}

          {/* Navigation */}
          <View className="flex-row justify-between mt-6">
            {step > 1 && (
              <TouchableOpacity
                className="bg-gray-400 px-4 py-2 rounded"
                onPress={handleBack}
              >
                <Text className="text-white">Précédent</Text>
              </TouchableOpacity>
            )}

            {step < totalSteps ? (
              <TouchableOpacity
                className="bg-[#181c5c] px-4 py-2 rounded"
                onPress={handleNext}
              >
                <Text className="text-white">Suivant</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="bg-[#ff894f] px-4 py-2 rounded"
                onPress={handleSubmit}
              >
                <Text className="text-white font-semibold">Soumettre</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
