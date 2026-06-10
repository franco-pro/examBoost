import * as FileSystem from "expo-file-system/legacy"
import { buildFileUrl } from "../hooks/files/buildRouteFiles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveRecentDocument } from "../hooks/files/recentDocuments/recentDocument";

export const downloadPdfFile = async (
    fileUrl: string,
    fileName: string,
    token?: string
) => {
    const finalName = (fileName && fileName.trim()) || `document_${Date.now()}`
    const safeName = finalName.replace(/[^\w.-]/g, "_") + ".pdf"
    const localuri = FileSystem.documentDirectory + safeName;
    const options: FileSystem.DownloadOptions = {}

    if (token) {
        options.headers = {Authorization : `Bearer ${token}`}
    }

    const result = await FileSystem.downloadAsync(fileUrl, localuri, options)
    return result.uri
}

export type subjectDocumentype = {
    id: number;
    name: string;
    format: string;
    subject: string;
    url: string;
}

export const handleOpenDocument = async (doc: subjectDocumentype) => {
    try {
      const fullUrl = buildFileUrl(doc.url);
    //   console.log("full url file:", fullUrl,"doc: ", doc);

      const token = await AsyncStorage.getItem("accessToken");
      if (!token) console.log("le token est vide :", token);
      const localUri = await downloadPdfFile(
        fullUrl,
        doc.name,
        token || undefined,
      );
        return { 
            localUri,
            title: doc.subject
        }
        // saveRecentDocument(doc.id,)
    
    } catch(err) {
console.log("erreur lors de l'ouverture du fichier dans downloadFile: ", err)
    } 
}

export const  documentsOffice = async()=>{}