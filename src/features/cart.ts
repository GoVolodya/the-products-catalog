// eslint-disable-next-line import/no-extraneous-dependencies
import { createSlice } from '@reduxjs/toolkit';
import { Product } from '../types/Product';

const getInitialCart = (): Product[] => {
  const getCartFromStorage = window.localStorage.getItem('cart');

  if (getCartFromStorage) {
    const previousCart = JSON.parse(getCartFromStorage);

    return Array.isArray(previousCart) ? previousCart : [];
  }

  return [];
};

const saveCart = (currentCart: Product[]) => {
  window.localStorage.setItem('cart', JSON.stringify(currentCart));
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState: getInitialCart(),
  reducers: {
    addToCart: (cart, action) => {
      const newCart = [...cart, action.payload];

      saveCart(newCart);

      return newCart;
    },
    removeFromCart: (cart, action) => {
      const index = cart.findIndex(product => product.id === action.payload.id);

      if (index !== -1) {
        const newCart = [...cart.slice(0, index), ...cart.slice(index + 1)];

        saveCart(newCart);

        return newCart;
      }

      saveCart(cart);

      return cart;
    },
    deleteFromCart: (cart, action) => {
      const newCart = cart.filter(product => product.id !== action.payload.id);

      saveCart(newCart);

      return newCart;
    },
    clearCart: () => {
      saveCart([]);

      return [];
    },
  },
});
