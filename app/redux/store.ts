import { configureStore } from "@reduxjs/toolkit";
// import roomReducer from "./rooms/rooms.slice";

export const store = configureStore({
  reducer: {
    // rooms: roomReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;