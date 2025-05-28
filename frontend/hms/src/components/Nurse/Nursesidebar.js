import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Nursesidebar = () => {
      const location = useLocation();

  const isActive = (path) => location.pathname === path;
  return (

    <div className="d-flex flex-column vh-100 position-fixed" 
         style={{ 
           width: '260px',
           minHeight: '100vh',
           background: 'linear-gradient(to bottom, #f0f9ff, #e0f2fe)',
           borderRight: '1px solid #bae6fd',
           boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)'
         }}>
      
      {/* Hospital Header with Medical Icon */}
      <div className="text-center mb-4 mt-4 px-3">
        <div className="d-flex align-items-center justify-content-center gap-1 mb-2">
          <div style={{
            width: '50px',
            height: '40px',
            background: '#38bdf8',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 5px rgba(56, 189, 248, 0.3)'
          }}>
            <i className="bi bi-heart-pulse text-white" style={{ fontSize: '1.25rem' }}></i>
          </div>
          <h4 className="text-sky-800 fw-bold mb-0" style={{ fontFamily: "'Arial Rounded MT Bold', sans-serif" }}>
            MEDCARE HOSPITAL
          </h4>
        </div>
        <div className="badge bg-sky-100 text-sky-800 px-3 py-1 rounded-pill text-muted">
          <i className="bi bi-reception-4 me-1"></i> Nurse Desk
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="nav flex-column gap-1 px-3">
        {/* Dashboard */}
        <Link 
          className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded ${
            isActive('/') ? 'bg-sky-100 text-sky-800 fw-medium' : 'text-sky-600'
          }`}
          to="/"
        >
          <i className="bi bi-speedometer2" style={{ width: '24px', fontSize: '1.1rem' }}></i>
          Dashboard
        </Link>

        <Link 
          className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded ${
            isActive('/Viewappointmentnurse') ? 'bg-sky-100 text-sky-800 fw-medium' : 'text-sky-600'
          }`}
          to="/Viewappointmentnurse"
        >
          <i className="bi bi-speedometer2" style={{ width: '24px', fontSize: '1.1rem' }}></i>
          View Appointment
        </Link>


        
      </nav>

      {/* Footer with Medical Theme */}
      <div className="mt-auto p-3 text-center" style={{
        borderTop: '1px solid #bae6fd',
        background: 'rgba(186, 230, 253, 0.3)'
      }}>
        <div className="d-flex justify-content-center gap-3 mb-2">
          <button className="btn btn-sm btn-outline-primary rounded-circle p-2">
            <i className="bi bi-bell"></i>
          </button>
          <button className="btn btn-sm btn-outline-primary rounded-circle p-2">
            <i className="bi bi-question-circle"></i>
          </button>
        </div>
        <small className="text-sky-700 d-block">Hospital Management System</small>
        <small className="text-sky-500">v2.4.1</small>
      </div>


    </div>
  )
}

export default Nursesidebar
