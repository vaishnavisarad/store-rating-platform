import { useState, useEffect } from 'react';
import api from '../../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'USER',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (filterParams = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const response = await api.get(`/admin/users?${params.toString()}`);
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchUsers(filters);
  };

  const resetFilters = () => {
    setFilters({ name: '', email: '', address: '', role: '' });
    fetchUsers();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (formData.name.length < 20 || formData.name.length > 60) {
      errs.name = 'Name must be 20-60 characters';
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errs.email = 'Invalid email';
    }
    if (formData.address.length > 400) {
      errs.address = 'Address cannot exceed 400 characters';
    }
    if (!formData.password.match(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/)) {
      errs.password = 'Password: 8-16 chars, 1 uppercase, 1 special';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post('/admin/users', formData);
      setShowForm(false);
      setFormData({ name: '', email: '', password: '', address: '', role: 'USER' });
      fetchUsers();
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Failed to create user' });
    } finally {
      setLoading(false);
    }
  };

  const viewUserDetails = async (id) => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      setSelectedUser(response.data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

  const getRoleClass = (role) => {
    switch (role) {
      case 'ADMIN': return 'role-admin';
      case 'STORE_OWNER': return 'role-owner';
      default: return 'role-user';
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">Manage all platform users</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          Add User
        </button>
      </div>

      <div className="filters-card">
        <h3>Filters</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Name</label>
            <input
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Search by name"
            />
          </div>
          <div className="filter-group">
            <label>Email</label>
            <input
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
              placeholder="Search by email"
            />
          </div>
          <div className="filter-group">
            <label>Address</label>
            <input
              name="address"
              value={filters.address}
              onChange={handleFilterChange}
              placeholder="Search by address"
            />
          </div>
          <div className="filter-group">
            <label>Role</label>
            <select name="role" value={filters.role} onChange={handleFilterChange}>
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
        <div className="filter-actions">
          <button className="btn-secondary" onClick={resetFilters}>
            Reset
          </button>
          <button className="btn-primary" onClick={applyFilters}>
            Apply Filters
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>
                  <span className={`role-badge ${getRoleClass(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-link"
                    onClick={() => viewUserDetails(user.id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New User</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>
                &times;
              </button>
            </div>
            {errors.form && <div className="error-alert">{errors.form}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Name (20-60 characters)"
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Email address"
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  placeholder="Password"
                  className={errors.password ? 'input-error' : ''}
                />
                {errors.password && (
                  <span className="field-error">{errors.password}</span>
                )}
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  placeholder="Address"
                  className={errors.address ? 'input-error' : ''}
                  rows={2}
                />
                {errors.address && (
                  <span className="field-error">{errors.address}</span>
                )}
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleFormChange}>
                  <option value="USER">Normal User</option>
                  <option value="STORE_OWNER">Store Owner</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="modal-close" onClick={() => setSelectedUser(null)}>
                &times;
              </button>
            </div>
            <div className="user-details">
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{selectedUser.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedUser.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{selectedUser.address}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Role:</span>
                <span className={`role-badge ${getRoleClass(selectedUser.role)}`}>
                  {selectedUser.role}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Created:</span>
                <span className="detail-value">
                  {new Date(selectedUser.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Rating:</span>
                <span className="detail-value">
                  {selectedUser.rating ? `★ ${selectedUser.rating}` : 'N/A'}
                </span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-primary" onClick={() => setSelectedUser(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
