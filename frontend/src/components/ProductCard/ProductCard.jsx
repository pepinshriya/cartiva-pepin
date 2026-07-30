import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const { dispatch, addToCart } = useAppContext();
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const success = await addToCart({
      productId: product.id,
      quantity: 1,
    });
    if (success) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  return (
    <div style={{ position: 'relative' }}>
      <Link to={`/product/${product.id}`} className={styles.card}>
        <div className={styles.imageWrap}>
          <motion.img
            src={product.image}
            alt={product.name}
            className={styles.image}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.5 }}
          />
          {product.badge && (
            <span
              className={`${styles.badge} ${
                product.badge === 'Sale'
                  ? styles.saleBadge
                  : product.badge === 'New'
                    ? styles.newBadge
                    : ''
              }`}
            >
              {product.badge}
            </span>
          )}
          <div className={styles.actions}>
            <motion.button
              className={styles.actionBtn}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              aria-label="Add to wishlist"
            >
              <Heart size={14} />
            </motion.button>
            <motion.button
              className={`${styles.actionBtn} ${styles.cartBtn}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              aria-label="Add to cart"
            >
              <ShoppingBag size={14} />
            </motion.button>
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.rating}>
            <Star size={12} fill="#F59E0B" color="#F59E0B" />
            <span>{product.rating}</span>
            <span className={styles.reviews}>({product.reviews})</span>
          </div>
          <h3 className={styles.name}>{product.name}</h3>
          <div className={styles.priceRow}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          {product.colors && (
            <div className={styles.colors}>
              {product.colors.slice(0, 4).map((color, i) => (
                <span key={i} className={styles.colorDot} style={{ backgroundColor: color }} />
              ))}
            </div>
          )}
        </div>
      </Link>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#16a34a',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            zIndex: 10,
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <Check size={14} />
          Added to cart
        </motion.div>
      )}
    </div>
  );
};

export default ProductCard;
