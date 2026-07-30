import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
import styles from './Footer.module.css';

const footerLinks = {
  Shop: [
    { label: 'New Arrivals', path: '/shop' },
    { label: 'Best Sellers', path: '/shop' },
    { label: 'Sale', path: '/shop' },
    { label: 'Clothing', path: '/shop/clothing' },
    { label: 'Footwear', path: '/shop/footwear' },
    { label: 'Accessories', path: '/shop/accessories' },
  ],
  Company: [
    { label: 'About Us', path: '/' },
    { label: 'Careers', path: '/' },
    { label: 'Press', path: '/' },
    { label: 'Blog', path: '/' },
    { label: 'Affiliates', path: '/' },
  ],
  Support: [
    { label: 'Help Center', path: '/' },
    { label: 'Shipping Info', path: '/' },
    { label: 'Returns & Exchanges', path: '/' },
    { label: 'Size Guide', path: '/' },
    { label: 'Contact Us', path: '/' },
  ],
};

const socials = [
  { label: 'Instagram', href: '#', letter: 'Ig' },
  { label: 'Twitter', href: '#', letter: 'X' },
  { label: 'Facebook', href: '#', letter: 'Fb' },
  { label: 'YouTube', href: '#', letter: 'Yt' },
];

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              Cartiva
            </Link>
            <p className={styles.brandDesc}>
              Modern minimal fashion for the conscious consumer. Quality crafted, sustainably made.
            </p>
            <div className={styles.socials}>
              {socials.map(({ label, href, letter }) => (
                <motion.a
                  key={label}
                  href={href}
                  className={styles.socialLink}
                  whileHover={{ scale: 1.1, y: -2 }}
                  aria-label={label}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{letter}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className={styles.col}>
              <h4 className={styles.colTitle}>{title}</h4>
              <ul className={styles.linkList}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className={styles.footerLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Get in Touch</h4>
            <div className={styles.contactList}>
              <div className={styles.contact}>
                <MapPin size={16} />
                <span>123 Fashion Ave, New York, NY 10001</span>
              </div>
              <div className={styles.contact}>
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className={styles.contact}>
                <Mail size={16} />
                <span>hello@cartiva.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.copy}>
            &copy; {new Date().getFullYear()} Cartiva. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
