import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaUserCircle, FaLock, FaClinicMedical, FaStethoscope } from 'react-icons/fa';
import { useAuth } from './AuthContext';

const Login = () => {
  const [data, setData] = useState({ Email: '', Password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { setDoctorId } = useAuth();
  const navigate = useNavigate();

  // Dynamic greeting
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : 
                  currentHour < 18 ? 'Good Afternoon' : 
                  'Good Evening';

  const handleInputChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('https://localhost:7058/api/Authentication/login', data);
      const token = response.data?.token;
      if (!token) throw new Error('Invalid response from server.');

      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      const doctorIdFromToken = decoded['DoctorId'];

      if (doctorIdFromToken) {
        localStorage.setItem('doctorId', doctorIdFromToken);
        setDoctorId(doctorIdFromToken);
      }

      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      localStorage.setItem('role', role);

      if (role.includes('Admin')) navigate('/Admindashboard');
      else if (role.includes('Receptionist')) navigate('/Createappointment');
      else if (role.includes('Nurse')) navigate('/Viewappointmentnurse');
      else if (role.includes('Doctor')) navigate('/viewappointment');
      else if (role.includes('Patient')) navigate('/Viewapatientappointment');
      else navigate('/unauthorized');
    } catch (error) {
      console.error('Login failed:', error);
      const errMsg = error?.response?.data || 'Login failed. Please try again.';
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD

  <div
    className="min-vh-100 d-flex align-items-center justify-content-center"
    style={{
      backgroundImage: "url('https://cdn.pixabay.com/photo/2017/08/06/22/01/hospital-2598822_1280.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: "'Poppins', sans-serif",
    }}
  >
    <div
      className="p-4 rounded-4 shadow"
      style={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        maxWidth: '400px',
        width: '100%',
        border: '1px solid rgba(255,255,255,0.4)',
      }}
    >
      <div className="text-center text-white mb-4">
        <i className="bi bi-hospital-fill" style={{ fontSize: '2rem' }}></i>
        <h3 className="fw-bold mt-2">Hospital Portal</h3>
        <p className="small mb-0">Secure Login for Staff & Patients</p>
      </div>

      {message && <div className="alert alert-danger text-center">{message}</div>}

      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
          <label className="form-label text-white">Email</label>
          <input
            type="email"
            name="Email"
            className="form-control"
            placeholder="Enter email"
            value={data.Email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-white">Password</label>
          <input
            type="password"
            name="Password"
            className="form-control"
            placeholder="Enter password"
            value={data.Password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="text-end mb-3">
          <a href="/forgot-password" className="small text-white text-decoration-none">Forgot Password?</a>
        </div>

        <button className="btn btn-light w-100 fw-semibold" type="submit" disabled={loading}>
          {loading ? <span className="spinner-border spinner-border-sm" /> : 'Login'}
        </button>
      </form>

      <div className="text-center mt-3">
        <small className="text-white-50">© 2025 HealthyLife Hospital</small>
=======
    <div className="min-vh-100 d-flex align-items-center justify-content-center" 
         style={{ 
           background: 'linear-gradient(135deg, #f8f9fa 0%, #e9f7fe 100%)'
         }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
              <div className="row g-0">
                {/* Left Side - Hospital Branding */}
                <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center p-5 text-white"
                     style={{ background: 'linear-gradient(135deg, #1e88e5 0%, #0d47a1 100%)' }}>
                  <div className="text-center">
                    <FaClinicMedical size={48} className="mb-4" />
                    <h2 className="mb-3 fw-bold">Medcare Hospital</h2>
                    <div className="d-flex justify-content-center mb-4">
                      <div className="border-top border-2 border-white w-25"></div>
                    </div>
                    <p className="lead mb-4">
                      <FaStethoscope className="me-2" />
                      "Your Health, Our Priority"
                    </p>
                    <div className="d-flex justify-content-center">
                      <div className="bg-white text-primary rounded-pill px-3 py-1 small fw-bold">
                        EST. 1998
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="col-md-6 bg-white p-5">
                  <div className="text-center mb-4">
                    <FaUserCircle size={48} className="text-primary mb-3" />
                    <h4 className="mb-1">{greeting}</h4>
                    <p className="text-muted">Access your medical portal</p>
                  </div>

                  {message && (
                    <div className="alert alert-danger d-flex align-items-center">
                      <FaLock className="flex-shrink-0 me-2" />
                      <div className="small">{message}</div>
                    </div>
                  )}

                  <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-bold text-secondary small">EMAIL</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white">
                          <FaUserCircle className="text-muted" />
                        </span>
                        <input
                          type="email"
                          name="Email"
                          className="form-control border-start-0"
                          placeholder="Enter your email"
                          value={data.Email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-bold text-secondary small">PASSWORD</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white">
                          <FaLock className="text-muted" />
                        </span>
                        <input
                          type="password"
                          name="Password"
                          className="form-control border-start-0"
                          placeholder="Enter your password"
                          value={data.Password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="rememberMe" />
                        <label className="form-check-label small" htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>
                      <a href="/forgot-password" className="small text-decoration-none">
                        Forgot password?
                      </a>
                    </div>

                    <button 
                      className="btn btn-primary w-100 py-2 fw-bold" 
                      type="submit" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Authenticating...
                        </>
                      ) : (
                        'Login to Portal'
                      )}
                    </button>
                  </form>

                  <div className="text-center mt-4 pt-3 border-top">
                    <p className="small text-muted mb-0">
                      © {new Date().getFullYear()} Medcare Health Systems. All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
>>>>>>> b015cd1cb247a24fd85d56d0e689967029f695ba
      </div>
    </div>
  </div>
);

<<<<<<< HEAD
};
export default Login;
=======
export default Login;
>>>>>>> b015cd1cb247a24fd85d56d0e689967029f695ba
