import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { ShoppingCart } from 'lucide-react';

import OrderToolbar from '../../components/orders/OrderToolbar';
import OrderTable from '../../components/orders/OrderTable';
import OrderDetailsDrawer from '../../components/orders/OrderDetailsDrawer';
import UpdateStatusDialog from '../../components/orders/UpdateStatusDialog';
import useAdminOrders from '../../hooks/useAdminOrders';

const Orders = () => {
  const {
    orders,
    loading,
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
  } = useAdminOrders();

  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
      >
        <ShoppingCart size={22} />
        Orders
      </Typography>

      <OrderToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <OrderTable
        orders={orders}
        loading={loading}
        onViewDetails={openDetailsDrawer}
      />

      <OrderDetailsDrawer
        open={drawerOpen}
        onClose={closeDetailsDrawer}
        order={selectedOrder}
        timeline={timeline}
        timelineLoading={timelineLoading}
        onUpdateStatus={openStatusDialog}
      />

      <UpdateStatusDialog
        open={statusDialogOpen}
        onClose={closeStatusDialog}
        onConfirm={handleUpdateStatus}
        order={selectedOrder}
        loading={statusUpdateLoading}
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

export default Orders;
