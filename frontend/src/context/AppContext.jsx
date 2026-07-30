import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  getCart,
  addItem as cartAddItem,
  removeItem as cartRemoveItem,
  clearCart as cartClearCart,
  updateItemQuantity as cartUpdateItemQuantity,
  createCart,
} from '../services/cartService';
import { getProductById } from '../services/productService';
import { useAuth } from './AuthContext';

const AppContext = createContext();

const initialState = {
  user: null,
  cart: [],
  wishlist: [],
  isAuthenticated: false,
  loading: false,
  error: null,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload, loading: false, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_TO_WISHLIST': {
      const exists = state.wishlist.find((item) => item.id === action.payload.id);
      if (exists) return state;
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    }
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, wishlist: state.wishlist.filter((item) => item.id !== action.payload.id) };
    default:
      return state;
  }
};

const enrichCartItems = async (items) => {
  if (!items || items.length === 0) return [];

  const enriched = await Promise.all(
    items.map(async (item) => {
      try {
        const product = await getProductById(item.productId);
        return {
          ...item,
          id: item.productId,
          image: product.image,
          size: product.sizes?.[0] || 'M',
          color: product.colors?.[0] || '#000',
        };
      } catch {
        return {
          ...item,
          id: item.productId,
          image: null,
          size: 'M',
          color: '#000',
        };
      }
    })
  );
  return enriched;
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    dispatch({ type: 'SET_USER', payload: user });
  }, [user]);

  const getUserId = useCallback(() => {
    return user?.sub || user?.email || null;
  }, [user]);

  const loadCart = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      dispatch({ type: 'SET_CART', payload: [] });
      return;
    }
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      let cart;
      try {
        cart = await getCart(userId);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          await createCart(userId);
          dispatch({ type: 'SET_CART', payload: [] });
          return;
        }
        throw err;
      }
      const enrichedItems = await enrichCartItems(cart.items || []);
      dispatch({ type: 'SET_CART', payload: enrichedItems });
    } catch (err) {
      console.error('Failed to load cart:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
    }
  }, [getUserId]);

  const addToCart = useCallback(async (item) => {
    const userId = getUserId();
    if (!userId) return false;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await cartAddItem(userId, {
        productId: item.productId || item.id,
        quantity: item.quantity || 1,
      });
      await loadCart();
      return true;
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
      return false;
    }
  }, [getUserId, loadCart]);

  const removeFromCart = useCallback(async (productId) => {
    const userId = getUserId();
    if (!userId) return false;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await cartRemoveItem(userId, productId);
      await loadCart();
      return true;
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' });
      return false;
    }
  }, [getUserId, loadCart]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    const userId = getUserId();
    if (!userId) return { success: false, error: 'Not authenticated' };

    try {
      const result = await cartUpdateItemQuantity(userId, productId, quantity);
      const updatedItems = result?.cart?.items;
      if (updatedItems) {
        const enrichedItems = await enrichCartItems(updatedItems);
        dispatch({ type: 'SET_CART', payload: enrichedItems });
      } else {
        await loadCart();
      }
      return { success: true };
    } catch (patchErr) {
      const status = patchErr?.response?.status;
      if (status === 404 || status === 405 || !patchErr?.response) {
        try {
          await cartRemoveItem(userId, productId);
          await cartAddItem(userId, { productId, quantity });
          await loadCart();
          return { success: true };
        } catch (fallbackErr) {
          const message = fallbackErr?.response?.data?.error || 'Failed to update quantity';
          console.error('Update quantity fallback failed:', fallbackErr);
          return { success: false, error: message };
        }
      }
      const message = patchErr?.response?.data?.error || 'Failed to update quantity';
      console.error('Failed to update quantity:', patchErr);
      return { success: false, error: message };
    }
  }, [getUserId, loadCart]);

  const clearCartItems = useCallback(async () => {
    const userId = getUserId();
    if (!userId) return false;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await cartClearCart(userId);
      dispatch({ type: 'SET_CART', payload: [] });
      return true;
    } catch (err) {
      console.error('Failed to clear cart:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear cart' });
      return false;
    }
  }, [getUserId]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return (
    <AppContext.Provider value={{ state, dispatch, loadCart, addToCart, removeFromCart, updateQuantity, clearCart: clearCartItems }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
