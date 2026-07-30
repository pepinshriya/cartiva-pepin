import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import styles from '../Register/Register.module.css';

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { confirmRegistration, resendConfirmationCode } = useAuth();

  const [email] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('No email found. Please register again.');
      return;
    }

    setLoading(true);
    try {
      await confirmRegistration(email, code);
      setSuccess('Account confirmed! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    setResending(true);
    try {
      await resendConfirmationCode(email);
      setSuccess('A new code has been sent to your email.');
    } catch (err) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Verify Your Email</h1>
          <p>{email ? `Enter the code sent to ${email}` : 'Enter your verification code'}</p>
        </div>
        {error && (
          <div
            style={{
              background: '#fef2f2',
              color: '#dc2626',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 16,
              border: '1px solid #fecaca',
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              background: '#f0fdf4',
              color: '#16a34a',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 16,
              border: '1px solid #bbf7d0',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <CheckCircle size={16} />
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Verification Code</label>
            <div className={styles.inputWrap}>
              <ShieldCheck size={18} className={styles.icon} />
              <input
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>
        <p className={styles.footer}>
          Didn&apos;t get a code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0,
              font: 'inherit',
            }}
          >
            {resending ? 'Sending...' : 'Resend code'}
          </button>
        </p>
        <p className={styles.footer}>
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default Verify;
