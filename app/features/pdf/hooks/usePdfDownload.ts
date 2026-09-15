import { useCallback, useState } from "react";
import {Paths, File} from "expo-file-system";
import { buildFileUrl } from "@/app/hooks/files/buildRouteFiles";
import pdfStorage from "../utils/pdfStorage";

interface DownloadResult {
  localUri: string;
  fileName: string;
}

export function usePdfDownload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localUri, setLocalUri] = useState<string | null>(null);

  const downloadPdf = useCallback(
    async (pdfUrl: any): Promise<DownloadResult> => {
      let absoluteUrl = "";
       if (typeof pdfUrl === "object" && pdfUrl !== null) {
         // Si c'est un objet contenant une propriété uri ou url (ajustez selon votre structure)
         absoluteUrl = pdfUrl.uri || pdfUrl.url || pdfUrl.pdfUrl;
         console.log("pdf utl :", pdfUrl)
       } else {
         absoluteUrl = pdfUrl;
      }
       if (!absoluteUrl || typeof absoluteUrl !== "string") {
         throw new Error("L'URL fournie n'est pas valide.");
       }
      try {
        setLoading(true);
        setError(null);
        // const absoluteUrl = buildFileUrl(pdfUrl);
          console.log("pdfuri:", absoluteUrl)

        const fileName =
          pdfUrl.split("/").pop() ?? `document-${Date.now()}.pdf`;

          const file = new File(Paths.cache, fileName)
          const localUri = file.uri;
          setLocalUri(absoluteUrl)
        // Le fichier existe déjà → inutile de le télécharger
        // const info = file.info;

        if (file.exists) {
          return {
            localUri,
            fileName,
          };
        }
        const downLoadLocalUri = await pdfStorage.savePdf(absoluteUrl, fileName)
        return {
          localUri:downLoadLocalUri,
          fileName, 
        };
      } catch (e: any) {
        console.log("Erreur téléchargement PDF :", e);

        setError(e.message ?? "Erreur téléchargement");

        throw e;
      } finally {
        setLoading(false);
      }
    },
    [],
  );
// console.log("localurl dans download: ", localUri)
  return {
    localUri,
    loading,
    error,
    downloadPdf,
};
}
