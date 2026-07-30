import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { PackagePlus, Pencil, History } from 'lucide-react';
import InventoryStatusChip from './InventoryStatusChip';

const headCells = [
  { id: 'product', label: 'Product', sortable: false, hideMobile: false },
  { id: 'current', label: 'Current Stock', sortable: false, hideMobile: false },
  { id: 'reserved', label: 'Reserved', sortable: false, hideMobile: true },
  { id: 'available', label: 'Available', sortable: false, hideMobile: true },
  { id: 'threshold', label: 'Threshold', sortable: false, hideMobile: true },
  { id: 'status', label: 'Status', sortable: false, hideMobile: false },
  { id: 'updated', label: 'Last Updated', sortable: false, hideMobile: true },
  { id: 'actions', label: 'Actions', sortable: false, hideMobile: false },
];

const RowSkeleton = () => (
  <TableRow>
    {[140, 50, 50, 50, 50, 80, 80, 100].map((w, i) => (
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

const InventoryTable = ({ items, loading, onRestock, onAdjust, onHistory }) => {
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

  if (!items.length) {
    return (
      <Paper
        sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', p: 6, textAlign: 'center' }}
      >
        <Typography color="text.secondary">No inventory items found.</Typography>
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
            {items.map((item) => {
              const available = item.currentStock - item.reservedStock;
              return (
                <TableRow key={item.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell sx={{ fontSize: 13 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {item.productName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.sku}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>{item.currentStock}</TableCell>
                  <TableCell
                    sx={{
                      fontSize: 13,
                      color: '#64748b',
                      display: { xs: 'none', md: 'table-cell' },
                    }}
                  >
                    {item.reservedStock}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: available <= 0 ? '#ef4444' : '#10b981',
                      display: { xs: 'none', md: 'table-cell' },
                    }}
                  >
                    {available}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 13,
                      color: '#64748b',
                      display: { xs: 'none', md: 'table-cell' },
                    }}
                  >
                    {item.threshold}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13 }}>
                    <InventoryStatusChip stock={item.currentStock} threshold={item.threshold} />
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 12,
                      color: '#64748b',
                      display: { xs: 'none', md: 'table-cell' },
                    }}
                  >
                    {formatDate(item.lastUpdated)}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13 }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Restock">
                        <IconButton size="small" color="primary" onClick={() => onRestock(item)}>
                          <PackagePlus size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Adjust Stock">
                        <IconButton size="small" color="warning" onClick={() => onAdjust(item)}>
                          <Pencil size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="History">
                        <IconButton size="small" color="default" onClick={() => onHistory(item)}>
                          <History size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default InventoryTable;
