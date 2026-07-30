import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { Package } from 'lucide-react';

import ProductToolbar from '../../components/products/ProductToolbar';
import ProductTable from '../../components/products/ProductTable';
import ProductDialog from '../../components/products/ProductDialog';
import DeleteDialog from '../../components/products/DeleteDialog';
import useAdminProducts from '../../hooks/useAdminProducts';

const Products = () => {
  const {
    products,
    loading,
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
  } = useAdminProducts();

  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
      >
        <Package size={22} />
        Products
      </Typography>

      <ProductToolbar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        onAdd={openAddDialog}
      />

      <ProductTable
        products={products}
        loading={loading}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
      />

      <ProductDialog
        open={dialogOpen}
        onClose={closeDialog}
        onSubmit={handleSubmit}
        product={editingProduct}
      />

      <DeleteDialog
        open={deleteOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        product={deletingProduct}
        loading={deleteLoading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2, fontWeight: 500 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Products;
