import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import ProductCard from "../ProductCard/ProductCard";
import { getProducts } from "../../services/productService";

import styles from "./TrendingProducts.module.css";

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <h2 className="section-title">Trending Products</h2>
          <p>Loading products...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className={styles.header}>
          <div>
            <h2 className="section-title">Trending Now</h2>
            <p className="section-subtitle">
              Products from AWS Product Service
            </p>
          </div>

          <Link to="/shop" className={styles.viewAll}>
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.grid}>
          {products.map((product, i) => (
            <motion.div
              key={product.productId}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.5,
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;