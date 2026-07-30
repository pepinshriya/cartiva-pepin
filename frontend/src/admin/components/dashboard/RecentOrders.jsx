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
  Chip,
  Box,
} from '@mui/material';
import { ShoppingCart } from 'lucide-react';

const statusColorMap = {
  Delivered: 'success',
  Processing: 'info',
  Shipped: 'warning',
  Pending: 'default',
  Cancelled: 'error',
};

const RecentOrders = ({ orders }) => {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <ShoppingCart size={20} color="#64748b" />
          <Typography variant="h6" fontWeight={600}>
            Recent Orders
          </Typography>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: 12 }}>
                  Order
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: 12 }}>
                  Customer
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#64748b',
                    fontSize: 12,
                    display: { xs: 'none', md: 'table-cell' },
                  }}
                >
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: 12 }}>
                  Status
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, color: '#64748b', fontSize: 12, textAlign: 'right' }}
                >
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>{order.id}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {order.customer}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: { xs: 'none', md: 'block' } }}
                    >
                      {order.email}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 13,
                      color: '#64748b',
                      display: { xs: 'none', md: 'table-cell' },
                    }}
                  >
                    {order.date}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      size="small"
                      color={statusColorMap[order.status]}
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                        fontSize: 11,
                        borderRadius: 1.5,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13, textAlign: 'right' }}>
                    ${order.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
