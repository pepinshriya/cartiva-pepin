import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { getUserOrders } from '../../services/orderService';
import styles from './Orders.module.css';

const statusColors = {
  PENDING: styles.processing,
  CONFIRMED: styles.shipped,
  SHIPPED: styles.shipped,
  DELIVERED: styles.delivered,
  CANCELLED: styles.cancelled,
};

const statusLabels = {
  PENDING: 'Processing',
  CONFIRMED: 'Confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const Orders = () => {
  const { state } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = state.user?.sub || state.user?.email;
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getUserOrders(userId);
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        const message = err?.response?.data?.error || 'Failed to load orders';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [state.user]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container" style={{ textAlign: 'center', padding: '120px 24px' }}>
          <Loader2 size={48} color="#D1D5DB" style={{ animation: 'spin 1s linear infinite' }} />
          <h2>Loading your orders...</h2>
        </div>
      </div>
    );
  }

  if (!state.user) {
    return (
      <div className={styles.page}>
        <div className="container">
          <h1 className={styles.title}>My Orders</h1>
          <div className={styles.empty}>
            <Package size={64} color="#D1D5DB" />
            <h2>Please log in</h2>
            <p>Sign in to view your order history.</p>
            <Link to="/login" className={styles.shopLink}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>My Orders</h1>

        {error && <div className={styles.errorBanner}>{error}</div>}

        {orders.length === 0 ? (
          <div className={styles.empty}>
            <Package size={64} color="#D1D5DB" />
            <h2>No orders yet</h2>
            <p>When you place an order, it will appear here.</p>
            <Link to="/shop" className={styles.shopLink}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className={styles.orders}>
            {orders.map((order, i) => (
              <motion.div
                key={order.orderId}
                className={styles.orderCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={styles.orderHeader}>
                  <div>
                    <span className={styles.orderId}>{order.orderId.slice(0, 8)}...</span>
                    <span className={styles.orderDate}>
                      <Clock size={14} /> {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <span
                    className={`${styles.status} ${statusColors[order.status] || styles.processing}`}
                  >
                    <CheckCircle size={14} /> {statusLabels[order.status] || order.status}
                  </span>
                </div>
                <div className={styles.orderItems}>
                  {order.items.map((item, j) => (
                    <div key={j} className={styles.orderItem}>
                      <Package size={20} color="var(--color-text-secondary)" />
                      <div>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemQty}>Qty: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.orderFooter}>
                  <span className={styles.total}>Total: ${order.totalAmount.toFixed(2)}</span>
                  <span className={styles.paymentStatus}>Payment: {order.paymentStatus}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
