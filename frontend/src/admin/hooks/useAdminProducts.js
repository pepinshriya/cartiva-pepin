import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/productService';

const useAdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load products';
      setError(msg);
      showSnackbar(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = useMemo(() => {
    let result = products;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name?.toLowerCase().includes(q) || p.productId?.toLowerCase().includes(q)
      );
    }
    if (category) {
      result = result.filter((p) => p.category === category);
    }
    return result;
  }, [products, search, category]);

  const openAddDialog = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const openEditDialog = (product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.productId, formData);
        showSnackbar('Product updated successfully');
      } else {
        await createProduct(formData);
        showSnackbar('Product created successfully');
      }
      await fetchProducts();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Operation failed';
      showSnackbar(msg, 'error');
      throw err;
    }
  };

  const openDeleteDialog = (product) => {
    setDeletingProduct(product);
    setDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteOpen(false);
    setDeletingProduct(null);
  };

  const handleDelete = async () => {
    if (!deletingProduct) {
      return;
    }
    setDeleteLoading(true);
    try {
      await deleteProduct(deletingProduct.productId);
      showSnackbar('Product deleted successfully');
      closeDeleteDialog();
      await fetchProducts();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete product';
      showSnackbar(msg, 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    products: filtered,
    allProducts: products,
    loading,
    error,
    search,
    setSearch,
    category,
    setCategory,
    snackbar,
    closeSnackbar,
    dialogOpen,
    editingProduct,
    openAddDialog,
    openEditDialog,
    closeDialog,
    handleSubmit,
    deleteOpen,
    deletingProduct,
    deleteLoading,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
    refetch: fetchProducts,
  };
};

export default useAdminProducts;
