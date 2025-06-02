import React from "react";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../Logout";

const ReceptionistNavbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
    const handleLogout = () => {
    logout();
  };

  return (
    <div
      className="d-flex flex-column vh-100 position-fixed"
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f0f9ff, #e0f2fe)",
        borderRight: "1px solid #bae6fd",
        boxShadow: "2px 0 10px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Hospital Header with Medical Icon */}
      <div className="text-center mb-4 mt-4 px-3">
        <div className="d-flex align-items-center justify-content-center gap-1 mb-2">
          <div
            style={{
              width: "50px",
              height: "40px",
              background: "#38bdf8",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 5px rgba(56, 189, 248, 0.3)",
            }}
          >
            <i
              className="bi bi-heart-pulse text-white"
              style={{ fontSize: "1.25rem" }}
            ></i>
          </div>
          <h4
            className="text-sky-800 fw-bold mb-0"
            style={{ fontFamily: "'Arial Rounded MT Bold', sans-serif" }}
          >
            MEDCARE HOSPITAL
          </h4>
        </div>
        <div className="badge bg-sky-100 text-sky-800 px-3 py-1 rounded-pill text-muted">
          <i className="bi bi-reception-4 me-1"></i> Reception Desk
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="nav flex-column gap-1 px-3">
        {/* Patient Management Section */}
        <div className="mt-3 mb-2 text-uppercase small fw-bold text-sky-600 ps-3">
          <i className="bi bi-clipboard2-pulse me-2"></i>
          Patient Management
        </div>

        {/* Edit User Dropdown */}
        <div className="mb-2">
          <button
            className={`btn btn-link text-start w-100 d-flex align-items-center justify-content-between gap-2 py-2 px-3 rounded ${
              isActive("/listpatient")
                ? "bg-sky-50 text-sky-700"
                : "text-sky-600"
            }`}
            data-bs-toggle="collapse"
            data-bs-target="#patientMenu"
            style={{ textDecoration: "none" }}
          >
            <span className="d-flex align-items-center gap-2">
              <i
                className="bi bi-person-gear"
                style={{ width: "24px", fontSize: "1.1rem" }}
              ></i>
              <span>Patient Records</span>
            </span>
            <i
              className={`bi bi-chevron-down small ${
                isActive("/listpatient") ? "text-sky-700" : "text-sky-500"
              }`}
            ></i>
          </button>

          <div
            className={`collapse ${isActive("/listpatient") ? "show" : ""}`}
            id="patientMenu"
          >
            <nav className="nav flex-column ms-4">
              <Link
                className={`nav-link py-2 ps-3 rounded ${
                  isActive("/listpatient")
                    ? "bg-sky-50 text-sky-700 border-start border-sky-500"
                    : "text-sky-600"
                }`}
                to="/listpatient"
              >
                <i className="bi bi-list-ul me-2"></i>
                Patient List
              </Link>
            </nav>
          </div>
        </div>

        {/* Register Patient */}
        <Link
          className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded ${
            isActive("/CreatePatient")
              ? "bg-sky-100 text-sky-800 fw-medium"
              : "text-sky-600"
          }`}
          to="/CreatePatient"
        >
          <i
            className="bi bi-person-plus"
            style={{ width: "24px", fontSize: "1.1rem" }}
          ></i>
          Register Patient
        </Link>

        <Link
          className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded ${
            isActive("/Listappointment")
              ? "bg-sky-100 text-sky-800 fw-medium"
              : "text-sky-600"
          }`}
          to="/Listappointment"
        >
          <i
            className="bi bi-person-plus"
            style={{ width: "24px", fontSize: "1.1rem" }}
          ></i>
          List Appointment
        </Link>

        <Link
          className={`nav-link py-2 ps-3 rounded ${
            isActive("/changepassword")
              ? "bg-sky-50 text-sky-700 border-start border-sky-500"
              : "text-sky-600"
          }`}
          to="/changepassword"
        >
          <i className="bi bi-list-ul me-2"></i>
          Change Password
        </Link>

        {/* Quick Actions Section */}
        <div className="mt-4 mb-2 text-uppercase small fw-bold text-sky-600 ps-3">
          <i className="bi bi-lightning-charge me-2"></i>
          Quick Actions
        </div>

        <Link
          className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded ${
            isActive("/Appointment")
              ? "bg-sky-100 text-sky-800 fw-medium"
              : "text-sky-600"
          }`}
          to="/Createappointment"
        >
          <button className="btn btn-sm btn-outline-primary rounded-pill mx-2 mb-3">
            <i className="bi bi-calendar-plus me-1"></i>
            Create Appointment
          </button>
        </Link>

        <button
          onClick={handleLogout}
          className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded text-danger bg-transparent border-0 text-start ${
            isActive("/") ? "bg-sky-100 fw-medium" : ""
          }`}
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-box-arrow-right fs-5"></i>
          Logout
        </button>
      </nav>

      {/* Footer with Medical Theme */}
      <div
        className="mt-auto p-3 text-center"
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
        <small className="text-sky-700 d-block">
          Hospital Management System
        </small>
        <small className="text-sky-500">v2.4.1</small>
      </div>
    </div>
  );
};

export default ReceptionistNavbar;
