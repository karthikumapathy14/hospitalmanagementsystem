import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const StaffDetails = () => {
  const { role, id } = useParams();
  const [staff, setStaff] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7058/api/Admin/GetStaffDetailsByRoleAndId/${role}/${id}`
        );
        setStaff(response.data);
        console.log(response.data)
      } catch (err) {
        setError(err.response?.data || "Failed to fetch staff details");
      }
    };

    fetchStaffDetails();
  }, [role, id]);

  if (error) {
    return (
      <div className="container mt-5">
        <h4 className="text-danger">Error: {error}</h4>
        <button className="btn btn-outline-secondary mt-3" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading staff details...</p>
      </div>
    );
  }

const renderDoctorView = () => (
  <div className="card p-4 shadow-sm">
    <h3 className="text-primary mb-3">Doctor Profile</h3>

    <p><strong>Name:</strong> {staff.userName}</p>
    <p><strong>Email:</strong> {staff.email}</p>
    <p><strong>Phone No:</strong> {staff.phoneNo}</p>
    <p><strong>Qualification:</strong> {staff.qualification}</p>
    <p><strong>Address:</strong> {staff.address}</p>

    <p><strong>Status:</strong> 
      <span className={`badge ms-2 ${staff.status === true ? 'bg-success' : 'bg-danger'}`}>
        {staff.status === true ? 'Active' : 'Inactive'}
        {console.log(staff.status)}
      </span>
    </p>

    <p><strong>Availability:</strong> 
      <span className={`badge ms-2 ${staff.availability === 'Available' ? 'bg-success' : 'bg-danger'}`}>
        {staff.availability}
      </span>
    </p>

    <p><strong>Department:</strong> {staff.department?.departmentName || 'N/A'}</p>
  </div>
);



  const renderNurseView = () => (
    <div className="card p-4 shadow-sm">
      <h3 className="text-success mb-3">Nurse Profile</h3>
      <p><strong>Username:</strong> {staff.userName}</p>
      <p><strong>Email:</strong> {staff.email}</p>
      <p><strong>Phone No:</strong> {staff.phoneNo}</p>
       <p><strong>Address:</strong> {staff.address}</p>
       <p><strong>Status:</strong> 
      <span className={`badge ms-2 ${staff.status === true ? 'bg-success' : 'bg-danger'}`}>
        {staff.status === true ? 'Active' : 'Inactive'}
        {console.log(staff.status)}
      </span>
    </p>
      <p><strong>Availability:</strong> 
        <span className={`badge ms-2 ${staff.availability === 'Available' ? 'bg-success' : 'bg-danger'}`}>
          {staff.availability}
        </span>
      </p>
      <p><strong>Shift:</strong> {staff.shift || 'N/A'}</p>
    </div>
  );

  const renderReceptionistView = () => (
    <div className="card p-4 shadow-sm">
      <h3 className="text-warning mb-3">Receptionist Profile</h3>
      <p><strong>Username:</strong> {staff.userName}</p>
      <p><strong>Email:</strong> {staff.email}</p>
      <p><strong>Phone No:</strong> {staff.phoneNo}</p>
      <p><strong>Address:</strong> {staff.address}</p>
       <p><strong>Status:</strong> 
      <span className={`badge ms-2 ${staff.status === true ? 'bg-success' : 'bg-danger'}`}>
        {staff.status === true ? 'Active' : 'Inactive'}
        {console.log(staff.status)}
      </span>
    </p>
      <p><strong>Availability:</strong> 
        <span className={`badge ms-2 ${staff.availability === 'Available' ? 'bg-success' : 'bg-danger'}`}>
          {staff.availability}
        </span>
      </p>
      
    </div>
  );

  return (
    <div className="container mt-5">
      {role.toLowerCase() === "doctor" && renderDoctorView()}
      {role.toLowerCase() === "nurse" && renderNurseView()}
      {role.toLowerCase() === "receptionist" && renderReceptionistView()}

     
    </div>
  );
};

export default StaffDetails;
