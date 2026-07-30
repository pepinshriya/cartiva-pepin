import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Skeleton, Typography,
} from '@mui/material';

const headCells = [
  { id: 'product', label: 'Product', hideMobile: false },
  { id: 'stock', label: 'Current Stock', hideMobile: false },
  { id: 'threshold', label: 'Threshold', hideMobile: true },
  { id: 'value', label: 'Inventory Value', hideMobile: false },
];

const RowSkeleton = () => (
  <TableRow>
    {[140, 50, 50, 80].map((w, i) => (
      <TableCell key={i}>
        <Skeleton variant="rounded" width={w} height={20} />
      </TableCell>
    ))}
  </TableRow>
);

const InventoryReportTable = ({ data, loading }) => {
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
      <Paper sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', p: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">No inventory data found.</Typography>
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
              <TableRow key={row.productId || i} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                <TableCell sx={{ fontSize: 13 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {row.productName || 'Unknown'}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: (row.currentStock ?? 0) <= (row.threshold ?? 10) ? '#ef4444' : '#10b981',
                  }}
                >
                  {row.currentStock ?? 0}
                </TableCell>
                <TableCell sx={{ fontSize: 13, color: '#64748b', display: { xs: 'none', md: 'table-cell' } }}>
                  {row.threshold ?? 0}
                </TableCell>
                <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>
                  ${(row.inventoryValue ?? 0).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default InventoryReportTable;
