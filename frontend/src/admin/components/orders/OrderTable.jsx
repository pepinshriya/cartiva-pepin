import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Skeleton, Typography, IconButton, Tooltip,
} from '@mui/material';
import { Eye, ArrowUpDown } from 'lucide-react';
import { OrderStatusChip, PaymentStatusChip } from './OrderStatusChip';
import { useMemo, useState } from 'react';

const headCells = [
  { id: 'orderId', label: 'Order ID', sortable: false, hideMobile: false },
  { id: 'customer', label: 'Customer', sortable: false, hideMobile: false },
  { id: 'items', label: 'Items', sortable: false, hideMobile: true },
  { id: 'total', label: 'Total', sortable: false, hideMobile: false },
  { id: 'payment', label: 'Payment', sortable: false, hideMobile: true },
  { id: 'status', label: 'Status', sortable: false, hideMobile: false },
  { id: 'date', label: 'Date', sortable: false, hideMobile: true },
  { id: 'actions', label: '', sortable: false, hideMobile: false },
];

const RowSkeleton = () => (
  <TableRow>
    {[90, 120, 40, 60, 70, 80, 80, 36].map((w, i) => (
      <TableCell key={i}>
        <Skeleton variant="rounded" width={w} height={20} />
      </TableCell>
    ))}
  </TableRow>
);

const formatDate = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  } catch {
    return iso;
  }
};

const OrderTable = ({ orders, loading, onViewDetails }) => {
  const [orderBy, setOrderBy] = useState('createdAt');
  const [orderDir, setOrderDir] = useState('desc');

  const handleSort = (id) => {
    const isAsc = orderBy === id && orderDir === 'asc';
    setOrderBy(id);
    setOrderDir(isAsc ? 'desc' : 'asc');
  };

  const sorted = useMemo(() => {
    if (!orders.length) return orders;
    return [...orders].sort((a, b) => {
      const aVal = orderBy === 'total' ? a.totalAmount : orderBy === 'date' ? a.createdAt : a[orderBy];
      const bVal = orderBy === 'total' ? b.totalAmount : orderBy === 'date' ? b.createdAt : b[orderBy];
      if (!aVal) return 1;
      if (!bVal) return -1;
      const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal;
      return orderDir === 'asc' ? cmp : -cmp;
    });
  }, [orders, orderBy, orderDir]);

  if (loading) {
    return (
      <Paper sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {headCells.map((h) => (
                  <TableCell key={h.id} sx={{ fontWeight: 600, color: '#64748b', fontSize: 12 }}>
                    {h.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3, 4, 5].map((n) => (
                <RowSkeleton key={n} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (!orders.length) {
    return (
      <Paper sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', p: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">No orders found.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {headCells.map((h) => (
                <TableCell
                  key={h.id}
                  sx={{
                    fontWeight: 600, color: '#64748b', fontSize: 12,
                    display: h.hideMobile ? { xs: 'none', md: 'table-cell' } : undefined,
                    cursor: h.sortable ? 'pointer' : undefined,
                  }}
                  onClick={h.sortable ? () => handleSort(h.id) : undefined}
                >
                  {h.label}
                  {h.sortable && (
                    <ArrowUpDown size={12} style={{ marginLeft: 4, verticalAlign: 'middle', opacity: 0.5 }} />
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((order) => (
              <TableRow key={order.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>
                  {order.orderId?.length > 10 ? `${order.orderId.slice(0, 10)}…` : order.orderId}
                </TableCell>
                <TableCell sx={{ fontSize: 13 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {order.customer?.name || '—'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
                    {order.customer?.email || ''}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: 13, color: '#64748b', display: { xs: 'none', md: 'table-cell' } }}>
                  {order.items?.length ?? 0}
                </TableCell>
                <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>
                  ${order.totalAmount?.toFixed(2)}
                </TableCell>
                <TableCell sx={{ fontSize: 13, display: { xs: 'none', md: 'table-cell' } }}>
                  <PaymentStatusChip status={order.paymentStatus} />
                </TableCell>
                <TableCell sx={{ fontSize: 13 }}>
                  <OrderStatusChip status={order.status} />
                </TableCell>
                <TableCell sx={{ fontSize: 12, color: '#64748b', display: { xs: 'none', md: 'table-cell' } }}>
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell sx={{ fontSize: 13 }}>
                  <Tooltip title="View Details">
                    <IconButton size="small" onClick={() => onViewDetails(order)}>
                      <Eye size={16} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OrderTable;
