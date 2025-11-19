import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

export default function Competition(){
    const router = useRouter();
  return (
    <View className="bg-[#E8F5FA] flex-1">
      <Button
        className="bg-primary-defaultOrange mt-4"
        onPress={() => router.push("/pages/competitions-screen/user")}
      >
        <Text className="text-white">Rejoindre...</Text>
      </Button>
    </View>
  );
}
