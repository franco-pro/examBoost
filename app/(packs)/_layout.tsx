import { Stack } from 'expo-router';

export default function PacksStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='packs' options={{title:"Tous les packs"}}/>
    </Stack>
  );
}
