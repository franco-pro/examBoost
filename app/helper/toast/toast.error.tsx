import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { CloseIcon, HelpCircleIcon, Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';
import { useState } from 'react';

interface ErrorToastProps { 
    message: string;
}
  
  export default function ErrorToast({message}: ErrorToastProps) {
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
                    action="error"
                    variant="outline"
                    nativeID={uniqueToastId}
                    className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
                  >
                    <HStack space="md">
                      <Icon as={HelpCircleIcon} className="stroke-error-500 mt-0.5" />
                      <VStack space="xs">
                        <ToastTitle className="font-semibold text-error-500">
                          Error!
                        </ToastTitle>
                        <ToastDescription size="sm">
                          {message}
                        </ToastDescription>
                      </VStack>
                    </HStack>
                    <HStack className="min-[450px]:gap-3 gap-1">
                      <Button variant="link" size="sm" className="px-3.5 self-center">
                        <ButtonText>Retry</ButtonText>
                      </Button>
                      <Pressable onPress={() => toast.close(id)}>
                        <Icon as={CloseIcon} />
                      </Pressable>
                    </HStack>
                  </Toast>
                );
              },
            });
          };
      }
    };       
  }
  