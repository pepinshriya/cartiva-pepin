import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Shield, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import styles from './Login.module.css';

const ADMIN_GROUPS = ['Admin', 'SuperAdmin', 'InventoryManager', 'OrderManager'];

const Login = () => {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const groups = user.groups || [];
      const hasAdminRole = groups.some((g) => ADMIN_GROUPS.includes(g));
      if (hasAdminRole) {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className={styles.page}>
        <Loader2
          size={40}
          color="#94a3b8"
          style={{ animation: 'spin 1s linear infinite' }}
        />
      </div>
    );
  }

  if (user) {
    const groups = user.groups || [];
    const hasAdminRole = groups.some((g) => ADMIN_GROUPS.includes(g));
    if (!hasAdminRole) {
      return <Navigate to="/admin/access-denied" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const result = await login(email, password);
      if (result?.isSignedIn) {
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <Shield size={28} />
        </div>

        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.subtitle}>
          Sign in with your admin credentials
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrap}>
              <input
                className={styles.input}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.submitBtn}
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <Link to="/login" className={styles.customerLink}>
          Customer login
        </Link>
      </div>
    </div>
  );
};

export default Login;
