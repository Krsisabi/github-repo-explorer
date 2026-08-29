import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { api } from '~/services/api';
import reposReducer from './reposSlice';

const rootReducer = combineReducers({
  reposReducer,
  [api.reducerPath]: api.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
