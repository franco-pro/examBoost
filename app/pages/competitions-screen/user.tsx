import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function User() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>User</Text>
      <Button
        title="Quitter"
        onPress={() => router.back()} 
      />
    </View>
  );
}