import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { categories } from '../../data/products';
import styles from './CategorySection.module.css';

const CategorySection = () => {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you're looking for</p>
          </div>
          <Link to="/shop" className={styles.viewAll}>
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className={styles.grid}>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link to={`/shop/${cat.name.toLowerCase()}`} className={styles.card}>
                <div className={styles.imageWrap}>
                  <img src={cat.image} alt={cat.name} className={styles.image} />
                  <div className={styles.overlay} />
                </div>
                <div className={styles.info}>
                  <h3 className={styles.name}>{cat.name}</h3>
                  <p className={styles.desc}>{cat.description}</p>
                  <span className={styles.count}>{cat.count} products</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
