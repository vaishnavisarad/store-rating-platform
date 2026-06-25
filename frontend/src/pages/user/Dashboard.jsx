import { useState, useEffect } from 'react';
import api from '../../services/api';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [ratingModal, setRatingModal] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async (filterParams = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const response = await api.get(`/user/stores?${params.toString()}`);
      setStores(response.data.stores);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
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
    setFilters({ name: '', address: '' });
    fetchStores();
  };

  const openRatingModal = (store, isEdit = false) => {
    setRatingModal({ store, isEdit });
    setRatingValue(store.user_rating || 5);
  };

  const submitRating = async () => {
    if (!ratingModal) return;
    setLoading(true);
    try {
      if (ratingModal.isEdit) {
        await api.put(`/user/ratings/${ratingModal.store.id}`, {
          rating: ratingValue,
        });
      } else {
        await api.post('/user/ratings', {
          store_id: ratingModal.store.id,
          rating: ratingValue,
        });
      }
      setRatingModal(null);
      fetchStores(filters);
    } catch (err) {
      console.error('Failed to submit rating:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="no-rating">No rating</span>;
    return (
      <span className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'star filled' : 'star'}
          >
            ★
          </span>
        ))}
      </span>
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Browse Stores</h1>
          <p className="page-subtitle">Find and rate stores in your area</p>
        </div>
      </div>

      <div className="filters-card">
        <h3>Search Stores</h3>
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
            Search
          </button>
        </div>
      </div>

      <div className="stores-grid">
        {stores.map((store) => (
          <div key={store.id} className="store-card">
            <div className="store-header">
              <h3>{store.name}</h3>
              <div className="store-rating-badge">
                {renderStars(store.overall_rating)}
              </div>
            </div>
            <p className="store-address">{store.address}</p>
            <div className="store-rating-info">
              <div>
                <span className="label">Your Rating:</span>
                {store.user_rating ? (
                  <span className="user-rating">{renderStars(store.user_rating)}</span>
                ) : (
                  <span className="no-rating">Not rated yet</span>
                )}
              </div>
            </div>
            <div className="store-actions">
              {store.user_rating ? (
                <button
                  className="btn-secondary"
                  onClick={() => openRatingModal(store, true)}
                >
                  Modify Rating
                </button>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => openRatingModal(store, false)}
                >
                  Submit Rating
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {ratingModal && (
        <div className="modal-overlay">
          <div className="modal modal-small">
            <div className="modal-header">
              <h2>{ratingModal.isEdit ? 'Modify Rating' : 'Rate Store'}</h2>
              <button className="modal-close" onClick={() => setRatingModal(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p className="store-name">{ratingModal.store.name}</p>
              <div className="rating-input">
                <label>Select Rating:</label>
                <div className="star-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={star <= ratingValue ? 'star-btn filled' : 'star-btn'}
                      onClick={() => setRatingValue(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setRatingModal(null)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={submitRating} disabled={loading}>
                {loading ? 'Saving...' : 'Save Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
