import { useEffect } from 'react';
import Hero from '../../components/Hero/Hero';
import CategorySection from '../../components/CategorySection/CategorySection';
import TrendingProducts from '../../components/TrendingProducts/TrendingProducts';
import FeaturedCollection from '../../components/FeaturedCollection/FeaturedCollection';
import Newsletter from '../../components/Newsletter/Newsletter';

import { getProducts } from '../../services/productService';

const Home = () => {
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getProducts();

        console.log('=================================');
        console.log('Products from AWS');
        console.log(products);
        console.log('=================================');
      } catch (error) {
        console.error('Failed to load products');
        console.error(error);
      }
    };

    loadProducts();
  }, []);

  return (
    <>
      <Hero />
      <CategorySection />
      <TrendingProducts />
      <FeaturedCollection />
      <Newsletter />
    </>
  );
};

export default Home;
