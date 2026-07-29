import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Toast from 'react-native-toast-message';

import { LanguageContext } from "@/app/context/LanguageProvider";
import { resetActionDone, setCompetitioErrorNull, updateOne } from "@/app/hooks/redux/competitions/competitions.slice";
import { createCompetition, update } from "@/app/hooks/redux/competitions/competitions.thunks";
import { addTransaction } from "@/app/hooks/redux/transactions/transactions.slice";
import Competition from "@/app/hooks/services/competitions/competition.entity";
import { CompetitionTypeDescription } from "@/app/hooks/services/competitionText.enum";
import { DialogText } from "@/app/hooks/services/text.enum";
import PopoverInstructionsCreation from "@/app/services/compeititonService/popover.creation";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FullscreenLoader from "@/app/helper/Dialogs/loaderFullScreen";
import { useSelector } from "react-redux";
import { RootState } from "../hooks/redux/store";

const { width } = Dimensions.get("window");

export default function CreateCompetitionForm() {
  //TODO: -add condition, commission for competition where using IA
  const {homeBaseData} = useAppSelector((state)=> state.competitions)
  const { user } = useSelector((state: RootState) => state.user);

  const { data } = useLocalSearchParams() as any;
  const { language } = useContext(LanguageContext);
  
  const [actionType, setActionType] = useState<"UPDATE"|"CREATE">("CREATE")
  const TextEnum = DialogText;
  const competitionText = CompetitionTypeDescription; 
  const {t } = useTranslation("competition")
  // const competitionToUpdate = JSON.parse(data);
  
  const MAX_PARTICIPANTS = homeBaseData ? homeBaseData.MAX_PARTICIPANTS: 15;
  const MIN_PARTICIPANTS = homeBaseData ? homeBaseData.MIN_PARTICIPANTS: 2;
  const MAX_QUESTION_NUMBER = homeBaseData ? homeBaseData.MAX_QUESTION_NUMBER : 20;
  const MIN_QUESTION_NUMBER = homeBaseData ? homeBaseData.MIN_QUESTION_NUMBER: 5;
  const MIN_TO_USE_IA_PRIVATE = homeBaseData ? homeBaseData.MIN_WINNERPRICE_TO_USE_AI_IN_PRIVATE_COMP : 8000;
  const MIN_TO_USE_IA_PUBLIC = homeBaseData ? homeBaseData.MIN_WINNERPRICE_TO_USE_AI_IN_PUBLIC_COMP : 15000;
  const userId = user?.id;
  const [formError, setFormError] = useState<string>("");
  const [isFirstCalendarOpen, setIsFirstCalendarOpen] = useState(true);

  const dispatch = useAppDispatch()
  const {error, actionDone,loading} = useAppSelector((state)=> state.competitions)

  const [maxUsers, setMaxUsers] = useState<number>(MAX_PARTICIPANTS);
  const [entryFee, setEntryFee] = useState<number>(0);
  const [lang, setLang] = useState<"FRANCAIS"|"ANGLAIS">("FRANCAIS");
  const [questionNbr, setQuestionNbr] = useState(0);
  const [useIA, setUseIA] = useState(false);
  const [isPublic, setCompetitionType] = useState<Boolean>(
    false
  );
  const [isExamBoostCompetition, setIsExamBoostCompetition] = useState(false);
  const isSuperAdmin = user && user.role === "SUPERADMIN" ? true : false;

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
          setIsExamBoostCompetition(competitionToUpdate.isExamBoostCompetition);
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
      showToast("Your action was completed successfully.", "Done", "success")
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
    const instructions = language === "fr" ? (homeBaseData ? 
                         homeBaseData.CREATION_HELP.GoldenA+
                         homeBaseData.CREATION_HELP.GoldenB+
                         homeBaseData.CREATION_HELP.GoldenC+
                         homeBaseData.CREATION_HELP.GoldenD+
                         homeBaseData.CREATION_HELP.NOTE:
                         competitionText.GOLDEN_A+ 
                         competitionText.GOLDEN_B+ 
                         competitionText.GOLDEN_C+ 
                         competitionText.GOLDEN_D+ 
                         competitionText.NOTE) : 
                         (homeBaseData ? 
                          homeBaseData.CREATION_HELP.GoldenA_EN+
                          homeBaseData.CREATION_HELP.GoldenB_EN+
                          homeBaseData.CREATION_HELP.GoldenC_EN+
                          homeBaseData.CREATION_HELP.GoldenD_EN+
                          homeBaseData.CREATION_HELP.NOTE_EN:
                          competitionText.GOLDEN_A_EN+ 
                          competitionText.GOLDEN_B_EN+ 
                          competitionText.GOLDEN_C_EN+ 
                          competitionText.GOLDEN_D_EN+ 
                          competitionText.NOTE_EN)
    return instructions;                         
  } 

  const handleNext = () => step < totalSteps && setStep(step + 1);
  const handleBack = () => step > 1 && setStep(step - 1);

  const handleSubmit = () => {
    const errorMessage: Record<string, string> = {
      name: t("mycompetition.competition.creations_screen.errors.name"),
      description: t("mycompetition.competition.creations_screen.errors.description"),
      type: t("mycompetition.competition.creations_screen.errors.type"),
      topic: t("mycompetition.competition.creations_screen.errors.topic"),
      registration_deadline: t("mycompetition.competition.creations_screen.errors.registration_deadline"),
      date: t("mycompetition.competition.creations_screen.errors.date"),
      entryFee: t("mycompetition.competition.creations_screen.errors.entryFee"),
      winnerPrice: t("mycompetition.competition.creations_screen.errors.winnerPrice"),
      questionsNbr: t("mycompetition.competition.creations_screen.errors.questionsNbr"),
      lang: t("mycompetition.competition.creations_screen.errors.lang")
    };
  
    let errors: string | null = null;
    let updatedData = { ...formData };

    updatedData.isManagedByIA = useIA;
    updatedData.isPublic = isPublic;
    updatedData.minUsers = MIN_PARTICIPANTS;
   
    updatedData.registration_deadline = actionType == "UPDATE" ? updatedData.registration_deadline.toISOString(): updatedData.registration_deadline;
    updatedData.date = actionType== "UPDATE" ? updatedData.date.toISOString(): updatedData.date;

    if (new Date(updatedData.registration_deadline) >= new Date(updatedData.date)) {
      errors = t("mycompetition.competition.creations_screen.errors.subErrors.date");
    }


    // --- VALIDATION maxUsers ---
    if (Number(maxUsers) <= MAX_PARTICIPANTS && Number(maxUsers) >= MIN_PARTICIPANTS) {
      updatedData.maxUsers = Number(maxUsers);
    } else {
      errors = t("mycompetition.competition.creations_screen.errors.subErrors.maxUsers", {
        MAX_PARTICIPANTS: MAX_PARTICIPANTS,
        MIN_PARTICIPANTS: MIN_PARTICIPANTS
      });
    }
  
    // --- VALIDATION questionNbr ---
    if (Number(questionNbr) <= MAX_QUESTION_NUMBER && Number(questionNbr) >= MIN_QUESTION_NUMBER) {
      updatedData.questionsNbr = Number(questionNbr);
    } else {
      errors = t("mycompetition.competition.creations_screen.errors.subErrors.questions", {
        MAX_QUESTION_NUMBER: MAX_QUESTION_NUMBER,
        MIN_QUESTION_NUMBER: MIN_QUESTION_NUMBER
      });
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
      updatedData.username = user?.surname + " " + user?.username;
      updatedData.isExamBoostCompetition = isExamBoostCompetition;
      dispatch(createCompetition(updatedData))
    }else{
      updatedData.isExamBoostCompetition = isExamBoostCompetition;
      dispatch(update(updatedData))
    }
  };

  function canUseIA(): boolean{
    if(isSuperAdmin) return true;

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
    setIsFirstCalendarOpen(field === "date");
    setCurrentField(field);
    setShowDatePicker(true);
  };

  return (
    
    <KeyboardAvoidingView 
          className="flex-1 bg-gray-50 pt-[40px] w-full max-w-full  pb-[50px] px-4"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}       
    >
      <TouchableOpacity
        className="flex-row items-center mb-4"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#181c5c" />
        <Text className="ml-2 text-lg font-semibold text-gray-800">
          {t('mycompetition.back')}
        </Text>
      </TouchableOpacity>

      {/* 🏆 Header stylé */}
      <View className="bg-[#181c5c] py-10 px-6 rounded-3xl items-center shadow-lg">
        <Ionicons name="trophy" size={50} color="#ffb347" />
        <Text className="text-white text-3xl font-bold mt-2">
          {
            actionType == "CREATE" ?  t(TextEnum.competition_create_head) : t(TextEnum.competition_update_head) 
          }
        </Text>
        <Text className="text-gray-200 text-sm mt-1 ">
        {
            actionType == "CREATE" ?   t(TextEnum.competititon_create_body) : t(TextEnum.competition_update_body) 
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
          {t('mycompetition.competition.creations_screen.step')} {step} / {totalSteps}
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
              <Text className="mb-1 font-semibold">
              {t('mycompetition.competition.creations_screen.model.nom')}
              </Text>
              <TextInput
                className="border border-gray-300 p-2 rounded mb-4"
                placeholder="Ex: Hackathon 2025"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
              />

              <Text className="mb-1 font-semibold">
              {t('mycompetition.competition.creations_screen.model.description.label')}
              </Text>
              <TextInput
                className="border border-gray-300 p-2 rounded mb-4"
                multiline
                placeholder={t('mycompetition.competition.creations_screen.model.description.placeholder')}
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
              />

              <Text className="mb-1 font-semibold">{t("mycompetition.competition.creations_screen.model.theme")} </Text>
              <TextInput
                className="border border-gray-300 p-2 rounded mb-4"
                placeholder="Ex: Intelligence Artificielle"
                value={formData.topic}
                onChangeText={(text) =>
                  setFormData({ ...formData, topic: text })
                }
              />

              <Text className="mb-1 font-semibold">{t('mycompetition.competition.creations_screen.model.date')} (GMT +1)</Text>
              <TouchableOpacity
                className="border border-gray-300 p-3 rounded mb-4 flex-row items-center"
                onPress={() => openCalendar("date")}
              >
                <Ionicons name="calendar" size={20} color="#181c5c" />
                <Text className="ml-2 text-gray-700">
                  { formData.date && formatCameroonDate(formData.date)}
                </Text>
              </TouchableOpacity>

              {showDatePicker && isFirstCalendarOpen && (
                  <DateTimePicker
                    value={formData[currentField] || new Date()}
                    mode="datetime"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}

              <Text className="mb-1 font-semibold mt-[10px]">
              {t('mycompetition.competition.creations_screen.model.deadlineDate')} (GMT +1)
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
                {/* Affichage du calendrier */}
                {showDatePicker && !isFirstCalendarOpen && (
                  <DateTimePicker
                    value={formData[currentField] || new Date()}
                    mode="datetime"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}

              {/* Nombre max d'utilisateurs */}
            
                          <Text className="mb-1 font-semibold mt-[10px]">
                          {t('mycompetition.competition.creations_screen.model.maxUsers')} (max: {MAX_PARTICIPANTS}, min: {MIN_PARTICIPANTS})
                          </Text>
                          <TextInput
                            keyboardType="numeric"
                            placeholder="Max participants"
                            value={maxUsers.toString()}
                            onChangeText={(text) => setMaxUsers(Number(text))}
                            editable = {actionType == "CREATE" ||( actionType == "UPDATE") && !useIA && type != "PAID_REGISTRATION_AS_WINNER_PRICE"}
                            className="border border-gray-300 p-2 rounded mb-4"
                          />

                
            </View>
          )}

          {/* === ÉTAPE 2 === */}
          {step === 2 && (
            <View>
              {/* Select type competition */}
              <Text className="mb-1 font-semibold">
              {t('mycompetition.competition.creations_screen.model.porte.label')}  
              </Text>
              <Picker
                selectedValue={isPublic}
                onValueChange={(itemValue) => setCompetitionType(itemValue)}
                className="border border-gray-300 p-2 rounded mb-4"
              >
                <Picker.Item label={t('mycompetition.competition.creations_screen.model.porte.private')} value={false} />
                <Picker.Item label={t('mycompetition.competition.creations_screen.model.porte.public')} value={true} />
              </Picker>

            {
              (actionType !== "UPDATE") && (
                <View>
                  <Text className="mb-1 font-semibold">
                    Type 
                  </Text>
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

            

              <Text className="mb-1 font-semibold">Lang</Text>
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

        


           {/*Etape 3*/}
           {
            step === 3 && (
              <View>

                 {/* Montant d'inscription */}
              {
                type != "TOTAL_FREE_NO_PRICE_TO_WIN" && type != "FREE_REGISTRATION_WITH_WINNER_PRICE" && (
                  <View>
                    <Text className="mb-1 font-semibold">{t('mycompetition.competition.creations_screen.model.entryFee')} (credits)</Text>
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
                type === "PAID_REGISTRATION_AS_WINNER_PRICE" && (
                    <View>
                        <Text className="mb-1 font-semibold">{t('mycompetition.competition.creations_screen.model.winnerPrice')} (credits) ({percentage + '%'}) </Text>
                        <TextInput
                          keyboardType="numeric"
                          placeholder={t(`mycompetition.competition.creations_screen.model.montant_min`, {amount: minWinnerPrice})}
                          value={"(("+ entryFee.toString() + " x " + maxUsers.toString() + ") x " + percentage + ")/ 100"  + " = " + displayedWinnerPrice.toString()}
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
                type != "TOTAL_FREE_NO_PRICE_TO_WIN" &&  type != "PAID_REGISTRATION_AS_WINNER_PRICE" && (
                    <View>
                        <Text className="mb-1 font-semibold">{t('mycompetition.competition.creations_screen.model.winnerPrice')} (credits) ({percentage + '%'}) </Text>
                        <TextInput
                          keyboardType="numeric"
                          placeholder={t(`mycompetition.competition.creations_screen.model.montant_min`, {amount: minWinnerPrice})}
                          // value={winnerPrice.toString()}
                          onChangeText={(text) =>
                            !usePercentage && setWinnerPrice(Number(text)) && canUseIA() ? setUseIA(true) : setUseIA(false)
                          }
                          className="border border-gray-300 p-2 rounded mb-4"
                          editable={!usePercentage || actionType=="CREATE"} // readonly si on utilise le pourcentage
                        />
                    </View>
                    
                ) 
              }

              {/* {
                 type != "TOTAL_FREE_NO_PRICE_TO_WIN" && (
                 <View>
                    <Text className="mb-1 font-semibold">{t('mycompetition.competition.creations_screen.model.finalPrice')} (credits) </Text>
                    <TextInput
                      keyboardType="numeric"
                      placeholder={t(`mycompetition.competition.creations_screen.model.montant_min.${minWinnerPrice}`)}
                      value={((displayedWinnerPrice*percentage)/100).toString()}
                      onChangeText={(text) =>
                        !usePercentage && setWinnerPrice(Number(text))
                      }
                      className="border border-gray-300 p-2 rounded mb-4"
                      editable={false} // readonly si on utilise le pourcentage
                  />
                 </View>
                  
              )
              } */}

              

                <Text className="mb-1 font-semibold">{t('mycompetition.competition.creations_screen.model.nombreMaxQts')} (max: {MAX_QUESTION_NUMBER}, min: {MIN_QUESTION_NUMBER}) </Text>
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
                    <Text className="ml-2">{t('mycompetition.competition.creations_screen.model.isManagedByIA')}</Text>
                  </View>
                )}

                {
                  isSuperAdmin && (
                    
                    <View className="flex-row items-center mb-4">
                      <Switch value={isExamBoostCompetition} onValueChange={()=> setIsExamBoostCompetition(true)} />
                      <Text className="ml-2">{t('mycompetition.competition.creations_screen.model.isExamBoostCompetition')}</Text>
                    </View>
                  )
                }
              </View>

            )

          }

          {/* Navigation */}
          <View className="flex-row justify-between mt-6">
            {step > 1 && (
              <TouchableOpacity
                className="bg-gray-400 px-4 py-2 rounded w-[40%]"
                onPress={handleBack}
              >
                <Text className="text-white text-center ">{t('mycompetition.competition.creations_screen.previous')}</Text>
              </TouchableOpacity>
            )}

            {step < totalSteps ? (
              <TouchableOpacity
                className="bg-[#181c5c] px-4 py-2 rounded w-[40%]"
                onPress={handleNext}
              >
                <Text className="text-white text-center">{t('mycompetition.competition.creations_screen.next')}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="bg-[#ff894f] px-4 py-2 rounded max-w-[45%] w-[45%] justify-center items-center"
                onPress={handleSubmit}
              >
                <Text className="text-white font-semibold">
                    {
                      actionType == "CREATE" ? t(TextEnum.competition_create_btn_text ) : t(TextEnum.competition_update_btn_text) 
                    }
                </Text>
              </TouchableOpacity>
            )}
          </View>
         
        </View>

          <FullscreenLoader visible={loading} />
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
