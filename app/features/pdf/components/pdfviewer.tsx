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
 console.log("========== PDF VIEWER ==========");
 console.log("📍 localUri :", localUri);
 console.log("⏳ loading :", loading);
 console.log("❌ error :", error);
 console.log("📄 currentPage :", currentPage);
  usePdfSecurity()
  console.log("🔎 PDF VIEWER DECISION :", {
    loading,
    error,
    localUri,
  });
  // if (loading) {
  //   return <PdfLoading />;
  // }

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

  console.log("🔍 PDF URI :", localUri);
  console.log("🔍 IS LOCAL :", localUri.startsWith("file://"));
  console.log("🔍 IS HTTPS :", localUri.startsWith("https://"));
  return (
    <View style={{ flex: 1 }}>
      <Pdf
        source={{
          uri: localUri,
        }}
        style={{ flex: 1 }}
        onLoadComplete={(pages, filePath) => {
          console.log("🎉 PDF LOAD COMPLETE");
          console.log("📄 pages :", pages);
          console.log("📄 filePath :", filePath);
        }}
        onLoadProgress={(percent) => {
          console.log("📥 PDF PROGRESS :", percent);
        }}
        onError={(error) => {
          console.log("💥 PDF ERROR :", error);
        }}
      />

      <PdfWatermark
        username={`${user?.username} ${user?.surname}`}
        email={user?.email}
        // logo={require("@/app/assets/images/logo.png")}
      />
    </View>
  );
}