import {
  Drawer, Box, Typography, IconButton, Divider, Skeleton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import { X, User, ShoppingCart, MapPin, Package, DollarSign, Clock } from 'lucide-react';
import CustomerStatusChip from './CustomerStatusChip';
import { useState, useEffect } from 'react';

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

const formatDateTime = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
    <Box sx={{ color: '#94a3b8', flexShrink: 0, mt: 0.3 }}>
      <Icon size={16} />
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value || '—'}
      </Typography>
    </Box>
  </Box>
);

const CustomerDetailsDrawer = ({
  open, onClose, customer, orders, ordersLoading, onUpdateStatus, statusUpdating,
}) => {
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (customer) {
      setNewStatus(customer.status);
    }
  }, [customer]);

  const handleStatusChange = (e) => {
    const val = e.target.value;
    setNewStatus(val);
    onUpdateStatus(customer.customerId, val);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: '85vw', sm: 480 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ p: 3, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700}>
            Customer Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <X size={18} />
          </IconButton>
        </Box>

        <Divider />

        <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          {!customer ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[1, 2, 3, 4].map((n) => (
                <Skeleton key={n} variant="rounded" width="100%" height={20} />
              ))}
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <CustomerStatusChip status={customer.status} />
                <FormControl size="small" sx={{ minWidth: 130, ml: 'auto' }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newStatus}
                    label="Status"
                    onChange={handleStatusChange}
                    disabled={statusUpdating}
                  >
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="INACTIVE">Inactive</MenuItem>
                    <MenuItem value="BLOCKED">Blocked</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Profile */}
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <User size={16} color="#64748b" />
                Profile
              </Typography>

              <InfoRow icon={User} label="Name" value={customer.name} />
              <InfoRow icon={User} label="Email" value={customer.email} />
              <InfoRow icon={User} label="Phone" value={customer.phone || '—'} />
              <InfoRow icon={User} label="Customer ID" value={customer.customerId} />
              <InfoRow icon={Clock} label="Joined" value={formatDate(customer.createdAt)} />

              <Divider sx={{ my: 2.5 }} />

              {/* Statistics */}
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <DollarSign size={16} color="#64748b" />
                Statistics
              </Typography>

              <InfoRow icon={ShoppingCart} label="Total Orders" value={customer.totalOrders} />
              <InfoRow icon={DollarSign} label="Total Revenue" value={`$${customer.totalSpending?.toFixed(2)}`} />
              {customer.latestOrder && (
                <InfoRow icon={Package} label="Latest Order" value={formatDateTime(customer.latestOrder.createdAt)} />
              )}

              {customer.shippingAddresses?.length > 0 && (
                <>
                  <Divider sx={{ my: 2.5 }} />
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MapPin size={16} color="#64748b" />
                    Shipping Addresses
                  </Typography>
                  {customer.shippingAddresses.map((addr, i) => (
                    <Box
                      key={i}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        borderRadius: 2,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Address {i + 1}
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {addr.city}, {addr.state} {addr.zip}
                      </Typography>
                      {addr.country && (
                        <Typography variant="body2" color="text.secondary">
                          {addr.country}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </>
              )}

              <Divider sx={{ my: 2.5 }} />

              {/* Order History */}
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShoppingCart size={16} color="#64748b" />
                Order History
              </Typography>

              {ordersLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {[1, 2, 3].map((n) => (
                    <Skeleton key={n} variant="rounded" width="100%" height={48} />
                  ))}
                </Box>
              ) : !orders.length ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No orders found.
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: 11 }}>Order</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: 11 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: 11 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: 11, textAlign: 'right' }}>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                          <TableCell sx={{ fontSize: 12, fontWeight: 600 }}>
                            {order.orderId?.length > 10 ? `${order.orderId.slice(0, 10)}…` : order.orderId}
                          </TableCell>
                          <TableCell sx={{ fontSize: 12, color: '#64748b' }}>
                            {formatDate(order.createdAt)}
                          </TableCell>
                          <TableCell sx={{ fontSize: 12 }}>
                            {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                          </TableCell>
                          <TableCell sx={{ fontSize: 12, fontWeight: 600, textAlign: 'right' }}>
                            ${order.totalAmount?.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default CustomerDetailsDrawer;
