import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nursesidebar from './Nursesidebar';

const Viewappointmentnurse = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('https://localhost:7058/api/Nurse/appointmentnurse', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);


  const handleEdit = (appointmentId) => {
    navigate(`/Editappointmentnurse/${appointmentId}`);
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#f8f9fa' }}>
        <Nursesidebar />
      </div>


      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: '#f0f2f5' }}>
        <div className="card shadow border-0">
          <div className="card-header bg-info text-white text-center">
            <h4 className="mb-0">
              <i className="bi bi-calendar-check"></i> Nurse - View Appointments
            </h4>
          </div>
          <div className="card-body p-4">
            {data.length === 0 ? (
              <p className="text-center text-muted">No appointments found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-striped align-middle">
                  <thead className="table-primary text-center">
                    <tr>
                      <th>Patient ID</th>
                      <th>Patient Name</th>
                      <th>Date</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Doctor Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data
                      .filter((item) => item.status !== 'Complete')
                      .map((item) => (
                        <tr key={item.appointmentId}>
                          <td>{item.patientid}</td>
                          <td>{item.patientName}</td>
                          <td>{new Date(item.appointmentDate).toLocaleDateString()}</td>
                          <td>{item.reason}</td>
                          <td>
                            <span
                              className={`badge ${
                                item.status === 'Pending'
                                  ? 'bg-warning'
                                  : item.status === 'Approved'
                                  ? 'bg-success'
                                  : 'bg-secondary'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td>{item.doctorName}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-outline-warning btn-sm"
                              onClick={() => handleEdit(item.appointmentId)}
                            >
                              Edit <i className="bi bi-pencil-square ms-1"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewappointmentnurse;
