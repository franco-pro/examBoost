import apiClient from "@/app/api/apiClient"
import * as ImagePicker from "expo-image-picker"

//Upload image
const uploadImage = async (image: any)=>{
    const formData = new FormData()

    formData.append("photo", {
        uri: image.uri,
        name: "profile.jpg",
        type:"image/jpeg"
    } as any)
    await apiClient.patch("profile/photo", formData, {
        headers:{"Content-Type": "multipart/form-data"}
    })
}
//select image
const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.7
    })

    if (!result.canceled) {
        uploadImage(result.assets[0])
    }
}