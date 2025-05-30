import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Addprescription from "./Addprescription";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  const navigate = useNavigate();
  const { doctorId, setAppid, appid } = useAuth();

  useEffect(() => {
    axios
      .get("https://localhost:7058/api/Doctor/api/appointments/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("Appointments fetched:", response.data); // Debug log

        const updatedAppointments = response.data.map((item) => ({
          ...item,
          localStatus: item.status || "",
        }));

        setAppointments(updatedAppointments);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
      });
  }, []);

  const handleEdit = (appointmentId, e) => {
    console.log("Edit clicked for ID:", appointmentId); // Debug log

    if (!appointmentId) {
      alert("Invalid appointment ID!");
      return;
    }

    navigate(`/DoctorSideEditAppointment/${appointmentId}`);
  };

  const handleAdd = (e) => {
    navigate("/Addprescription");
  };

  const viewappointment = () => {
    navigate("/PatientHistory");
  };
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between">
        <h2 className="text-center mb-4">Today's Appointments</h2>
        <button
          type="button"
          onClick={viewappointment}
          className="btn btn-outline-primary"
        >
          View History
        </button>
      </div>

      <div className="row">

        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Appointment Date</th>
              <th>Patient ID</th>
              <th>Patient Name</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.filter(
              (appointment) => appointment.status !== "Complete"
            ).length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No upcoming appointments.
                </td>
              </tr>
            ) : (
              appointments
                .filter((appointment) => appointment.status !== "Complete")
                .map((appointment) => (
                  <tr key={appointment.appointmentId || appointment.id}>
                    <td>
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString()}
                    </td>
                    <td>{appointment.patientid}</td>
                    <td>{appointment.patientName}</td>
                    <td>{appointment.reason}</td>
                    <td>{appointment.status}</td>
                    <td>
                      <button
                        className="btn btn-primary me-2"
                        onClick={() =>
                          handleEdit(
                            appointment.appointmentId || appointment.id
                          )
                        }
                      >
                        Asign Nurse
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={() => {
                          setAppid(appointment.appointmentId);
                          handleAdd();
                        }}
                      >
                        Add Prescription
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default Appointments;
