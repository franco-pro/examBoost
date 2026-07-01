import type { Notification } from '@/app/features/notifications/types';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';

import Toast from "react-native-toast-message";

import NotificationSwipeableItem from '@/app/features/notifications/NotificationSwipeableItem';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useAppSelector } from '../redux/redux.hooks';
import { useAppDispatch } from '../hooks/redux/redux.hooks';
import { deleteAllNotifications, deleteNotification, getNotification, loadAllNotification, setAsRead } from '../hooks/redux/notifications/notification.thunks';
import FullscreenLoader from '../helper/Dialogs/loaderFullScreen';
import { getOne } from '../hooks/redux/competitions/competitions.thunks';
import { EmitEvent, initializeRoomsGateway } from '../hooks/services/socket/rooms.gateway';
import { LanguageContext } from '../context/LanguageProvider';
import { createSubscription } from '../hooks/redux/competitions-suscriptions/subscription.thunks';
import InvitationConfirm from '../helper/Dialogs/invitationConfirm';
import { setAllNotifAsRead, updateBalanceUser } from '../hooks/redux/users/users.slice';
import { useSoundAud } from '../hooks/useSound.hook';
import { setCompetitioErrorNull } from '../hooks/redux/competitions/competitions.slice';
import { toastConfig } from '../config/toast.config';
import { useTranslation } from 'react-i18next';

