import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import DoctorDashboard from "./DoctorDashboard";
import { toast } from "react-toastify";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [selectedNurses, setSelectedNurses] = useState({});
  const navigate = useNavigate();
  const { setAppid } = useAuth();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Restricted Access");
      navigate("/");
      return;
    }

    loadAppointments();

    axios
      .get("https://localhost:7058/api/Admin/getnurse", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNurses(res.data))
      .catch((err) => {
        console.error("Error fetching nurses:", err);
        toast.error("Failed to load nurses");
      });
  }, [navigate, token]);

  const loadAppointments = () => {
    axios
      .get("https://localhost:7058/api/Doctor/api/appointments/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const updatedAppointments = response.data.map((item) => ({
          ...item,
          localStatus: item.status || "",
          prescriptionAdded: item.prescriptionAdded || false,
        }));

        const initialSelectedNurses = {};
        updatedAppointments.forEach((appointment) => {
          if (appointment.nurseId) {
            initialSelectedNurses[appointment.appointmentId] =
              appointment.nurseId.toString();
          }
        });

        setAppointments(updatedAppointments);
        setSelectedNurses(initialSelectedNurses);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
      });
  };

  const handleAdd = () => {
    navigate("/doctor/Addprescription");
  };

  const viewappointment = () => {
    navigate("/doctor/PatientHistory");
  };

  const handleNurseChange = (appointmentId, nurseId) => {
    setSelectedNurses((prev) => ({
      ...prev,
      [appointmentId]: nurseId,
    }));
  };

  const handleAssignNurse = (appointmentId) => {
    const nurseId = selectedNurses[appointmentId];
    if (!nurseId) {
      toast.warning("Please select a nurse");
      return;
    }

    const payload = {
      appointmentId,
      nurseId: parseInt(nurseId),
    };

    axios
      .put(
        `https://localhost:7058/api/Doctor/api/Editappointments/${appointmentId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        toast.success("Nurse assigned successfully!");
        loadAppointments();
      })
      .catch((err) => {
        console.error("Failed to assign nurse:", err);
        toast.error("Error assigning nurse");
      });
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const response = await axios.put(
        `https://localhost:7058/api/Doctor/appointments/${appointmentId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data || "Status updated successfully");
      loadAppointments();
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data ===
          "Cannot mark appointment as complete without prescription."
      ) {
        toast.error(
          "Please add a prescription before marking this appointment as complete."
        );
      } else {
        toast.error("Failed to update status. Please try again.");
      }
    }
  };

  const handleMarkComplete = (appointmentId) => {
    updateAppointmentStatus(appointmentId, "Complete");
  };

  const pendingAppointments = appointments.filter(
    (a) => a.status !== "Complete"
  );
  const completedAppointments = appointments.filter(
    (a) => a.status === "Complete"
  );

  return (
    <div className="d-flex ">
      <div className="flex-grow-1" >
        <div className="container-fluid py-3 px-4">
          <div className="d-flex justify-content-end mb-3">
            <button
              type="button"
              onClick={viewappointment}
              className="btn btn-outline-success"
            >
              View Patient History
            </button>
          </div>

          <div className="card shadow rounded-4 border-0 mb-4">
            <div className="card-body">
              <h2 className="text-center text-primary mb-4">
                Upcoming Appointments
              </h2>

              <div className="table-responsive">
                <table className="table table-hover text-center align-middle">
                  <thead className="table-primary">
                    <tr>
                      <th>Date</th>
                      <th>Patient ID</th>
                      <th>Name</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Assign Nurse</th>
                      <th>Prescription</th>
                      <th>Complete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingAppointments.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-muted">
                          No upcoming appointments.
                        </td>
                      </tr>
                    ) : (
                      pendingAppointments.map((appointment) => (
                        <tr key={appointment.appointmentId || appointment.id}>
                          <td>
                            {new Date(
                              appointment.appointmentDate
                            ).toLocaleDateString()}
                          </td>
                          <td>{appointment.patientid}</td>
                          <td>{appointment.patientName}</td>
                          <td>{appointment.reason}</td>
                          <td>
                            <span
                              className={`badge bg-${
                                appointment.status === "Pending"
                                  ? "warning"
                                  : "success"
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex flex-column gap-2">
                              <select
                                className="form-select form-select-sm"
                                value={
                                  selectedNurses[appointment.appointmentId] ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleNurseChange(
                                    appointment.appointmentId,
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">-- Select Nurse --</option>
                                {nurses.map((nurse) => (
                                  <option
                                    key={nurse.id}
                                    value={nurse.id}
                                    disabled={nurse.availability !== "Available"}
                                    style={{
                                      color:
                                        nurse.availability === "Available"
                                          ? "green"
                                          : "red",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {nurse.userName} ({nurse.availability})
                                  </option>
                                ))}
                              </select>
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() =>
                                  handleAssignNurse(appointment.appointmentId)
                                }
                              >
                                Assign Nurse
                              </button>
                              {appointment.nurseId && (
                                <div className="text-muted small">
                                  Assigned:{" "}
                                  {nurses.find(
                                    (n) => n.id === appointment.nurseId
                                  )?.userName || "N/A"}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-success btn-sm"
                              onClick={() => {
                                setAppid(appointment.appointmentId);
                                handleAdd();
                              }}
                              disabled={appointment.prescriptionAdded}
                              title={
                                appointment.prescriptionAdded
                                  ? "Prescription already added"
                                  : "Add Prescription"
                              }
                            >
                              {appointment.prescriptionAdded
                                ? "Added"
                                : "Add Prescription"}
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-success btn-sm"
                              disabled={appointment.status === "Complete"}
                              onClick={() =>
                                handleMarkComplete(appointment.appointmentId)
                              }
                            >
                              Mark Complete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Completed Appointments Section */}
          <div className="card shadow rounded-4 border-0">
            <div className="card-body">
              <h2 className="text-center text-success mb-4">
                Completed Appointments
              </h2>
              <div className="table-responsive">
                <table className="table table-hover text-center align-middle">
                  <thead className="table-success">
                    <tr>
                      <th>Date</th>
                      <th>Patient ID</th>
                      <th>Name</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedAppointments.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-muted">
                          No completed appointments today.
                        </td>
                      </tr>
                    ) : (
                      completedAppointments.map((appointment) => (
                        <tr key={appointment.appointmentId || appointment.id}>
                          <td>
                            {new Date(
                              appointment.appointmentDate
                            ).toLocaleDateString()}
                          </td>
                          <td>{appointment.patientid}</td>
                          <td>{appointment.patientName}</td>
                          <td>{appointment.reason}</td>
                          <td>
                            <span className="badge bg-success">
                              {appointment.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-primary"
                              onClick={() =>
                                navigate(
                                  `/doctor/viewprescription/${appointment.appointmentId}`
                                )
                              }
                            >
                              View/Edit Prescription
                            </button>
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
