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
    async (pdfUrl: string): Promise<DownloadResult> => {
      try {
        setLoading(true);
        setError(null);
        // const absoluteUrl = buildFileUrl(pdfUrl);
          const absoluteUrl = pdfUrl;
        //   console.log("pdfuri:", absoluteUrl)

        const fileName =
          pdfUrl.split("/").pop() ?? `document-${Date.now()}.pdf`;

        const localUri = Paths.cache + fileName;
          const file = new File(localUri)
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
