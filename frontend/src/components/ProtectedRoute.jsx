import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    // While we're checking for the user, render nothing or a loading spinner
    return <div>Loading...</div>; // Or return null;
  }
  
  if (!user) {
    // If user is not authenticated, redirect to the login page.
    // The 'replace' prop prevents the user from navigating back to the protected page.
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    // If route is admin-only and user is not an admin, redirect to dashboard
    // You could also redirect to a dedicated "Not Authorized" page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;