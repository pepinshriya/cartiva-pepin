import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react';
import { getOrder } from '../../services/orderService';
import styles from './OrderSuccess.module.css';

const POLL_INTERVAL = 2000;
const POLL_TIMEOUT = 30000;

const OrderSuccess = () => {
  const { state } = useLocation();
  const initialOrder = state?.order;
  const [order, setOrder] = useState(initialOrder);
  const [polling, setPolling] = useState(true);

  const fetchOrder = useCallback(async () => {
    if (!initialOrder?.orderId) {
      return;
    }
    try {
      const latest = await getOrder(initialOrder.orderId);
      setOrder(latest);

      if (latest.status === 'CONFIRMED' || latest.paymentStatus === 'PAID') {
        setPolling(false);
      }
    } catch {
      // ignore fetch errors during polling
    }
  }, [initialOrder?.orderId]);

  useEffect(() => {
    if (!initialOrder?.orderId) {
      return;
    }

    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += POLL_INTERVAL;
      if (elapsed >= POLL_TIMEOUT) {
        clearInterval(timer);
        setPolling(false);
        return;
      }
      fetchOrder();
    }, POLL_INTERVAL);

    // fetch immediately
    fetchOrder();

    return () => clearInterval(timer);
  }, [initialOrder?.orderId, fetchOrder]);

  if (!order) {
    return <Navigate to="/orders" replace />;
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isConfirmed = order.status === 'CONFIRMED' || order.paymentStatus === 'PAID';

  return (
    <div className={styles.page}>
      <div className="container">
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className={styles.iconWrap}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
          >
            <CheckCircle size={56} color="#16A34A" />
          </motion.div>

          <h1 className={styles.title}>Order Placed Successfully!</h1>
          <p className={styles.subtitle}>
            Thank you for your purchase. Your order has been confirmed.
          </p>

          {polling && (
            <div className={styles.polling}>
              <Loader2 size={16} className={styles.spinIcon} />
              <span>Confirming payment...</span>
            </div>
          )}

          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Order ID</span>
              <span className={styles.value}>{order.orderId}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Order Date</span>
              <span className={styles.value}>{orderDate}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Total Amount</span>
              <span className={styles.value}>${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Payment Status</span>
              <span
                className={`${styles.badge} ${isConfirmed ? styles.confirmed : styles.pending}`}
              >
                {order.paymentStatus}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Order Status</span>
              <span
                className={`${styles.badge} ${isConfirmed ? styles.confirmed : styles.pending}`}
              >
                {order.status}
              </span>
            </div>
          </div>

          <div className={styles.items}>
            <h3>Items Ordered</h3>
            {order.items.map((item, i) => (
              <div key={i} className={styles.item}>
                <Package size={18} color="var(--color-text-secondary)" />
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemMeta}>
                    Qty: {item.quantity} &middot; ${item.price.toFixed(2)} each
                  </span>
                </div>
                <span className={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <Link to="/orders" className={styles.ordersBtn}>
              View My Orders
            </Link>
            <Link to="/shop" className={styles.shopBtn}>
              Continue Shopping <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;
