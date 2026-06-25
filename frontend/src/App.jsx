import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Stores from './pages/admin/Stores';
import UserDashboard from './pages/user/Dashboard';
import OwnerDashboard from './pages/owner/Dashboard';
import './index.css';

const AppContent = () => {
  const { isAuthenticated, isAdmin, isStoreOwner } = useAuth();

  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login';
    if (isAdmin) return '/admin';
    if (isStoreOwner) return '/owner';
    return '/user';
  };

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <main className={isAuthenticated ? 'main-content' : ''}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Stores />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner"
            element={
              <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
          <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
        </Routes>
      </main>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
