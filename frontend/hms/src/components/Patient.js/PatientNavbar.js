 import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PatientNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let patientName='';

  const isActive = (path) => location.pathname === path;
 
  const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

  if (token) {
    patientName =
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    console.log(patientName);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("patientID");
    navigate("/");
  };

  return (
    <div>
    <nav
      className="navbar navbar-expand-lg navbar-light shadow-sm px-4"
      style={{ background: "linear-gradient(to right, #e0f7fa, #b2ebf2)" }}
    >
      <div className="container-fluid">
        <span className="navbar-brand fw-bold text-primary d-flex align-items-center gap-2">
          <i className="bi bi-heart-pulse-fill"></i>
          Medcare Hospital - Patient Panel
        </span>

        <div className="d-flex align-items-center gap-3 ms-auto">
           {patientName && (
          <div className="badge bg-sky-200 text-sky-800 px-3 py-1 rounded-pill mb-1 text-dark">
            <h6><i className="bi bi-person-circle me-1"></i> Welcome {patientName}!</h6>
          </div>
        )}
          <Link
            className={`btn btn-sm ${
              isActive("/patient/changepassword")
                ? "btn-primary text-white"
                : "btn-outline-primary"
            }`}
            to="/patient/changepassword"
          >
            <i className="bi bi-shield-lock-fill me-1"></i> Change Password
          </Link>

          <button onClick={handleLogout} className="btn btn-sm btn-danger">
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </div>
    </nav>

    </div>
  )
}

export default PatientNavbar
