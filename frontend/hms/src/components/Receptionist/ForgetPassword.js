import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
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
      await axios.post('https://localhost:7058/api/Account/forgot-password', {
        email,
        ClientURL: 'http://localhost:3000/resetpassword'
      });
      setMessage({ 
        text: 'Password reset link has been sent to your email if an account exists.', 
        type: 'success' 
      });
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Failed to send reset link. Please try again.', 
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
            <i className="bi bi-envelope-fill text-primary" style={{ fontSize: '3rem' }}></i>
            <h2 className="h4 mb-3">Forgot Password</h2>
            <p className="text-muted">Enter your email to receive a password reset link</p>
          </div>

          {message.text && (
            <div className={`alert alert-${message.type} mb-4 text-center`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
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
                    Sending...
                  </>
                ) : 'Send Reset Link'}
              </button>
            </div>
          </form>

          <div className="text-center mt-3">
            <button 
              className="btn btn-link p-0" 
              onClick={() => navigate('/')}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;