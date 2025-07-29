import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../Common/Logout";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ReceptionistNavbar = () => {
  const location = useLocation();
  const [availability, setAvailability] = useState("Unavailable");
  const [receptionistId, setReceptionistId] = useState(null);
  let recepName='';
   
  const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

  if (token) {
    recepName =
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    console.log(recepName);
  }

  
  const getReceptionistId = () => {
    let id = localStorage.getItem("receptionistId");
    if (!id) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          id = decoded?.id || decoded?.receptionistId || decoded?.ReceptionistId;
          if (id) {
            localStorage.setItem("receptionistId", id);
          }
        } catch (err) {
          console.error("Error decoding token:", err);
        }
      }
    }
    return id;
  };

  const isActive = (path) => location.pathname === path;

  const fetchAvailability = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://localhost:7058/api/Receptionist/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAvailability(response.data.availability);
    } catch (error) {
      console.error("Error fetching receptionist availability:", error);
    }
  };

  const toggleAvailability = async () => {
    if (!receptionistId) {
      console.error("Receptionist ID is undefined.");
      return;
    }

    const newAvailability =
      availability === "Available" ? "Unavailable" : "Available";

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://localhost:7058/api/Receptionist/availabilitystatus/${receptionistId}`,
        { availability: newAvailability },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
        console.log(receptionistId)
    
      setAvailability(newAvailability);
    } catch (error) {
      console.error("Error updating receptionist availability:", error);
    }
  };

  useEffect(() => {
    const id = getReceptionistId();
    if (id) {
      setReceptionistId(id);
      fetchAvailability(id);
    } else {
      console.error("Receptionist ID could not be determined.");
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="d-flex flex-column vh-100 position-fixed" style={{
      width: "260px",
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #f0f9ff, #e0f2fe)",
      borderRight: "1px solid #bae6fd",
      boxShadow: "2px 0 10px rgba(0, 0, 0, 0.05)",
    }}>
      {/* HEADER */}
      <div className="text-center mb-4 mt-4 px-3">
        <div className="d-flex align-items-center justify-content-center gap-1 mb-2">
          <div style={{
            width: "50px",
            height: "40px",
            background: "#38bdf8",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 5px rgba(56, 189, 248, 0.3)",
          }}>
            <i className="bi bi-heart-pulse text-white" style={{ fontSize: "1.25rem" }}></i>
          </div>
          <h4 className="text-sky-800 fw-bold mb-0">MEDCARE HOSPITAL</h4>
        </div>
        <div className="badge bg-sky-100 text-sky-800 px-3 py-1 rounded-pill text-muted">
          <i className="bi bi-reception-4 me-1"></i> Reception Desk
        </div>
         {recepName && (
          <div className="badge bg-sky-200 text-sky-800 px-3 py-1 rounded-pill mb-1 text-dark">
            <p><i className="bi bi-person-circle me-1"></i> Welcome {recepName}!</p>
          </div>
        )}
      </div>

      {/* AVAILABILITY TOGGLE */}
      <div className="text-center mb-3 px-3">
        <label className="form-check form-switch d-flex align-items-center justify-content-center gap-2">
          <input
            className="form-check-input"
            type="checkbox"
            checked={availability === "Available"}
            onChange={toggleAvailability}
            role="switch"
          />
          <span className={`badge ${availability === "Available" ? "bg-success" : "bg-danger"}`}>
            {availability}
          </span>
        </label>
      </div>

      {/* NAVIGATION */}
      <nav className="nav flex-column gap-1 px-3">
        <Link className={`nav-link ${isActive("/receptionist/Createappointment") ? "bg-sky-100 fw-medium" : "text-sky-600"}`} to="/receptionist/Createappointment">
          <i className="bi bi-patch-plus me-2"></i> Create Appointment
        </Link>
        <Link className={`nav-link ${isActive("/receptionist/listpatient") ? "bg-sky-100 fw-medium" : "text-sky-600"}`} to="/receptionist/listpatient">
          <i className="bi bi-list-ul me-2"></i> Patient List
        </Link>
        <Link className={`nav-link ${isActive("/receptionist/CreatePatient") ? "bg-sky-100 fw-medium" : "text-sky-600"}`} to="/receptionist/CreatePatient">
          <i className="bi bi-person-plus me-2"></i> Register Patient
        </Link>
        <Link className={`nav-link ${isActive("/receptionist/Listappointment") ? "bg-sky-100 fw-medium" : "text-sky-600"}`} to="/receptionist/Listappointment">
          <i className="bi bi-calendar me-2"></i> List Appointment
        </Link>
        <Link className={`nav-link ${isActive("/receptionist/changepassword") ? "bg-sky-100 fw-medium" : "text-sky-600"}`} to="/receptionist/changepassword">
          <i className="bi bi-shield-lock me-2"></i> Change Password
        </Link>
        <button onClick={handleLogout} className="nav-link text-danger border-0 text-start bg-transparent">
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </nav>

      {/* FOOTER */}
      <div className="mt-auto p-3 text-center" style={{
        borderTop: "1px solid #bae6fd",
        background: "rgba(186, 230, 253, 0.3)",
      }}>
        <small className="text-sky-700">Hospital Management System</small>
        <br />
        <small className="text-sky-500">v2.4.1</small>
      </div>
    </div>
  );
};

export default ReceptionistNavbar;
