import { Button } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';

export default function Competition(){
    const router = useRouter();
    return(
       <VStack>
        <Button className="bg-primary-defaultOrange mt-4"
      onPress={() => router.push('/pages/competitions-screen/online.users')}  
      >
        <Text className="text-white">Rejoindre...</Text>
      </Button>
      <Button className="bg-primary-defaultBlue mt-4"
      onPress={() => router.push('/pages/competitions-screen/owner.online')}  
      >
        <Text className="text-white">Rejoindre owner...</Text>
      </Button>
       </VStack>
      
    )
}
