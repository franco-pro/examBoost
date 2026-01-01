import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Icon, TrashIcon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';

interface DialogDeleteProps {
  isOpen: boolean;
  headText: string,
  bodyText: string,
  isLoading: boolean,
  onClose: () => void,
  onConfirm: ()=> void;
}
export default function DialogDelete({isOpen, isLoading, onClose, onConfirm, headText, bodyText}: DialogDeleteProps) {  
  const {t} = useTranslation("competition");
  return (
    <>
      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogBackdrop />
        <AlertDialogContent className="w-[90%] max-w-[415px] gap-4 items-center">
          <Box className="rounded-full h-[52px] w-[52px] bg-background-error items-center justify-center">
            <Icon as={TrashIcon} size="80" className="stroke-error-500" />
          </Box>
          <AlertDialogHeader className="mb-2">
            <Heading size="md">{headText}</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text size="xl" className="text-center">
                {bodyText}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter className="mt-5">
          
            <Button
              variant="outline"
              action="secondary"
              onPress={onClose}
              size="xl"
              className="px-[30px]"
            >
              <ButtonText> 
                  {t("mycompetition.confirmModal.cancel")}
              </ButtonText>
            </Button>

            <Button
              size="xl"
              action="negative"
              onPress={onConfirm}
              className="px-[30px]"
            >
              <ButtonText>
              {t("mycompetition.deleteModal.textBtn")}
                  {
                    isLoading && <Spinner  size="small" color="blue"/>
                  }
              </ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
