import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, LogOut, LogIn, Package } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../hooks/useAuth';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  {
    label: 'Categories',
    path: '/shop',
    children: [
      { label: 'Clothing', path: '/shop/clothing' },
      { label: 'Footwear', path: '/shop/footwear' },
      { label: 'Accessories', path: '/shop/accessories' },
      { label: 'Outerwear', path: '/shop/outerwear' },
    ],
  },
  { label: 'About', path: '/' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useAppContext();
  const { user, logout } = useAuth();

  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="container">
          <div className={styles.inner}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoText}>Cartiva</span>
            </Link>

            <ul className={styles.navLinks}>
              {navLinks.map((link) => (
                <li
                  key={link.label}
                  className={styles.navItem}
                  onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={link.path}
                    className={`${styles.navLink} ${location.pathname === link.path ? styles.activeLink : ''}`}
                  >
                    {link.label}
                    {link.children && <ChevronDown size={14} />}
                  </Link>
                  {link.children && (
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.ul
                          className={styles.dropdown}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                        >
                          {link.children.map((child) => (
                            <li key={child.label}>
                              <Link to={child.path} className={styles.dropdownLink}>
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              ))}
            </ul>

            <div className={styles.actions}>
              <button
                className={`${styles.iconBtn} ${searchOpen ? styles.activeIcon : ''}`}
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <Link to="/wishlist" className={styles.iconBtn} aria-label="Wishlist">
                <Heart size={20} />
              </Link>
              {user && (
                <Link to="/orders" className={styles.iconBtn} aria-label="Orders">
                  <Package size={20} />
                </Link>
              )}
              {user ? (
                <>
                  <Link to="/profile" className={styles.iconBtn} aria-label="Account">
                    <User size={20} />
                  </Link>
                  <button
                    className={styles.iconBtn}
                    aria-label="Logout"
                    onClick={() => { logout(); navigate('/'); }}
                  >
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <Link to="/login" className={styles.iconBtn} aria-label="Login">
                  <LogIn size={20} />
                </Link>
              )}
              <Link to="/cart" className={styles.iconBtn} aria-label="Cart">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <motion.span
                    className={styles.badge}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
              <button
                className={`${styles.menuBtn} ${mobileOpen ? styles.activeIcon : ''}`}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {searchOpen && (
              <motion.div
                className={styles.searchBar}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.searchInner}>
                  <Search size={20} className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                    autoFocus
                  />
                  <button className={styles.searchClose} onClick={() => setSearchOpen(false)}>
                    <X size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className={styles.mobileMenu}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className={styles.mobileHeader}>
                <span className={styles.logoText}>Cartiva</span>
                <button onClick={() => setMobileOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className={styles.mobileSearch}>
                <Search size={18} />
                <input type="text" placeholder="Search..." />
              </div>
              <ul className={styles.mobileLinks}>
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className={styles.mobileLink}>
                      {link.label}
                    </Link>
                    {link.children && (
                      <ul className={styles.mobileSubLinks}>
                        {link.children.map((child) => (
                          <li key={child.label}>
                            <Link to={child.path} className={styles.mobileSubLink}>
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              <div className={styles.mobileFooter}>
                {user ? (
                  <>
                    <Link to="/profile" className={styles.mobileFooterLink}>
                      <User size={18} /> My Account
                    </Link>
                    <Link to="/orders" className={styles.mobileFooterLink}>
                      <ShoppingBag size={18} /> My Orders
                    </Link>
                    <button
                      className={styles.mobileFooterLink}
                      onClick={() => { logout(); setMobileOpen(false); navigate('/'); }}
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" className={styles.mobileFooterLink}>
                    <LogIn size={18} /> Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
