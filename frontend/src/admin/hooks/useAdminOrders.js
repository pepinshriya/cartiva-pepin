import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getOrders,
  updateOrderStatus,
  getOrderTimeline,
} from '../../services/orderService';

const useAdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load orders';
      setError(msg);
      showSnackbar(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filtered = useMemo(() => {
    let result = orders;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderId?.toLowerCase().includes(q) ||
          o.customer?.name?.toLowerCase().includes(q) ||
          o.customer?.email?.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter((o) => o.status === statusFilter);
    }
    return result;
  }, [orders, search, statusFilter]);

  const openDetailsDrawer = async (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
    setTimelineLoading(true);
    try {
      const data = await getOrderTimeline(order.orderId);
      setTimeline(data);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load timeline';
      showSnackbar(msg, 'error');
      setTimeline([]);
    } finally {
      setTimelineLoading(false);
    }
  };

  const closeDetailsDrawer = () => {
    setDrawerOpen(false);
    setSelectedOrder(null);
    setTimeline([]);
  };

  const openStatusDialog = () => {
    setStatusDialogOpen(true);
  };

  const closeStatusDialog = () => {
    setStatusDialogOpen(false);
  };

  const handleUpdateStatus = async (newStatus, note) => {
    if (!selectedOrder) return;
    setStatusUpdateLoading(true);
    try {
      const updated = await updateOrderStatus(selectedOrder.orderId, newStatus, note);
      setOrders((prev) => prev.map((o) => (o.orderId === updated.orderId ? updated : o)));
      setSelectedOrder(updated);
      showSnackbar(`Order ${selectedOrder.orderId} updated to ${newStatus}`);
      closeStatusDialog();

      const data = await getOrderTimeline(updated.orderId);
      setTimeline(data);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Status update failed';
      showSnackbar(msg, 'error');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  return {
    orders: filtered,
    allOrders: orders,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    snackbar,
    closeSnackbar,
    drawerOpen,
    selectedOrder,
    timeline,
    timelineLoading,
    openDetailsDrawer,
    closeDetailsDrawer,
    statusDialogOpen,
    statusUpdateLoading,
    openStatusDialog,
    closeStatusDialog,
    handleUpdateStatus,
    refetch: fetchOrders,
  };
};

export default useAdminOrders;
