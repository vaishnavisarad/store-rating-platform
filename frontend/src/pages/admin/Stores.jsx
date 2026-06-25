import { useState, useEffect } from 'react';
import api from '../../services/api';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    owner_id: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStores();
    fetchUsers();
  }, []);

  const fetchStores = async (filterParams = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const response = await api.get(`/admin/stores?${params.toString()}`);
      setStores(response.data);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users?role=STORE_OWNER');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch store owners:', err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchStores(filters);
  };

  const resetFilters = () => {
    setFilters({ name: '', email: '', address: '' });
    fetchStores();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name) errs.name = 'Name is required';
    if (!formData.email) errs.email = 'Email is required';
    if (!formData.address) errs.address = 'Address is required';
    if (!formData.owner_id) errs.owner_id = 'Store owner is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post('/admin/stores', formData);
      setShowForm(false);
      setFormData({ name: '', email: '', address: '', owner_id: '' });
      fetchStores();
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Failed to create store' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stores</h1>
          <p className="page-subtitle">Manage all registered stores</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          Add Store
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
              <th>Rating</th>
              <th>Total Ratings</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.email}</td>
                <td>{store.address}</td>
                <td>{store.rating ? `★ ${store.rating}` : 'N/A'}</td>
                <td>{store.totalRatings || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Store</h2>
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
                  placeholder="Store name"
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
                  placeholder="Store email"
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  placeholder="Store address"
                  className={errors.address ? 'input-error' : ''}
                  rows={2}
                />
                {errors.address && (
                  <span className="field-error">{errors.address}</span>
                )}
              </div>
              <div className="form-group">
                <label>Store Owner</label>
                <select
                  name="owner_id"
                  value={formData.owner_id}
                  onChange={handleFormChange}
                  className={errors.owner_id ? 'input-error' : ''}
                >
                  <option value="">Select owner</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                {errors.owner_id && (
                  <span className="field-error">{errors.owner_id}</span>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stores;
