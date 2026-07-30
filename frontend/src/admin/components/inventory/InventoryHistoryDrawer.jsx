import { Drawer, Box, Typography, IconButton, Divider, Skeleton, Chip } from '@mui/material';
import { X, History, PackagePlus, Pencil } from 'lucide-react';

const formatDate = (iso) => {
  if (!iso) {
    return '—';
  }
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

const HistorySkeleton = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
    <Skeleton variant="rounded" width="60%" height={16} />
    <Skeleton variant="rounded" width="40%" height={14} />
    <Skeleton variant="rounded" width="90%" height={14} />
  </Box>
);

const InventoryHistoryDrawer = ({ open, onClose, item, history, loading }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: '85vw', sm: 400 }, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <History size={20} color="#64748b" />
            <Typography variant="h6" fontWeight={700}>
              Stock History
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <X size={18} />
          </IconButton>
        </Box>

        {item && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            <strong>{item.productName}</strong> — SKU: {item.sku}
          </Typography>
        )}

        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <>
            <HistorySkeleton />
            <HistorySkeleton />
            <HistorySkeleton />
          </>
        ) : !history || history.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No history recorded yet.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {history.map((entry) => {
              const isRestock = entry.type === 'restock';
              return (
                <Box
                  key={entry.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: isRestock ? '#ecfdf5' : '#fffbeb',
                    border: `1px solid ${isRestock ? '#10b98130' : '#f59e0b30'}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    {isRestock ? (
                      <PackagePlus size={16} color="#10b981" />
                    ) : (
                      <Pencil size={16} color="#f59e0b" />
                    )}
                    <Typography variant="body2" fontWeight={600}>
                      {isRestock ? 'Restock' : 'Adjustment'}
                    </Typography>
                    <Chip
                      label={entry.quantity > 0 ? `+${entry.quantity}` : entry.quantity}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: 11,
                        color: entry.quantity > 0 ? '#10b981' : '#ef4444',
                        bgcolor: entry.quantity > 0 ? '#10b98115' : '#ef444415',
                      }}
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Stock: {entry.previousStock} → {entry.newStock}
                  </Typography>

                  {entry.reason && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Reason: {entry.reason}
                    </Typography>
                  )}

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {formatDate(entry.date)} — {entry.performedBy}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default InventoryHistoryDrawer;
