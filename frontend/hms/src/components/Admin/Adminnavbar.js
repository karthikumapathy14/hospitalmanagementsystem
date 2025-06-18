import React from "react";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../Common/Logout";
import { jwtDecode } from "jwt-decode";

const Adminnavbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  let adminName = "";

  const handleLogout = () => {
    logout();
  };

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  console.log(decoded);

  if (token) {
    adminName =
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    console.log(adminName);
  }
  // console.log(adminName) 

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
      {/* Header */}
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
              className="bi bi-hospital text-white"
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
          <i className="bi bi-person-gear me-1"></i> Admin Panel
        </div>

        {adminName && (
          <div className="badge bg-sky-200 text-sky-800 px-3 py-1 rounded-pill mb-1 text-dark">
            <i className="bi bi-person-circle me-1"></i> Welcome {adminName} !
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="nav flex-column gap-1 px-3">
        <Link
          className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded ${
            isActive("/admin/Admindashboard")
              ? "bg-sky-100 text-sky-800 fw-medium"
              : "text-sky-600"
          }`}
          to="/admin/Admindashboard"
        >
          <i
            className="bi bi-speedometer2"
            style={{ width: "24px", fontSize: "1.1rem" }}
          ></i>
          Dashboard
        </Link>

        <div className="mt-3 mb-2 text-uppercase small fw-bold text-sky-600 ps-3">
          <i className="bi bi-person-lines-fill me-2"></i>
          User Management
        </div>

        <div className="mb-2">
          <button
            className={`btn btn-link text-start w-100 d-flex align-items-center justify-content-between gap-2 py-2 px-3 rounded ${
              [
                "/admin/listdoc",
                "/admin/ListNurse",
                "/admin/listrecep",
                "/admin/Department",
              ].includes(location.pathname)
                ? "bg-sky-50 text-sky-700"
                : "text-sky-600"
            }`}
            data-bs-toggle="collapse"
            data-bs-target="#adminUserMenu"
            style={{ textDecoration: "none" }}
          >
            <span className="d-flex align-items-center gap-2">
              <i
                className="bi bi-person-gear"
                style={{ width: "24px", fontSize: "1.1rem" }}
              ></i>
              Edit Users
            </span>
            <i className="bi bi-chevron-down small"></i>
          </button>

          <div
            className={`collapse ${
              [
                "/admin/listdoc",
                "/admin/ListNurse",
                "/admin/listrecep",
                "/admin/Department",
              ].includes(location.pathname)
                ? "show"
                : ""
            }`}
            id="adminUserMenu"
          >
            <nav className="nav flex-column ms-4">
              <Link
                className={`nav-link py-2 ps-3 rounded ${
                  isActive("/admin/listdoc")
                    ? "bg-sky-50 text-sky-700 border-start border-sky-500"
                    : "text-sky-600"
                }`}
                to="/admin/listdoc"
              >
                👨‍⚕️ List Doctors
              </Link>
              <Link
                className={`nav-link py-2 ps-3 rounded ${
                  isActive("/admin/ListNurse")
                    ? "bg-sky-50 text-sky-700 border-start border-sky-500"
                    : "text-sky-600"
                }`}
                to="/admin/ListNurse"
              >
                🧑‍⚕️ List Nurses
              </Link>
              <Link
                className={`nav-link py-2 ps-3 rounded ${
                  isActive("/admin/listrecep")
                    ? "bg-sky-50 text-sky-700 border-start border-sky-500"
                    : "text-sky-600"
                }`}
                to="/admin/listrecep"
              >
                🧑‍💼 List Receptionists
              </Link>
            </nav>
          </div>
        </div>
        <Link
          className={`nav-link py-2 ps-3 rounded ${
            isActive("/admin/Department")
              ? "bg-sky-50 text-sky-700 border-start border-sky-500"
              : "text-sky-600"
          }`}
          to="/admin/Department"
        >
          🏢 Add Department
        </Link>
        <Link
          className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded ${
            isActive("/admin/reg")
              ? "bg-sky-100 text-sky-800 fw-medium"
              : "text-sky-600"
          }`}
          to="/admin/reg"
        >
          <i
            className="bi bi-person-plus"
            style={{ width: "24px", fontSize: "1.1rem" }}
          ></i>
          Register User
        </Link>

        <Link
          className={`nav-link py-2 ps-3 rounded ${
            isActive("/admin/changepassword")
              ? "bg-sky-50 text-sky-700 border-start border-sky-500"
              : "text-sky-600"
          }`}
          to="/admin/changepassword"
        >
          <i className="bi bi-list-ul me-2"></i>
          Change Password
        </Link>

        <Link
          className={`nav-link py-2 ps-3 rounded ${
            isActive("/admin/Circularsender")
              ? "bg-sky-50 text-sky-700 border-start border-sky-500"
              : "text-sky-600"
          }`}
          to="/admin/Circularsender"
        >
          <i className="bi bi-list-ul me-2"></i>
          Circular Sender
        </Link>
        <Link
          className={`nav-link py-2 ps-3 rounded ${
            isActive("/admin/Staffavailable")
              ? "bg-sky-50 text-sky-700 border-start border-sky-500"
              : "text-sky-600"
          }`}
          to="/admin/Staffavailable"
        >
          <i className="bi bi-person-fill-check me-2"></i>
          Staffavailable
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

      {/* Footer */}
      <div
        className="mt-auto p-3 text-center"
        style={{
          borderTop: "1px solid #bae6fd",
          background: "rgba(186, 230, 253, 0.3)",
        }}
      >
        <div className="d-flex justify-content-center gap-3 mb-2">
          <button className="btn btn-sm btn-outline-primary rounded-circle p-2">
            <i className="bi bi-gear"></i>
          </button>
          <button className="btn btn-sm btn-outline-primary rounded-circle p-2">
            <i className="bi bi-info-circle"></i>
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

export default Adminnavbar;
