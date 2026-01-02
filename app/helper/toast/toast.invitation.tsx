import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import {
    Toast,
    useToast
} from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';
import { useState } from 'react';

interface InvitationToastProps { 
    message: string;
    senderName: string;
    senderSurname: string,
    senderUrlProfile: string
}
  
  export default function InvitationToast({message, senderName, senderSurname, senderUrlProfile }: InvitationToastProps) {
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
                className="p-4 gap-3 w-full sm:min-w-[386px] max-w-[386px] bg-background-0 shadow-hard-2 flex-row"
              >
                <Avatar>
                  <AvatarFallbackText>JS</AvatarFallbackText>
                  <AvatarImage
                    source={{
                      uri: (senderUrlProfile?? 'https://gluestack.github.io/public-blog-video-assets/Avatar.png'),
                    }}
                  />
                </Avatar>
                <VStack className="web:flex-1">
                  <HStack className="justify-between">
                    <Heading
                      size="sm"
                      className="text-typography-950 font-semibold"
                    >
                      {senderSurname?? 'Jacob Steve'}
                    </Heading>
                    <Text size="sm" className="text-typography-500">
                      2m ago
                    </Text>
                  </HStack>
                  <Text size="sm" className="text-typography-500">
                    {message ?? 'Send you invitation to join a competition ! click to see more.'} 
                  </Text>
                </VStack>
              </Toast>
                );
              },
            });
          };
      }
    };       
  }
  