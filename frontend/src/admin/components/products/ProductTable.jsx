import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, Paper, Skeleton, Box, Typography, IconButton, Avatar,
} from '@mui/material';
import { Edit3, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import ProductStatusChip from './ProductStatusChip';

const headCells = [
  { id: 'image', label: '', sortable: false, hideMobile: false },
  { id: 'name', label: 'Product', sortable: true, hideMobile: false },
  { id: 'category', label: 'Category', sortable: true, hideMobile: true },
  { id: 'price', label: 'Price', sortable: true, hideMobile: false },
  { id: 'stock', label: 'Status', sortable: true, hideMobile: false },
  { id: 'actions', label: 'Actions', sortable: false, hideMobile: false },
];

const RowSkeleton = () => (
  <TableRow>
    {[48, 140, 80, 60, 90, 80].map((w, i) => (
      <TableCell key={i}>
        <Skeleton variant="rounded" width={w} height={i === 0 ? 40 : 20} />
      </TableCell>
    ))}
  </TableRow>
);

const ProductTable = ({ products, loading, onEdit, onDelete }) => {
  const [orderBy, setOrderBy] = useState('name');
  const [orderDir, setOrderDir] = useState('asc');

  const handleSort = (id) => {
    const isAsc = orderBy === id && orderDir === 'asc';
    setOrderBy(id);
    setOrderDir(isAsc ? 'desc' : 'asc');
  };

  const sorted = useMemo(() => {
    if (!products.length || !orderBy) return products;
    return [...products].sort((a, b) => {
      const aVal = a[orderBy] ?? '';
      const bVal = b[orderBy] ?? '';
      const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal;
      return orderDir === 'asc' ? cmp : -cmp;
    });
  }, [products, orderBy, orderDir]);

  const renderImage = (src) => {
    if (!src) return <Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: '#f1f5f9' }} />;
    return (
      <Avatar
        variant="rounded"
        src={src}
        alt=""
        sx={{ width: 40, height: 40 }}
        slotProps={{ img: { style: { objectFit: 'cover' } } }}
      />
    );
  };

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

  if (!products.length) {
    return (
      <Paper sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', p: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">No products found.</Typography>
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
                  {h.sortable ? (
                    <TableSortLabel
                      active={orderBy === h.id}
                      direction={orderBy === h.id ? orderDir : 'asc'}
                      onClick={() => handleSort(h.id)}
                    >
                      {h.label}
                    </TableSortLabel>
                  ) : (
                    h.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((product) => (
              <TableRow key={product.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  {renderImage(product.image)}
                </TableCell>
                <TableCell sx={{ fontSize: 13 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {product.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
                    ID: {product.productId}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: 13, color: '#64748b', display: { xs: 'none', md: 'table-cell' } }}>
                  {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : '—'}
                </TableCell>
                <TableCell sx={{ fontSize: 13 }}>
                  <Typography variant="body2" fontWeight={600}>
                    ${product.price?.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: 13 }}>
                  <ProductStatusChip inStock={product.inStock} />
                </TableCell>
                <TableCell sx={{ fontSize: 13 }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" color="primary" onClick={() => onEdit(product)}>
                      <Edit3 size={16} />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onDelete(product)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ProductTable;
