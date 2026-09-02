import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const ProtectedRoute = ({ role, children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loading fullScreen message="Verifying authentication..." />;
  }

  // 1. Not logged in -> Redirect to /login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role check if specific role is required
  if (role && user.role !== role) {
    // Redirect to user's authorized role dashboard
    if (user.role === 'CUSTOMER') {
      return <Navigate to="/customer/dashboard" replace />;
    }
    if (user.role === 'SELLER') {
      return <Navigate to="/seller/dashboard" replace />;
    }
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Authorized
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
