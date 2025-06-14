import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DoctorSideEditAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nurses, setNurses] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch appointment details
  useEffect(() => {
    if (!id) {
      toast.error("Invalid appointment ID!");
      return;
    }

    if (!token) {
      toast.error("Restricted Access");
      navigate("/");
      return;
    }

    axios
      .get(`https://localhost:7058/api/Doctor/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAppointment(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching appointment:", err);
        toast.error("Failed to fetch appointment!");
        setLoading(false);
      });
  }, [id, navigate, token]);

  // Fetch nurse list
  useEffect(() => {
    axios
      .get("https://localhost:7058/api/Admin/getnurse", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNurses(res.data))
      .catch((err) => {
        console.error("Error fetching nurses:", err);
        toast.error("Failed to load nurses");
      });
  }, [token]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle update
  const handleUpdate = (e) => {
    e.preventDefault();

    if (!appointment.status || !appointment.nurseId) {
      toast.warning("Please select both status and nurse");
      return;
    }

    const payload = {
      appointmentId: appointment.appointmentId,
      status: appointment.status,
      nurseId: parseInt(appointment.nurseId),
    };

    console.log("Submitting payload:", payload);

    axios
      .put(
        `https://localhost:7058/api/Doctor/api/Editappointments/${id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        toast.success("Appointment updated successfully!");
        navigate("/doctor/viewappointment");
      })
      .catch((err) => {
        console.error(
          "Error updating appointment:",
          err.response?.data || err.message
        );
        toast.error("Failed to update appointment");
      });
  };

  // UI rendering
  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!appointment)
    return (
      <div className="text-danger text-center mt-5">No appointment found</div>
    );

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
                value={appointment.patientName || ""}
                disabled
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Reason:</label>
              <input
                type="text"
                className="form-control"
                value={appointment.reason || ""}
                disabled
              />
            </div>
          </div>

          <div className="row mb-3">
         

            <div className="col-md-6">
              <label className="form-label fw-semibold">Assign Nurse:</label>
              <select
                className="form-select"
                name="nurseId"
                value={appointment.nurseId || ""}
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
