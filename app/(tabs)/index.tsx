import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useEffect } from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';



export default function Index() {
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => router.push('/(tabs)/profile' as any)}
          accessibilityLabel="Ouvrir le profil"
          className="mr-3"
        >
          <Ionicons name="person-circle" size={26} color="#FFFFFF" />
        </Pressable>
      ),
    });
  }, [navigation, router]);

  function onPress() {
    router.push(
      "/pages/competitions-screen/components-ui/online-competitions/trophySection" as any
    );
  }
  return (

    <View className="flex-1 items-center justify-center">
      <Text className="text-error-500 text-lg font-bold">
        Hello world, this is the main screen!
      </Text>
      <Button className="bg-primary-defaultOrange mt-4" onPress={onPress}>
        <Text className="text-white">Bouton principal</Text>
      </Button>
   </View>

  );
}



