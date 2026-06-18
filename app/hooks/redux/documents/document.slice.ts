import { createSlice } from "@reduxjs/toolkit";
import { DocumentState } from "./document.state";
import { deleteDoc, getAllDocs, updateDoc } from "./document.thunks";


const initialState: DocumentState = {
    loading: false,
    error: null,
    documentsList: []
}

const documentSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
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
                        state.documentsList = action.payload.data;
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
                        const updatedDoc = {...action.payload.data};
    
                        const index = state.documentsList.findIndex(doc => doc.id === updatedDoc.id);
                        if(index !== -1){
                            state.documentsList[index] = updatedDoc;
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
    
                        state.documentsList = state.documentsList.filter(doc => doc.id !== deletedDocId);
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
    deleteTwo
} = documentSlice.actions;