import { toastConfig } from '@/app/config/toast.config';
import { SearchHttp } from '@/app/hooks/services/search/search';
import { EmitEventNotif } from '@/app/hooks/services/socket/notifications.gateway';
import { useAppDispatch, useAppSelector } from '@/app/hooks/redux/redux.hooks';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { ArrowLeftIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/ui/modal';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface SpecificNotificationPromptsProps {
    isOpen: boolean;
    onClose: () => void;
    notifDetail: {title: string, text: string};
    userDetails: {id: number, username: string, surname: string, imgUrl: string, phone: any};
}

 export default function SpecificNotification({isOpen, onClose, notifDetail, userDetails}: SpecificNotificationPromptsProps) {
    const [actionType, setActionType] = useState<"Rechercher"|"Send Notification">("Rechercher");
    const [searchValue, setSearchValue] = useState<string>("");
    const [response, setResponse] = useState<{
                                              id: number,
                                              email: string,
                                              phone: string, 
                                              imgUrl: string,
                                              username: string,
                                              surname: string
                                            }|null>(null);
    const [waitingResponse, setWaitingResponse] = useState<boolean>(false);
    const searchHttp = SearchHttp();
    const dispatch = useAppDispatch();

    useFocusEffect(
        useCallback(()=>{
            setActionType("Rechercher");
            return ()=>{
                setActionType("Rechercher");
                setSearchValue("");
            }
        }, [])
    )
   async  function DoAction(){
        if(actionType === "Send Notification"){
            // Envoyer l'invitation
            if(response && ( notifDetail && notifDetail.text.length != 0) && (notifDetail && notifDetail.title.length != 0) ){
                try{
                    setWaitingResponse(true);
                    const eventNotf = EmitEventNotif(dispatch);
                    eventNotf.notificationAdmin(
                      {
                        receiverId: response.id,
                        adminId: userDetails.id,  
                        text: notifDetail.text,
                        title: notifDetail.title,
                        type: "ADMIN_ALERT",
                        created_at: new Date()
                      },
                      {
                        receiver: {
                          id: response.id,
                          username: response.username,
                          surname: response.surname,
                          imgUrl: response.imgUrl,
                          phone: response.phone
                        },
                        sender: {
                          id: userDetails.id,
                          username: userDetails.username,
                          surname: userDetails.surname,
                          imgUrl: userDetails.imgUrl,
                          phone: userDetails.phone
                        }
                      }
                    )
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    setWaitingResponse(false);
                    Alert.alert(
                               "Notification Envoyée",
                               "La notification a été envoyé a " + response.username + ".",
                               [
                                   { text: "OK", onPress: () => {onClose(); router.back()}, style: "cancel"}
                               ]
                           )
                    
                }catch(e: any){
                    console.log('error on sending invitation:', e.message);
                    setWaitingResponse(false);
                    showToast("Une Erreur s'est produite lors de l'envoi de la notification.", "Error");
                    return;
                }
            }else{
                showToast("Utilisateur introuvable ou champs incomplets.", "Error");
                return;
            }
            setActionType("Rechercher");
        }else{
            // Rechercher l'utilisateur
            try{

              if(searchValue.trim().length === 0){
                showToast("Information invalide ou non trouvée" ,"Erreur");
                return;
              }

              setWaitingResponse(true);
              const responseHttp = await searchHttp.searchUsers(searchValue.toLowerCase().trim());
              
              if(responseHttp){
                setResponse(responseHttp);
                setWaitingResponse(false);
              }
            }catch(e: any){
                console.log('error on searching user:', e.message);
                setWaitingResponse(false);
                showToast("Une Erreur s'est produite lors de la recherche de l'utilisateur.", "Error");
                return;
            }
            setActionType("Send Notification");
        }
    }

    function defineSearchValue(text: string){
        setSearchValue(text);
        if(text.length === 0){ 
            setActionType("Rechercher");
        }
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
      <>
        <Modal
          isOpen={isOpen}
        >
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader className="flex-col items-start gap-0.5">
              <Heading>Notification</Heading>
              <Text size="sm">Envoyer une notification specifique à un utilisateur. </Text>
            </ModalHeader>
            <ModalBody className="mb-4">
              <VStack className="gap-1">
                <Input>
                    <InputField 
                        value={searchValue} 
                        onChangeText={(text: string) => defineSearchValue(text)} 
                        placeholder="Enter the email or phone number" 
                    />
                </Input>
                {
                  waitingResponse && 
                  (
                    <View className="justify-center items-center">
                      <VStack>

                          <Spinner size="large" color="blue" />
                          <Text>Veuillez patienté </Text>
                      </VStack>

                    </View>
                  )
                }

                {
                  !waitingResponse && response && actionType == "Send Notification" && (
                    <Box key={response.id} className="flex-row mb-4 items-center mt-4">
                    <Avatar className="mr-3">
                      <AvatarFallbackText>
                        {response.username.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallbackText>
                      {response.imgUrl ? (
                        <AvatarImage source={{ uri: response.imgUrl }} alt="image" />
                      ) : null}
                      
                    </Avatar>
                    
                    <VStack>
                      <Heading size="sm" className="mb-1">
                        {response.username} {response.surname}
                      </Heading>
                      <Text size="sm">
                        {response.email} - {response.phone}
                      </Text>
                    </VStack>
                  </Box>
                  ) 
                }
              </VStack>
            </ModalBody>
            <ModalFooter className="flex-col items-start">
              <Button
                className={"w-full"+(actionType == "Send Notification" ? " bg-primary-defaultBlue" : "")}
                onPress={() => DoAction() }
              >
                <ButtonText> {actionType} </ButtonText>
              </Button>
              <Button
                variant="link"
                size="sm"
                onPress={() => onClose()}

                className="gap-1"
              >
                <ButtonIcon as={ArrowLeftIcon} />
                <ButtonText>
                    Annuler
                </ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      
      <Toast config={toastConfig} />
        
      </>
    );
  }
  