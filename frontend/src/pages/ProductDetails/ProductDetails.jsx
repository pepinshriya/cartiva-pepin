import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  Star,
  Minus,
  Plus,
  ChevronRight,
  Check,
} from 'lucide-react';

import { getProductById } from '../../services/productService';
import { useAppContext } from '../../context/AppContext';
import styles from './ProductDetails.module.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useAppContext();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);

        if (data.sizes?.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div
        className="container"
        style={{
          padding: '120px 0',
          textAlign: 'center',
        }}
      >
        <h2>Loading Product...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="container"
        style={{
          padding: '120px 0',
          textAlign: 'center',
        }}
      >
        <h2>Product not found</h2>

        <Link
          to="/shop"
          style={{
            color: 'var(--color-primary)',
            marginTop: 16,
            display: 'inline-block',
          }}
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = async () => {
    const success = await addToCart({
      productId: product.id,
      quantity,
    });
    if (success) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.breadcrumb}>
          <Link to="/">Home</Link>

          <ChevronRight size={14} />

          <Link to="/shop">Shop</Link>

          <ChevronRight size={14} />

          <span>{product.name}</span>
        </div>

        <div className={styles.details}>
          <div className={styles.images}>
            <div className={styles.thumbnailList}>
              {product.images.map((img, index) => (
                <button
                  key={index}
                  className={`${styles.thumbnail} ${
                    selectedImage === index ? styles.activeThumb : ''
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={product.name} />
                </button>
              ))}
            </div>

            <motion.div
              key={selectedImage}
              className={styles.mainImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <img src={product.images[selectedImage]} alt={product.name} />

              {product.badge && <span className={styles.badge}>{product.badge}</span>}
            </motion.div>
          </div>

          <div className={styles.info}>
            <h1 className={styles.name}>{product.name}</h1>

            <div className={styles.rating}>
              <Star size={16} fill="#F59E0B" color="#F59E0B" />

              <span>{product.rating}</span>

              <span className={styles.reviewCount}>({product.reviews} reviews)</span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.price}>₹{product.price.toLocaleString()}</span>
            </div>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.selector}>
              <label className={styles.label}>Color</label>

              <div className={styles.colorOptions}>
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    className={`${styles.colorSwatch} ${
                      selectedColor === index ? styles.activeColor : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(index)}
                  />
                ))}
              </div>
            </div>

            <div className={styles.selector}>
              <label className={styles.label}>Size</label>

              <div className={styles.sizeOptions}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`${styles.sizeBtn} ${
                      selectedSize === size ? styles.activeSize : ''
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.quantityRow}>
              <label className={styles.label}>Quantity</label>

              <div className={styles.quantityControl}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus size={16} />
                </button>

                <span>{quantity}</span>

                <button onClick={() => setQuantity(quantity + 1)}>
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className={styles.actions}>
              <motion.button
                className={styles.addBtn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
              >
                <ShoppingBag size={20} />
                Add to Cart
              </motion.button>

              <motion.button
                className={styles.wishBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart size={20} />
              </motion.button>
            </div>

            <div className={styles.features}>
              <div className={styles.feature}>
                <Truck size={20} />
                <div>
                  <strong>Free Shipping</strong>
                  <span>On orders over ₹5,000</span>
                </div>
              </div>

              <div className={styles.feature}>
                <Shield size={20} />
                <div>
                  <strong>2 Year Warranty</strong>
                  <span>Guaranteed quality</span>
                </div>
              </div>

              <div className={styles.feature}>
                <RotateCcw size={20} />
                <div>
                  <strong>Easy Returns</strong>
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: '#16a34a',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          <Check size={16} />
          Added to cart successfully
        </motion.div>
      )}
    </div>
  );
};

export default ProductDetails;
