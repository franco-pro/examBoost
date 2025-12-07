import { configureStore } from "@reduxjs/toolkit";
import subscriptionReducer from "./competitions-suscriptions/subscription.slice";
import competitionReducer from "./competitions/competitions.slice";
import roomReducer from "./rooms/rooms.slice";
import transactionReducer from "./transactions/transactions.slice";


export const store = configureStore({
  reducer: {
    rooms: roomReducer,
    competitions: competitionReducer,
    subscriptions: subscriptionReducer,
    transactions: transactionReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;