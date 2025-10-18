import {
    Toast,
    ToastDescription,
    ToastTitle,
    useToast,
} from '@/components/ui/toast';
import { useState } from 'react';

interface ErrorToastProps { 
    message: string;
}
  
  export default function SuccessToast({message}: ErrorToastProps) {
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
                    <Toast nativeID={uniqueToastId} action="success" variant="solid">
                        <ToastTitle>Done</ToastTitle>
                        <ToastDescription>
                          {message}
                        </ToastDescription>
                  </Toast>
                );
              },
            });
          };
      }
    };       
  }
  