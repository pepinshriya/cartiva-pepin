import axios from "axios";
import { getAccessToken } from "../auth/cognitoService";
import API_CONFIG from "../config/api";

const productApi = axios.create({
  baseURL: API_CONFIG.products.baseURL,
  headers: { "Content-Type": "application/json" },
});

productApi.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Token unavailable — proceed without header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

productApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const transformProduct = (product) => {
  const primaryImage = product.imageUrl || product.image || "";
  return {
    id: product.productId,
    productId: product.productId,
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice ?? null,
    image: primaryImage,
    images: product.images ?? (primaryImage ? [primaryImage] : []),
    category: product.category,
    inStock: product.inStock ?? true,
    rating: product.rating ?? 4.5,
    reviews: product.reviews ?? 0,
    badge: product.badge ?? null,
    trending: product.trending ?? false,
    colors: product.colors ?? [],
    sizes: product.sizes ?? [],
  };
};

export const getProducts = async () => {
  try {
    const response = await productApi.get("/api/products");
    const items = response.data?.data ?? response.data ?? [];
    return items.map(transformProduct);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await productApi.get(`/api/products/${productId}`);
    const product = response.data?.data ?? response.data;
    return transformProduct(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const payload = {
      name: productData.name,
      description: productData.description,
      price: Number(productData.price),
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
      imageUrl: productData.image || productData.imageUrl || "",
      category: productData.category,
      inStock: productData.inStock ?? true,
    };

    const response = await productApi.post("/api/products", payload);
    const created = response.data?.data ?? response.data;
    return transformProduct(created);
  } catch (error) {
    console.error("Failed to create product:", error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const payload = {
      name: productData.name,
      description: productData.description,
      price: Number(productData.price),
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
      imageUrl: productData.image || productData.imageUrl || "",
      category: productData.category,
      inStock: productData.inStock ?? true,
    };

    const response = await productApi.put(`/api/products/${productId}`, payload);
    const updated = response.data?.data ?? response.data;
    return transformProduct(updated);
  } catch (error) {
    console.error("Failed to update product:", error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    await productApi.delete(`/api/products/${productId}`);
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw error;
  }
};
