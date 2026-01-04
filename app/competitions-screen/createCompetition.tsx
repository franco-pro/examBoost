import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Toast from 'react-native-toast-message';

import { resetActionDone, setCompetitioErrorNull, updateOne } from "@/app/hooks/redux/competitions/competitions.slice";
import { createCompetition, update } from "@/app/hooks/redux/competitions/competitions.thunks";
import { addTransaction } from "@/app/hooks/redux/transactions/transactions.slice";
import Competition from "@/app/hooks/services/competitions/competition.entity";
import { CompetitionTypeDescription } from "@/app/hooks/services/competitionText.enum";
import { DialogText } from "@/app/hooks/services/text.enum";
import PopoverInstructionsCreation from "@/app/services/compeititonService/popover.creation";
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function CreateCompetitionForm() {
  const {homeBaseData} = useAppSelector((state)=> state.competitions)
  const { data } = useLocalSearchParams() as any;
  const [actionType, setActionType] = useState<"UPDATE"|"CREATE">("CREATE")
  const TextEnum = DialogText;
  const competitionText = CompetitionTypeDescription; 

  // const competitionToUpdate = JSON.parse(data);
  
  const MAX_PARTICIPANTS = homeBaseData ? homeBaseData.MAX_PARTICIPANTS: 15;
  const MIN_PARTICIPANTS = homeBaseData ? homeBaseData.MIN_PARTICIPANTS: 2;
  const MAX_QUESTION_NUMBER = homeBaseData ? homeBaseData.MAX_QUESTION_NUMBER : 20;
  const MIN_QUESTION_NUMBER = homeBaseData ? homeBaseData.MIN_QUESTION_NUMBER: 5;
  const MIN_TO_USE_IA_PRIVATE = homeBaseData ? homeBaseData.MIN_WINNERPRICE_TO_USE_AI_IN_PRIVATE_COMP : 8000;
  const MIN_TO_USE_IA_PUBLIC = homeBaseData ? homeBaseData.MIN_WINNERPRICE_TO_USE_AI_IN_PUBLIC_COMP : 15000;
  const userId = 1;
  const [formError, setFormError] = useState<string>("");

  const dispatch = useAppDispatch()
  const {error, actionDone} = useAppSelector((state)=> state.competitions)

  const [maxUsers, setMaxUsers] = useState<number>(MAX_PARTICIPANTS);
  const [entryFee, setEntryFee] = useState<number>(0);
  const [lang, setLang] = useState<"FRANCAIS"|"ANGLAIS">("FRANCAIS");
  const [questionNbr, setQuestionNbr] = useState(0);
  const [useIA, setUseIA] = useState(false);
  const [isPublic, setCompetitionType] = useState<Boolean>(
    false
  );
  const [type, setType]= useState<
                                "PAID_REGISTRATION_AS_WINNER_PRICE"
                                |"FREE_REGISTRATION_WITH_WINNER_PRICE"
                                | "PAID_REGISTRATION_WITH_WINNER_PRICE"
                                | "TOTAL_FREE_NO_PRICE_TO_WIN">("PAID_REGISTRATION_WITH_WINNER_PRICE")
  // Déclarations
  const [winnerPrice, setWinnerPrice] = useState<number>(0);
  const [usePercentage, setUsePercentage] = useState(false);
  const percentage = homeBaseData ? homeBaseData.PERCENTAGE : 80; 

  const percentageAmount = Math.round(maxUsers * entryFee * (percentage / 100));

  // Détermine si on doit afficher la checkbox pourcentage
  const showUseIACheckbox = (type === "PAID_REGISTRATION_AS_WINNER_PRICE") || (type === "PAID_REGISTRATION_WITH_WINNER_PRICE") ? 
                                      ((!isPublic && (entryFee * maxUsers) >= MIN_TO_USE_IA_PRIVATE) || (isPublic && (entryFee * maxUsers) >= MIN_TO_USE_IA_PUBLIC))
                                      :
                                      ((!isPublic && winnerPrice >= MIN_TO_USE_IA_PRIVATE) || (isPublic && winnerPrice >= MIN_TO_USE_IA_PUBLIC)) ;

  // Calcul du montant à afficher dans l'input du prix du gagnant
  const displayedWinnerPrice = usePercentage ? percentageAmount : winnerPrice;

  useFocusEffect(
    useCallback(()=> {
        if(data){
          setActionType("UPDATE")

          const competitionToUpdate = JSON.parse(data) as Competition;
          competitionToUpdate.date = new Date(competitionToUpdate.date) as any;
          competitionToUpdate.registration_deadline = new Date(competitionToUpdate.registration_deadline) as any; 
          setFormData(competitionToUpdate);
          setMaxUsers(competitionToUpdate.maxUsers);
          setEntryFee(competitionToUpdate.entryFee);
          setLang(competitionToUpdate.language);
          setQuestionNbr(competitionToUpdate.questionsNbr);
          setUseIA(competitionToUpdate.isManagedByIA);
          setCompetitionType(competitionToUpdate.isPublic);
          setType(competitionToUpdate.type);
          setWinnerPrice(competitionToUpdate.winnerPrice);

        }else{
          setActionType("CREATE")
        }

        return () => {
          dispatch(resetActionDone()) 
          dispatch(setCompetitioErrorNull())
        };
    }, [])
  )

  function changeType(typeChoose: any){
    if(typeChoose == "PAID_REGISTRATION_AS_WINNER_PRICE") {
      setUsePercentage(true);
    }
    setType(typeChoose);
  }
 

  // Validation min
  const minWinnerPrice = !isPublic ? 8000 : 15000;
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const progress = useRef(new Animated.Value(0)).current;

  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    date: new Date(),
    registration_deadline: new Date(),
    entryFee: "",
    winnerPrice: "",
    minUsers: "",
    type: "",
    language: "",
    questionsNbr: "",
    isPublic: false,
    isManagedByIA: false,
    maxUsers: "",
    topic: "",
    statut: "UPCOMING",
    creatorID: userId
  });

  const router = useRouter();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentField, setCurrentField] = useState<any>(null);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (step - 1) / (totalSteps - 1),
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [step]);

  useEffect(()=> {
      if(error){
        if(error.message){
          setFormError((error.message ? error.message: error.message[0]));
        }else{
          setFormError(error)
        }
      }
  }, [error])

  useEffect(()=> {
    if(actionDone){
      if(actionType == "CREATE"){
        addLocalTransaction();
      }else{
        dispatch(updateOne(formData))
      }
      showToast("Your action was completed successfully.", "Opération Effectuée", "success")
      router.back();
    }
  }, [actionDone])


  function showToast(message: string, title: string, type: "success"|"error"){
        Toast.show({
          type: type,
          text2: message,
          text1: title,
          position: 'top',
          visibilityTime: 3500,
        }) 
    }

  function addLocalTransaction(){
    if(type != "TOTAL_FREE_NO_PRICE_TO_WIN"){
        const transaction = {
          id: 0,
          type: "CREATE_COMPETITION",
          amount: (type == "PAID_REGISTRATION_AS_WINNER_PRICE" ? Number(entryFee):Number(winnerPrice)),
          created_at: new Date().toLocaleString(),
          PID: 0
        }
        dispatch(addTransaction(transaction))
    }
  }

  function concatInstructions(): string{
    const instructions = homeBaseData ? 
                         homeBaseData.CREATION_HELP.GoldenA+
                         homeBaseData.CREATION_HELP.GoldenB+
                         homeBaseData.CREATION_HELP.GoldenC+
                         homeBaseData.CREATION_HELP.GoldenD+
                         competitionText.NOTE:
                         competitionText.GOLDEN_A+ 
                         competitionText.GOLDEN_B+ 
                         competitionText.GOLDEN_C+ 
                         competitionText.GOLDEN_D+ 
                         competitionText.NOTE
    return instructions;                         
  } 

  const handleNext = () => step < totalSteps && setStep(step + 1);
  const handleBack = () => step > 1 && setStep(step - 1);

  const handleSubmit = () => {
    const errorMessage: Record<string, string> = {
      name: "Le nom de la compatition n'est pas défini",
      description: "La Description n'est pas défini",
      type: "Le type de competition n'est pas choisi",
      topic: "Le Thème de la competition n'est pas défini",
      registration_deadline: "La date limite d'inscription n'est pas définie",
      date: "La date de l'évènement n'est pas définie",
      entryFee: "Le prix d'inscription n'est pas défini",
      winnerPrice: "La cagnotte du vainqueur n'est pas defini",
      questionsNbr: "Le nombre de questions n'est pas défini",
      lang: "La langue n'est pas choisie"
    };
  
    let errors: string | null = null;
    let updatedData = { ...formData };

    updatedData.isManagedByIA = useIA;
    updatedData.isPublic = isPublic;
    updatedData.minUsers = MIN_PARTICIPANTS;
   
    updatedData.registration_deadline = actionType == "UPDATE" ? updatedData.registration_deadline.toISOString(): updatedData.registration_deadline;
    updatedData.date = actionType== "UPDATE" ? updatedData.date.toISOString(): updatedData.date;

    if (new Date(updatedData.registration_deadline) >= new Date(updatedData.date)) {
      errors = "La date limite d'inscription ne peut pas être supérieure ou égale à la date et heure de la compétition."
    }


    // --- VALIDATION maxUsers ---
    if (Number(maxUsers) <= MAX_PARTICIPANTS && Number(maxUsers) >= MIN_PARTICIPANTS) {
      updatedData.maxUsers = Number(maxUsers);
    } else {
      errors = `Le nombre de participants maximum doit être ≤ ${MAX_PARTICIPANTS} et ≥ ${MIN_PARTICIPANTS}`;
    }
  
    // --- VALIDATION questionNbr ---
    if (Number(questionNbr) <= MAX_QUESTION_NUMBER && Number(questionNbr) >= MIN_QUESTION_NUMBER) {
      updatedData.questionsNbr = Number(questionNbr);
    } else {
      errors = `Le nombre total de questions doit être ≤ ${MAX_QUESTION_NUMBER} et ≥ ${MIN_QUESTION_NUMBER}`;
    }
  
    // --- VALIDATION entryFee si nécessaire ---
    if (type === "PAID_REGISTRATION_AS_WINNER_PRICE" || type === "PAID_REGISTRATION_WITH_WINNER_PRICE") {
      if (!entryFee) {
        errors = errorMessage["entryFee"];

      } else {
        updatedData.entryFee = Number(entryFee);
      }

        if(type == "PAID_REGISTRATION_WITH_WINNER_PRICE"){
          if(!winnerPrice){
            errors = errorMessage['winnerPrice'];
          }else{
            updatedData.winnerPrice = (Number(winnerPrice)*percentage)/100;
          }
        }
      updatedData.type = type;

    }else if(!type){
      errors = errorMessage['type']
    }else if(type){
      updatedData.type = type;
      updatedData.entryFee = 0;
    }

    if(type === "TOTAL_FREE_NO_PRICE_TO_WIN"){
      updatedData.entryFee = 0;
    }
    
      if(usePercentage){
        updatedData.winnerPrice = Number(percentageAmount);
      }else{
        updatedData.winnerPrice = (Number(winnerPrice)*percentage)/100
      }

    if(lang){
      updatedData.language = lang;
    }else{
      errors = errorMessage['lang']
    }
  
    // --- VALIDATION des champs obligatoires ---
    const requiredFields = ["name", "description", "type", "topic", "registration_deadline", "date", "questionsNbr"];
    
    for (const field of requiredFields) {
      if (!updatedData[field]) {
        errors = errorMessage[field];
        break;
      }
    }
  
    // --- S’IL Y A DES ERREURS ---
    if (errors) {
      setFormError(errors);
      console.log("Formulaire invalide");
      return;
    }
    
    // --- SINON : UPDATE FINAL ET ENVOI ---
    setFormData(updatedData);
    setFormError("");
    
    if(actionType==="CREATE"){
      dispatch(createCompetition(updatedData))
    }else{
      dispatch(update(updatedData))
    }
  };

  function canUseIA(): boolean{
    if(type == "PAID_REGISTRATION_WITH_WINNER_PRICE" || type == "FREE_REGISTRATION_WITH_WINNER_PRICE"){
      if(isPublic){
        return Number(winnerPrice) >= MIN_TO_USE_IA_PUBLIC;
      }else{
        return Number(winnerPrice) >= MIN_TO_USE_IA_PRIVATE;
      }
    }else if(type == "PAID_REGISTRATION_AS_WINNER_PRICE"){
      if(isPublic){
        return percentageAmount >= MIN_TO_USE_IA_PUBLIC; 
      }else{
        return percentageAmount >= MIN_TO_USE_IA_PRIVATE; 
      }
    }
    return false
  }

  const formatCameroonDate = (date: any) => {
    return date.toLocaleString("fr-FR", {
      timeZone: "Africa/Douala",   // Cameroun
    });
  };
  

  const handleDateChange = (event: any, selectedDate:any) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }

    // const cameroonDate = new Date(selectedDate.getTime() + 1 * 60 * 60 * 1000);

    if (selectedDate) {
      setFormData((prev: any) => ({
        ...prev,
        [currentField]: selectedDate,
      }));
    }

    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    setShowDatePicker(false);

  };

  const openCalendar = (field: any) => {
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
          {
            actionType == "CREATE" ? TextEnum.competition_create_head : TextEnum.competition_update_head
          }
        </Text>
        <Text className="text-gray-200 text-sm mt-1 ">
        {
            actionType == "CREATE" ? TextEnum.competititon_create_body : TextEnum.competition_update_body
          }
        </Text>
        {
          formError && (
            <View>
              <Text className="text-error-600 text-lg mt-1 ">
                  Error: {formError}
              </Text>
            </View>
          )
        }

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
                placeholder="Décrivez la compétition en 500 caractères max..."
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

              <Text className="mb-1 font-semibold">Date et heure de la compétition (GMT +1)</Text>
              <TouchableOpacity
                className="border border-gray-300 p-3 rounded mb-4 flex-row items-center"
                onPress={() => openCalendar("date")}
              >
                <Ionicons name="calendar" size={20} color="#181c5c" />
                <Text className="ml-2 text-gray-700">
                  { formData.date && formatCameroonDate(formData.date)}
                </Text>
              </TouchableOpacity>

              <Text className="mb-1 font-semibold">
                {"Date et heure limite d'inscription (GMT +1)"}
              </Text>
              <TouchableOpacity
                className="border border-gray-300 p-3 rounded mb-4 flex-row items-center"
                onPress={() => openCalendar("registration_deadline")}
              >
                <Ionicons name="calendar-outline" size={20} color="#181c5c" />
                <Text className="ml-2 text-gray-700">
                  {formData.registration_deadline && formatCameroonDate(formData.registration_deadline)}
                </Text>
              </TouchableOpacity>

              {/* Nombre max d'utilisateurs */}
            
                          <Text className="mb-1 font-semibold">
                            Nombre maximum de participants (max: {MAX_PARTICIPANTS}, min: {MIN_PARTICIPANTS})
                          </Text>
                          <TextInput
                            keyboardType="numeric"
                            placeholder="Max participants"
                            value={maxUsers.toString()}
                            onChangeText={(text) => setMaxUsers(Number(text))}
                            editable = {actionType == "UPDATE" && useIA && type != "PAID_REGISTRATION_AS_WINNER_PRICE"}
                            className="border border-gray-300 p-2 rounded mb-4"
                          />

                
            </View>
          )}

          {/* === ÉTAPE 2 === */}
          {step === 2 && (
            <View>
              {/* Select type competition */}
              <Text className="mb-1 font-semibold">Portée </Text>
              <Picker
                selectedValue={isPublic}
                onValueChange={(itemValue) => setCompetitionType(itemValue)}
                className="border border-gray-300 p-2 rounded mb-4"
              >
                <Picker.Item label="Privée" value={false} />
                <Picker.Item label="Publique" value={true} />
              </Picker>

            {
              (actionType !== "UPDATE") && (
                <View>
                  <Text className="mb-1 font-semibold">Type </Text>
                  <PopoverInstructionsCreation data={
                                                 {
                                                  instructions: concatInstructions()
                                                 }
                                              }
                    />
                  <Picker
                    selectedValue={type}
                    onValueChange={(itemValue: any) => changeType(itemValue)}
                    enabled={false}
                    className="border border-gray-300 p-2 rounded mb-4"
                  >
                    <Picker.Item label="Golden A" value="PAID_REGISTRATION_WITH_WINNER_PRICE" />
                    <Picker.Item label="Golden B" value="FREE_REGISTRATION_WITH_WINNER_PRICE"/>
                    <Picker.Item label="Golden C" value="PAID_REGISTRATION_AS_WINNER_PRICE"/>
                    <Picker.Item label="Golden D" value="TOTAL_FREE_NO_PRICE_TO_WIN"/>
                  </Picker>
                </View>
              )
            }

            

              <Text className="mb-1 font-semibold">Lang </Text>
              <Picker
                selectedValue={lang}
                onValueChange={(itemValue) => setLang(itemValue)}
                className="border border-gray-300 p-2 rounded mb-4"
              >
                <Picker.Item label="ENGLISH" value="ANGLAIS" />
                <Picker.Item label="FRANCAIS" value="FRANCAIS" />
              </Picker>
              
            </View>
          )}

          {/* Affichage du calendrier */}
          {showDatePicker && (
            <DateTimePicker
              value={formData[currentField] || new Date()}
              mode="datetime"
              display="default"
              onChange={handleDateChange}
            />
          )}


           {/*Etape 3*/}
           {
            step === 3 && (
              <View>

                 {/* Montant d'inscription */}
              {
                type != "TOTAL_FREE_NO_PRICE_TO_WIN" && type != "FREE_REGISTRATION_WITH_WINNER_PRICE" && (
                  <View>
                    <Text className="mb-1 font-semibold">{"Montant d'inscription (XAF)"}</Text>
                    <TextInput
                      keyboardType="numeric"
                      placeholder="Montant"
                      value={entryFee.toString()}
                      onChangeText={(text) => setEntryFee(Number(text))}
                      className="border border-gray-300 p-2 rounded mb-4"
                    />
                  </View>
                )
              }

              {
                type != "TOTAL_FREE_NO_PRICE_TO_WIN" && (
                    <View>
                        <Text className="mb-1 font-semibold">Prix du gagnant (XAF) ({percentage + '%'}) </Text>
                        <TextInput
                          keyboardType="numeric"
                          placeholder={`Montant minimum ${minWinnerPrice}`}
                          value={displayedWinnerPrice.toString()}
                          onChangeText={(text) =>
                            !usePercentage && setWinnerPrice(Number(text))
                          }
                          className="border border-gray-300 p-2 rounded mb-4"
                          editable={!usePercentage || actionType=="CREATE"} // readonly si on utilise le pourcentage
                        />
                    </View>
                    
                ) 
              }

              {
                 type != "TOTAL_FREE_NO_PRICE_TO_WIN" && (
                 <View>
                    <Text className="mb-1 font-semibold">Montant Net (XAF) </Text>
                    <TextInput
                      keyboardType="numeric"
                      placeholder={`Montant minimum ${minWinnerPrice}`}
                      value={((displayedWinnerPrice*percentage)/100).toString()}
                      onChangeText={(text) =>
                        !usePercentage && setWinnerPrice(Number(text))
                      }
                      className="border border-gray-300 p-2 rounded mb-4"
                      editable={false} // readonly si on utilise le pourcentage
                  />
                 </View>
                  
              )
              }

              

                <Text className="mb-1 font-semibold">Nombre Total de Questions (max: {MAX_QUESTION_NUMBER}, min: {MIN_QUESTION_NUMBER}) </Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder={`ex: 20`}
                  value={questionNbr.toString()}
                  onChangeText={(text) =>
                    setQuestionNbr(Number(text))
                  }
                  className="border border-gray-300 p-2 rounded mb-4"
                />

                {/* Checkbox IA */}
                {canUseIA() && (
                  <View className="flex-row items-center mb-4">
                    <Switch value={useIA} onValueChange={setUseIA} disabled={actionType == "UPDATE"} />
                    <Text className="ml-2">{"Questions générées par l'IA"}</Text>
                  </View>
                )}
              </View>

            )

          }

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
                className="bg-[#ff894f] px-4 py-2 rounded max-w-[65%] w-[65%] justify-center items-center"
                onPress={handleSubmit}
              >
                <Text className="text-white font-semibold">
                    {
                      actionType == "CREATE" ? TextEnum.competition_create_btn_text : TextEnum.competition_update_btn_text
                    }
                </Text>
              </TouchableOpacity>
            )}
          </View>


         
        </View>
      </ScrollView>
    </View>
  );
}
