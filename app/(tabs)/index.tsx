import { StatusBar, Text, View } from "react-native";
import styles from "../styles/style";
import { Link } from 'expo-router'

export default function Index() {
  return (
    <View style={styles.container}
    >
      <StatusBar
            backgroundColor="your_desired_color" // e.g., "#61dafb"
            barStyle="light-content" // or "dark-content", "default"
            animated={true}
            hidden={false}
          />
      <Text style={styles.text}>Edit app/index.tsx to edit this screen.</Text>
      <Link style={styles.button} href={"/pack"}>Nos Packs</Link>

    </View>
  );
}



