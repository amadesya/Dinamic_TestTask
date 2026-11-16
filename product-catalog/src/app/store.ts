import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { productsApi } from '../api/productsApi';
import favoritesReducer from '../features/favorites/favoritesSlice';
import { saveFavoritesToStorage } from '../features/favorites/favoritesStorage';

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

setupListeners(store.dispatch);

// Automatically persist favorites in localStorage whenever favorites state changes
let currentFavoriteIds = store.getState().favorites.ids;
store.subscribe(() => {
  const previousFavoriteIds = currentFavoriteIds;
  currentFavoriteIds = store.getState().favorites.ids;
  if (previousFavoriteIds !== currentFavoriteIds) {
    saveFavoritesToStorage(currentFavoriteIds);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
