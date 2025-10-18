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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function CreateCompetitionForm() {
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
      ><View className="bg-white mt-6 p-6 rounded-2xl shadow-lg">
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
              <Text className="mb-1 font-semibold">
                Frais d'inscription (XAF)
              </Text>
              <TextInput
                className="border border-gray-300 p-2 rounded mb-4"
                keyboardType="numeric"
                value={formData.entryFee}
                placeholder="Ex: 1000"
                onChangeText={(text) =>
                  setFormData({ ...formData, entryFee: text })
                }
              />

              <Text className="mb-1 font-semibold">Prix du gagnant (XAF)</Text>
              <TextInput
                className="border border-gray-300 p-2 rounded mb-4"
                keyboardType="numeric"
                value={formData.winnerPrice}
                placeholder="Ex: 50000"
                onChangeText={(text) =>
                  setFormData({ ...formData, winnerPrice: text })
                }
              />
              <Text className="mb-1 font-semibold">
                Nombre minimal de participants
              </Text>
              <TextInput
                className="border border-gray-300 p-2 rounded mb-4"
                keyboardType="numeric"
                placeholder="Ex: 2"
                value={formData.minUsers}
                onChangeText={(text) =>
                  setFormData({ ...formData, minUsers: text })
                }
              />

              <Text className="mb-1 font-semibold">
                Nombre maximal de participants
              </Text>
              <TextInput
                className="border border-gray-300 p-2 rounded mb-4"
                keyboardType="numeric"
                placeholder="Ex: 10"
                value={formData.maxUsers}
                onChangeText={(text) =>
                  setFormData({ ...formData, maxUsers: text })
                }
              />
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
