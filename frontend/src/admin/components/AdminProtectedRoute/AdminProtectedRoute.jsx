import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

const ADMIN_GROUPS = ['Admin', 'SuperAdmin', 'InventoryManager', 'OrderManager'];

const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: '120px 24px', textAlign: 'center' }}>
        <Loader2 size={48} color="#D1D5DB" style={{ animation: 'spin 1s linear infinite' }} />
        <h2>Verifying access...</h2>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const userGroups = user.groups || [];
  const hasAdminRole = userGroups.some((g) => ADMIN_GROUPS.includes(g));

  if (!hasAdminRole) {
    return <Navigate to="/admin/access-denied" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
