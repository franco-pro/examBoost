import { useCallback, useEffect, useState } from "react";
import {
  getRecentDocuments,
  RecentDocument,
  saveRecentDocument,
} from "@/app/hooks/files/recentDocuments/recentDocument";

interface PdfReaderProps {
  documentID: number;
}

export function usePdfReader({ documentID }: PdfReaderProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [progress, setProgress] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(true);

  /**
   * Charger la progression sauvegardée
   */
  const loadHistory = useCallback(async () => {
    try {
      setLoadingHistory(true);
      const history = await getRecentDocuments();
      const recent = history.find((doc:RecentDocument) => doc.documentId === documentID);
console.log("recent dans pdf reader:", recent, "documentid:", documentID)
      if (!recent) return;

      setCurrentPage(recent.currentPage);
      setTotalPages(recent.totalPages);
      setProgress(recent.progress);
    } catch (e) {
      console.log("Erreur chargement historique :", e);
    } finally {
      setLoadingHistory(false);
    }
  }, [documentID]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  /**
   * PDF complètement chargé
   */
  const onLoadComplete = useCallback(
    async (pages: number) => {
      setTotalPages(pages);

      await saveRecentDocument(documentID, currentPage, pages);
    },
    [documentID, currentPage],
  );

  /**
   * Changement de page
   */
  const onPageChanged = useCallback(
    async (page: number) => {
      setCurrentPage(page);
      const value = Math.round((page / totalPages) * 100);
      setProgress(value);
      await saveRecentDocument(documentID, page, totalPages);
    },
    [documentID, totalPages],
  );

  /**
   * Lecture terminée
   */
  const finishReading = useCallback(async () => {
    await saveRecentDocument(documentID, totalPages, totalPages);

    setCurrentPage(totalPages);
    setProgress(100);
  }, [documentID, totalPages]);

  return {
    currentPage,
    totalPages,
    progress,
    loadingHistory,
    onLoadComplete,
    onPageChanged,
    finishReading,
  };
}
