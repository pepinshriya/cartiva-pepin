import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { Users } from 'lucide-react';

import CustomerToolbar from '../../components/customers/CustomerToolbar';
import CustomerTable from '../../components/customers/CustomerTable';
import CustomerDetailsDrawer from '../../components/customers/CustomerDetailsDrawer';
import useCustomers from '../../hooks/useCustomers';

const Customers = () => {
  const {
    customers,
    loading,
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
  } = useCustomers();

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
          }}
        >
          <Users size={22} />
          Customers
        </Typography>
      </Box>

      <CustomerToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <CustomerTable
        customers={customers}
        loading={loading}
        onViewDetails={openDetailsDrawer}
      />

      <CustomerDetailsDrawer
        open={drawerOpen}
        onClose={closeDetailsDrawer}
        customer={selectedCustomer}
        orders={customerOrders}
        ordersLoading={ordersLoading}
        onUpdateStatus={handleUpdateStatus}
        statusUpdating={statusUpdating}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Customers;
