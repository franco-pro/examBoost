import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';

export default function Competition(){
    const router = useRouter();
    return(
      <Button className="bg-primary-defaultOrange mt-4"
      onPress={() => router.push('/pages/competitions-screen/user')}  
      >
        <Text className="text-white">Rejoindre...</Text>
      </Button>
    )
}
