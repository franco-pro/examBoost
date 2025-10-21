import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useRouter } from 'expo-router';
import { connectRoomsSocket } from '../hooks/services/socket/socket.init';



export default function Index() {
  const router = useRouter();
  const socketIo = connectRoomsSocket();  
  return (

    <View className="flex-1 items-center justify-center">
      <Text className="text-error-500 text-lg font-bold">
        Hello world, this is the main screen!
      </Text>
      <Button className="bg-primary-defaultOrange mt-4">
        <Text className="text-white">Bouton principal</Text>
      </Button>
   </View>

  );
}



