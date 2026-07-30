import axios from "axios";
import { getAccessToken } from "../auth/cognitoService";
import API_CONFIG from "../config/api";

const cartApi = axios.create({
  baseURL: API_CONFIG.cart.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

cartApi.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Token unavailable
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const createCart = async (userId) => {
  const response = await cartApi.post("/", { userId });
  return response.data.data;
};

export const getCart = async (userId) => {
  const response = await cartApi.get(`/${userId}`);
  return response.data.data;
};

export const addItem = async (userId, item) => {
  const response = await cartApi.post(`/${userId}/items`, item);
  return response.data.data;
};

export const updateItemQuantity = async (userId, productId, quantity) => {
  const response = await cartApi.patch(`/${userId}/items/${productId}`, { quantity });
  return response.data.data;
};

export const removeItem = async (userId, productId) => {
  const response = await cartApi.delete(`/${userId}/items/${productId}`);
  return response.data.data;
};

export const clearCart = async (userId) => {
  const response = await cartApi.delete(`/${userId}`);
  return response.data;
};
