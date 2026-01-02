import { AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';

interface DialogConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    message: string | null;
  }

export default function CompetitionStopedAlert({isOpen, onClose, message}: DialogConfirmProps) {
  const {t} = useTranslation("competition")  
  return (
        <>
        <AlertDialog isOpen={isOpen} onClose={onClose}>
          <AlertDialogBackdrop />
          <AlertDialogContent className="w-[85%] max-w-[90%] gap-4 items-center">
            <Box className="rounded-full h-[52px] w-[52px] bg-background-error items-center justify-center">
                <Text size="xl"> ❌ </Text>
            </Box>
            <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="xl">
                {t("mycompetition.competition.stoppped.label")}
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="xl">
            {message ?? t("mycompetition.competition.stopped.text")}
             {' \n'}
            
             
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              className="bg-primary-defaultBlue w-full"
              onPress={onClose}
              size="lg"
            
            >
              <ButtonText> {t("mycompetition.competition.quit")}  </ButtonText>
            </Button>
          </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }
  