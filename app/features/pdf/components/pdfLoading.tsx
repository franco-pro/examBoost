import { ActivityIndicator, Text, View } from "react-native";

export default function PdfLoading() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#1E3A8A" />

      <Text
        style={{
          marginTop: 12,
          fontSize: 16,
          fontWeight: "600",
        }}
      >
        Chargement du document...
      </Text>
    </View>
  );
}
