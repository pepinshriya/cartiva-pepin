import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlides } from '../../data/products';
import styles from './Hero.module.css';

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  const slide = heroSlides[current];

  return (
    <section className={styles.hero}>
      <div className={styles.slider}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={slide.id}
            className={styles.slide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className={styles.slideImage}>
              <img src={slide.image} alt={slide.title} />
              <div className={styles.overlay} />
            </div>
            <div className="container">
              <div className={styles.content}>
                <motion.h1
                  className={styles.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  {slide.title.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i === 0 && <br />}
                    </span>
                  ))}
                </motion.h1>
                <motion.p
                  className={styles.subtitle}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  {slide.subtitle}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <Link to="/shop">
                    <motion.button
                      className={styles.cta}
                      whileHover={{ scale: 1.05, gap: '14px' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {slide.cta}
                      <ArrowRight size={20} />
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev}>
        <ChevronLeft size={22} />
      </button>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next}>
        <ChevronRight size={22} />
      </button>

      <div className={styles.dots}>
        {heroSlides.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.activeDot : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <div className={styles.promoCards}>
        <motion.div
          className={styles.promoCard}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <span className={styles.promoTag}>New In</span>
          <h3>Spring Essentials</h3>
          <p>Fresh picks for the new season</p>
          <Link to="/shop" className={styles.promoLink}>
            Shop Now <ArrowRight size={14} />
          </Link>
        </motion.div>
        <motion.div
          className={styles.promoCard}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <span className={styles.promoTag}>Up to 30%</span>
          <h3>Season Sale</h3>
          <p>Selected styles at reduced prices</p>
          <Link to="/shop" className={styles.promoLink}>
            View Deals <ArrowRight size={14} />
          </Link>
        </motion.div>
        <motion.div
          className={styles.promoCard}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <span className={styles.promoTag}>Free Shipping</span>
          <h3>Over $100</h3>
          <p>Fast & free delivery on big orders</p>
          <Link to="/shop" className={styles.promoLink}>
            Learn More <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
