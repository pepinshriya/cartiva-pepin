import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import styles from './Cart.module.css';

const Cart = () => {
  const { state, removeFromCart, updateQuantity } = useAppContext();
  const { cart, loading } = state;

  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [error, setError] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  const handleUpdateQuantity = async (item, newQty) => {
    const productId = item.productId || item.id;

    if (newQty < 1) {
      await removeFromCart(productId);
      return;
    }

    setUpdatingItemId(productId);
    setError(null);

    const result = await updateQuantity(productId, newQty);

    if (!result.success) {
      setError(result.error);
      setTimeout(() => setError(null), 3000);
    }

    setUpdatingItemId(null);
  };

  const handleRemoveItem = async (item) => {
    await removeFromCart(item.productId || item.id);
  };

  if (loading && cart.length === 0) {
    return (
      <div className={styles.empty}>
        <div className="container" style={{ textAlign: 'center', padding: '120px 24px' }}>
          <Loader2 size={48} color="#D1D5DB" style={{ animation: 'spin 1s linear infinite' }} />
          <h2>Loading your cart...</h2>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className={styles.empty}>
        <div className="container" style={{ textAlign: 'center', padding: '120px 24px' }}>
          <ShoppingBag size={64} color="#D1D5DB" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven&apos;t added anything yet.</p>
          <Link to="/shop" className={styles.shopLink}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Shopping Cart ({cart.length})</h1>
        <div className={styles.layout}>
          <div className={styles.items}>
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.productId || item.id}
                  className={styles.item}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <Link to={`/product/${item.productId || item.id}`} className={styles.itemImage}>
                    <img src={item.image} alt={item.name} />
                  </Link>
                  <div className={styles.itemInfo}>
                    <Link to={`/product/${item.productId || item.id}`} className={styles.itemName}>
                      {item.name}
                    </Link>
                    <div className={styles.itemMeta}>
                      <span>Size: {item.size}</span>
                      <span className={styles.colorDot} style={{ backgroundColor: item.color }} />
                    </div>
                    <div className={styles.itemBottom}>
                      <div className={styles.quantityControl}>
                        <button
                          onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                          disabled={updatingItemId === (item.productId || item.id)}
                          className={
                            updatingItemId === (item.productId || item.id) ? styles.disabledBtn : ''
                          }
                        >
                          <Minus size={14} />
                        </button>
                        <span>
                          {updatingItemId === (item.productId || item.id) ? (
                            <Loader2 size={14} className={styles.spinIcon} />
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                          disabled={updatingItemId === (item.productId || item.id)}
                          className={
                            updatingItemId === (item.productId || item.id) ? styles.disabledBtn : ''
                          }
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className={styles.itemPrice}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button className={styles.removeBtn} onClick={() => handleRemoveItem(item)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className={styles.summary}>
            <h3 className={styles.summaryTitle}>Order Summary</h3>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <p className={styles.freeShippingHint}>
                Add ${(100 - subtotal).toFixed(2)} more for free shipping
              </p>
            )}
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link to="/checkout">
              <motion.button
                className={styles.checkoutBtn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </motion.button>
            </Link>
            <Link to="/shop" className={styles.continueLink}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={styles.errorToast}
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
