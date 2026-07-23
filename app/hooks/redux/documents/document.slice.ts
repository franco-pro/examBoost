import { createSlice } from "@reduxjs/toolkit";
import { DocumentState } from "./document.state";
import { deleteDoc, getAllDocs, updateDoc } from "./document.thunks";
import { Document } from "../../entities/document";


const initialState: DocumentState = {
    loading: false,
    error: null,
    documentsList: [],
    isSendingSuspended: false
}

const documentSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        addDocument: (state, action)=> {
            if(action.payload){
                state.documentsList.unshift(action.payload);
            }
        },
        setDocumentsList: (state, action)=>{
            state.documentsList = action.payload;
        },
        deleteOne : (state, action)=>{
            if(action.payload){
                state.documentsList = state.documentsList.filter(data => data.id !== action.payload)
            }
        },
        deleteTwo: (state, action)=>{
            if(Array.isArray(action.payload)){
                const doc_id = action.payload[0];
                const cor_id = action.payload[1];

                state.documentsList = state.documentsList.filter(doc => (doc.id != doc_id && doc.id != cor_id))
            }
        },
        updateSendingStatut: (state, action)=>{
            state.isSendingSuspended = action.payload;
        },
        resetState: (state)=>{
            state.loading = false;
            state.error = null;
            state.documentsList = [];
        }
    },
    extraReducers: (builder)=>{
            builder
                .addCase(getAllDocs.pending, (state)=>{
                    state.loading = true;
                    state.error = null;
                })
                .addCase(getAllDocs.fulfilled, (state, action)=>{
                    if(!action.payload.error){
                        state.documentsList = action.payload.data.documents;
                        state.isSendingSuspended = action.payload.data.isSendingSuspended;
                    }else{
                        state.error = action.payload.error;
                    }
                    state.loading = false;
                })
                .addCase(getAllDocs.rejected, (state, action)=>{
                    state.loading = false;
                    state.error = action.payload as string;
                })
                .addCase(updateDoc.pending, (state)=>{
                    state.loading = true;
                    state.error = null;
                })
                .addCase(updateDoc.fulfilled, (state, action)=>{
                    if(!action.payload.error){
                        const updatedDocData = {...action.payload.data} as Document;

                        if(updatedDocData.isValidated){
                            const index = state.documentsList.findIndex(doc => doc.id === updatedDocData.id);
                            const docLinkedIndex = state.documentsList.findIndex(doc => doc.id !== updatedDocData.id && doc.correctionId === updatedDocData.correctionId);

                            if(index !== -1 && docLinkedIndex !== -1){
                                state.documentsList[index] = updatedDocData;
                                state.documentsList[docLinkedIndex].isValidated = updatedDocData.isValidated; 
                            }
                        }else{
                            const firstIndex = state.documentsList.findIndex(doc => doc.id === updatedDocData.id);

                            const linkID = state.documentsList.find((doc)=> doc.correctionId === updatedDocData.correctionId && doc.id !== updatedDocData.id)?.id;
                            if(linkID){
                                const index = state.documentsList.findIndex((doc)=> doc.id === linkID);

                                if(index !== -1 && firstIndex !== -1){
                                    //delete in the list 
                                    state.documentsList.splice(index, 1);
                                    state.documentsList.splice(firstIndex, 1);
                                }
                            }
                        }
                       
                    }else{
                        state.error = action.payload.error;
                    }
                    state.loading = false;
                })
                .addCase(updateDoc.rejected, (state, action)=>{
                    state.loading = false;
                    state.error = action.payload as string;
                })
                .addCase(deleteDoc.pending, (state)=>{
                    state.loading = true;
                    state.error = null;
                })
                .addCase(deleteDoc.fulfilled, (state, action)=>{
                    if(!action.payload.error){
                        const deletedDocId = action.payload.data;
                        const docData = state.documentsList.find(doc => doc.id === deletedDocId);

                        if(docData){
                            let list = state.documentsList.filter(doc => doc.id !== deletedDocId);
                            state.documentsList = list.filter(doc => doc.correctionId !== docData.correctionId);
                        }
                    }else{
                        state.error = action.payload.error;
                    }
                    state.loading = false;
                })
                .addCase(deleteDoc.rejected, (state, action)=>{
                    state.loading = false;
                    state.error = action.payload as string;
                })
    }
})

export default documentSlice.reducer;

export const {
    setDocumentsList,
    resetState,
    deleteOne,
    deleteTwo,
    updateSendingStatut,
    addDocument,
} = documentSlice.actions;