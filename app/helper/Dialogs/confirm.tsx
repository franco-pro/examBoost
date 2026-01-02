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
  
  interface DialogConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }
  export default function DialogConfirm({isOpen, onClose, onConfirm}: DialogConfirmProps) {  
    const {t}= useTranslation("competition");
    return (
      <>
        <AlertDialog isOpen={isOpen} onClose={onClose}>
          <AlertDialogBackdrop />
          <AlertDialogContent className="w-[85%] max-w-[90%] gap-4 items-center">
            <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="xl">
                {t("mycompetition.confirmModal.title")}
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="xl">
            {t("mycompetition.confirmModal.text")}
             {' \n'}
            
            {t("mycompetition.confirmModal.text2")}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              className="bg-primary-defaultBlue"
              onPress={onClose}
              size="sm"
            >
              <ButtonText>
                 {t("mycompetition.confirmModal.cancel")}
              </ButtonText>
            </Button>
            <Button size="sm" onPress={onConfirm} action="negative">
              <ButtonText> {t("mycompetition.confirmModal.textBtn")} </ButtonText>
            </Button>
          </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }
  