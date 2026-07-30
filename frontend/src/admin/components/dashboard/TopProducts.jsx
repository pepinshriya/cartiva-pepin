import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';
import { Star } from 'lucide-react';

const TopProducts = ({ products }) => {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Star size={20} color="#64748b" />
          <Typography variant="h6" fontWeight={600}>
            Top Products
          </Typography>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: 12 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: 12 }}>
                  Product
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#64748b',
                    fontSize: 12,
                    display: { xs: 'none', md: 'table-cell' },
                  }}
                >
                  Category
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, color: '#64748b', fontSize: 12, textAlign: 'right' }}
                >
                  Sold
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, color: '#64748b', fontSize: 12, textAlign: 'right' }}
                >
                  Revenue
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, color: '#64748b', fontSize: 12, textAlign: 'right' }}
                >
                  Growth
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => {
                const isPositive = !product.growth.startsWith('-');
                return (
                  <TableRow key={product.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ fontSize: 13, color: '#94a3b8' }}>{index + 1}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {product.name}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 13,
                        color: '#64748b',
                        display: { xs: 'none', md: 'table-cell' },
                      }}
                    >
                      {product.category}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13, textAlign: 'right' }}>
                      {product.sold.toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13, fontWeight: 600, textAlign: 'right' }}>
                      ${(product.revenue / 1000).toFixed(1)}k
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        textAlign: 'right',
                        color: isPositive ? '#10b981' : '#ef4444',
                      }}
                    >
                      {product.growth}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default TopProducts;
