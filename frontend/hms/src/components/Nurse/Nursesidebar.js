import React from "react";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../Logout";

const Nursesidebar = ({ isMobile, closeSidebar }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    if (isMobile) closeSidebar();
  };

  return (
    <div className={`d-flex flex-column h-100 ${isMobile ? "w-100" : ""}`}
      style={{
        background: "linear-gradient(to bottom, #f0f9ff, #e0f2fe)",
        borderRight: isMobile ? "none" : "1px solid #bae6fd",
        boxShadow: isMobile ? "none" : "2px 0 10px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Header */}
      <div className="text-center py-3 border-bottom border-sky-200">
        <div className="d-flex flex-column align-items-center justify-content-center gap-2 mb-2 px-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "40px",
              height: "40px",
              background: "#38bdf8",
              boxShadow: "0 2px 5px rgba(56, 189, 248, 0.3)",
            }}
          >
            <i className="bi bi-heart-pulse text-white fs-5"></i>
          </div>
          <h5 className="text-sky-800 fw-bold mb-0">MEDCARE HOSPITAL</h5>
        </div>
        <div className="badge bg-sky-0 tex-dark px-3 py-1 rounded-pill">
          <i className="bi bi-reception-4 me-1"></i> Nurse Desk
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav flex-column px-2 pt-3 flex-grow-1">
        {/* <Link
          className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded ${
            isActive("/") ? "bg-sky-100 text-sky-800 fw-semibold" : "text-sky-600"
          }`}
          to="/"
          onClick={isMobile ? closeSidebar : null}
        >
          <i className="bi bi-speedometer2 fs-5"></i>
          Dashboard
        </Link> */}

        <Link
          className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded ${
            isActive("/Viewappointmentnurse")
              ? "bg-sky-100 text-sky-800 fw-semibold"
              : "text-sky-600"
          }`}
          to="/Viewappointmentnurse"
          onClick={isMobile ? closeSidebar : null}
        >
          <i className="bi bi-calendar-check fs-5"></i>
          View Appointment
        </Link>

        <Link
          className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded ${
            isActive("/changepassword")
              ? "bg-sky-50 text-sky-700 border-start border-3 border-sky-500"
              : "text-sky-600"
          }`}
          to="/changepassword"
          onClick={isMobile ? closeSidebar : null}
        >
          <i className="bi bi-shield-lock fs-5"></i>
          Change Password
        </Link>

        <button
          onClick={handleLogout}
          className="nav-link d-flex align-items-center gap-2 py-2 px-3 rounded text-danger bg-transparent border-0 text-start mt-2"
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-box-arrow-right fs-5"></i>
          Logout
        </button>
      </nav>

      {/* Footer */}
      <div
        className="mt-auto text-center py-3 px-3"
        style={{
          borderTop: "1px solid #bae6fd",
          background: "rgba(186, 230, 253, 0.3)",
        }}
      >
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
  );
};

export default Nursesidebar;