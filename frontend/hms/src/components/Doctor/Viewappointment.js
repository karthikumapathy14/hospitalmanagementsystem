import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import DoctorDashboard from "./DoctorDashboard";
import { toast } from "react-toastify";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const { setAppid } = useAuth();
  const token = localStorage.getItem("token");

  useEffect(() => {
      if (!token) {
      toast.error("Restricted Access");
      navigate("/");
      return;
    }
    axios
      .get("https://localhost:7058/api/Doctor/api/appointments/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const updatedAppointments = response.data.map((item) => ({
          ...item,
          localStatus: item.status || "",
        }));
        setAppointments(updatedAppointments);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
      });
  }, [navigate]);

  const handleEdit = (appointmentId) => {
    if (!appointmentId) {
      alert("Invalid appointment ID!");
      return;
    }
    navigate(`/DoctorSideEditAppointment/${appointmentId}`);
  };

  const handleAdd = () => {
    navigate("/Addprescription");
  };

  const viewappointment = () => {
    navigate("/PatientHistory");
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <DoctorDashboard />
      <div className="flex-grow-1 p-4" style={{ marginLeft: "230px" }}>
        <div className="container-fluid py-3 px-4">
          <div className="card shadow rounded-4 border-0">
            <div className="card-body">
              <h2 className="text-center text-primary mb-4">Today's Appointments</h2>

              <div className="d-flex justify-content-end mb-3">
                <button
                  type="button"
                  onClick={viewappointment}
                  className="btn btn-outline-success"
                >
                  View Patient History
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover text-center align-middle">
                  <thead className="table-primary">
                    <tr>
                      <th>Date</th>
                      <th>Patient ID</th>
                      <th>Name</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.filter(a => a.status !== "Complete").length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-muted">
                          No upcoming appointments.
                        </td>
                      </tr>
                    ) : (
                      appointments
                        .filter(a => a.status !== "Complete")
                        .map((appointment) => (
                          <tr key={appointment.appointmentId || appointment.id}>
                            <td>
                              {new Date(appointment.appointmentDate).toLocaleDateString()}
                            </td>
                            <td>{appointment.patientid}</td>
                            <td>{appointment.patientName}</td>
                            <td>{appointment.reason}</td>
                            <td>
                              <span className={`badge bg-${appointment.status === "Pending" ? "warning" : "success"}`}>
                                {appointment.status}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => handleEdit(appointment.appointmentId)}
                                >
                                  Assign Nurse
                                </button>
                                <button
                                  className="btn btn-outline-success btn-sm"
                                  onClick={() => {
                                    setAppid(appointment.appointmentId);
                                    handleAdd();
                                  }}
                                >
                                  Add Prescription
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
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

export default Appointments;
