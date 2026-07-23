import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface Props {
  message: string;
}

export default function PdfError({ message }: Props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
      }}
    >
      <Ionicons name="warning-outline" size={60} color="red" />

      <Text
        style={{
          marginTop: 15,
          textAlign: "center",
          fontSize: 16,
          color: "#444",
        }}
      >
        {message}
      </Text>
    </View>
  );
}
