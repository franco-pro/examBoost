import userReducer from "./users/users.slice"
import { configureStore,combineReducers } from "@reduxjs/toolkit"
import { persistReducer, persistStore } from "redux-persist"
import AsyncStorage from "@react-native-async-storage/async-storage"


const rootReducer = combineReducers({
    user: userReducer
})

const persistConfig = {
    key: "root",
    storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig,rootReducer)
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefautMiddleware)=>getDefautMiddleware({serializableCheck:false})
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch