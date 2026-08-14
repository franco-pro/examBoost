import { LanguageContext } from "@/app/context/LanguageProvider";
import DialogDelete from "@/app/helper/Dialogs/delete";
import InvitationPrompts from "@/app/helper/Dialogs/invitation";
import FullscreenLoader from "@/app/helper/Dialogs/loaderFullScreen";
import { setActionDoneNULL, setSuscriptionErrorNULL } from "@/app/hooks/redux/competitions-suscriptions/subscription.slice";
import { createSubscription } from "@/app/hooks/redux/competitions-suscriptions/subscription.thunks";
import { setCompetitioErrorNull, setSelectedCompetitionNull, updateSelectedCompetition, updateStatut, updateSuscribers } from "@/app/hooks/redux/competitions/competitions.slice";
import { deleteOne } from "@/app/hooks/redux/competitions/competitions.thunks";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { resetRoomState, setErrorType, setRoomsErrorNull, setWaitingJoinin } from "@/app/hooks/redux/rooms/rooms.slice";
import { fetchRoomCreate } from "@/app/hooks/redux/rooms/rooms.thunks";
import Competition from "@/app/hooks/services/competitions/competition.entity";
import { EmitEvent, initializeRoomsGateway } from "@/app/hooks/services/socket/rooms.gateway";
import { DialogText } from "@/app/hooks/services/text.enum";
import { useSoundAud } from "@/app/hooks/useSound.hook";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { RootState } from "../hooks/redux/store";
import { useSelector } from "react-redux";
import { toastConfig } from "../config/toast.config";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Information() {
  const router = useRouter();
  const { user, accessToken, others } = useSelector(
    (state: RootState) => state.user
  );
  const userId = user && user.id ? user.id: 0;
  const email= user?.email;
  const phone= user?.phone;
  const username = user?.username;
  const { t, i18n } = useTranslation("competition"); // <- hook i18n
  const language = i18n.language;

  const {selectedCompetition, loading, error: errorCompetition} = useAppSelector((state)=>state.competitions);
  const {waitingLaunching, room, error, waitingJoining, errorType} = useAppSelector((state)=> state.rooms);
  const {error: errorSuscription, loading: suscriptionLoading, actionDone} = useAppSelector((state)=> state.subscriptions);

  const [competitionLaunch, setCompetitionLaunch] = useState(false);
  const [joinAs, setJoininStatut] = useState<"spectator"|"participant"|"admin"|null>(null);

  
  const [showModal, setShowModal] = useState(false);

  const dispatch = useAppDispatch();
  const [isDeleteOpen, setDeleteIsOpen] = useState(false)
  const {stop}= useSoundAud();
  
  const isCreator = userId === selectedCompetition?.creatorID;

  // Esce que l'utilisateur est inscrit ? (retourne true ou false)
  const isSubscribed = selectedCompetition?.suscribers?.some(user => user.id === userId);
  
  // La compétition est elle ouverte aux inscriptions ?
  const canStillRegister = selectedCompetition?.registration_deadline && 
                           new Date(selectedCompetition.registration_deadline) >= new Date() &&
                           selectedCompetition?.statut !== "ONGOING";

  const DialogDeleteText = DialogText;

  const colors = {
    defaultBlue: "#181c5c",
    defaultOrange: "#ff894f",
  };

  const onLeavingPageCallback = useCallback(() => {
    if(error) dispatch(setRoomsErrorNull());
    if(errorCompetition) dispatch(setCompetitioErrorNull());
    if(errorSuscription) dispatch(setSuscriptionErrorNULL());
    if(errorType) dispatch(setErrorType(null));
  
    dispatch(setActionDoneNULL());
    dispatch(setSelectedCompetitionNull())
    dispatch(setWaitingJoinin(false));
  }, [
    errorCompetition,
    errorSuscription,
    errorType
  ]);

  useFocusEffect(
    useCallback(()=>{
      stop();
      if(actionDone && !errorSuscription){
          showToast(t("mycompetition.information.success.subscriptionDone"), "Success", "success");
           dispatch(updateSuscribers(
            {
              competitionID: selectedCompetition ? selectedCompetition.id: 0,
              newSuscriber: {
                id: userId,
                email: email,
                phone: phone,
                username: username
              }
            }
           ));
          showToast(t("mycompetition.information.success.subscriptionDone"), "Success", "success");
             setTimeout(() => {
                router.back();
           }, 1000);

      }else{
        if(errorSuscription){
          showToast(errorSuscription, "Error", "error");
          router.back();

        }
      }


      return ()=>{
               onLeavingPageCallback()
            }
    }, [actionDone, onLeavingPageCallback])
  )

  useEffect(()=>{
    if(!waitingLaunching && room && competitionLaunch){
      dispatch(updateSelectedCompetition({statut: "ONGOING", roomId: room.roomId}));
      dispatch(updateStatut({statut: "ONGOING", competitionID: selectedCompetition ? selectedCompetition.id: 0, roomId: room.roomId}));
      
      showToast(t("mycompetition.information.success.competition_launched"), "Succès", "success");
    }

    if(error){
      showToast(error, "Error", "error");
    }
    
    if(errorCompetition){
      showToast(errorCompetition, "Error", "error");
    }  

    if(errorSuscription) showToast(errorSuscription, "Error", "error");

  }, [selectedCompetition, waitingLaunching, error, errorCompetition, errorSuscription])

  useEffect(()=>{
    if(!waitingJoining){
      if(error && errorType){
        showToast(error, "Error A", "error")
      }else {
        if(room && !error){
          if(joinAs =="participant") router.replace("/competitions-screen/online.users");
          if(joinAs == "admin") router.replace("/competitions-screen/owner.online");
          if(joinAs == "spectator") router.replace("/competitions-screen/viewer.online");
        }
      }
    }
     
    
  }, [waitingJoining])

  function deleteCompetition(competitionID: number){
      if(competitionID){
        if(selectedCompetition?.suscribers && selectedCompetition?.suscribers.length > 0 &&
          (selectedCompetition?.type !== "TOTAL_FREE_NO_PRICE_TO_WIN" && selectedCompetition?.type !== "FREE_REGISTRATION_WITH_WINNER_PRICE")
         ){
          dispatch(deleteOne(competitionID))
          router.back();
      }else{
        //show toast impossible de supprimer une competition ayant des inscrit qui ont payé pour l'inscription
        showToast(t("mycompetition.information.errors.competition_delete_error"), "Error", "error");
      }
  }
}

  function goToUpdatePage(competitionData: Competition){
    // console.log('competition registration deadline ', new Date(competitionData.registration_deadline).toLocaleString("fr-FR",{timeZone: "Africa/douala"}));
    // console.log('now', new Date())
    // console.log('comparation', new Date(competitionData.registration_deadline) >= new Date())
   if(competitionData){
        router.replace({
          pathname: "./createCompetition",
          params: { data: JSON.stringify(competitionData) } 
        })
    }
  }

  function observeCompetition(){
    if(selectedCompetition && selectedCompetition.roomID){
      setJoininStatut("spectator")
      initializeRoomsGateway(dispatch, null, userId)
      const eventManager = EmitEvent(dispatch, {isManagedByIA: selectedCompetition?.isManagedByIA as any, roomId: selectedCompetition?.roomID ?? room?.roomId as any});
      eventManager.joinAsSpectator({
        userID: userId,
        username: username ? username:"",
        appLang: (language as any)
      });
    }
     
  }


  function adminJoinCompetition(){

   if(selectedCompetition && selectedCompetition.roomID){
        setJoininStatut("admin")
        initializeRoomsGateway(dispatch, room, userId)
        const eventManager = EmitEvent(dispatch, {isManagedByIA: selectedCompetition?.isManagedByIA as any, roomId: selectedCompetition?.roomID ?? room?.roomId  as any});
        eventManager.joinRoom({
          roomId: selectedCompetition?.roomID as any,
          userID: userId,
          appLang: language as any,
          username: username ? username:"Dems",
          imgUrl: user ? user.imgUrl: "https://i.ibb.co/7R4DyhQ/Avatar-1.jpg",
          surname: user ? user.surname : "",
          role: "manager"
        })
     }

}

function userJoinCompetition(){

  if(selectedCompetition && selectedCompetition.roomID){
    setJoininStatut("participant");

    initializeRoomsGateway(dispatch, null, userId)
  
    const eventManager = EmitEvent(dispatch, {isManagedByIA: selectedCompetition?.isManagedByIA as any, roomId: selectedCompetition?.roomID as any});
    eventManager.joinRoom({
      roomId: selectedCompetition?.roomID as any,
      userID: userId,
      appLang: (language as any),
      username: username ? username:"Dems",
      imgUrl: user ? user.imgUrl: "https://i.ibb.co/7R4DyhQ/Avatar-1.jpg",
      surname: user ? user.surname : "",
      role: "participant"
    })

  }
  
    
 }


 async function startCompetition(){
    if( selectedCompetition?.suscribers && 
        selectedCompetition?.suscribers.length < selectedCompetition?.maxUsers &&
        selectedCompetition.isManagedByIA && 
        selectedCompetition.type == "PAID_REGISTRATION_AS_WINNER_PRICE"){
          showToast(t("mycompetition.information.errors.participantNbr_not_reached"), "Error", "error");
          return;
    }else{
          try {
      dispatch(resetRoomState())
      dispatch(fetchRoomCreate(
        {
          name: selectedCompetition ? selectedCompetition.name : "Competition Room",
          competitionID: selectedCompetition ? selectedCompetition.id: 0,
          topic: selectedCompetition ? selectedCompetition.topic : "",
          userID: userId,
          isManagedByIA : selectedCompetition ? selectedCompetition.isManagedByIA : false
        }
      ));
      setCompetitionLaunch(true);
    } catch (error: any) {
      console.log('error on starting competition', error.message);
    }
    }
    
  }

  function seeResult(){
    console.log('see result competition', selectedCompetition?.roomID)
    console.log('see result room', room?.roomId)

    router.replace({
      pathname: "./seeResult",
      params: {
        roomID: selectedCompetition ? selectedCompetition?.roomID : room?.roomId
      }
    })
  }

  function registerToCompetition(){
     const data = {
        userID: userId,
        competitionID: selectedCompetition ? selectedCompetition.id: 0,
        score: 0,
        suscribeFromInvitation: false
     } as any;

     dispatch(createSubscription(data));
  }
  

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
    <SafeAreaView className="flex-1 bg-gray-50 pt-[40px] pb-[10px] px-4" edges={["bottom"]}>
      {/* Bouton Retour */}
      <TouchableOpacity
        className="flex-row items-center mb-6"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.defaultBlue} />
        <Text className="ml-2 text-lg font-semibold text-gray-800">{t("mycompetition.back")} </Text>
      </TouchableOpacity>


      {selectedCompetition && userId === selectedCompetition.creatorID &&
        selectedCompetition.isPublic === false &&
        new Date(selectedCompetition.registration_deadline) >= new Date() && (
          <TouchableOpacity 
          className="flex-row items-center mb-2 bg-primary-defaultBlue self-start px-4 py-2 rounded-full ml-auto"
          onPress={()=> setShowModal(true)}
          >
            <Text className="text-white text-sm font-semibold mr-2">
              {t("mycompetition.information.invite.label")}
            </Text>
            <Ionicons name="send" size={22} color="#ffffff" />
          </TouchableOpacity>
        )}

        <InvitationPrompts 
            isOpen={showModal} 
            onClose={()=> setShowModal(false)} 
            competitionDetails={{id: selectedCompetition ? selectedCompetition.id: 0, name: selectedCompetition ? selectedCompetition.name : ""}}
            userDetails={{id: userId, username: (user?.surname ?? "")+ " " + username}}
        />

      {/* --- Première carte avec dégradé --- */}
      <LinearGradient
        colors={[colors.defaultBlue, colors.defaultOrange]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-6 rounded-2xl mb-5 mt-5 shadow-lg items-center"
        style={{ minHeight: 255, borderRadius: 30 }}
      >
         {/* Boutons edit / delete en haut à droite */}
          {selectedCompetition && selectedCompetition?.creatorData.id === userId && (
            <HStack style={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}>
              <Button
                className={
                  "mb-2 rounded-2xl " +
                  (selectedCompetition.statut !== "UPCOMING" ? "" : "bg-primary-defaultBlue")
                }
                disabled={selectedCompetition.statut !== "UPCOMING"}
                onPress={() => goToUpdatePage(selectedCompetition)}
              >
                <ButtonText size="sm" className="text-typography-white">
                  <Ionicons name="pencil" size={22} color={"#fffff"} />
                </ButtonText>
              </Button>

              <Button
                action="negative"
                className="ml-2 rounded-2xl "
                disabled={selectedCompetition.statut !== "UPCOMING"}
                onPress={() => setDeleteIsOpen(true)}
              >
                <ButtonText size="sm" className="text-typography-white">
                  <Ionicons name="trash" size={22} color={"#fffff"} />
                </ButtonText>
              </Button>

              <DialogDelete
                isOpen={isDeleteOpen}
                onClose={() => setDeleteIsOpen(false)}
                onConfirm={() => deleteCompetition(selectedCompetition.id)}
                bodyText={t(DialogDeleteText.competition_delete_body)}
                headText={t(DialogDeleteText.competition_delete_head)}
                isLoading={loading}
              />
            </HStack>
          )}

          <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center mb-4">
            <Ionicons name="code-slash-outline" size={40} color="white" />
          </View>

          <Text className="text-2xl font-bold text-center text-white mb-2">
            {selectedCompetition?.name}
          </Text>

         <View className="h-[65px] max-h-[65px] justify-center text-center m-3 ">
          <ScrollView>
          <Text className="text-typography-white text-center mb-4 ">
           {selectedCompetition?.description}
           </Text>
          </ScrollView>
          
        </View>

        <Text className="text-center text-white">
          <Text className="font-semibold">{t("mycompetition.competition.creations_screen.model.theme")} :</Text> {selectedCompetition?.topic}
        </Text>
      

        <View className="border-t border-white/30 my-3 w-full" />

       
        <Text className="text-center text-white">
          <Text className="font-semibold">Lang :</Text> {selectedCompetition?.language}
        </Text>
        <Text className="text-center text-white">
          <Text className="font-semibold">{t("mycompetition.information.totalQuestion")} :</Text> {selectedCompetition?.questionsNbr}
        </Text>
        <Text className="text-center text-white mt-2 mb-3">
          <Text className="font-semibold">Date :</Text>{" "}
          {selectedCompetition?.date && new Date(selectedCompetition.date).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </LinearGradient>

      {/* --- Deuxième carte : Détails rapides --- */}
      {/* <ScrollView className="h-[300px] max-h-[100%]"> */}
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>

      <View className="bg-white rounded-2xl py-4 px-5 mt-2 shadow-md border border-gray-100">
        <Text
          className="text-lg font-semibold mb-3"
          style={{ color: colors.defaultBlue }}
        >
            {t("mycompetition.information.competitionDetails")}
        </Text>

        <View className="flex-row justify-between mb-3">
          <View className="flex-row items-center">
            <Ionicons
              name="person-circle-outline"
              size={22}
              color={colors.defaultBlue}
            />
            <Text className="ml-2 text-gray-700 font-medium">
              {
                selectedCompetition?.isExamBoostCompetition ? "ExamBoost":selectedCompetition?.creatorData.surname + " " + selectedCompetition?.creatorData.username
              }
            </Text>
            {
                selectedCompetition?.isExamBoostCompetition && <Text><Ionicons name="checkmark-circle" size={16} color="blue" /></Text>
            }
          </View>

          <View className="flex-row items-center">
            <Ionicons
              name="trophy-outline"
              size={22}
              color={colors.defaultOrange}
            />
            {
              selectedCompetition?.type === "FREE_REGISTRATION_WITH_WINNER_PRICE" || selectedCompetition?.type === "PAID_REGISTRATION_WITH_WINNER_PRICE" ? 
              (
                <Text className="ml-2 text-gray-700 font-medium">
                  {selectedCompetition?.winnerPrice.toLocaleString("fr-FR")} U
                 </Text>
              ) : selectedCompetition?.type == "PAID_REGISTRATION_AS_WINNER_PRICE" ? 
                (
                  <Text className="ml-2 text-gray-700 font-medium">
                    {selectedCompetition?.winnerPrice.toLocaleString("fr-FR") + " x " + selectedCompetition?.suscribers.length} U
                  </Text>
                ): (
                  <Text className="ml-2 text-gray-700 font-medium">
                      00 U
                 </Text>
                )
            }
          
          </View>
        </View>

    

        <View className="flex-row justify-between">
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={20} color="#2e86de" />
            <Text className="ml-2 text-gray-700">
              {selectedCompetition?.date && new Date(selectedCompetition.date).toLocaleDateString(
                "fr-FR",
                { day: "2-digit", month: "long", year: "numeric" }
              )}
            </Text>
          </View>

          <View className="flex-row items-center">
            {
              selectedCompetition?.statut == "UPCOMING" && (
                <Ionicons
                name="timer"
                size={20}
                color="#10b981"
              />
              )
            }

            {
              selectedCompetition?.statut == "CANCELLED" && (
                <Ionicons
                name="close"
                size={20}
                color="#10b981"
              />
              )
            }

            {
              selectedCompetition?.statut == "COMPLETED" && (
                  <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="#10b981"
                />
              )
            }

            {
              selectedCompetition?.statut != "ONGOING" ? (
                <View>
                    <Text className="ml-2 text-gray-700">{t(`participation.labels.status.${selectedCompetition?.statut}`)}</Text>
                </View>
              ) :(
                <View className="rounded-full px-3 py-1  bg-yellow-200">
                    <Text className="ml-2 text-gray-700 ">{t(`participation.labels.status.${selectedCompetition?.statut}`)}</Text>

                </View>
              )
            }
            
          </View>


        </View>

        <View className="flex-row justify-between mt-3">
            
        <View className="flex-row items-center">
            <Ionicons name="book" size={20} color="#2e86de" />
            <Text className="ml-2 text-gray-700">
            {t("mycompetition.competition.online_game.question_manager")}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Text className="ml-2 text-gray-700">{selectedCompetition?.isManagedByIA ? 'Genesys-IA':'OWNER'}</Text>
          </View>


        </View>
        
      </View>
        {/* --- Troisième carte : Informations supplémentaires --- */}
        <View className="mt-5 bg-white rounded-2xl p-4 shadow-md border border-gray-100 mb-3">
          <View className="flex-row justify-between items-center">
          <View className="flex-row items-center mb-3">
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={colors.defaultBlue}
            />
            <Text
              className="ml-2 text-lg font-semibold"
              style={{ color: colors.defaultBlue }}
            >
                   {t("mycompetition.information.more_info")}
            </Text>
          </View>
          
          </View>

          <View className="border-t border-gray-200 " />

          <View className="mt-2 space-y-3">
            {/* Chaque ligne d'infos sous forme de row */}
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Ionicons
                  name="cash-outline"
                  size={20}
                  color={colors.defaultOrange}
                />
                <Text className="ml-2 text-gray-700">
                {t("mycompetition.information.participationFee")}

                </Text>
              </View>
              <Text className="font-semibold text-gray-800">
                {(Number(selectedCompetition?.entryFee === 0) || !selectedCompetition?.entryFee)
                  ? t("mycompetition.information.free")
                  : `${selectedCompetition?.entryFee.toLocaleString("fr-FR")} U`}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Ionicons
                  name="people-outline"
                  size={20}
                  color={colors.defaultBlue}
                />
                <Text className="ml-2 text-gray-700">
                {t("mycompetition.information.min_participants")}
                </Text>
              </View>
              <Text className="font-semibold text-gray-800">
                {selectedCompetition?.minUsers}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Ionicons
                  name="people-circle-outline"
                  size={20}
                  color={colors.defaultOrange}
                />
                <Text className="ml-2 text-gray-700">
                  {t("mycompetition.information.max_participants")}

                </Text>
              </View>
              <Text className="font-semibold text-gray-800">
                {selectedCompetition?.maxUsers}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Ionicons
                  name="document"
                  size={20}
                  color={colors.defaultOrange}
                />
                
                <Text className="ml-2 text-gray-700">
                  
                  {
                    selectedCompetition?.statut == "UPCOMING" ? 'Déjà inscrits':'Inscrits'
                  }
                </Text>
              </View>
              <Text className="font-semibold text-gray-800">
                {selectedCompetition?.suscribers.length}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
                <Ionicons
                   name="calendar-outline"
                  size={20}
                  color={colors.defaultOrange}
                />
                <Text className="ml-2 text-gray-700">Deadline</Text>
              </View>
            <Text className="ml-2 text-gray-700">
              {selectedCompetition?.registration_deadline && new Date(selectedCompetition.registration_deadline).toLocaleDateString(
                "fr-FR",
                {
                  timeZone: "Africa/douala",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </Text>
          </View>
          </View>
        </View>

              {/* Bouton Supprimer - à gauche */}
         <ScrollView 
            horizontal={true} 
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="flex-row items-center gap-4 pr-8 pl-4"
          >

          {(user?.role.toLowerCase() === "superadmin") &&
            (selectedCompetition?.statut === "UPCOMING" || selectedCompetition?.statut === "CANCELLED") && (
              <TouchableOpacity
                className="flex-row items-center bg-red-500 self-start px-4 py-2 rounded-full"
                onPress={() => setDeleteIsOpen(true)}
              >
                <Ionicons name="trash-outline" size={16} color="#ffffff" />
                <Text className="text-white text-xs font-semibold ml-2">Suppression Admin</Text>
              </TouchableOpacity>
            )}

          {canStillRegister && !isSubscribed && ((isCreator && selectedCompetition?.isManagedByIA) || (!isCreator)) && (
            <TouchableOpacity 
              className="flex-row items-center bg-primary-defaultBlue self-start px-4 py-2 rounded-full ml-auto" 
              onPress={() => registerToCompetition()}
            >
              <Text className="text-white text-xs font-semibold mr-2">
                {t("mycompetition.information.register_comp")}
              </Text>
              <Ionicons name="chevron-forward" size={22} color="#ffffff" />
            </TouchableOpacity>
          )}

          {isSubscribed && !errorType && selectedCompetition?.statut === "ONGOING" && !isCreator && (
            <TouchableOpacity 
              className="flex-row items-center bg-primary-defaultBlue self-start px-4 py-2 rounded-full ml-auto"
              onPress={() => userJoinCompetition()}
            >
              <Text className="text-white text-xs font-semibold mr-2">
                {t("mycompetition.information.join_comp")}
              </Text>
              <Ionicons name="chevron-forward" size={22} color="#ffffff" />
            </TouchableOpacity>
          )}

        {isSubscribed && !errorType && selectedCompetition?.statut === "ONGOING" && isCreator && selectedCompetition.isManagedByIA  && (
            <TouchableOpacity 
              className="flex-row items-center bg-primary-defaultBlue self-start px-4 py-2 rounded-full ml-auto"
              onPress={() => userJoinCompetition()}
            >
              <Text className="text-white text-xs font-semibold mr-2">
                {t("mycompetition.information.join_comp")}
              </Text>
              <Ionicons name="chevron-forward" size={22} color="#ffffff" />
            </TouchableOpacity>
          )}

          {isCreator && room && !waitingLaunching && !selectedCompetition.isManagedByIA && selectedCompetition?.statut === "ONGOING" && (
            <TouchableOpacity 
              className="flex-row items-center bg-green-600 self-start px-4 py-2 rounded-full ml-auto"
              onPress={() => adminJoinCompetition()}
            >
              <Text className="text-white text-xs font-semibold mr-2">
              {t("mycompetition.information.manage_competition")}
              </Text>
              <Ionicons name="settings-outline" size={22} color="#ffffff" />
            </TouchableOpacity>
          )}

          {isCreator && !waitingLaunching && !room && selectedCompetition?.statut === "UPCOMING" && (
            <TouchableOpacity 
              className="flex-row items-center bg-primary-defaultBlue self-start px-4 py-2 rounded-full ml-auto"
              onPress={() => startCompetition()}
            >
              <Text className="text-white text-xs font-semibold mr-2">
                {t("mycompetition.information.start_comp")}
              </Text>
              <Ionicons name="chevron-forward" size={22} color="#ffffff" />
            </TouchableOpacity>
          )}

          {(!isSubscribed || errorType === "USER_HAS_LEAVED_ROOM") && 
          (room || selectedCompetition?.roomID) && 
          selectedCompetition?.statut === "ONGOING" && ((isCreator && selectedCompetition?.isManagedByIA) || (!isCreator) ) && (
            <TouchableOpacity
              className="flex-row items-center bg-primary-defaultBlue self-start px-4 py-2 rounded-full ml-auto"
              onPress={() => observeCompetition()}
            >
              <Text className="text-white text-xs font-semibold mr-2">
                {t("mycompetition.information.look_comp")}
              </Text>
              <Ionicons name="eye-outline" size={22} color="#ffffff" />
            </TouchableOpacity>
          )}

          {/* 6. VOIR LES RÉSULTATS */}
          {selectedCompetition?.statut === "COMPLETED" && (
            <TouchableOpacity 
              onPress={() => seeResult()}
              className="flex-row items-center bg-primary-defaultBlue self-start px-4 py-2 rounded-full ml-auto"
            >
              <Text className="text-white text-xs font-semibold mr-2">
                {t("mycompetition.information.see_result")}
              </Text>
              <Ionicons name="chevron-forward" size={22} color="#ffffff" />
            </TouchableOpacity>
          )}

       </ScrollView>

      </ScrollView>
      <Toast config={toastConfig} />
      <FullscreenLoader visible={waitingLaunching || loading || waitingJoining || suscriptionLoading} />
     
      
    </SafeAreaView>
  );
}
