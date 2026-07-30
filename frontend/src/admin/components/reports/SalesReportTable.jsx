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
  { id: 'date', label: 'Date', hideMobile: false },
  { id: 'orders', label: 'Orders', hideMobile: false },
  { id: 'revenue', label: 'Revenue', hideMobile: false },
  { id: 'aov', label: 'Avg Order Value', hideMobile: true },
];

const RowSkeleton = () => (
  <TableRow>
    {[100, 50, 70, 80].map((w, i) => (
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

const SalesReportTable = ({ data, loading }) => {
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
        <Typography color="text.secondary">No sales data found for the selected period.</Typography>
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
              <TableRow key={i} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                <TableCell sx={{ fontSize: 13, color: '#64748b' }}>
                  {formatDate(row.date)}
                </TableCell>
                <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>{row.orders ?? 0}</TableCell>
                <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>
                  ${(row.revenue ?? 0).toFixed(2)}
                </TableCell>
                <TableCell sx={{ fontSize: 13, display: { xs: 'none', md: 'table-cell' } }}>
                  ${(row.avgOrderValue ?? 0).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SalesReportTable;
