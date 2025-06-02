import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Addprescription from './Doctor/Addprescription';
import { useAuth } from './AuthContext';

const Login = () => {
  const [data, setData] = useState({ Email: '', Password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { setDoctorId, doctorId } = useAuth();
  const navigate = useNavigate();

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
      const patientId = decoded.PatientId;
      const doctorIdFromToken = decoded['DoctorId'];

      if (doctorIdFromToken) {
        localStorage.setItem('doctorId', doctorIdFromToken);
        setDoctorId(doctorIdFromToken);
      }

      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      localStorage.setItem('role', role);

      if (role.includes('Admin')) navigate('/Admindashboard');
      else if (role.includes('Receptionist')) navigate('/recepdashboard');
      else if (role.includes('Nurse')) navigate('/Viewappointmentnurse');
      else if (role.includes('Doctor')) navigate('/viewappointment');
      else if (role.includes('Patient')) navigate('/Viewapatientappointment')
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
      </div>
    </div>
  </div>
);

};
export default Login;
