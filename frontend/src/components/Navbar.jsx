import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import ChangePassword from '../pages/ChangePassword';

const Navbar = () => {
  const { user, logout, isAdmin, isStoreOwner, isUser } = useAuth();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (isAdmin) {
      return [
        { to: '/admin', label: 'Dashboard' },
        { to: '/admin/users', label: 'Users' },
        { to: '/admin/stores', label: 'Stores' },
      ];
    }
    if (isStoreOwner) {
      return [{ to: '/owner', label: 'Dashboard' }];
    }
    return [{ to: '/user', label: 'Stores' }];
  };

  const getRoleLabel = () => {
    if (isAdmin) return 'Administrator';
    if (isStoreOwner) return 'Store Owner';
    return 'User';
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <NavLink to="/" className="brand-link">
            <span className="brand-icon">⭐</span>
            <span className="brand-text">Store Ratings</span>
          </NavLink>
        </div>

        <div className="navbar-links">
          {getNavLinks().map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              end={link.to === '/admin' || link.to === '/owner' || link.to === '/user'}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{getRoleLabel()}</span>
          </div>
          <div className="user-actions">
            <button
              className="btn-link"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal modal-small">
            <button
              className="modal-close"
              onClick={() => setShowPasswordModal(false)}
            >
              &times;
            </button>
            <ChangePassword onClose={() => setShowPasswordModal(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
