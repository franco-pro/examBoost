import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
  } from '@/components/ui/alert-dialog';
  import { Button, ButtonText } from '@/components/ui/button';
  import { Heading } from '@/components/ui/heading';
  import { Text } from '@/components/ui/text';
  import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
    
    interface InvitationConfirmProps {
      isOpen: boolean;
      onClose: () => void;
      onConfirm: () => void;
      inscriptionFees: number;
    }
    export default function InvitationConfirm({isOpen, onClose, onConfirm, inscriptionFees}: InvitationConfirmProps) {  
      const {t}= useTranslation("competition");
      return (
        <View>
          <AlertDialog isOpen={isOpen} onClose={onClose}>
            <AlertDialogBackdrop />
            <AlertDialogContent className="w-[85%] max-w-[90%] gap-4 items-center">
              <AlertDialogHeader>
              <Heading className="text-typography-950 font-semibold" size="xl">
                  {t("mycompetition.invitationPrompt.title")}
                    
              </Heading>
            </AlertDialogHeader>
            <AlertDialogBody className="mt-3 mb-4">
              <Text size="md">
              {t("mycompetition.invitationPrompt.text")}
               {' \n'}
              
              {/* {t("mycompetition.confirmModal.text2")} */}
              {t("mycompetition.invitationPrompt.subtext", {inscriptionFees: inscriptionFees.toLocaleString("fr-FR")})}

              </Text>
            </AlertDialogBody>
            <AlertDialogFooter> 
              <Button
                className="bg-primary-defaultBlue"
                onPress={onConfirm}
                size="sm"
              >
                <ButtonText>
                   {t("mycompetition.invitationPrompt.joinBtn")}
                </ButtonText>
              </Button>
              <Button size="sm" onPress={onClose} action="negative">
                <ButtonText> {t("mycompetition.invitationPrompt.ignoreBtn")} </ButtonText>
              </Button>
            </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </View>
      );
    }
    