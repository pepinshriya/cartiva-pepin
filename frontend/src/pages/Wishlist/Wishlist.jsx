import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import styles from './Wishlist.module.css';

const Wishlist = () => {
  const { state, dispatch } = useAppContext();

  if (state.wishlist.length === 0) {
    return (
      <div className={styles.empty}>
        <div className="container" style={{ textAlign: 'center', padding: '120px 24px' }}>
          <Heart size={64} color="#D1D5DB" />
          <h2>Your wishlist is empty</h2>
          <p>Save items you love for later.</p>
          <Link to="/shop" className={styles.shopLink}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>My Wishlist ({state.wishlist.length})</h1>
        <div className={styles.grid}>
          {state.wishlist.map((item, i) => (
            <motion.div
              key={item.id}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/product/${item.id}`} className={styles.imageWrap}>
                <img src={item.image} alt={item.name} />
              </Link>
              <div className={styles.info}>
                <Link to={`/product/${item.id}`} className={styles.name}>
                  {item.name}
                </Link>
                <span className={styles.price}>${item.price.toFixed(2)}</span>
                <div className={styles.actions}>
                  <button
                    className={styles.addBtn}
                    onClick={() => {
                      dispatch({
                        type: 'ADD_TO_CART',
                        payload: {
                          ...item,
                          size: item.sizes?.[0] || 'M',
                          color: item.colors?.[0] || '#000',
                          quantity: 1,
                        },
                      });
                    }}
                  >
                    <ShoppingBag size={16} /> Add to Cart
                  </button>
                  <button
                    className={styles.removeBtn}
                    onClick={() => dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: item })}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
