import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Editappointment from './Editappointment';
import ReceptionistNavbar from './ReceptionistNavbar';

const ListAppointment = () => {
  const [data, setData] = useState([]);
  const{id}=useParams();

  useEffect(() => {
    axios.get("https://localhost:7058/api/Receptionist/getappointment")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
     <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <ReceptionistNavbar />
                      <div className="flex-grow-1 p-4" style={{ marginLeft: '260px', width: 'calc(100% - 260px)' }}>
                <div className="container-fluid py-4">
                    <div className="card shadow-sm border-0">
                       
                          
    <div className="container mt-5">
      <h2 className="text-center mb-4">Appointments List</h2>
      <div className="table-responsive">
        <table className="table table-hover table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Patient ID</th>
              <th>Department</th>
              <th>Doctor</th>
              <th>Appointment Date</th>
              <th>Appointment Time</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.appointmentId}>
                  <td>{item.patientid}</td>
                  <td>{item.departmentName}</td>
                  <td>{item.doctorName}</td>
                  <td>{new Date(item.appointmentDate).toLocaleDateString()}</td>
                  <td>{item.appointmentTime}</td>
                  <td>{item.reason}</td>
                  <td>
                    <span className={`badge ${item.status === 'Confirmed' ? 'bg-success' : 'bg-secondary'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                  <td>
                    <Link to={`/editappointment/${item.appointmentId}`}>
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-pencil-square"></i> Edit
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">No appointments found.</td>
              </tr>
            )}
           
          </tbody>
        </table>
       
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default ListAppointment;
