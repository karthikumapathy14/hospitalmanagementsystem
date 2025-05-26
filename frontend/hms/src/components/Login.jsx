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
  // const [doctorId, setLocalDoctorId] = useState(null); // local state for doctorId

  const { setDoctorId,doctorId } = useAuth(); // from AuthContext
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
      const doctorIdFromToken = decoded['DoctorId'];

      if (doctorIdFromToken) {
        localStorage.setItem('doctorId', doctorIdFromToken);
        setDoctorId(doctorIdFromToken); // for context
        // setLocalDoctorId(doctorIdFromToken); // for local component usage
      }

      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      localStorage.setItem('role', role);

      if (role.includes('Admin')) navigate('/Admindashboard');
      else if (role.includes('Receptionist')) navigate('/recepdashboard');
      else if (role.includes('Nurse')) navigate('/Viewappointmentnurse');
      else if (role.includes('Doctor')) navigate('/viewappointment');
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
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg border-0" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-header bg-primary text-white text-center">
          <h3 className="mb-0">Hospital Login</h3>
        </div>
        <form className="card-body" onSubmit={handleFormSubmit}>
          {message && <div className="alert alert-danger text-center">{message}</div>}

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="Email"
              className="form-control"
              placeholder="Enter your Email"
              value={data.Email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="Password"
              className="form-control"
              placeholder="Enter your Password"
              value={data.Password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm" /> : 'Login'}
          </button>
        </form>

        {/* Only show Addprescription if doctorId is available */}
        {doctorId && <Addprescription doctorId={doctorId} />}
      </div>
    </div>
  );
};

export default Login;
