import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Addprescription from './Addprescription';


const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  const navigate = useNavigate();
  const { doctorId, setAppid, appid } = useAuth();

  useEffect(() => {
    axios
      .get('https://localhost:7058/api/Doctor/api/appointments/my', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        console.log('Appointments fetched:', response.data); // Debug log

        const updatedAppointments = response.data.map((item) => ({
          ...item,
          localStatus: item.status || '',
        }));

        setAppointments(updatedAppointments);
      })
      .catch((error) => {
        console.error('Error fetching appointments:', error);
      });
  }, []);

  const handleEdit = (appointmentId, e) => {
   
    console.log('Edit clicked for ID:', appointmentId); // Debug log

    if (!appointmentId) {
      alert('Invalid appointment ID!');
      return;
    }

    navigate(`/DoctorSideEditAppointment/${appointmentId}`);
  };

  const handleAdd = (e) => {
    navigate('/Addprescription')
  }


  const viewappointment =()=>{
navigate('/PatientHistory')
  }
  return (
    <div className="container mt-4">
<div className='d-flex justify-content-between'> <h2 className="text-center mb-4">My Appointments</h2> <button type='button' onClick={viewappointment} className='btn btn-outline-primary'>View Appointment
      </button></div>
     
      <div className="row">
        {appointments.map((appointment) => (
          <div
            key={appointment.appointmentId || appointment.id}
            className="col-md-4 mb-4"
          >
            <div className="card h-100 p-3">
              <p><strong>Date:</strong> {appointment.appointmentDate}</p>
              <p><strong>Patient ID:</strong> {appointment.patientid}</p>
              <p><strong>Patient Name:</strong> {appointment.patientName}</p>
              <p><strong>Reason:</strong> {appointment.reason}</p>
              <p><strong>Status:</strong> {appointment.status}</p>

              <button
                className="btn btn-primary"
                onClick={() =>
                  handleEdit(appointment.appointmentId || appointment.id)
                }
              >
                Edit
              </button>
              <button
                className="btn btn-warning"
                onClick={() => {

                  setAppid(appointment.appointmentId);
                  handleAdd(appointment.appointmentId || appointment.id);
                  // console.log("appointment id:",appointment.appointmentId);
                  // console.log("new valuedgfsggsd",appid);
                }
                }
              >
                Add Prescription
              </button>
            
            </div>
          </div>

        ))}
      </div>
    </div>
  );
};

export default Appointments;
