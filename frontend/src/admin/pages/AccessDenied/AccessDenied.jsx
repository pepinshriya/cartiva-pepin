import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './AccessDenied.module.css';

const AccessDenied = () => {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <ShieldAlert size={48} />
        </div>
        <h1 className={styles.title}>403 — Access Denied</h1>
        <p className={styles.subtitle}>
          You do not have permission to access the admin panel.
        </p>
        <p className={styles.detail}>
          If you believe this is an error, contact your administrator.
        </p>
        <div className={styles.actions}>
          <Link to="/" className={styles.homeBtn}>Back to Store</Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
