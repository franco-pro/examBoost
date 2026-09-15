import { View } from "react-native";
import Pdf from "react-native-pdf"

import PdfLoading from "./pdfLoading";
import PdfError from "./pdfError";
import PdfFallback from "./pdfFallBack";

import { usePdfSecurity } from "../hooks/usePdfSecurity";
import PdfWatermark from "./pdfWatermark";
import { useSelector } from "react-redux";
import { RootState } from "@/app/hooks/redux/store";

import { EXPO_PUBLIC_USE_NATIVE_PDF } from "@/app/config/env";

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
  const user = useSelector((state: RootState) => state?.user?.user);

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

  const USE_NATIVE_PDF = EXPO_PUBLIC_USE_NATIVE_PDF

  /**
   * ===========================
   * TEMPORAIRE
   * Expo Go
   * ===========================
   */
  if (!USE_NATIVE_PDF) {
    return <PdfFallback localUri={localUri} />;
  }
// return <PdfFallback localUri={localUri} />;
  /**
   * ===========================
   * DEFINITIF
   * react-native-pdf
   * ===========================
   */

  
  return (
    <View style={{ flex: 1 }}>
      <Pdf
        source={{
          uri: localUri,
          cache: true,
        }}
        style={{
          flex: 1,
        }}
        page={currentPage}
        onLoadComplete={(pages) => {
          onLoadComplete(pages);
        }}
        onPageChanged={(page) => {
          onPageChanged(page);
        }}
        onError={(pdfError) => {
          console.log("PDF ERROR:", pdfError);
        }}
        enablePaging={false}
        horizontal={false}
        fitPolicy={0}
        trustAllCerts={false}
      />

      <PdfWatermark
                username={`${user?.username} ${user?.surname}`}
                email={user?.email}
                // logo={require("@/app/assets/images/logo.png")}
              />
    </View>
  );
}