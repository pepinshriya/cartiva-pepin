import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getCustomers,
  getCustomerOrders,
  updateCustomerStatus,
} from '../services/customerService';

const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [statusUpdating, setStatusUpdating] = useState(false);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load customers';
      setError(msg);
      showSnackbar(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filtered = useMemo(() => {
    let result = customers;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.customerId?.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter((c) => c.status === statusFilter);
    }
    return result;
  }, [customers, search, statusFilter]);

  const openDetailsDrawer = async (customer) => {
    setSelectedCustomer(customer);
    setDrawerOpen(true);
    setOrdersLoading(true);
    try {
      const orders = await getCustomerOrders(customer.customerId);
      setCustomerOrders(orders);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load orders';
      showSnackbar(msg, 'error');
      setCustomerOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const closeDetailsDrawer = () => {
    setDrawerOpen(false);
    setSelectedCustomer(null);
    setCustomerOrders([]);
  };

  const handleUpdateStatus = async (customerId, newStatus) => {
    setStatusUpdating(true);
    try {
      const updated = await updateCustomerStatus(customerId, newStatus);
      setCustomers((prev) => prev.map((c) => (c.customerId === updated.customerId ? updated : c)));
      setSelectedCustomer(updated);
      showSnackbar(`${updated.name} status updated to ${newStatus}`);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Status update failed';
      showSnackbar(msg, 'error');
    } finally {
      setStatusUpdating(false);
    }
  };

  return {
    customers: filtered,
    allCustomers: customers,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    snackbar,
    closeSnackbar,
    drawerOpen,
    selectedCustomer,
    customerOrders,
    ordersLoading,
    openDetailsDrawer,
    closeDetailsDrawer,
    statusUpdating,
    handleUpdateStatus,
    refetch: fetchCustomers,
  };
};

export default useCustomers;
