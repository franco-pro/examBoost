import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { StyleSheet, View ,Text, TouchableOpacity} from "react-native"


export default function NotificationList(){
    return (
        <View className="flex-1 bg-gray-50 pt-[40px] pb-[50px] px-4">
            <Text>Notification page</Text>

                    <TouchableOpacity
                            style={style.fab}
                            onPress={() => {
                                router.push("/dev-admin/pages/notification/sendNotification")
                            }}
                            activeOpacity={0.85}
                        >
                          <Ionicons name="add" size={28} color="#fff" />
                          <Text style={style.fabText}>Diffusion</Text>
                       </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    fab: {
        position: "absolute",
        bottom: 32, right: 24,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#F97316",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 50,
        shadowColor: "#F97316",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
      },
      fabText: { color: "#fff", fontWeight: "700", fontSize: 15 }
})