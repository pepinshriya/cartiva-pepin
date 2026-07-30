import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid3X3, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

import ProductCard from "../../components/ProductCard/ProductCard";
import { getProducts } from "../../services/productService";

import styles from "./Products.module.css";

const Products = () => {
  const { category } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [gridCols, setGridCols] = useState(3);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = category
    ? products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      )
    : products;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;

      case "price-high":
        return b.price - a.price;

      case "rating":
        return b.rating - a.rating;

      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
          <h2>Loading products...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">

        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              {category
                ? category.charAt(0).toUpperCase() + category.slice(1)
                : "All Products"}
            </h1>

            <p className={styles.count}>
              {sortedProducts.length} Products
            </p>
          </div>

          <div className={styles.controls}>
            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>

            <div className={styles.gridToggle}>
              <button
                className={`${styles.gridBtn} ${
                  gridCols === 3 ? styles.active : ""
                }`}
                onClick={() => setGridCols(3)}
              >
                <Grid3X3 size={18} />
              </button>

              <button
                className={`${styles.gridBtn} ${
                  gridCols === 4 ? styles.active : ""
                }`}
                onClick={() => setGridCols(4)}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </div>

        <motion.div
          className={styles.grid}
          style={{
            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          }}
          layout
        >
          {sortedProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
};

export default Products;