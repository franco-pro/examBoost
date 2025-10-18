import { Box } from '@/components/ui/box';
import { Button, ButtonGroup, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import {
    Toast,
    ToastDescription,
    ToastTitle,
    useToast,
} from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';
import { RefreshCw } from 'lucide-react-native';
import { useState } from 'react';

interface UpdateToastProps { 
    message: string;
}
  
  export default function UpdateToast({message}: UpdateToastProps) {
    const toast = useToast();
    const [toastId, setToastId] = useState(0);
    {
      if (!toast.isActive(toastId as any)) {
        {
            const newId = Math.random();
            setToastId(newId);
            toast.show({
              id: ''+newId,
              placement: 'top',
              duration: 3000,
              render: ({ id }) => {
                const uniqueToastId = 'toast-' + id;
                return (
                    <Toast
                    nativeID={uniqueToastId}
                    className="p-4 gap-4 w-full max-w-[386px] bg-background-0 shadow-hard-2 flex-row"
                  >
                    <Box className="h-11 w-11 items-center justify-center hidden min-[400px]:flex bg-background-50">
                      <Icon
                        as={RefreshCw}
                        size="xl"
                        className="stroke-background-800"
                      />
                    </Box>
                    <VStack space="xl">
                      <VStack space="xs">
                        <HStack className="justify-between">
                          <ToastTitle className="text-typography-900 font-semibold">
                            Update available
                          </ToastTitle>
                          <Pressable onPress={() => toast.close(id)}>
                            <Icon as={CloseIcon} className="stroke-background-500" />
                          </Pressable>
                        </HStack>
                        <ToastDescription className="text-typography-700">
                          {message ?? 'A new software version is available for download.'}.
                        </ToastDescription>
                      </VStack>
                      <ButtonGroup className="gap-3 flex-row">
                        <Button
                          action="secondary"
                          variant="outline"
                          size="sm"
                          className="flex-grow"
                          onPress={() => toast.close(id)}
                        >
                          <ButtonText>Not now</ButtonText>
                        </Button>
                        <Button size="sm" className="flex-grow">
                          <ButtonText>Update</ButtonText>
                        </Button>
                      </ButtonGroup>
                    </VStack>
                  </Toast>
               );
              },
            });
          };
      }
    };       
  }
  