export default function NotificationsScreen() {
  // brancher un  userID quand l'auth sera prête
  const {t} = useTranslation("notification");
  const {user} = useSelector((state: RootState) => state.user);
  const userID = user?.id ?? -1;
  const [loadDone, setLoadDone] = useState(false);
  const [isOpenConfirmation, setIsOpen]= useState(false);
  const {stop} = useSoundAud();
  const [btnActionType, setBtnActionType] = useState<"openDetails" | "acceptInvit" | "joinRoom" | "update">("openDetails");
  const {notifications:data, loading, error} = useAppSelector((state) => state.notifications);
  const {loading:competitionLoading, selectedCompetition, error:errorCompetition} = useAppSelector((state) => state.competitions);
  const {error:errorRoom, room, waitingJoining} = useAppSelector((state)=> state.rooms);
  const {loading: suscriptionLoading, error:suscriptionError} = useAppSelector((state)=> state.subscriptions);
  const [isPageActive, setIsPageActive] = useState(true);

   const {language} = useContext(LanguageContext);

  const dispatch = useAppDispatch();

   useFocusEffect(
      useCallback(()=>{
        stop();

        if(data && data.length == 0 && !loadDone){
          dispatch(getNotification(userID));
          setLoadDone(true);
        }
        if (error) {
          showToast(error, "Error", "error");
          setLoadDone(true);
        }
      }, [data, error])
    )
  
    useEffect(()=>{
      if (error) {
        showToast(error, "Error", "error");
        console.log('error', error)
      }
    }, [error, errorCompetition])

  const markAsRead = (id: number) => {
    // Implémenter le marquage comme lu d'une notification 
    dispatch(setAsRead(id));
  }

  const deleteAll = ()=>{
    // Implémenter la suppression de toutes les notifications
    dispatch(deleteAllNotifications(userID));
  }
  const deleteOne = (notifID: number)=>{
    dispatch(deleteNotification(notifID))
  }

  useFocusEffect(
    useCallback(()=>{
      dispatch(setAllNotifAsRead());
      setIsPageActive(true);
      dispatch(setCompetitioErrorNull());
      return ()=>{
       setIsPageActive(false)

      }
    }, [])
  )

  useEffect(()=>{
      if(errorRoom && isPageActive){
        showToast('error', 'Erreur de connexion', 'Une erreur est survenue lors de la connexion à la salle de compétition. Veuillez réessayer plus tard. ' + errorRoom);
      }
  },[errorRoom])

  useEffect(()=>{
    if(!waitingJoining && room && !errorRoom){
      router.push("/competitions-screen/online.users")
    }  
  }, [waitingJoining])

  useEffect(()=>{
    if(!suscriptionLoading && !suscriptionError && selectedCompetition && isPageActive){
      if(selectedCompetition.type === "PAID_REGISTRATION_AS_WINNER_PRICE" || selectedCompetition.type === "PAID_REGISTRATION_WITH_WINNER_PRICE"){
        //inscription done and the competition is with entry fee, then we have to update the user wallet in the store before redirection
        const wallet = user ? (user.wallet - selectedCompetition.entryFee) : 0;
        dispatch(updateBalanceUser(wallet));
        showToast('success', 'Invitation acceptée !', `Vous avez été enregistré à la compétition. Votre nouveau solde est de ${wallet} XAF.`);
      }else{
        showToast('success', 'Invitation acceptée !', 'Vous avez été enregistré à la compétition.');
      }
    }else if(suscriptionError){
      console.log("error suscription", suscriptionError)
      showToast('error', 'Erreur inscription', 'Une erreur est survenue: ' + suscriptionError);
    }
  }, [suscriptionLoading, suscriptionError])

  const doInscription = (entryFee?: boolean)=>{
      if(isOpenConfirmation) setIsOpen(false);
      
      if(selectedCompetition ){
        if(!entryFee){
          dispatch(createSubscription({userID: userID, competitionID: selectedCompetition.id, score: 0, suscribeFromInvitation: true}));  
        }else{
          //is a competition with entry fee, then we have to check te user wallet before suscription
          if(user.wallet >= selectedCompetition.entryFee){ 
            dispatch(createSubscription({userID: userID, competitionID: selectedCompetition.id, score: 0, suscribeFromInvitation: true}));
          }else{
            showToast('error', 'Fonds insuffisants', 'Vous n\'avez pas assez de fonds pour vous inscrire à cette compétition. Veuiilez recharger le solde de vote compte !');
          }
        }
      }
  }

  const checkCompetition = ()=>{
    if(selectedCompetition && selectedCompetition.suscribers && selectedCompetition.suscribers.length > 0){
        const finded = selectedCompetition.suscribers.find((sub: {id: number, email:string})=> sub.id == userID);
        if(!finded){
          if( selectedCompetition.statut === "UPCOMING"){
            //handle inscription   
            if((selectedCompetition.type === "PAID_REGISTRATION_AS_WINNER_PRICE" || selectedCompetition.type === "PAID_REGISTRATION_WITH_WINNER_PRICE") && isPageActive){
              setIsOpen(true);    
            }else{
              doInscription();
            }         
          }else{
            //competition started or ended
            showToast('success', 'Bienvenue !', 'La compétition a déjà commencé ou est terminée, redirection vers les détails.');
            router.push('/competitions-screen/information')
          }
        }else{
          //navigate to information
          showToast('success', 'Bienvenue !', 'Vous êtes déjà inscrit à la compétition, redirection vers les détails.');
          router.push('/competitions-screen/information')
        }
    }else{
      //handle inscription   
        if((selectedCompetition.type === "PAID_REGISTRATION_AS_WINNER_PRICE" || selectedCompetition.type === "PAID_REGISTRATION_WITH_WINNER_PRICE") && isPageActive){
          setIsOpen(true);    
        }else{
          doInscription();
        }
    }
  }

  const joiningRoom = ()=>{
    initializeRoomsGateway(dispatch, null, userID)
      const eventManager = EmitEvent(dispatch, {isManagedByIA: selectedCompetition?.isManagedByIA as any, roomId: selectedCompetition?.roomID as any});
      eventManager.joinRoom({
        roomId: selectedCompetition?.roomID as any,
        userID: userID,
        appLang: (language as any),
        username: user ? user.username:"Dems",
        imgUrl: user ? user.imgUrl: "https://i.ibb.co/7R4DyhQ/Avatar-1.jpg",
        surname: user ? user.surname : "",
        
      })
  }

  useEffect(()=>{
    if(selectedCompetition && selectedCompetition.id != -1 && !competitionLoading && isPageActive){
      if(btnActionType === "openDetails"){
      //navigate to information
        router.push('/competitions-screen/information')
      }else if (btnActionType === "acceptInvit"){
        // handle accept invit
        console.log('accept invit checking')
       checkCompetition()
      }else if (btnActionType === "joinRoom"){
          if(selectedCompetition.roomID && selectedCompetition.statut === "ONGOING"){
            joiningRoom();
          }
      }else{
        // handle update
      }
   }
  }, [selectedCompetition])

  const loadCompetitionDetails = (id: number, actionType:  "openDetails" | "acceptInvit" | "joinRoom" | "update")=> {      
    console.log('loadCompetitionDetails', id, actionType, isPageActive, selectedCompetition)
    if(id && actionType && isPageActive && !selectedCompetition){
        setBtnActionType(actionType);
        dispatch(getOne(id))
      }else{
        if(actionType === "acceptInvit"){
          console.log('check competition execute')
          checkCompetition();
        }else if(actionType === "openDetails"){
          router.push('/competitions-screen/information');
        }else{
          if(selectedCompetition.roomID && selectedCompetition.statut === "ONGOING"){
            joiningRoom();
          }else{
            showToast('error', 'Impossible de rejoindre', 'La compétition n\'est pas encore commencée ou est déjà terminée.');
          }
        }
      }
  }
  
  //rafraîchir hors de cette page

  const navigation = useNavigation();
  const router = useRouter();
  const unreadCount = useMemo(() => (data?.filter((n: any) => !n.isRead).length ?? 0), [data]);

  // useEffect(() => {
  //   // Dynamically update the tab badge for the Notifications tab
  //   navigation.setOptions({ tabBarBadge: unreadCount > 0 ? unreadCount : undefined });
  // }, [navigation, unreadCount]);


  const [selected, setSelected] = useState<Notification | null>(null);
  const modalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['45%', '85%'], []);

  // const openDetails = useCallback((n: Notification) => {
  //   setSelected(n);
  //   modalRef.current?.present();
  // }, []);

  const closeDetails = useCallback(() => {
    modalRef.current?.dismiss();
    setSelected(null);
  }, []);

  // const onRefresh = useCallback(() => {
  //   void refetch();
  // }, [refetch]);

    function showToast(type: "success"|"error" ,title: string, message: string,){
        Toast.show({
          type: type,
          topOffset: 60,
          text2: message,
          text1: title,
          position: 'top',
          visibilityTime: 3500,
        }) 
    }


  const renderItem = useCallback(({ item }: { item: Notification }) => (
    <NotificationSwipeableItem
      notification={item}
      onDelete={() =>
        deleteOne(item.id)
      }
      onOpenLink={() => loadCompetitionDetails(item.competionID, "joinRoom")}
      onOpenDetails={() => loadCompetitionDetails(item.competionID, "openDetails")}
      onAcceptInvitation={() => loadCompetitionDetails(item.competionID, "acceptInvit")}
    />
  ), [showToast]);

  const keyExtractor = useCallback((n: Notification) => n.id, []);

  const items = data ?? [];

  const Header = items.length !== 0 ? (
     <View className="px-4 pt-4 pb-2 bg-background-light dark:bg-background-dark flex-row items-center justify-between">
      <Text className="text-lg font-extrabold text-typography-default dark:text-typography-white">Notifications</Text>
      <Pressable
        onPress={() =>
          deleteAll()
        }
        disabled={loading || items.length === 0}
        accessibilityLabel="Supprimer toutes les notifications"
        className="flex-row items-center gap-2 px-3 py-2 rounded-md bg-error-400 opacity-100 disabled:opacity-50"
      >
        <Ionicons name="trash" size={18} color="#FFFFFF" />
        <Text className="text-white font-semibold">{t("notification.delete_all")}</Text>
      </Pressable>
    </View>
  ): null;

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
        <ActivityIndicator size="large" color="#181c5c" />
        <Text className="mt-3 text-typography-gray">{t('notification.loading_text')} </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark px-6">
        {Header}
       
        <View className="mt-10 items-center">
          <Ionicons name="alert-circle" size={42} color="#ef4444" />
          <Text className="mt-3 text-center text-typography-default dark:text-typography-white">
            {t("notification.error_on_loading")}
          </Text>
          <Pressable onPress={()=> dispatch(getNotification(userID))} className="mt-4 px-4 py-2 rounded-md bg-primary-500">
            <Text className="text-white font-semibold">{t("notification.try_again")} </Text>
          </Pressable>
        </View>
      </View>
    );
  }
  return (
    <>

    <BottomSheetModalProvider>
      <View className="flex-1 bg-background-light dark:bg-background-dark">
        {Header}
        {items.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <Ionicons name="notifications-off" size={48} color="#9CA3AF" />
            <Text className="mt-3 text-typography-gray">{t("notification.no_notifications")} </Text>
          </View>
        ) : (
          <FlatList<Notification>
            data={items}
            renderItem={renderItem}
            contentContainerStyle={{ paddingVertical: 8 }}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={() => dispatch(getNotification(userID)) } />}
          />
        )}

        {/* */}
        <BottomSheetModal
          ref={modalRef}
          snapPoints={snapPoints}
          backgroundStyle={{ backgroundColor: 'transparent' }}
          handleIndicatorStyle={{ backgroundColor: '#9CA3AF' }}
        >
          <View className="flex-1 rounded-t-2xl bg-background-light dark:bg-background-dark p-4">
            <View className="flex-row items-start gap-3">
              {selected && (
                <Ionicons
                  name={iconFor(selected.type)}
                  size={24}
                  color={colorFor(selected.type)}
                />
              )}
              <View className="flex-1">
                <Text className="text-base font-extrabold text-typography-default dark:text-typography-white" numberOfLines={2}>
                  {selected?.title}
                </Text>
                <Text className="mt-1 text-xs text-typography-gray">{selected ? relativeTime(selected.created_at) : ''}</Text>
              </View>
              <Pressable onPress={closeDetails} className="-mr-2 -mt-2 p-2 rounded-full active:opacity-80">
                <Ionicons name="close" size={20} color="#9CA3AF" />
              </Pressable>
            </View>

            <Text className="mt-4 text-typography-default dark:text-typography-white">{selected?.text}</Text>

            <View className="mt-6 flex-row items-center gap-3">
              {selected?.link && (
                <Pressable
                  onPress={() => (selected?.type === "COMPETITION_START" ? loadCompetitionDetails(selectedCompetition, "joinRoom") : loadCompetitionDetails(selected.competionID, "openDetails"))}
                  className="px-3 py-2 rounded-md bg-primary-500 active:opacity-90"
                  accessibilityRole="button"
                  accessibilityLabel={selected?.type === 'COMPETITION_START' ? 'Rejoindre la compétition' : 'Ouvrir le lien associé'}
                >
                  <Text className="text-white font-semibold">
                    {selected?.type === 'COMPETITION_START' ? 'Rejoindre la compétition' : 'Ouvrir'}
                  </Text>
                </Pressable>
              )}

              {selected && (
                <Pressable
                  onPress={() => {
                    void Haptics.selectionAsync();
                    if (selected.isRead) return;
                    markAsRead(selected.id);
                    setSelected((s) => (s ? { ...s, read: true } : s));
                  }}
                  disabled={!!selected?.isRead}
                  className="px-3 py-2 rounded-md bg-outline-50 dark:bg-outline-800 active:opacity-90"
                >
                  <Text className="text-typography-default dark:text-typography-white font-semibold">
                    Marquer lu
                  </Text>
                </Pressable>
              )}

              {selected && (
                <Pressable
                  onPress={() => {
                    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    deleteOne(selected.id);
                    closeDetails();
                  }}
                  disabled={selected.id===undefined || selected.id === null}
                  className="px-3 py-2 rounded-md bg-error-400 active:opacity-90 ml-auto"
                >
                  <Text className="text-white font-semibold">{t("delete")}</Text>
                </Pressable>
              )}
            </View>
          </View>
        </BottomSheetModal>
        
      </View>

      {isOpenConfirmation && isPageActive && (
          <InvitationConfirm
            onConfirm={() => doInscription(true)}
            onClose={() => setIsOpen(false)}
            isOpen={isOpenConfirmation}
            inscriptionFees={selectedCompetition.entryFee}
          />
        )}

    <FullscreenLoader visible={competitionLoading} />

    </BottomSheetModalProvider>
    <Toast config={toastConfig} />
    </>
  );
}

function relativeTime(iso: any) {
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `il y a ${diff}s`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `il y a ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  const day = Math.floor(h / 24);
  return `il y a ${day}j`;
}

function iconFor(type: Notification['type']): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case 'ADMIN_ALERT':
      return 'information-circle';
    case 'INVITATION_ACCEPTED':
      return 'checkmark-circle';
    case 'COMPETITION_START':
      return 'warning';
    case 'INVITATION_DECLINED':
      return 'alert-circle';
    default:
      return 'help-circle'; // Default icon for unhandled cases
  }
}

function colorFor(type: Notification['type']): string {
  switch (type) {
    case 'ADMIN_ALERT':
      return '#38bdf8'; // info-400
    case 'INVITATION_ACCEPTED':
      return '#22c55e'; // success-500
    case 'COMPETITION_START':
      return '#f59e0b'; // warning-500
    case 'INVITATION_DECLINED':
      return '#ef4444'; // error-500
    default:
      return '#9CA3AF'; // gray-400 for unhandled cases
  }
}
