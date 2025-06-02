import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const DoctorSideEditAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState("");
  const [loading, setLoading] = useState(true);
  const [nurses, getnurse] = useState([]);

  useEffect(() => {
    if (!id) {
      alert('Invalid appointment ID!');
      return;
    }

    axios
      .get(`https://localhost:7058/api/Doctor/api/appointments/${id}`)
      .then((res) => {
        setAppointment(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching appointment:', err);
        alert('Invalid appointment ID or failed to fetch!');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get("https://localhost:7058/api/Admin/getnurse")
      .then((res) => getnurse(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();

    const payload = {
      appointmentId: appointment.appointmentId,
      status: appointment.status,
      nurseId: parseInt(appointment.nurseId),
    };

    axios
      .put(`https://localhost:7058/api/Doctor/api/Editappointments/${id}`, payload)
      .then(() => {
        alert('Appointment updated successfully!');
        navigate('/viewappointment');
      })
      .catch((err) => {
        console.error('Error updating appointment:', err.response?.data || err.message);
        alert('Failed to update appointment');
      });
  };

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!appointment) return <div className="text-danger text-center mt-5">No appointment found</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 rounded-4 border-0 bg-white">
        <h3 className="text-center text-primary mb-4">Edit Appointment</h3>
        <form onSubmit={handleUpdate}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Patient Name:</label>
              <input
                type="text"
                className="form-control"
                value={appointment.patientName || ''}
                disabled
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Reason:</label>
              <input
                type="text"
                className="form-control"
                value={appointment.reason || ''}
                disabled
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Status:</label>
              <select
                className="form-select"
                name="status"
                value={appointment?.status || ''}
                onChange={handleChange}
              >
                <option value="">-- Select Status --</option>
                <option value="Schedule">Schedule</option>
                <option value="Complete">Complete</option>
                <option value="Cancel">Cancel</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Assign Nurse:</label>
              <select
                className="form-select"
                name="nurseId"
                value={appointment?.nurseId || ''}
                onChange={handleChange}
              >
                <option value="">-- Select Nurse --</option>
                {nurses.map((nurse) => (
                  <option key={nurse.id} value={nurse.id}>
                    {nurse.userName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-end">
            <button type="submit" className="btn btn-success px-4">
              Update Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorSideEditAppointment;
