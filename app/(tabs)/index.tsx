import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useRouter } from 'expo-router';



export default function Index() {
  const router = useRouter();
  return (

    <View className="flex-1 items-center justify-center">
      <Text className="text-error-500 text-lg font-bold">
        Hello world, this is the main screen!
      </Text>
      <Button className="bg-primary-defaultOrange mt-4" onPress={() => router.push('/pages/competitions-screen/components-ui/online-competitions/competitionResult')}>
        <Text className="text-white">Bouton principal</Text>
      </Button>
   </View>

  );
}



