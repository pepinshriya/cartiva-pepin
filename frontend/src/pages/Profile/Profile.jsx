import { motion } from 'framer-motion';
import { User, Package, LogOut, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container" style={{ textAlign: 'center', padding: '120px 24px' }}>
          <Loader2 size={48} color="#D1D5DB" style={{ animation: 'spin 1s linear infinite' }} />
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.layout}>
            <div className={styles.sidebar}>
              <div className={styles.avatar}>
                <User size={32} />
              </div>
              <h2 className={styles.name}>Guest User</h2>
              <p className={styles.email}>Sign in to view your profile</p>
              <nav className={styles.nav}>
                <Link to="/login" className={`${styles.navItem} ${styles.active}`}>
                  <User size={18} /> Sign In
                </Link>
              </nav>
            </div>
            <div className={styles.content}>
              <div className={styles.card} style={{ textAlign: 'center', padding: '80px 32px' }}>
                <User size={64} color="#D1D5DB" />
                <h2 style={{ marginTop: 16 }}>Please log in</h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>Sign in to view and edit your profile.</p>
                <Link to="/login" className={styles.saveBtn} style={{ display: 'inline-block', marginTop: 20, textDecoration: 'none' }}>
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = user.name || user.email?.split('@')[0] || 'User';

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.sidebar}>
            <div className={styles.avatar}>
              <User size={32} />
            </div>
            <h2 className={styles.name}>{displayName}</h2>
            <p className={styles.email}>{user.email}</p>
            <nav className={styles.nav}>
              <Link to="/profile" className={`${styles.navItem} ${styles.active}`}>
                <User size={18} /> My Profile
              </Link>
              <Link to="/orders" className={styles.navItem}>
                <Package size={18} /> My Orders
              </Link>
              <button className={styles.navItem} onClick={handleLogout}>
                <LogOut size={18} /> Sign Out
              </button>
            </nav>
          </div>
          <div className={styles.content}>
            <h1 className={styles.title}>My Profile</h1>
            <div className={styles.card}>
              <div className={styles.field}>
                <label>Full Name</label>
                <input type="text" defaultValue={user.name || ''} readOnly />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <input type="email" defaultValue={user.email || ''} readOnly />
              </div>
              <div className={styles.field}>
                <label>Cognito User ID</label>
                <input type="text" defaultValue={user.sub || ''} readOnly style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }} />
              </div>
              <div className={styles.field}>
                <label>Phone</label>
                <input type="tel" placeholder="Add phone number" />
              </div>
              <motion.button
                className={styles.saveBtn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled
                style={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                Save Changes
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
