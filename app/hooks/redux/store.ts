import { combineReducers, configureStore } from "@reduxjs/toolkit";
import subscriptionReducer from "./competitions-suscriptions/subscription.slice";
import competitionReducer from "./competitions/competitions.slice";
import niveauReducer from "./niveaux/niveaux.slice";
import devAdminReducer from "./dev-admin/dev-admin.slice";

import roomReducer from "./rooms/rooms.slice";
import transactionReducer from "./transactions/transactions.slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import persistReducer from "redux-persist/es/persistReducer";
import userReducer from "./users/users.slice";
import { persistStore } from "redux-persist";
import sessionReducer from "./session/session.slice";
import notificationsReducer from "./notifications/notifications.slice";
import packsReducer from "./packs/pack.slice";
import documentsReducer from "./documents/document.slice";
import othersReducer from "./others/others.slice";

const rootReducer = combineReducers({
  user: userReducer,
  session: sessionReducer,
  rooms: roomReducer,
  competitions: competitionReducer,
  subscriptions: subscriptionReducer,
  transactions: transactionReducer,
  niveaux: niveauReducer,
  devadmin: devAdminReducer,
  packs: packsReducer,
  documents: documentsReducer,
  notifications: notificationsReducer,
  others: othersReducer
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: [  
              'rooms', 
              'competitions', 
              'subscriptions', 
              'transactions', 
              "notifications", 
              "devadmin", 
              "niveaux",
              "documents",
              "packs",
              "others"
            ],   
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
