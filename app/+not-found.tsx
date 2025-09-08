import { Stack, Link } from "expo-router";
import {View, StyleSheet } from "react-native";

export default function NotfoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops, Not found !" }} />
      <View style={styles.container}>
        <Link style={styles.button} href={'/(tabs)/index'}>Home</Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
     container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
})
