import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SessionState = {
  currentUserId?: number;
};

const initialState: SessionState = {
  currentUserId: undefined,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setCurrentUserId(state, action: PayloadAction<number | undefined>) {
      state.currentUserId = action.payload;
    },
  },
});

export const { setCurrentUserId } = sessionSlice.actions;
export default sessionSlice.reducer;
