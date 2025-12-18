import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './session/slice';
import usersReducer from './users/slice';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
