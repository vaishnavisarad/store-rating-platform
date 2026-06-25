import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ChangePassword = ({ onClose }) => {
  const { logout } = useAuth();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.oldPassword) errs.oldPassword = 'Current password is required';
    if (!formData.newPassword.match(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/)) {
      errs.newPassword = 'Password: 8-16 chars, 1 uppercase, 1 special';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (err) {
      setErrors({
        form: err.response?.data?.message || 'Failed to change password',
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="modal-content">
        <div className="success-message">
          <h3>Password Changed Successfully!</h3>
          <p>You will be logged out shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-content">
      <h2>Change Password</h2>
      {errors.form && <div className="error-alert">{errors.form}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Current Password</label>
          <input
            name="oldPassword"
            type="password"
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="Enter current password"
            className={errors.oldPassword ? 'input-error' : ''}
          />
          {errors.oldPassword && (
            <span className="field-error">{errors.oldPassword}</span>
          )}
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="8-16 chars, 1 uppercase, 1 special"
            className={errors.newPassword ? 'input-error' : ''}
          />
          {errors.newPassword && (
            <span className="field-error">{errors.newPassword}</span>
          )}
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            className={errors.confirmPassword ? 'input-error' : ''}
          />
          {errors.confirmPassword && (
            <span className="field-error">{errors.confirmPassword}</span>
          )}
        </div>
        <div className="modal-actions">
          {onClose && (
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
