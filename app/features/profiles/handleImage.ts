import apiClient from "@/app/api/apiClient"
import * as ImagePicker from "expo-image-picker"
import { Alert } from "react-native";

//Upload image
export const uploadImage = async (image: any)=>{
    try {
        const formData = new FormData();
        const fileName = image.fileName || image?.uri?.split("/").pop() || `profile_${Date.now()}.jpg`;
        formData.append("image", {
          uri: image.image.uri,
          name: fileName,
          type: image.mimeType || "image/jpeg",
        } as any);
        
        const response = await apiClient.patch("users/photo", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // console.log("res dans handle image:", response)
        Alert.alert("Succès",response.data?.message ?? "Mise a jour effectuee.")
        return response
    } catch (error) {
        console.log("Erreur upload: ", error)
    }
}
//select image
const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permission.granted) {
        alert("Permission refusée.")
        return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
        allowsEditing: true,
        aspect: [1,1]
    })

    if (!result.canceled) {
        const image = result.assets[0]
        uploadImage(image)
    }
}