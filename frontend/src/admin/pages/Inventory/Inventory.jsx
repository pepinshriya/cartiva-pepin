import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { Warehouse } from 'lucide-react';

import InventoryToolbar from '../../components/inventory/InventoryToolbar';
import InventoryTable from '../../components/inventory/InventoryTable';
import RestockDialog from '../../components/inventory/RestockDialog';
import AdjustmentDialog from '../../components/inventory/AdjustmentDialog';
import InventoryHistoryDrawer from '../../components/inventory/InventoryHistoryDrawer';
import useAdminInventory from '../../hooks/useAdminInventory';

const Inventory = () => {
  const {
    items,
    loading,
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
  } = useAdminInventory();

  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 3,
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
        }}
      >
        <Warehouse size={22} />
        Inventory
      </Typography>

      <InventoryToolbar
        search={search}
        onSearchChange={setSearch}
        lowStockOnly={lowStockOnly}
        onLowStockChange={setLowStockOnly}
      />

      <InventoryTable
        items={items}
        loading={loading}
        onRestock={openRestock}
        onAdjust={openAdjust}
        onHistory={openHistory}
      />

      <RestockDialog
        open={restockOpen}
        onClose={closeRestock}
        onConfirm={handleRestock}
        item={restockItemData}
        loading={restockLoading}
      />

      <AdjustmentDialog
        open={adjustOpen}
        onClose={closeAdjust}
        onConfirm={handleAdjust}
        item={adjustItemData}
        loading={adjustLoading}
      />

      <InventoryHistoryDrawer
        open={historyOpen}
        onClose={closeHistory}
        item={historyItem}
        history={history}
        loading={historyLoading}
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

export default Inventory;
