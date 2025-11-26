import DialogDelete from "@/app/helper/Dialogs/delete";
import InvitationPrompts from "@/app/helper/Dialogs/invitation";
import FullscreenLoader from "@/app/helper/Dialogs/loaderFullScreen";
import { setActionDoneNULL } from "@/app/hooks/redux/competitions-suscriptions/subscription.slice";
import { createSubscription } from "@/app/hooks/redux/competitions-suscriptions/subscription.thunks";
import { setSelectedCompetitionNull, updateSelectedCompetition, updateStatut, updateSuscribers } from "@/app/hooks/redux/competitions/competitions.slice";
import { deleteOne } from "@/app/hooks/redux/competitions/competitions.thunks";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { resetRoomState } from "@/app/hooks/redux/rooms/rooms.slice";
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
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Information() {
  const router = useRouter();
  const userId = 1;
  const email= "";
  const phone ="";
  const username = "";

  const {selectedCompetition, loading} = useAppSelector((state)=>state.competitions);
  const {waitingLaunching, room} = useAppSelector((state)=> state.rooms);
  const [competitionLaunch, setCompetitionLaunch] = useState(false);
  
  const {actionDone} = useAppSelector((state)=> state.subscriptions);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useAppDispatch();
  const [isDeleteOpen, setDeleteIsOpen] = useState(false)
  const { id } = useLocalSearchParams();
  const {stop}= useSoundAud();

  const DialogDeleteText = DialogText;
  const now = new Date().toLocaleString("fr-FR", {
    timeZone: "Africa/Douala",
  })
  const colors = {
    defaultBlue: "#181c5c",
    defaultOrange: "#ff894f",
  };

  useFocusEffect(
    useCallback(()=>{
      stop();

      if(actionDone){
          showToast("Inscription réussie !", "Succès");
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
          router.back();
      }

      return ()=>{
                console.log("execute 222")
                dispatch(setSelectedCompetitionNull());
                dispatch(setActionDoneNULL())
            }
    }, [actionDone])
  )

  useEffect(()=>{
    if(!waitingLaunching && room && !competitionLaunch){
      dispatch(updateSelectedCompetition("ONGOING"));
      dispatch(updateStatut("ONGOING"))
      showToast("Compétition demarrée !", "Succès");
    }
  }, [selectedCompetition, waitingLaunching])

  function deleteCompetition(competitionID: number){
      if(competitionID){
          dispatch(deleteOne(competitionID))
          router.back();
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
    if(room){
      initializeRoomsGateway(dispatch, room, userId)
      const eventManager = EmitEvent(dispatch, room);
      eventManager.joinRoom({
        roomId: room.roomId,
        userID: userId,
        username: username,
        imgUrl: "https://i.ibb.co/7R4DyhQ/Avatar-1.jpg",
        surname: "Dems",
        
      });
     router.replace("/pages/competitions-screen/viewer.online")
  }
  }


  function joinCompetition(){
    if(room){
      initializeRoomsGateway(dispatch, room, userId)
      const eventManager = EmitEvent(dispatch, room);
      eventManager.joinRoom({
        roomId: room.roomId,
        userID: userId,
        username: username,
        imgUrl: "https://i.ibb.co/7R4DyhQ/Avatar-1.jpg",
        surname: "Dems",
        
      })
      if(room.creatorID == userId){
        router.replace("/pages/competitions-screen/owner.online");
      }else{
        router.replace("/pages/competitions-screen/online.users");
      }
  }
}



 async function startCompetition(){

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
      ))
    } catch (error: any) {
      console.log('error on starting competition', error.message);
    }
    
  }

  function seeResult(){
    router.replace({
      pathname: "./seeResult",
      params: {
        id: selectedCompetition ? selectedCompetition.roomID : 0
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
  

  function showToast(message: string, title: string){
      Toast.show({
        type: 'success',
        text2: message,
        text1: title,
        position: 'top',
        visibilityTime: 3500,
      }) 
  }

  return (
    <View className="bg-gray-50 pt-[40px] pb-[100px] px-4">
      {/* Bouton Retour */}
      <TouchableOpacity
        className="flex-row items-center mb-6"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.defaultBlue} />
        <Text className="ml-2 text-lg font-semibold text-gray-800">Retour</Text>
      </TouchableOpacity>


      {selectedCompetition && userId === selectedCompetition.creatorID &&
        selectedCompetition.isPublic === false &&
        new Date(selectedCompetition.registration_deadline) >= new Date() && (
          <TouchableOpacity 
          className="flex-row items-center mb-2 bg-primary-defaultBlue self-start px-4 py-2 rounded-full ml-auto"
          onPress={()=> setShowModal(true)}
          >
            <Text className="text-white text-sm font-semibold mr-2">
              Inviter des participants
            </Text>
            <Ionicons name="send" size={22} color="#ffffff" />
          </TouchableOpacity>
        )}

        <InvitationPrompts isOpen={showModal} onClose={()=> setShowModal(false)} />

      {/* --- Première carte avec dégradé --- */}
      <LinearGradient
        colors={[colors.defaultBlue, colors.defaultOrange]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-6 rounded-2xl mb-5 mt-5 shadow-lg items-center"
        style={{ minHeight: 255, borderRadius: 30 }}
      >
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
          <Text className="font-semibold">Thème :</Text> {selectedCompetition?.topic}
        </Text>
      

        <View className="border-t border-white/30 my-3 w-full" />

       
        <Text className="text-center text-white">
          <Text className="font-semibold">Lang :</Text> {selectedCompetition?.language}
        </Text>
        <Text className="text-center text-white">
          <Text className="font-semibold">Questions Total :</Text> {selectedCompetition?.questionsNbr}
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
      <ScrollView className="max-h-[100%] h-[300px]">

      <View className="bg-white rounded-2xl py-4 px-5 mt-2 shadow-md border border-gray-100">
        <Text
          className="text-lg font-semibold mb-3"
          style={{ color: colors.defaultBlue }}
        >
          Détails du concours
        </Text>

        <View className="flex-row justify-between mb-3">
          <View className="flex-row items-center">
            <Ionicons
              name="person-circle-outline"
              size={22}
              color={colors.defaultBlue}
            />
            <Text className="ml-2 text-gray-700 font-medium">
              {selectedCompetition?.creatorData.username}
            </Text>
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
                  {selectedCompetition?.winnerPrice} XAF
                 </Text>
              ) : selectedCompetition?.type == "PAID_REGISTRATION_AS_WINNER_PRICE" ? 
                (
                  <Text className="ml-2 text-gray-700 font-medium">
                    {selectedCompetition?.winnerPrice + " x " + selectedCompetition?.suscribers.length} XAF
                  </Text>
                ): (
                  <Text className="ml-2 text-gray-700 font-medium">
                      00 XAF
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

            
            <Text className="ml-2 text-gray-700">{selectedCompetition?.statut}</Text>
          </View>


        </View>

        <View className="flex-row justify-between mt-3">
            
        <View className="flex-row items-center">
            <Ionicons name="book" size={20} color="#2e86de" />
            <Text className="ml-2 text-gray-700">
                Questions Manager
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
              Informations supplémentaires
            </Text>
          </View>
          {
            selectedCompetition?.creatorData.id === userId &&
             <HStack className="">
                <Button className={"mb-2 rounded-2xl " + (selectedCompetition.statut !== "UPCOMING" ? "": "bg-primary-defaultBlue") } disabled={selectedCompetition.statut !== "UPCOMING"} onPress={()=> goToUpdatePage(selectedCompetition)} >
                  <ButtonText size="sm" className='text-typography-white'>
                        <Ionicons
                            name="pencil"
                            size={22}
                            color={"#fffff"}
                          />
                  </ButtonText>
                </Button>

                <Button action="negative" className="ml-2 rounded-2xl" onPress={()=> setDeleteIsOpen(true)}>
                  <ButtonText size="sm" className='text-typography-white'>
                        <Ionicons
                            name="trash"
                            size={22}
                            color={"#fffff"}
                          />
                  </ButtonText>
                </Button>

                <DialogDelete isOpen={isDeleteOpen} 
                              onClose={() => setDeleteIsOpen(false)} 
                              onConfirm={() =>deleteCompetition(selectedCompetition.id)}
                              bodyText={DialogDeleteText.competition_delete_body}
                              headText={DialogDeleteText.competition_delete_head}
                              isLoading={loading}
                              />
          </HStack>
          }
          
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
                  Frais de participation
                </Text>
              </View>
              <Text className="font-semibold text-gray-800">
                {(selectedCompetition?.entryFee === 0 || !selectedCompetition?.entryFee)
                  ? "Gratuit"
                  : `${selectedCompetition?.entryFee} XAF`}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Ionicons
                  name="people-outline"
                  size={20}
                  color={colors.defaultBlue}
                />
                <Text className="ml-2 text-gray-700">Participants minimum</Text>
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
                <Text className="ml-2 text-gray-700">Participants maximum</Text>
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
                <Text className="ml-2 text-gray-700">Déjà inscrit</Text>
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


        {/* boutton pour rejoindre la competition pour un user n'etant pas son createur et si la date limite n'est pas atteinte */}
        {selectedCompetition?.registration_deadline && 
        new Date(selectedCompetition.registration_deadline) >= new Date() &&
        selectedCompetition.isPublic &&
          userId !== selectedCompetition?.creatorID &&
          selectedCompetition?.suscribers.filter((user, index) => {
            return user.id === userId;
          }).length === 0 && (
            <TouchableOpacity className="flex-row items-center bg-primary-defaultBlue self-start px-4 py-2 rounded-full ml-auto" onPress={()=>registerToCompetition()}>
              <Text className="text-white text-xs font-semibold mr-2">
                S'inscrire à la competition
              </Text>
              <Ionicons name="chevron-forward" size={22} color="#ffffff" />
            </TouchableOpacity>
          )}


      {userId === selectedCompetition?.creatorID &&
        room &&
        !waitingLaunching &&
        !selectedCompetition.isManagedByIA &&
        selectedCompetition?.statut === "ONGOING" &&
           (
            <TouchableOpacity 
              className="flex-row items-center bg-primary-defaultBlue self-start px-4 py-2 rounded-full ml-auto"
              onPress={()=> joinCompetition()}
            >
              <Text className="text-white text-xs font-semibold mr-2">
                Rejoindre la competition
              </Text>
              <Ionicons name="chevron-forward" size={22} color="#ffffff" />
            </TouchableOpacity>
          )}

        {/* boutton pour rejoindre la competition pour un user n'etant pas son createur et si le room est creee NB:j'ai pas mis la condition sur le room */}
        {userId !== selectedCompetition?.creatorID &&
        room &&
        selectedCompetition?.statut === "ONGOING" &&
          selectedCompetition?.suscribers.filter((user, index) => {
            return user.id === userId;
          }).length === 1 && (
            <TouchableOpacity 
              className="flex-row items-center bg-primary-defaultBlue self-start px-4 py-2 rounded-full ml-auto"
              onPress={()=> joinCompetition()}
            >
              <Text className="text-white text-xs font-semibold mr-2">
                Rejoindre la competition
              </Text>
              <Ionicons name="chevron-forward" size={22} color="#ffffff" />
            </TouchableOpacity>
          )}

        {/* {userId !== selectedCompetition?.creatorID && selectedCompetition?.statut === "UPCOMING" &&
          selectedCompetition?.suscribers.filter((user, index) => {
            return user.id == userId;
          }).length === 1 && (
            <TouchableOpacity className="flex-row items-center bg-primary-defaultBlue self-start px-4 py-2 rounded-full ml-auto">
              <Text className="text-white text-xs font-semibold mr-2">
                Annuler mon inscription
              </Text>
              <Ionicons name="chevron-forward" size={22} color="#ffffff" />
            </TouchableOpacity>
          )} */}

        {/* btn for user to observe the competition when he is not register */}
        {userId !== selectedCompetition?.creatorID && 
        room &&
        selectedCompetition?.statut === "ONGOING" &&
          selectedCompetition?.suscribers.filter((user, index) => {
            return user.id === userId;
          }).length === 0 && (
            <TouchableOpacity
             className="flex-row items-center bg-primary-defaultBlue self-start px-4 py-2 rounded-full ml-auto"
             onPress={()=> observeCompetition()}
             
             >
              <Text className="text-white text-xs font-semibold mr-2">
                Observer la competition
              </Text>
              <Ionicons name="chevron-forward" size={22} color="#ffffff" />
            </TouchableOpacity>
          )}

        {/* btn for admin to observe the competition when it managed by IA*/}
        {userId === selectedCompetition?.creatorID && 
        room &&
        !waitingLaunching &&
        selectedCompetition.isManagedByIA &&
        selectedCompetition?.statut === "ONGOING" &&
          selectedCompetition?.suscribers.filter((user, index) => {
            return user.id === userId;
          }).length === 0 && selectedCompetition?.isManagedByIA && (
            <TouchableOpacity 
            className="flex-row items-center bg-primary-defaultBlue self-start px-4 py-2 rounded-full ml-auto"
            onPress={()=> observeCompetition()}
            >
              <Text className="text-white text-xs font-semibold mr-2">
                Observer la competition
              </Text>
              <Ionicons name="chevron-forward" size={22} color="#ffffff" />
            </TouchableOpacity>
          )}

        {userId === selectedCompetition?.creatorID && 
        !waitingLaunching && 
        !room &&
        selectedCompetition?.statut === "UPCOMING"  && (
            <TouchableOpacity 
              className="flex-row items-center bg-primary-defaultBlue self-start px-4 py-2 rounded-full ml-auto"
              onPress={()=> startCompetition()}
            >
              <Text className="text-white text-xs font-semibold mr-2">
                Demarrer la competition
              </Text>
              <Ionicons name="chevron-forward" size={22} color="#ffffff" />
            </TouchableOpacity>
          )}

            {/* btn to look the result of competition */}
        {selectedCompetition?.statut == "COMPLETED" && (
            <TouchableOpacity className="flex-row items-center bg-primary-defaultBlue self-start px-4 py-2 rounded-full ml-auto">
              <Text className="text-white text-xs font-semibold mr-2">
                Voir les resultats
              </Text>
              <Ionicons name="chevron-forward" size={22} color="#ffffff" />
            </TouchableOpacity>
          )}

      <FullscreenLoader visible={waitingLaunching || loading} />
      </ScrollView>
    </View>
  );
}
