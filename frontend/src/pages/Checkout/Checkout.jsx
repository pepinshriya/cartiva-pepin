import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Truck, CheckCircle, Lock, Loader2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { placeOrder } from '../../services/orderService';
import styles from './Checkout.module.css';

const shippingFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zip'];
const paymentFields = ['cardName', 'cardNumber', 'expiry', 'cvv'];

const Checkout = () => {
  const { state, clearCart } = useAppContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: '',
    cardNumber: '', expiry: '', cvv: '', cardName: '',
  });

  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleInput = (field, value) => {
    setForm({ ...form, [field]: value });
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: null });
    }
  };

  const validateShipping = () => {
    const errors = {};
    shippingFields.forEach((field) => {
      if (!form[field].trim()) {
        errors[field] = 'Required';
      }
    });
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'Invalid email';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePayment = () => {
    const errors = {};
    paymentFields.forEach((field) => {
      if (!form[field].trim()) {
        errors[field] = 'Required';
      }
    });
    if (form.cardNumber && form.cardNumber.replace(/\s/g, '').length < 16) {
      errors.cardNumber = 'Enter 16 digits';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateShipping()) return;
    if (step === 2 && !validatePayment()) return;
    setStep(step + 1);
  };

  const handlePlaceOrder = async () => {
    if (loading) return;

    const userId = user?.sub || user?.email;
    if (!userId) {
      setError('Please log in to place an order');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const order = await placeOrder(userId);
      await clearCart();
      navigate('/order-success', { state: { order } });
    } catch (err) {
      const message = err?.response?.data?.error || 'Failed to place order. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (state.cart.length === 0 && !loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '120px 24px' }}>
        <h2>Your cart is empty</h2>
        <Link to="/shop" style={{ color: 'var(--color-primary)', marginTop: 16, display: 'inline-block', fontWeight: 600 }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Checkout</h1>
        <div className={styles.steps}>
          <div className={`${styles.step} ${step >= 1 ? styles.activeStep : ''}`}>
            <span className={styles.stepNum}>1</span> Shipping
          </div>
          <div className={`${styles.stepLine} ${step >= 2 ? styles.activeLine : ''}`} />
          <div className={`${styles.step} ${step >= 2 ? styles.activeStep : ''}`}>
            <span className={styles.stepNum}>2</span> Payment
          </div>
          <div className={`${styles.stepLine} ${step >= 3 ? styles.activeLine : ''}`} />
          <div className={`${styles.step} ${step >= 3 ? styles.activeStep : ''}`}>
            <span className={styles.stepNum}>3</span> Confirm
          </div>
        </div>

        {error && (
          <div className={styles.errorBanner}>{error}</div>
        )}

        <div className={styles.layout}>
          <div className={styles.formSection}>
            {step === 1 && (
              <motion.div className={styles.formCard} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2><Truck size={20} /> Shipping Information</h2>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>First Name</label>
                    <input value={form.firstName} onChange={(e) => handleInput('firstName', e.target.value)} className={fieldErrors.firstName ? styles.inputError : ''} />
                    {fieldErrors.firstName && <span className={styles.fieldError}>{fieldErrors.firstName}</span>}
                  </div>
                  <div className={styles.field}>
                    <label>Last Name</label>
                    <input value={form.lastName} onChange={(e) => handleInput('lastName', e.target.value)} className={fieldErrors.lastName ? styles.inputError : ''} />
                    {fieldErrors.lastName && <span className={styles.fieldError}>{fieldErrors.lastName}</span>}
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Email</label>
                    <input type="email" value={form.email} onChange={(e) => handleInput('email', e.target.value)} className={fieldErrors.email ? styles.inputError : ''} />
                    {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
                  </div>
                  <div className={styles.field}>
                    <label>Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => handleInput('phone', e.target.value)} className={fieldErrors.phone ? styles.inputError : ''} />
                    {fieldErrors.phone && <span className={styles.fieldError}>{fieldErrors.phone}</span>}
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Address</label>
                  <input value={form.address} onChange={(e) => handleInput('address', e.target.value)} className={fieldErrors.address ? styles.inputError : ''} />
                  {fieldErrors.address && <span className={styles.fieldError}>{fieldErrors.address}</span>}
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>City</label>
                    <input value={form.city} onChange={(e) => handleInput('city', e.target.value)} className={fieldErrors.city ? styles.inputError : ''} />
                    {fieldErrors.city && <span className={styles.fieldError}>{fieldErrors.city}</span>}
                  </div>
                  <div className={styles.field}>
                    <label>State</label>
                    <input value={form.state} onChange={(e) => handleInput('state', e.target.value)} className={fieldErrors.state ? styles.inputError : ''} />
                    {fieldErrors.state && <span className={styles.fieldError}>{fieldErrors.state}</span>}
                  </div>
                  <div className={styles.field}>
                    <label>ZIP</label>
                    <input value={form.zip} onChange={(e) => handleInput('zip', e.target.value)} className={fieldErrors.zip ? styles.inputError : ''} />
                    {fieldErrors.zip && <span className={styles.fieldError}>{fieldErrors.zip}</span>}
                  </div>
                </div>
                <motion.button className={styles.continueBtn} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleNextStep}>
                  Continue to Payment
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div className={styles.formCard} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2><CreditCard size={20} /> Payment Details</h2>
                <div className={styles.field}>
                  <label>Cardholder Name</label>
                  <input value={form.cardName} onChange={(e) => handleInput('cardName', e.target.value)} className={fieldErrors.cardName ? styles.inputError : ''} />
                  {fieldErrors.cardName && <span className={styles.fieldError}>{fieldErrors.cardName}</span>}
                </div>
                <div className={styles.field}>
                  <label>Card Number</label>
                  <input placeholder="1234 5678 9012 3456" value={form.cardNumber} onChange={(e) => handleInput('cardNumber', e.target.value)} className={fieldErrors.cardNumber ? styles.inputError : ''} />
                  {fieldErrors.cardNumber && <span className={styles.fieldError}>{fieldErrors.cardNumber}</span>}
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Expiry</label>
                    <input placeholder="MM/YY" value={form.expiry} onChange={(e) => handleInput('expiry', e.target.value)} className={fieldErrors.expiry ? styles.inputError : ''} />
                    {fieldErrors.expiry && <span className={styles.fieldError}>{fieldErrors.expiry}</span>}
                  </div>
                  <div className={styles.field}>
                    <label>CVV</label>
                    <input placeholder="123" value={form.cvv} onChange={(e) => handleInput('cvv', e.target.value)} className={fieldErrors.cvv ? styles.inputError : ''} />
                    {fieldErrors.cvv && <span className={styles.fieldError}>{fieldErrors.cvv}</span>}
                  </div>
                </div>
                <div className={styles.btnRow}>
                  <button className={styles.backBtn} onClick={() => setStep(1)}>Back</button>
                  <motion.button className={styles.continueBtn} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleNextStep}>
                    Review Order
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div className={styles.formCard} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2><CheckCircle size={20} /> Review & Confirm</h2>
                <div className={styles.reviewSection}>
                  <div className={styles.reviewLabel}>Shipping to</div>
                  <p>{form.firstName} {form.lastName}, {form.address}, {form.city}, {form.state} {form.zip}</p>
                </div>
                <div className={styles.reviewSection}>
                  <div className={styles.reviewLabel}>Payment</div>
                  <p>Card ending in {form.cardNumber.replace(/\s/g, '').slice(-4)}</p>
                </div>
                <div className={styles.reviewItems}>
                  {state.cart.map((item) => (
                    <div key={`${item.id}-${item.size}`} className={styles.reviewItem}>
                      <img src={item.image} alt={item.name} />
                      <div>
                        <span>{item.name}</span>
                        <span className={styles.qty}>Qty: {item.quantity}</span>
                      </div>
                      <span className={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.btnRow}>
                  <button className={styles.backBtn} onClick={() => setStep(2)} disabled={loading}>Back</button>
                  <motion.button className={styles.placeBtn} whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }} onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 size={16} className={styles.spinIcon} /> Processing...
                      </>
                    ) : (
                      <>
                        <Lock size={16} /> Place Order — ${total.toFixed(2)}
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          <div className={styles.summary}>
            <h3>Order Summary</h3>
            <p className={styles.summaryItemCount}>{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
            {state.cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className={styles.summaryItem}>
                <img src={item.image} alt={item.name} />
                <div>
                  <span className={styles.summaryName}>{item.name}</span>
                  <span className={styles.summaryMeta}>Qty: {item.quantity}</span>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className={styles.summaryDivider} />
            <div className={styles.summaryRow}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className={styles.summaryRow}><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span></div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
