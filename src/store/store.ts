import { configureStore } from '@reduxjs/toolkit';
import { api } from '~/services/api';

// The store exists for RTK Query alone: the cache of GitHub responses, the
// request lifecycle and the deduplication of identical windows all live in it.
// There is no hand-written slice, because there is no state left that the URL
// does not already hold - the search term and the page number travel in the
// address, which survives a reload and a shared link. A slice mirroring them
// would be a second copy to keep in sync, and the first attempt at one is
// exactly what used to wipe the page number on every click.
const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
