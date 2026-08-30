import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { api } from '~/services/api';
import {
  LocalStorageKeys,
  loadFromLocalStorage,
  saveToLocalStorage,
} from '~/lib/localStorage';
import { createDebounce } from '~/lib/debounce';
import reposReducer, { initialState as reposInitialState } from './reposSlice';

const debouncedSaveToLocalStorage = createDebounce(saveToLocalStorage, 500);

const rootReducer = combineReducers({
  reposReducer,
  [api.reducerPath]: api.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    reposReducer: {
      ...reposInitialState,
      searchValue: loadFromLocalStorage(LocalStorageKeys.SEARCH_VALUE) ?? '',
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

store.subscribe(() => {
  debouncedSaveToLocalStorage(
    LocalStorageKeys.SEARCH_VALUE,
    store.getState().reposReducer.searchValue
  );
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
