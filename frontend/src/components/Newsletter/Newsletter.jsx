import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import styles from './Newsletter.module.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.content}>
            <span className={styles.tag}>Stay in the Loop</span>
            <h2 className={styles.title}>Join the Cartiva Community</h2>
            <p className={styles.desc}>
              Get early access to new arrivals, exclusive deals, and style inspiration delivered to
              your inbox.
            </p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputWrap}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.input}
                />
                <motion.button
                  type="submit"
                  className={styles.submitBtn}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {submitted ? (
                    <>
                      <CheckCircle size={18} />
                      Subscribed
                    </>
                  ) : (
                    <>
                      Subscribe
                      <Send size={16} />
                    </>
                  )}
                </motion.button>
              </div>
              <p className={styles.note}>No spam, ever. Unsubscribe anytime.</p>
            </form>
          </div>
          <div className={styles.visual}>
            <div className={styles.circle1} />
            <div className={styles.circle2} />
            <div className={styles.pattern} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
