import type { DocumentRow } from '@/src/features/documents/utils';
import type { Pack } from '@/src/features/packs/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPackDocumentsHttp, fetchPacksHttp, purchasePackHttp } from './thunks';

export type PacksState = {
  byId: Record<number, Pack>;
  ids: number[];
  loading: boolean;
  error?: string | null;
  purchasingById: Record<number, boolean>;
  documentsByPackId: Record<number, DocumentRow[]>;
  documentsLoadingByPackId: Record<number, boolean>;
};

const initialState: PacksState = {
  byId: {},
  ids: [],
  loading: false,
  error: null,
  purchasingById: {},
  documentsByPackId: {},
  documentsLoadingByPackId: {},
};

export const loadPacks = createAsyncThunk('packs/loadPacks', async (params: { userID: number }) => {
  return await fetchPacksHttp(params);
});

export const purchasePack = createAsyncThunk('packs/purchasePack', async (params: { userID: number; packID: number }) => {
  return await purchasePackHttp(params);
});

export const loadPackDocuments = createAsyncThunk('packs/loadPackDocuments', async (params: { userID: number; packID: number }) => {
  const docs = await fetchPackDocumentsHttp(params);
  const rows: DocumentRow[] = docs.map((d) => ({
    id: d.id,
    name: d.name,
    format: d.format,
    url: d.url,
    subject: d.subject,
    isValidated: d.isValidated ? 1 : 0,
    niveauID: d.niveauID,
    created_at: d.created_at,
    updated_at: d.updated_at,
  }));
  return { packID: params.packID, documents: rows };
});

const toPackUi = (dto: any): Pack => {
  const access = dto?.access;
  return {
    id: String(dto.id),
    title: dto.name,
    description: dto.description,
    price: dto.price,
    durationDays: dto.durationDays,
    isActive: dto.isActive,
    isSubscribed: access?.isSubscribed && !access?.isExpired,
    updatedAt: dto.updated_at,
    createdAt: dto.created_at,
  };
};

const packsSlice = createSlice({
  name: 'packs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadPacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPacks.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.byId = {};
        state.ids = [];
        for (const dto of action.payload) {
          const p = toPackUi(dto);
          const idNum = Number(dto.id);
          state.byId[idNum] = p;
          state.ids.push(idNum);
        }
      })
      .addCase(loadPacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur chargement packs';
      })
      .addCase(purchasePack.pending, (state, action) => {
        const packID = action.meta.arg.packID;
        state.purchasingById[packID] = true;
      })
      .addCase(purchasePack.fulfilled, (state, action) => {
        const { packID } = action.payload;
        state.purchasingById[packID] = false;
        const p = state.byId[packID];
        if (p) {
          state.byId[packID] = { ...p, isSubscribed: true };
        }
      })
      .addCase(purchasePack.rejected, (state, action) => {
        const packID = action.meta.arg.packID;
        state.purchasingById[packID] = false;
        state.error = action.error.message || 'Erreur achat pack';
      })
      .addCase(loadPackDocuments.pending, (state, action) => {
        const packID = action.meta.arg.packID;
        state.documentsLoadingByPackId[packID] = true;
      })
      .addCase(loadPackDocuments.fulfilled, (state, action) => {
        const { packID, documents } = action.payload;
        state.documentsLoadingByPackId[packID] = false;
        state.documentsByPackId[packID] = documents;
      })
      .addCase(loadPackDocuments.rejected, (state, action) => {
        const packID = action.meta.arg.packID;
        state.documentsLoadingByPackId[packID] = false;
        state.error = action.error.message || 'Erreur chargement documents';
      });
  },
});

export default packsSlice.reducer;
