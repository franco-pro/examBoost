import AsyncStorage from "@react-native-async-storage/async-storage";
const KEY = "RECENT_DOCUMENTS"

export interface RecentDocument {
    documentId: number,
    progress: number,
    currentPage: number,
    totalPages:number,
    openedAt:string
}

export async function saveRecentDocument(documentId: number,  currentPage: number, totalPages:number) {
    try {
        const existing = await AsyncStorage.getItem(KEY)
        let docs: RecentDocument[] = existing ? JSON.parse(existing) : []
        
        //supprimer ancien doublon
        docs = docs.filter((d) => d.documentId !== documentId)
        //calculer la progression
        const progress = totalPages > 0 ? Math.round((currentPage/totalPages)*100):0
        //ajouter en premier
        docs.unshift({
            documentId,
            progress,
            currentPage,
            totalPages,
            openedAt: new Date().toISOString()
        })

        //limiter a 10
        docs = docs.slice(0, 10)
        await AsyncStorage.setItem(KEY, JSON.stringify(docs))
    } catch (error) {
        console.log("Erreur recent docs: ", error)
    }
}
export async function getRecentDocuments() {
    try {
        const existing = await AsyncStorage.getItem(KEY)
        return existing? JSON.parse(existing):[]
    } catch (error) {
        console.log("erreur dans la recuperation des documents recents: ", error)
        return []
    }
}