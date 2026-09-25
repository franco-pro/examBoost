import * as FileSystem from "expo-file-system/legacy";

const PDF_FOLDER = FileSystem.documentDirectory + "examboost-pdf/";
export interface StoredPdf {
  fileName: string;
  uri: string;
}

class PdfStorage {
  /**
   * Création du dossier
   */
  async initStorage() {
    const info = await FileSystem.getInfoAsync(PDF_FOLDER);

    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(PDF_FOLDER, {
        intermediates: true,
      });
    }
  }

  /**
   * Retourne le dossier PDF
   */
  getPdfDirectory() {
    return PDF_FOLDER;
  }

  /**
   * Chemin complet
   */
  getLocalPdf(fileName: string) {
    return PDF_FOLDER + fileName;
  }

  /**
   * Vérifie si un PDF existe déjà
   */
  async fileExists(fileName: string) {
    const info = await FileSystem.getInfoAsync(this.getLocalPdf(fileName));

    return info.exists;
  }

  /**
   * Sauvegarde un PDF
   */
  async savePdf(remoteUrl: string, fileName: string, token?: string) {
    await this.initStorage();
    const destination = this.getLocalPdf(fileName);
    const exists = await this.fileExists(fileName);
    const options: FileSystem.DownloadOptions = {};

    if (token) {
      options.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    if (exists) {
      console.log("this doc already downloaded:", destination);
      return destination;
    }

    const result = await FileSystem.downloadAsync(
      remoteUrl,
      destination,
      options,
    );
    console.log("DOWNLOAD RESULT:", result);
    console.log("result.status:", result.status);
    console.log("📍 uri :", result.uri);
    const info = await FileSystem.getInfoAsync(result.uri);

    console.log("📦 FILE INFO :", info);
    return result.uri;
  }

  //extraire le chemin du fichier telecharge
  getFileNameFromUrl(url: string) {
    const cleanUrl = url.split("?")[0];

    const fileName = cleanUrl.split("/").pop();

    if (!fileName) {
      throw new Error("Impossible de déterminer le nom du PDF");
    }

    return fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
  }
  /**
   * Supprimer un PDF
   */
  async deletePdf(fileName: string) {
    const exists = await this.fileExists(fileName);
    if (!exists) return;
    await FileSystem.deleteAsync(this.getLocalPdf(fileName));
  }

  /**
   * Tous les PDF téléchargés
   */
  async listDownloadedPdf(): Promise<StoredPdf[]> {
    await this.initStorage();
    const files = await FileSystem.readDirectoryAsync(PDF_FOLDER);
    return files.map((file) => ({
      fileName: file,
      uri: this.getLocalPdf(file),
    }));
  }

  /**
   * Supprimer tous les PDF
   */
  async clearStorage() {
    const files = await this.listDownloadedPdf();
    for (const pdf of files) {
      await FileSystem.deleteAsync(pdf.uri);
    }
  }

  /**
   * Taille totale occupée
   */
  async storageSize() {
    const files = await this.listDownloadedPdf();
    let total = 0;

    for (const file of files) {
      const info = await FileSystem.getInfoAsync(file.uri);
      if (info.exists && info.size) {
        total += info.size;
      }
    }

    return total;
  }
}

export default new PdfStorage();
