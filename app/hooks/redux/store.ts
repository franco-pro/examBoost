import { combineReducers, configureStore } from "@reduxjs/toolkit";
import subscriptionReducer from "./competitions-suscriptions/subscription.slice";
import competitionReducer from "./competitions/competitions.slice";
import roomReducer from "./rooms/rooms.slice";
import transactionReducer from "./transactions/transactions.slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import persistReducer from "redux-persist/es/persistReducer";
import userReducer from "./users/users.slice";
import { persistStore } from "redux-persist";
import sessionReducer from "./session/session.slice";
import notificationsReducer from "./notifications/notifications.slice";

const rootReducer = combineReducers({
  user: userReducer,
  session: sessionReducer,
  rooms: roomReducer,
  competitions: competitionReducer,
  subscriptions: subscriptionReducer,
  transactions: transactionReducer,
  notifications: notificationsReducer,
});
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ['rooms', 'competitions', 'subscriptions', 'transactions', "notification"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
