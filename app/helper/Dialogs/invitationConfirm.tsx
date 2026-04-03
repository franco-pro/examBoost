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
    
    interface InvitationConfirmProps {
      isOpen: boolean;
      onClose: () => void;
      onConfirm: () => void;
      inscriptionFees: number;
    }
    export default function InvitationConfirm({isOpen, onClose, onConfirm, inscriptionFees}: InvitationConfirmProps) {  
    //   const {t}= useTranslation("competition");
      return (
        <>
          <AlertDialog isOpen={isOpen} onClose={onClose}>
            <AlertDialogBackdrop />
            <AlertDialogContent className="w-[85%] max-w-[90%] gap-4 items-center">
              <AlertDialogHeader>
              <Heading className="text-typography-950 font-semibold" size="xl">
                  {/* {t("mycompetition.confirmModal.title")} */}
                    Confirmation
              </Heading>
            </AlertDialogHeader>
            <AlertDialogBody className="mt-3 mb-4">
              <Text size="xl">
              {/* {t("mycompetition.confirmModal.text")} */}
              Cette compétition exige des frais de participation... vous serez debité d'un montant de {inscriptionFees} XAF.
               {' \n'}
              
              {/* {t("mycompetition.confirmModal.text2")} */}
              Voulez vous confirmer votre participation ?
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                className="bg-primary-defaultBlue"
                onPress={onClose}
                size="sm"
              >
                <ButtonText>
                   {/* {t("mycompetition.confirmModal.cancel")} */}
                   Annuler
                </ButtonText>
              </Button>
              <Button size="sm" onPress={onConfirm} action="negative">
                <ButtonText> Je confirme </ButtonText>
              </Button>
            </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    }
    