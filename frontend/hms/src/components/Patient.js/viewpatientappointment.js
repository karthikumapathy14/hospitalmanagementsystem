import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import PatientNavbar from './PatientNavbar';
import { toast } from 'react-toastify';

const Viewapatientappointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();


  const getAppointments = async () => {

    try {
      const token = localStorage.getItem('token');
       if (!token) {
      toast.error("Restricted Access");
      navigate("/");
      return;
    }
      if (!token) {
        setError('Token not found. Please login again.');
        setLoading(false);
        return;
      }

      const decoded = jwtDecode(token);
      const patientID = decoded?.PatientId;

      if (!patientID) {
        setError('Patient ID not found in token.');
        setLoading(false);
        return;
      }
     
      const response = await axios.get(
        `https://localhost:7058/api/PatientContoller/api/patient/appointments/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, [navigate]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return <span className="badge bg-success">{status}</span>;
      case 'pending':
        return <span className="badge bg-warning text-dark">{status}</span>;
      case 'cancelled':
        return <span className="badge bg-danger">{status}</span>;
      default:
        return <span className="badge bg-secondary">{status || 'N/A'}</span>;
    }
  };

  return (
    <>
    
      <div className="container mt-5">
        <h2 className="mb-4 text-center">My Appointments</h2>

        {loading && (
          <div className="text-center text-primary">Loading appointments...</div>
        )}

        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {!loading && appointments.length === 0 && !error && (
          <div className="alert alert-info text-center">
            No appointments found.
          </div>
        )}

        {!loading && appointments.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle shadow">
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Bill</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((app, index) => (
                  <tr key={index}>
                    <td>{app.appointmentId}</td>
                    <td>{app.doctorName}</td>
                    <td>{app.departmentName}</td>
                    <td>
                      {app.appointmentDate
                        ? new Date(app.appointmentDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td>{app.appointmentTime || 'N/A'}</td>
                    <td>{app.reason || 'N/A'}</td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td>
                      <Link to={`/patient/billpatientview/${app.appointmentId}`}>
                        <button className="btn btn-outline-primary btn-sm">
                          View Bill
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Viewapatientappointment;
