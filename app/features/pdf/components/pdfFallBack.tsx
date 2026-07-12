import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

import { Pressable, Text, View } from "react-native";

interface Props {
  localUri: string;
}

export default function PdfFallback({ localUri }: Props) {
    const openPdf = async () => {
      console.log("localUri:", localUri)
    await WebBrowser.openBrowserAsync(localUri);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
      }}
    >
      <Ionicons name="document-text" size={70} color="#1E3A8A" />

      <Text
        style={{
          marginTop: 20,
          fontWeight: "700",
          fontSize: 18,
        }}
      >
        Document prêt
      </Text>

      <Text
        style={{
          marginTop: 8,
          textAlign: "center",
          color: "#666",
        }}
      >
        Expo Go ne supporte pas encore react-native-pdf.
      </Text>

      <Pressable
        onPress={openPdf}
        style={{
          marginTop: 30,
          backgroundColor: "#FF8A00",
          paddingHorizontal: 30,
          paddingVertical: 14,
          borderRadius: 30,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "700",
          }}
        >
          Ouvrir le PDF
        </Text>
      </Pressable>
    </View>
  );
}
