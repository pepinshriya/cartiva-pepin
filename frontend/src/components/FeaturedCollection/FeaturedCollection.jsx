import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../ProductCard/ProductCard';
import { products } from '../../data/products';
import styles from './FeaturedCollection.module.css';

const featuredProducts = products.filter((p) => p.featured);

const FeaturedCollection = () => {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <span className={styles.tag}>Curated for You</span>
            <h2 className="section-title">Featured Collection</h2>
            <p className="section-subtitle">Handpicked essentials we think you'll love</p>
          </div>
          <Link to="/shop" className={styles.viewAll}>
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className={styles.grid}>
          {featuredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
