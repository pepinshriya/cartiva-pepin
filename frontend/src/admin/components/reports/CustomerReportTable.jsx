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
} from '@mui/material';

const headCells = [
  { id: 'customer', label: 'Customer', hideMobile: false },
  { id: 'orders', label: 'Orders', hideMobile: false },
  { id: 'spending', label: 'Total Spending', hideMobile: false },
  { id: 'lastPurchase', label: 'Last Purchase', hideMobile: true },
];

const RowSkeleton = () => (
  <TableRow>
    {[140, 50, 80, 100].map((w, i) => (
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

const CustomerReportTable = ({ data, loading }) => {
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

  if (!data.length) {
    return (
      <Paper
        sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', p: 6, textAlign: 'center' }}
      >
        <Typography color="text.secondary">
          No customer data found for the selected period.
        </Typography>
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
                  }}
                >
                  {h.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => (
              <TableRow
                key={row.customerId || i}
                hover
                sx={{ '&:last-child td': { borderBottom: 0 } }}
              >
                <TableCell sx={{ fontSize: 13 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {row.name || '—'}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: { xs: 'none', md: 'block' } }}
                  >
                    {row.email || ''}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>{row.totalOrders ?? 0}</TableCell>
                <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>
                  ${(row.totalSpending ?? 0).toFixed(2)}
                </TableCell>
                <TableCell
                  sx={{ fontSize: 12, color: '#64748b', display: { xs: 'none', md: 'table-cell' } }}
                >
                  {formatDate(row.lastPurchase)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CustomerReportTable;
