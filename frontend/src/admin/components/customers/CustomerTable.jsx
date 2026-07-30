import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Eye } from 'lucide-react';
import { useState, useMemo } from 'react';
import CustomerStatusChip from './CustomerStatusChip';

const headCells = [
  { id: 'customerId', label: 'Customer ID', sortable: false, hideMobile: false },
  { id: 'name', label: 'Name', sortable: false, hideMobile: false },
  { id: 'email', label: 'Email', sortable: false, hideMobile: true },
  { id: 'phone', label: 'Phone', sortable: false, hideMobile: true },
  { id: 'totalOrders', label: 'Total Orders', sortable: false, hideMobile: false },
  { id: 'totalSpending', label: 'Total Spending', sortable: false, hideMobile: false },
  { id: 'status', label: 'Status', sortable: false, hideMobile: false },
  { id: 'joined', label: 'Joined Date', sortable: false, hideMobile: true },
  { id: 'actions', label: '', sortable: false, hideMobile: false },
];

const RowSkeleton = () => (
  <TableRow>
    {[80, 120, 160, 100, 60, 70, 70, 80, 36].map((w, i) => (
      <TableCell key={i}>
        <Skeleton variant="rounded" width={w} height={20} />
      </TableCell>
    ))}
  </TableRow>
);

const formatDate = (iso) => {
  if (!iso) {
    return '—';
  }
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

const CustomerTable = ({ customers, loading, onViewDetails }) => {
  const [orderBy, setOrderBy] = useState('name');
  const [orderDir, setOrderDir] = useState('asc');

  const handleSort = (id) => {
    const isAsc = orderBy === id && orderDir === 'asc';
    setOrderBy(id);
    setOrderDir(isAsc ? 'desc' : 'asc');
  };

  const sorted = useMemo(() => {
    if (!customers.length) {
      return customers;
    }
    return [...customers].sort((a, b) => {
      const aVal =
        orderBy === 'totalSpending'
          ? a.totalSpending
          : orderBy === 'joined'
            ? a.createdAt
            : a[orderBy];
      const bVal =
        orderBy === 'totalSpending'
          ? b.totalSpending
          : orderBy === 'joined'
            ? b.createdAt
            : b[orderBy];
      if (!aVal) {
        return 1;
      }
      if (!bVal) {
        return -1;
      }
      const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal;
      return orderDir === 'asc' ? cmp : -cmp;
    });
  }, [customers, orderBy, orderDir]);

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

  if (!customers.length) {
    return (
      <Paper
        sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', p: 6, textAlign: 'center' }}
      >
        <Typography color="text.secondary">No customers found.</Typography>
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
                    fontWeight: 600,
                    color: '#64748b',
                    fontSize: 12,
                    display: h.hideMobile ? { xs: 'none', md: 'table-cell' } : undefined,
                    cursor: h.sortable ? 'pointer' : undefined,
                  }}
                  onClick={h.sortable ? () => handleSort(h.id) : undefined}
                >
                  {h.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((customer) => (
              <TableRow key={customer.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                  {customer.customerId?.length > 10
                    ? `${customer.customerId.slice(0, 10)}…`
                    : customer.customerId}
                </TableCell>
                <TableCell sx={{ fontSize: 13 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {customer.name}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{ fontSize: 13, color: '#64748b', display: { xs: 'none', md: 'table-cell' } }}
                >
                  {customer.email}
                </TableCell>
                <TableCell
                  sx={{ fontSize: 13, color: '#64748b', display: { xs: 'none', md: 'table-cell' } }}
                >
                  {customer.phone || '—'}
                </TableCell>
                <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>{customer.totalOrders}</TableCell>
                <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>
                  ${customer.totalSpending?.toFixed(2)}
                </TableCell>
                <TableCell sx={{ fontSize: 13 }}>
                  <CustomerStatusChip status={customer.status} />
                </TableCell>
                <TableCell
                  sx={{ fontSize: 12, color: '#64748b', display: { xs: 'none', md: 'table-cell' } }}
                >
                  {formatDate(customer.createdAt)}
                </TableCell>
                <TableCell sx={{ fontSize: 13 }}>
                  <Tooltip title="View Details">
                    <IconButton size="small" onClick={() => onViewDetails(customer)}>
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

export default CustomerTable;
