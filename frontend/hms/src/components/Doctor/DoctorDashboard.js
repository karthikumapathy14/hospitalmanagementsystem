import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DoctorSidebar = ({ doctor }) => {
  // `doctor` is an object like:
  // { name: "Dr. Marttin Deo", qualifications: "MBBS, FCPS - MD (Medicine), MCPS", imageUrl: "profile-pic-url" }

  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ width: '280px', minHeight: '100vh', backgroundColor: '#f9fafb', boxShadow: '2px 0 8px rgba(0,0,0,0.1)' }} className="d-flex flex-column px-4 py-5">
      
      {/* Profile Section */}
      <div className="text-center mb-4">
        <img 
          src={doctor.imageUrl || "https://via.placeholder.com/120"} 
          alt="Doctor Profile" 
          className="rounded-circle mb-3" 
          style={{ width: '120px', height: '120px', objectFit: 'cover', border: '2px solid #3b82f6' }} 
        />
        <h5 className="fw-bold text-primary">{doctor.name}</h5>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>{doctor.qualifications}</p>
        <hr />
      </div>

      {/* Navigation Links */}
      <nav className="nav flex-column gap-3">
        <Link to="/dashboard" className={`d-flex align-items-center gap-2 ${isActive('/dashboard') ? 'text-primary fw-bold' : 'text-dark'}`}>
          <i className="bi bi-grid-fill"></i> Dashboard
        </Link>

        <Link to="/appointments" className={`d-flex align-items-center gap-2 ${isActive('/appointments') ? 'text-primary fw-bold' : 'text-dark'}`}>
          <i className="bi bi-calendar-check"></i> Appointment
        </Link>

        <Link to="/appointmentpage" className={`d-flex align-items-center gap-2 ${isActive('/appointmentpage') ? 'text-primary fw-bold' : 'text-dark'}`}>
          <i className="bi bi-file-earmark-text"></i> Appointment Page
        </Link>

        <Link to="/payment" className={`d-flex align-items-center gap-2 ${isActive('/payment') ? 'text-primary fw-bold' : 'text-dark'}`}>
          <i className="bi bi-credit-card-2-front"></i> Payment
        </Link>

        <Link to="/profile" className={`d-flex align-items-center gap-2 ${isActive('/profile') ? 'text-primary fw-bold' : 'text-dark'}`}>
          <i className="bi bi-person"></i> Profile
        </Link>

        <Link to="/logout" className="d-flex align-items-center gap-2 text-danger">
          <i className="bi bi-box-arrow-right"></i> Logout
        </Link>
      </nav>
    </div>
  );
};

export default DoctorSidebar;
