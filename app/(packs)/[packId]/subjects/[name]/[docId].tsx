import { useEffect, useMemo, useState } from "react";
import { Platform, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";

import type { RootState } from "@/app/hooks/redux/store";
import type { DocumentRow } from "@/app/features/documents/utils";

import {
  useDocumentAndCorrection,
  usePackDocumentsQuery,
} from "@/app/features/packs/hooks.rq";

import PdfToolbar from "@/app/features/pdf/components/pdfToolbar";
import PdfViewer from "@/app/features/pdf/components/pdfviewer";
import PdfWatermark from "@/app/features/pdf/components/pdfWatermark";

import { usePdfDownload } from "@/app/features/pdf/hooks/usePdfDownload";
import { usePdfReader } from "@/app/features/pdf/hooks/usePdfReader";
import { usePdfSecurity } from "@/app/features/pdf/hooks/usePdfSecurity";

const EMPTY_DOCS: DocumentRow[] = [];
export default function DocumentViewerPage() {
  const router = useRouter();

  const { docId } =
    useLocalSearchParams<{
      docId: string;
    }>();

  const documentID = Number(docId);

  /**
   * ==========================
   * USER
   * ==========================
   */

  const user = useSelector(
    (state: RootState) => state.user.user
  );

  const userID = user?.id;

  /**
   * ==========================
   * SECURITY
   * ==========================
   */

  usePdfSecurity();

  /**
   * ==========================
   * DOCUMENTS
   * ==========================
   */

  const packsQuery =
    usePackDocumentsQuery(userID);

  const docsForPack =
    packsQuery.data ?? EMPTY_DOCS;

  const docsWithCorrection =
    useDocumentAndCorrection(documentID);

  const all =
    docsWithCorrection.data ?? [];

  const document =
    all[0]?.document as
    | DocumentRow
    | undefined;

  const correction =
    all[0]?.correction as
    | DocumentRow
    | undefined;

  /**
   * ==========================
   * TAB
   * ==========================
   */

  const [activeTab, setActiveTab] =
    useState<
      "document" | "correction"
    >("document");

  /**
   * ==========================
   * DOCUMENT COURANT
   * ==========================
   */

  const currentDocument =
    useMemo(() => {

      if (
        activeTab === "correction" &&
        correction
      ) {
        return correction;
      }

      return document;

    }, [
      activeTab,
      document,
      correction,
    ]);

  /**
   * ==========================
   * URL ABSOLUE
   * ==========================
   */

  const absoluteUrl =
    useMemo(() => {

      if (!currentDocument)
        return "";

      return currentDocument.url;

    }, [currentDocument]);

  /**
   * ==========================
   * DOWNLOAD
   * ==========================
   */

  const pdfDownload =
    usePdfDownload();

  useEffect(() => {

    if (!absoluteUrl) return;

    pdfDownload.downloadPdf(
      absoluteUrl
    );

  }, [absoluteUrl]);

  /**
   * ==========================
   * READER
   * ==========================
   */

  const reader =
    usePdfReader({
      documentID,
    });

  /**
   * ==========================
   * DOCUMENT INTROUVABLE
   * ==========================
   */

  if (!document) {

    return (
      <View className="flex-1 justify-center items-center">
        <Text>
          Document introuvable
        </Text>
      </View>
    );

  }

  return (
    <View className="mt-10 flex-1 bg-background-light dark:bg-background-dark">
      <PdfToolbar
        title={currentDocument?.subject ?? "Document"}
        activeTab={activeTab}
        progress={reader.progress}
        currentPage={reader.currentPage}
        totalPages={reader.totalPages}
        onBack={() => router.back()}
        onChangeTab={setActiveTab}
        onDownload={() => {
          if (absoluteUrl) {
            pdfDownload.downloadPdf(absoluteUrl);
          }
        }}
        onMore={() => { }}
      />

      <View className="flex-1">
        <PdfViewer
          localUri={pdfDownload.localUri}
          loading={pdfDownload.loading}
          error={pdfDownload.error}
          currentPage={reader.currentPage}
          totalPages={reader.totalPages}
          progress={reader.progress}
          onLoadComplete={reader.onLoadComplete}
          onPageChanged={reader.onPageChanged}
        />

        <PdfWatermark
          username={`${user?.username} ${user?.surname}`}
          email={user?.email}
          // logo={require("@/app/assets/images/logo.png")}
        />
      </View>
    </View>
  );

}