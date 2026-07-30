import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
} from '@mui/material';
import { X, ShoppingCart, User, MapPin, FileText } from 'lucide-react';
import { OrderStatusChip, PaymentStatusChip } from './OrderStatusChip';
import OrderTimeline from './OrderTimeline';

const formatDate = (iso) => {
  if (!iso) {
    return '—';
  }
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

const OrderDetailsDrawer = ({
  open,
  onClose,
  order,
  timeline,
  timelineLoading,
  onUpdateStatus,
}) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: '85vw', sm: 480 },
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Box
          sx={{
            p: 3,
            pb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Order Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <X size={18} />
          </IconButton>
        </Box>

        <Divider />

        <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          {!order ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[1, 2, 3, 4].map((n) => (
                <Skeleton key={n} variant="rounded" width="100%" height={20} />
              ))}
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                <OrderStatusChip status={order.status} />
                <PaymentStatusChip status={order.paymentStatus} />
              </Box>

              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <ShoppingCart size={16} color="#64748b" />
                Order Info
              </Typography>

              <InfoRow icon={FileText} label="Order ID" value={order.orderId} />
              <InfoRow
                icon={ShoppingCart}
                label="Total Amount"
                value={`$${order.totalAmount?.toFixed(2)}`}
              />
              <InfoRow
                icon={ShoppingCart}
                label="Items"
                value={`${order.items?.length ?? 0} item(s)`}
              />
              <InfoRow icon={FileText} label="Created" value={formatDate(order.createdAt)} />
              {order.updatedAt && (
                <InfoRow icon={FileText} label="Last Updated" value={formatDate(order.updatedAt)} />
              )}

              <Divider sx={{ my: 2.5 }} />

              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <User size={16} color="#64748b" />
                Customer
              </Typography>

              <InfoRow icon={User} label="Name" value={order.customer?.name} />
              <InfoRow icon={User} label="Email" value={order.customer?.email} />

              {order.shippingAddress && (
                <>
                  <Divider sx={{ my: 2.5 }} />
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <MapPin size={16} color="#64748b" />
                    Shipping Address
                  </Typography>
                  {order.shippingAddress.line1 && (
                    <InfoRow icon={MapPin} label="Address" value={order.shippingAddress.line1} />
                  )}
                  {order.shippingAddress.city && (
                    <InfoRow icon={MapPin} label="City" value={order.shippingAddress.city} />
                  )}
                  {order.shippingAddress.state && (
                    <InfoRow icon={MapPin} label="State" value={order.shippingAddress.state} />
                  )}
                  {order.shippingAddress.zip && (
                    <InfoRow icon={MapPin} label="ZIP" value={order.shippingAddress.zip} />
                  )}
                  {order.shippingAddress.country && (
                    <InfoRow icon={MapPin} label="Country" value={order.shippingAddress.country} />
                  )}
                </>
              )}

              {order.items?.length > 0 && (
                <>
                  <Divider sx={{ my: 2.5 }} />
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                    Items
                  </Typography>

                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: 11 }}>
                            Item
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              color: '#64748b',
                              fontSize: 11,
                              textAlign: 'right',
                            }}
                          >
                            Qty
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              color: '#64748b',
                              fontSize: 11,
                              textAlign: 'right',
                            }}
                          >
                            Price
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.items.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell sx={{ fontSize: 13 }}>{item.name}</TableCell>
                            <TableCell sx={{ fontSize: 13, textAlign: 'right' }}>
                              {item.quantity}
                            </TableCell>
                            <TableCell sx={{ fontSize: 13, textAlign: 'right' }}>
                              ${(item.price * item.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}

              <Divider sx={{ my: 2.5 }} />

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  Progress
                </Typography>
                <Chip
                  label="Update Status"
                  size="small"
                  color="primary"
                  onClick={onUpdateStatus}
                  sx={{ cursor: 'pointer', fontWeight: 600, fontSize: 11 }}
                />
              </Box>

              <OrderTimeline
                events={timeline}
                loading={timelineLoading}
                currentStatus={order.status}
              />
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default OrderDetailsDrawer;
