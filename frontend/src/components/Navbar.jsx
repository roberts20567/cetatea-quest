import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Rating Quest
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" className="navbar-link">
                Admin Panel
              </Link>
            )}
            <span>Welcome, {user.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>{/* Optionally show Login/Register links here */}</>
        )}
      </div>
    </nav>
  );
};

export default Navbar;