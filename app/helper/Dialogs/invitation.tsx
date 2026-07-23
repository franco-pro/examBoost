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
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';

interface InvitationPromptsProps {
    isOpen: boolean;
    onClose: () => void;
    competitionDetails: {id: number, name: string};
    userDetails: {id: number, username: string };
}

 export default function InvitationPrompts({isOpen, onClose, competitionDetails, userDetails}: InvitationPromptsProps) {
    const [actionType, setActionType] = useState<"Rechercher"|"Send Invitation">("Rechercher");
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
    const {t} = useTranslation("competition");
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
        if(actionType === "Send Invitation"){
            // Envoyer l'invitation
            if(response){
                try{
                    setWaitingResponse(true);
                    const eventNotf = EmitEventNotif(dispatch);
                    eventNotf.sendInvitation(
                      {
                        receiverID: response.id,
                        senderID: userDetails.id, // Remplacez par l'ID réel de l'expéditeur
                        competitionId: competitionDetails.id, // Remplacez par l'ID réel de la compétition
                        senderName: userDetails.username, // Remplacez par le nom réel de l'expéditeur
                        competitionName: competitionDetails.name // Remplacez par le nom réel de la compétition
                      }
                    )
                    // Simuler l'envoi de l'invitation
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    setWaitingResponse(false);
                    showToast(t("mycompetition.information.invite.modal.success.send", {name: response.username }), "Succès");
                    // Fermer la modal après l'envoi
                    onClose();
                }catch(e: any){
                    console.log('error on sending invitation:', e.message);
                    setWaitingResponse(false);
                    showToast(t('mycompetition.information.invite.modal.errors.sending'), "Error");
                    return;
                }
            }else{
                showToast(t("mycompetition.information.invite.modal.errors.404"), "Error");
                return;
            }
            setActionType("Rechercher");
        }else{
            // Rechercher l'utilisateur
            try{

              if(searchValue.trim().length === 0){
                showToast(t("mycompetition.information.invite.modal.errors.mail"), "Erreur");
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
                showToast(t("mycompetition.information.invite.modal.errors.search"), "Error");
                return;
            }
            setActionType("Send Invitation");
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
              <Heading>{t("mycompetition.information.invite.modal.title")}</Heading>
              <Text size="sm">{t("mycompetition.information.invite.modal.text")}</Text>
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
                          <Text>{t("mycompetition.information.invite.modal.waiting")} </Text>
                      </VStack>

                    </View>
                  )
                }

                {
                  !waitingResponse && response && actionType == "Send Invitation" && (
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
                className={"w-full"+(actionType == "Send Invitation" ? " bg-primary-defaultBlue" : "")}
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
                    {t("mycompetition.confirmModal.cancel")}
                </ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
         </Modal>
      
        <Toast config={toastConfig} />
        
      </>
    );
  }
  