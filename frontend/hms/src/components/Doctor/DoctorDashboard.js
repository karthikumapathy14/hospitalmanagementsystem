import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../Common/Logout";
import axios from "axios";

const DoctorSidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [availability, setAvailability] = useState("Unavailable");
   const doctorId = localStorage.getItem("doctorId");

  // Fetch doctor availability
  const fetchAvailability = async () => {
    
    if (!doctorId) return;  // safety check

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://localhost:7058/api/Doctor/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("DoctorSidebar loaded with doctorId:", doctorId);
      setAvailability(response.data.availability);
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  // Toggle availability handler
  const toggleAvailability = async () => {
    console.log(doctorId);
    if (!doctorId) {
      console.error("Doctor ID is undefined. Cannot toggle availability.");
      return;
    }
    try {
      const newAvailability =
        availability === "Available" ? "Unavailable" : "Available";
      const token = localStorage.getItem("token");
      await axios.put(
        `https://localhost:7058/api/Doctor/availabilitystatus/${doctorId}`,
        { availability: newAvailability }, // this matches your backend model
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAvailability(newAvailability);
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [doctorId]);

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
      <div className="text-center mb-4 mt-4 px-3">
        <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "#38bdf8",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 5px rgba(56, 189, 248, 0.3)",
            }}
          >
            <i className="bi bi-heart-pulse text-white fs-5"></i>
          </div>
          <h5 className="text-sky-800 fw-bold mb-0">MEDCARE HOSPITAL</h5>
        </div>
        <div className="px-3 py-1 rounded-pill">
          <i className="bi bi-reception-4 me-1"></i> Doctor Desk
        </div>
      </div>

      <div className="text-center mb-3 px-3">
        <label className="form-check form-switch d-flex align-items-center justify-content-center gap-2">
          <input
            className="form-check-input"
            type="checkbox"
            checked={availability === "Available"}
            onChange={toggleAvailability}
            role="switch"
          />
          <span
            className={`badge ${
              availability === "Available" ? "bg-success" : "bg-danger"
            }`}
          >
            {availability}
          </span>
        </label>
      </div>

      <nav className="nav flex-column gap-1 px-3">
        <Link
          className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded ${
            isActive("/doctor/viewappointment")
              ? "bg-sky-100 text-sky-800 fw-medium"
              : "text-sky-600"
          }`}
          to="/doctor/viewappointment"
        >
          <i className="bi bi-person-plus" style={{ fontSize: "1.1rem" }}></i>
          View Appointments
        </Link>

        <Link
          className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded ${
            isActive("/doctor/changepassword")
              ? "bg-sky-100 text-sky-800 fw-medium"
              : "text-sky-600"
          }`}
          to="/doctor/changepassword"
        >
          <i className="bi bi-shield-lock" style={{ fontSize: "1.1rem" }}></i>
          Change Password
        </Link>

            <Link
          className={`nav-link d-flex align-items-center gap-2 py-2 px-3 rounded ${
            isActive("/doctor/DoctorAvailibility")
              ? "bg-sky-100 text-sky-800 fw-medium"
              : "text-sky-600"
          }`}
          to="/doctor/DoctorAvailibility"
        >
          <i className="bi bi-shield-lock" style={{ fontSize: "1.1rem" }}></i>
          Doctor Availibility
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
        <small className="text-sky-700 d-block">Hospital Management System</small>
        <small className="text-sky-500">v2.4.1</small>
      </div>
    </div>
  );
};

export default DoctorSidebar;
