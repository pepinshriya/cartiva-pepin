import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getInventory,
  restockItem,
  adjustStock,
  getInventoryHistory,
} from '../../services/inventoryService';

const useAdminInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [restockOpen, setRestockOpen] = useState(false);
  const [restockItemData, setRestockItemData] = useState(null);
  const [restockLoading, setRestockLoading] = useState(false);

  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustItemData, setAdjustItemData] = useState(null);
  const [adjustLoading, setAdjustLoading] = useState(false);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItem, setHistoryItem] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const isLowStock = (item) => {
    return item.currentStock <= item.threshold;
  };

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInventory();
      setItems(data);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load inventory';
      setError(msg);
      showSnackbar(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const filtered = useMemo(() => {
    let result = items;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.productName?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      );
    }
    if (lowStockOnly) {
      result = result.filter(isLowStock);
    }
    return result;
  }, [items, search, lowStockOnly]);

  const openRestock = (item) => {
    setRestockItemData(item);
    setRestockOpen(true);
  };

  const closeRestock = () => {
    setRestockOpen(false);
    setRestockItemData(null);
  };

  const handleRestock = async (quantity, note) => {
    if (!restockItemData) return;
    setRestockLoading(true);
    try {
      const updated = await restockItem(restockItemData.productId, quantity, note);
      setItems((prev) => prev.map((i) => (i.productId === updated.productId ? updated : i)));
      showSnackbar(`Restocked ${quantity} units of ${restockItemData.productName}`);
      closeRestock();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Restock failed';
      showSnackbar(msg, 'error');
    } finally {
      setRestockLoading(false);
    }
  };

  const openAdjust = (item) => {
    setAdjustItemData(item);
    setAdjustOpen(true);
  };

  const closeAdjust = () => {
    setAdjustOpen(false);
    setAdjustItemData(null);
  };

  const handleAdjust = async (quantity, reason) => {
    if (!adjustItemData) return;
    setAdjustLoading(true);
    try {
      const updated = await adjustStock(adjustItemData.productId, quantity, reason);
      setItems((prev) => prev.map((i) => (i.productId === updated.productId ? updated : i)));
      const dir = quantity > 0 ? 'increased' : 'decreased';
      showSnackbar(`Stock ${dir} by ${Math.abs(quantity)} for ${adjustItemData.productName}`);
      closeAdjust();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Adjustment failed';
      showSnackbar(msg, 'error');
    } finally {
      setAdjustLoading(false);
    }
  };

  const openHistory = async (item) => {
    setHistoryItem(item);
    setHistoryOpen(true);
    setHistoryLoading(true);
    try {
      const data = await getInventoryHistory(item.productId);
      setHistory(data);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load history';
      showSnackbar(msg, 'error');
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const closeHistory = () => {
    setHistoryOpen(false);
    setHistoryItem(null);
    setHistory([]);
  };

  return {
    items: filtered,
    allItems: items,
    loading,
    error,
    search,
    setSearch,
    lowStockOnly,
    setLowStockOnly,
    snackbar,
    closeSnackbar,
    restockOpen,
    restockItemData,
    restockLoading,
    openRestock,
    closeRestock,
    handleRestock,
    adjustOpen,
    adjustItemData,
    adjustLoading,
    openAdjust,
    closeAdjust,
    handleAdjust,
    historyOpen,
    historyItem,
    history,
    historyLoading,
    openHistory,
    closeHistory,
    refetch: fetchInventory,
  };
};

export default useAdminInventory;
