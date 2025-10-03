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
  
  interface DialogConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }
  export default function DialogConfirm({isOpen, onClose, onConfirm}: DialogConfirmProps) {  
    return (
      <>
        <AlertDialog isOpen={isOpen} onClose={onClose}>
          <AlertDialogBackdrop />
          <AlertDialogContent className="w-[85%] max-w-[90%] gap-4 items-center">
            <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
                Êtes-vous sur de vouloir quitter cette compétition ?
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm">
             Quitter cette competition, vous fera perdre votre progression actuelle et vous ne pourrez plus y revenir en tant que participant, mais uniquement en mode spectacteur !
             {' \n'}
            
             Êtes-vous sûr de vouloir continuer ? 
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              className="bg-primary-defaultBlue"
              onPress={onClose}
              size="sm"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button size="sm" onPress={onConfirm} action="negative">
              <ButtonText>Quitter la competition</ButtonText>
            </Button>
          </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }
  