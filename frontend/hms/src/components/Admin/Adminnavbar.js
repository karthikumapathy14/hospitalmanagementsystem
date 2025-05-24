import React from 'react';
import { Link } from 'react-router-dom';

const Adminnavbar = () => {
  return (
    <div className="bg-dark text-white d-flex flex-column vh-100 p-3" style={{ width: '250px' }}>
      <h4 className="text-center border-bottom pb-3 mb-4">🏥 Hospital Admin</h4>

      <nav className="nav flex-column gap-2">
        <Link className="nav-link text-white fw-bold" to="/Admindashboard">
          <i className="bi bi-speedometer2 me-2"></i> Dashboard
        </Link>

        <div>
          <button
            className="btn btn-dark text-white fw-bold w-100 text-start d-flex justify-content-between align-items-center"
            data-bs-toggle="collapse"
            data-bs-target="#doctorMenu"
          >
            <span><i className="bi bi-person-gear me-2"></i>Edit Users</span>
            <i className="bi bi-caret-down-fill"></i>
          </button>

          <div className="collapse mt-2" id="doctorMenu">
            <nav className="nav flex-column ms-3">
              <Link className="nav-link text-white" to="/listdoc">👨‍⚕️ List Doctors</Link>
              <Link className="nav-link text-white" to="/ListNurse">🧑‍⚕️ List Nurses</Link>
              <Link className="nav-link text-white" to="/listrecep">🧑‍💼 List Receptionists</Link>
              <Link className="nav-link text-white" to="/Department">🏢 Add Department</Link>
            </nav>
          </div>
        </div>

        <Link className="nav-link text-white fw-bold" to="/reg">
          <i className="bi bi-person-plus me-2"></i> Register User
        </Link>
      </nav>
    </div>
  );
};

export default Adminnavbar;
