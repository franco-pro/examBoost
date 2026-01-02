import { Stack } from 'expo-router';

export default function PacksStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* L'écran index de l'onglet Packs héritera aussi de ce layout si placé sous ce segment */}
    </Stack>
  );
}
