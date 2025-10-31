import { AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

interface DialogConfirmProps {
    isOpen: boolean;
    onClose: () => void;
  }

export default function CompetitionEndedAlert({isOpen, onClose}: DialogConfirmProps) {
    return (
        <>
        <AlertDialog isOpen={isOpen} onClose={onClose}>
          <AlertDialogBackdrop />
          <AlertDialogContent className="w-[85%] max-w-[90%] gap-4 items-center">
            <Box className="rounded-full h-[52px] w-[52px] bg-background-error items-center justify-center">
                <Text size="xl"> ⌛ </Text>
            </Box>
            <AlertDialogHeader>
            
            <Heading className="text-typography-950 font-semibold" size="xl">
                C'EST LA FIN !
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="xl">
            La Compétition est terminée, vous pouvez consulter les resultats generaux de la competition, merci pour votre participation !
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              className="bg-primary-defaultBlue w-full"
              onPress={onClose}
              size="xl"
            >
              <ButtonText>Voir les resultats 🔥</ButtonText>
            </Button>
          </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }
  