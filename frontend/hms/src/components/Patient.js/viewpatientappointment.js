import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Link ,useParams} from 'react-router-dom';

const Viewapatientappointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
    const { id } = useParams();

  const getAppointments = async () => {
    try {
      const token = localStorage.getItem('token'); // make sure token is saved after login
      if (!token) {
        setError('Token not found. Please login again.');
        return;
      }

      const decoded = jwtDecode(token);
      const patientID = decoded.PatientId;

      if (!patientID) {
        setError('Patient ID not found in token.');
        return;
      }

      const response = await axios.get(`https://localhost:7058/api/PatientContoller/api/patient/appointments/my`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAppointments(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load appointments.');
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <div className="container">
      <h2 className="my-3">My Appointments</h2>

      {error && <p className="text-danger">{error}</p>}

      {appointments.length === 0 && !error ? (
        <p>No appointments found.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Date</th>
              <th>Time</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((app, index) => (
              <tr key={index}>
                <td>{app.appointmentId}</td>
                <td>{app.doctorName}</td>
                <td>{app.departmentName}</td>
                <td>{new Date(app.appointmentDate).toLocaleDateString()}</td>
                <td>{app.appointmentTime}</td>
                <td>{app.reason}</td>
                <td>{app.status}</td>
                <td>
                  <Link to={`/billview/${app.appointmentId}`}>
                    <button className='btn btn-outline-primary'>Bill View</button>
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Viewapatientappointment;
