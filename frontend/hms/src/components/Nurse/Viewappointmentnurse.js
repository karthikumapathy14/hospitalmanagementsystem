import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        console.log('Appointments fetched:', res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleEdit = (appointmentId) => {
    navigate(`/Editappointmentnurse/${appointmentId}`);
  };

  return (
    <div className="container my-5">
      <div className="card shadow-lg border-0">
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
                    <th>Appointment Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Doctor Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.appointmentId}>
                      <td>{item.patientId}</td>
                      <td>{item.patientName}</td>
                      <td>{new Date(item.appointmentDate).toLocaleDateString()}</td>
                      <td>{item.reason}</td>
                      <td>
                        <span className={`badge ${item.status === 'Pending' ? 'bg-warning' : item.status === 'Approved' ? 'bg-success' : 'bg-secondary'}`}>
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
  );
};

export default Viewappointmentnurse;
