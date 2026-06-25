import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      }
    };
    fetchDashboard();
  }, []);

  if (!stats) {
    return <div className="loading-spinner">Loading...</div>;
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
    { label: 'Total Stores', value: stats.totalStores, icon: '🏪' },
    { label: 'Total Ratings', value: stats.totalRatings, icon: '⭐' },
  ];

  return (
    <div className="dashboard">
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-subtitle">Overview of platform statistics</p>

      <div className="stats-grid">
        {statCards.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
