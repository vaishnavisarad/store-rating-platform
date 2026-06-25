import { useState, useEffect } from "react";
import api from "../../services/api";

const OwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashboardRes, ratingsRes] = await Promise.all([
        api.get("/user/owner/dashboard"),
        api.get("/user/owner/ratings"),
      ]);

      setStores(dashboardRes.data.data || []);
      setRatings(ratingsRes.data.data || []);
    } catch (err) {
      console.error("Failed to fetch owner data:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <span className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "star filled" : "star"}
          >
            ★
          </span>
        ))}
      </span>
    );
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Store Owner Dashboard</h1>
          <p className="page-subtitle">
            Manage your stores and view ratings
          </p>
        </div>
      </div>

      {/* STORES SECTION */}
      <div className="stores-section">
        <h2>Your Stores</h2>

        {stores.length === 0 ? (
          <div className="empty-state">
            <p>No stores assigned to you.</p>
          </div>
        ) : (
          stores.map((store) => (
            <div
              key={store.id}
              className="store-info-card"
              style={{ marginBottom: "20px" }}
            >
              <div className="store-details-grid">
                <div className="detail-item">
                  <span className="detail-label">
                    Store Name
                  </span>
                  <span className="detail-value">
                    {store.name}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    Average Rating
                  </span>

                  <span className="detail-value rating-value">
                    {store.average_rating > 0 ? (
                      <>
                        {renderStars(
                          Math.round(
                            Number(store.average_rating)
                          )
                        )}

                        <span className="rating-number">
                          ({store.average_rating})
                        </span>
                      </>
                    ) : (
                      "No ratings yet"
                    )}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    Total Ratings
                  </span>

                  <span className="detail-value">
                    {store.total_ratings || 0}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* RATINGS SECTION */}
      <div className="ratings-section">
        <h2>User Ratings</h2>

        {ratings.length === 0 ? (
          <div className="empty-state">
            <p>No ratings submitted yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Store Name</th>
                  <th>Rating</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {ratings.map((rating) => (
                  <tr key={rating.id}>
                    <td>{rating.name}</td>

                    <td>{rating.email}</td>

                    <td>{rating.store_name}</td>

                    <td>
                      {renderStars(rating.rating)}
                    </td>

                    <td>
                      {new Date(
                        rating.created_at
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;