import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loadFavoritesFromStorage } from './favoritesStorage';

export interface FavoritesState {
  ids: number[];
}

const initialState: FavoritesState = {
  ids: loadFavoritesFromStorage(),
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (!state.ids.includes(id)) {
        state.ids.push(id);
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.ids = state.ids.filter((existingId) => existingId !== id);
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const index = state.ids.indexOf(id);
      if (index === -1) {
        state.ids.push(id);
      } else {
        state.ids.splice(index, 1);
      }
    },
    clearFavorites: (state) => {
      state.ids = [];
    },
  },
  selectors: {
    selectFavoriteIds: (state): number[] => state.ids,
    selectFavoritesCount: (state): number => state.ids.length,
    selectIsFavorite: (state, id: number): boolean => state.ids.includes(id),
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites } =
  favoritesSlice.actions;

export const { selectFavoriteIds, selectFavoritesCount, selectIsFavorite } =
  favoritesSlice.selectors;

export default favoritesSlice.reducer;
