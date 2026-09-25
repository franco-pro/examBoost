import { View, Text } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Pdf from "react-native-pdf";

import pdfStorage from "@/app/features/pdf/utils/pdfStorage";

export default function PdfPage() {
  const router = useRouter();

  const { id, title } = useLocalSearchParams<{
    id: string;
    title?: string;
  }>();

  const localUri = id ? pdfStorage.getLocalPdf(id) : null;

  console.log("========== PDF PAGE ==========");
  console.log("📄 id :", id);
  console.log("📍 localUri :", localUri);

  if (!localUri) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>PDF introuvable</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: title ?? "Document",
        }}
      />

      <Pdf
        source={{
          uri: localUri,
        }}
        style={{
          flex: 1,
        }}
        onLoadComplete={(pages, filePath) => {
          console.log("🎉 PDF LOAD COMPLETE");
          console.log("📄 pages :", pages);
          console.log("📄 filePath :", filePath);
        }}
        onError={(error) => {
          console.log("💥 PDF ERROR :", error);
        }}
      />
    </View>
  );
}
