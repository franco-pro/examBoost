import { View } from "react-native";

import PdfLoading from "./pdfLoading";
import PdfError from "./pdfError";
import PdfFallback from "./pdfFallBack";
import { usePdfSecurity } from "../hooks/usePdfSecurity";
import PdfWatermark from "./pdfWatermark";

interface PdfViewerProps {
  localUri: string | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  progress: number;
  onLoadComplete: (pages: number) => void;
  onPageChanged: (page: number) => void;
}

export default function PdfViewer({
  localUri,
  loading,
  error,
  currentPage,
  totalPages,
  progress,
  onLoadComplete,
  onPageChanged,
}: PdfViewerProps) {

usePdfSecurity()
  if (loading) {
    return <PdfLoading />;
  }

  if (error) {
    return <PdfError message={error} />;
  }

  if (!localUri) {
    return <PdfError message="Impossible de charger le document." />;
  }


  /**
   * ===========================
   * TEMPORAIRE
   * Expo Go
   * ===========================
   */
  return <PdfFallback localUri={localUri} />;

  /**
   * ===========================
   * DEFINITIF
   * react-native-pdf
   * ===========================
   */

  /*
  return (

      <Pdf
          source={{uri:localUri}}
          style={{flex:1}}
          page={currentPage}
          onLoadComplete={(pages)=>{
                onLoadComplete(pages)
          }}
          onPageChanged={(page)=>{
                onPageChanged(page)
          }}
      />

  )
  */
}
