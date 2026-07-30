import { Chip } from '@mui/material';

const statusConfig = {
  ACTIVE: { label: 'Active', color: '#10b981', bg: '#ecfdf5', border: '#10b981' },
  INACTIVE: { label: 'Inactive', color: '#64748b', bg: '#f1f5f9', border: '#64748b' },
  BLOCKED: { label: 'Blocked', color: '#ef4444', bg: '#fef2f2', border: '#ef4444' },
};

const CustomerStatusChip = ({ status }) => {
  const cfg = statusConfig[status] || {
    label: status,
    color: '#64748b',
    bg: '#f1f5f9',
    border: '#64748b',
  };
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

export default CustomerStatusChip;
