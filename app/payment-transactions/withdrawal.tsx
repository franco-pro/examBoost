import { Text, View, ScrollView } from "react-native";

export default function Index() {
    return (
      <>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
          className="flex-1 bg-gray-50 "
        >
          {/* On force la View à prendre 100% de la largeur de l'écran (w-full) */}
          <View className="w-full p-4 bg-gray-50 ">
            <Text className="flex-shrink text-base">Recharge your account</Text>
          </View>
        </ScrollView>
      </>
    );
}