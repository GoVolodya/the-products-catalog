// eslint-disable-next-line import/no-extraneous-dependencies
import { createSlice } from '@reduxjs/toolkit';
import { Product } from '../types/Product';

const getInitialFavourites = (): Product[] => {
  const getFavouritesFromStorage = window.localStorage.getItem('favourite');

  if (getFavouritesFromStorage) {
    const previousFavourites = JSON.parse(getFavouritesFromStorage);

    return Array.isArray(previousFavourites) ? previousFavourites : [];
  }

  return [];
};

const saveFavourites = (currentFavourites: Product[]) => {
  window.localStorage.setItem('favourite', JSON.stringify(currentFavourites));
};

export const favouriteSlice = createSlice({
  name: 'favourite',
  initialState: getInitialFavourites(),
  reducers: {
    addToFavourite: (favourite, action) => {
      const newFavourites = [...favourite, action.payload];

      saveFavourites(newFavourites);

      return newFavourites;
    },
    removeFromFavourite: (favourite, action) => {
      const newFavourites = favourite.filter(
        (item: Product) => item.id !== action.payload.id,
      );

      saveFavourites(newFavourites);

      return newFavourites;
    },
  },
});
