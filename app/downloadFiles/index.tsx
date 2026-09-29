import AsyncStorage from "@react-native-async-storage/async-storage";
import { buildFileUrl } from "../hooks/files/buildRouteFiles";
import pdfStorage from "../features/pdf/utils/pdfStorage";

export type subjectDocumentype = {
  id: number;
  name: string;
  format: string;
  subject: string;
    url: string;
  content:string
};

export const handleOpenDocument = async (doc: {
  id: string | number;
  content: string;
  url: string;
}) => {
  try {
    console.log("📄 HOME DOCUMENT :", doc);

    const fullUrl = buildFileUrl(doc.url);

    console.log("🌐 URL DOCUMENT :", fullUrl);

    const fileName = pdfStorage.getFileNameFromUrl(fullUrl);

    console.log("📄 NOM PDF :", fileName);

    const localUri = await pdfStorage.savePdf(fullUrl, fileName);

    console.log("📍 DOCUMENT LOCAL :", localUri);

    return {
        localUri,
        fileName,
      title: doc.content,
    };
  } catch (err) {
    console.log("❌ Erreur ouverture document :", err);

    throw err;
  }
};
