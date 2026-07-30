import { Chip } from '@mui/material';

const getStatus = (stock, threshold) => {
  if (threshold <= 0) return 'normal';
  if (stock <= 0) return 'out';
  if (stock <= threshold * 0.3) return 'critical';
  if (stock <= threshold) return 'low';
  return 'normal';
};

const statusConfig = {
  normal: { label: 'In Stock', color: '#10b981', bg: '#ecfdf5', border: '#10b981' },
  low: { label: 'Low Stock', color: '#f59e0b', bg: '#fffbeb', border: '#f59e0b' },
  critical: { label: 'Critical', color: '#ef4444', bg: '#fef2f2', border: '#ef4444' },
  out: { label: 'Out of Stock', color: '#64748b', bg: '#f1f5f9', border: '#64748b' },
};

const InventoryStatusChip = ({ stock, threshold }) => {
  const status = getStatus(stock, threshold);
  const cfg = statusConfig[status];

  return (
    <Chip
      label={cfg.label}
      size="small"
      variant="outlined"
      sx={{
        fontWeight: 600,
        fontSize: 11,
        borderRadius: 1.5,
        color: cfg.color,
        borderColor: cfg.border,
        bgcolor: cfg.bg,
      }}
    />
  );
};

export default InventoryStatusChip;
