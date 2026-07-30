import api from "../api/axios";

const transformItem = (item) => ({
  id: item.productId || item.id,
  productId: item.productId || item.id,
  productName: item.productName || item.name || "",
  sku: item.sku || item.productId || "",
  currentStock: item.currentStock ?? item.stock ?? item.quantity ?? 0,
  reservedStock: item.reservedStock ?? 0,
  threshold: item.threshold ?? 10,
  lastUpdated: item.lastUpdated ?? item.updatedAt ?? new Date().toISOString(),
  category: item.category ?? "",
  image: item.imageUrl || item.image || "",
});

const transformHistory = (entry) => ({
  id: entry.id || entry.adjustmentId,
  type: entry.type || (entry.quantity > 0 ? "restock" : "adjustment"),
  quantity: entry.quantity ?? 0,
  previousStock: entry.previousStock ?? 0,
  newStock: entry.newStock ?? 0,
  reason: entry.reason || "",
  date: entry.date || entry.createdAt || new Date().toISOString(),
  performedBy: entry.performedBy || entry.userId || "System",
});

export const getInventory = async () => {
  try {
    const response = await api.get("/api/inventory");
    const items = response.data?.data ?? response.data ?? [];
    return items.map(transformItem);
  } catch (error) {
    console.error("Failed to fetch inventory:", error);
    throw error;
  }
};

export const getInventoryItem = async (productId) => {
  try {
    const response = await api.get(`/api/inventory/${productId}`);
    const item = response.data?.data ?? response.data;
    return transformItem(item);
  } catch (error) {
    console.error("Failed to fetch inventory item:", error);
    throw error;
  }
};

export const restockItem = async (productId, quantity, note) => {
  try {
    const response = await api.patch(`/api/inventory/${productId}/increase`, {
      quantity: Number(quantity),
    });
    const updated = response.data?.data ?? response.data;
    return transformItem(updated);
  } catch (error) {
    console.error("Failed to restock item:", error);
    throw error;
  }
};

export const adjustStock = async (productId, quantity, reason) => {
  try {
    const response = await api.post("/api/inventory/adjust", {
      productId,
      quantity: Number(quantity),
      reason: reason || "",
    });
    const updated = response.data?.data ?? response.data;
    return transformItem(updated);
  } catch (error) {
    console.error("Failed to adjust stock:", error);
    throw error;
  }
};

export const getInventoryHistory = async (productId) => {
  try {
    const response = await api.get(`/api/inventory/${productId}/history`);
    const entries = response.data?.data ?? response.data ?? [];
    return entries.map(transformHistory);
  } catch (error) {
    console.error("Failed to fetch inventory history:", error);
    throw error;
  }
};
