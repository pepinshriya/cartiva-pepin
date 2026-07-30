import { Chip } from '@mui/material';

const statusConfig = {
  PENDING: { label: 'Pending', color: '#f59e0b', bg: '#fffbeb', border: '#f59e0b' },
  CONFIRMED: { label: 'Confirmed', color: '#3b82f6', bg: '#eff6ff', border: '#3b82f6' },
  SHIPPED: { label: 'Shipped', color: '#8b5cf6', bg: '#f5f3ff', border: '#8b5cf6' },
  DELIVERED: { label: 'Delivered', color: '#10b981', bg: '#ecfdf5', border: '#10b981' },
  CANCELLED: { label: 'Cancelled', color: '#ef4444', bg: '#fef2f2', border: '#ef4444' },
};

const PAYMENT_STATUSES = {
  PAID: { label: 'Paid', color: '#10b981', bg: '#ecfdf5' },
  UNPAID: { label: 'Unpaid', color: '#f59e0b', bg: '#fffbeb' },
  REFUNDED: { label: 'Refunded', color: '#64748b', bg: '#f1f5f9' },
  FAILED: { label: 'Failed', color: '#ef4444', bg: '#fef2f2' },
};

export const OrderStatusChip = ({ status }) => {
  const cfg = statusConfig[status] || { label: status, color: '#64748b', bg: '#f1f5f9', border: '#64748b' };
  return (
    <Chip
      label={cfg.label}
      size="small"
      variant="outlined"
      sx={{
        fontWeight: 600, fontSize: 11, borderRadius: 1.5,
        color: cfg.color, borderColor: cfg.border, bgcolor: cfg.bg,
      }}
    />
  );
};

export const PaymentStatusChip = ({ status }) => {
  const cfg = PAYMENT_STATUSES[status] || { label: status, color: '#64748b', bg: '#f1f5f9' };
  return (
    <Chip
      label={cfg.label}
      size="small"
      sx={{
        fontWeight: 600, fontSize: 11, borderRadius: 1.5,
        color: cfg.color, bgcolor: cfg.bg,
      }}
    />
  );
};
