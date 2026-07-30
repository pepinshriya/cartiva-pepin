import { motion } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import styles from './AdminDashboard.module.css';

const stats = [
  { label: 'Total Revenue', value: '$24,580', change: '+12.5%', icon: TrendingUp, color: '#5F6F52' },
  { label: 'Orders', value: '342', change: '+8.2%', icon: ShoppingCart, color: '#2563EB' },
  { label: 'Products', value: '156', change: '+3.1%', icon: Package, color: '#D97706' },
  { label: 'Customers', value: '1,204', change: '+15.3%', icon: Users, color: '#7C3AED' },
];

const AdminDashboard = () => {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>
            <LayoutDashboard size={24} /> Dashboard
          </h1>
        </div>
        <div className={styles.stats}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                <stat.icon size={22} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statChange}>{stat.change}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className={styles.placeholder}>
          <p>Admin tables and order management coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
