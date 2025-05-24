import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReceptionistNavbar from './ReceptionistNavbar';

const CreatePatient = () => {
  const [formData, setFormData] = useState({
    UserName: "",
    Email: "",
    Role: "Patient",
    PasswordHash: ""
  });

  const{id}=useParams();

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // axios.get(`https://localhost:7058/api/Receptionist/getbyid-patient/${id}`)
    // .then((res)=>console.log(res.data))
    // .catch((err)=>console.log(err))

    if (formData.PasswordHash.length < 6) {
      setMessage({
        text: "Password must be at least 6 characters long.",
        type: "danger"
      });
      
      return;
    }

    setIsLoading(true);
    try {
      const result = await axios.post("https://localhost:7058/api/Receptionist/Register", formData);
      setMessage({ text: `Patient registered successfully! Patient ID: ${result.data.patientId}`, type: "success" });
    
      setFormData({
        UserName: "",
        Email: "",
        Role: "Patient",
        PasswordHash: ""
      });
      setTimeout(() => navigate('/listpatient'), 4000);
    } catch (err) {
      setMessage({
        text:
          err.response?.data?.[0]?.description ||
          err.response?.data?.title ||
          "Registration failed",
        type: "danger"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(true);
    setTimeout(() => setShowPassword(false), 3000);
  };

  return (
    <div className="d-flex" style={{
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      backgroundImage: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)'
    }}>
      <ReceptionistNavbar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: '260px' }}>
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <div className="row w-100 justify-content-center">
            <div className="card-header bg-white border-0 pt-4 mb-3">
                  <div className="d-flex align-items-center justify-content-center mb-3">
                    <div style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#38bdf8',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '15px'
                    }}>
                      <i className="bi bi-person-plus text-white" style={{ fontSize: '1.5rem' }}></i>
                    </div>
                    <h2 className="mb-0 text-primary" style={{ fontWeight: '600' }}>
                      New Patient Registration
                    </h2>
                  </div>
                </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', backgroundColor: '#ffffff' }}>
                
                <div className="card-body px-5 py-4">
                  {message && (
                    <div className={`alert alert-${message.type} mb-4`}>
                      <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                      {message.text}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} autoComplete="off">
                      <div className="md-6 mb-4">
                        <label className="form-label fw-bold text-muted">
                          <i className="bi bi-person me-2 text-primary"></i>
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="UserName"
                          className="form-control rounded-pill"
                          placeholder="John Doe"
                          value={formData.UserName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="md-6 mb-4">
                        <label className="form-label fw-bold text-muted">
                          <i className="bi bi-envelope me-2 text-primary"></i>
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="Email"
                          placeholder="john@example.com"
                          className="form-control rounded-pill"
                          value={formData.Email}
                          onChange={handleChange}
                          required
                          autoComplete="off"
                        />
                      </div>
                    

                    <div className="mb-4 position-relative">
                      <label className="form-label fw-bold text-muted">
                        <i className="bi bi-lock me-2 text-primary"></i>
                        Password
                      </label>
                      <div className="input-group">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="PasswordHash"
                          placeholder="Create a password"
                          className="form-control rounded-pill"
                          value={formData.PasswordHash}
                          onChange={handleChange}
                          required
                          minLength="6"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-primary rounded-pill"
                          onClick={handleShowPassword}
                          style={{ marginLeft: '10px' }}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-bold text-muted">
                        <i className="bi bi-person-badge me-2 text-primary"></i>
                        Role
                      </label>
                      <select
                        name="Role"
                        className="form-select rounded-pill"
                        value={formData.Role}
                        onChange={handleChange}
                        disabled
                      >
                        <option value="Patient">Patient</option>
                      </select>
                    </div>

                    <div className="d-flex justify-content-between mt-5">
                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-pill px-4"
                        onClick={() => navigate(-1)}
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary rounded-pill px-4"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Registering...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-person-plus me-2"></i>
                            Register Patient
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePatient;
