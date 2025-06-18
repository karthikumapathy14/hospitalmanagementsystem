import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      await axios.post('https://localhost:7058/api/Account/reset-password', {
        email,
        token,
        newPassword: password
      });
      setMessage({ text: 'Password reset successfully! Redirecting to login...', type: 'success' });
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Failed to reset password. Please try again.', 
        type: 'danger' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <i className="bi bi-lock-fill text-primary" style={{ fontSize: '3rem' }}></i>
            <h2 className="h4 mb-3">Reset Password</h2>
          </div>

          {message.text && (
            <div className={`alert alert-${message.type} mb-4 text-center`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">New Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              <div className="form-text">Password must be at least 8 characters long</div>
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>

            <div className="d-grid gap-2">
              <button 
                type="submit" 
                className="btn btn-primary py-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Resetting...
                  </>
                ) : 'Reset Password'}
              </button>
            </div>
          </form>

          <div className="text-center mt-3">
            <p className="text-muted mb-0">Remember your password?</p>
            <button 
              className="btn btn-link p-0" 
              onClick={() => navigate('/login')}
            >
              Sign in here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;