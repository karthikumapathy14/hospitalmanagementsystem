import axios from "axios";
import React, { useEffect, useState } from "react";
import ReceptionistNavbar from "./ReceptionistNavbar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Makeappointment = () => {
  const [forms, setForm] = useState({
    doctorId: "",
    patientid: "",
    departmentId: "",
    appointmentDate: new Date(),
    startTime: "",
    reason: "",
    status: "",
    createdAt: new Date().toISOString().split("T")[0],
  });

  const [doc, setdoc] = useState([]);
  const [patient, getpatient] = useState([]);
  const [filtered, setfiltered] = useState([]);
  const [dept, getdept] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [message, setMessage] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "departmentId") {
      const filteredDoctors = doc.filter((d) => d.departmentId == value);
      setfiltered(filteredDoctors);
      setForm((prev) => ({ ...prev, doctorId: "", startTime: "" }));
      setAvailableSlots([]);
    }

    if (name === "doctorId" || name === "appointmentDate") {
      setForm((prev) => ({ ...prev, startTime: "" }));
      setAvailableSlots([]);
    }
  };

  const appointmentDateString =
    typeof forms.appointmentDate === "string"
      ? forms.appointmentDate
      : forms.appointmentDate.toISOString().split("T")[0];

  useEffect(() => {
    if (!forms.doctorId || !appointmentDateString) {
      setAvailableSlots([]);
      return;
    }

    axios
      .get(
        `https://localhost:7058/api/Receptionist/Get-available-slots/${forms.doctorId}/${appointmentDateString}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setAvailableSlots(res.data);
      })
      .catch(() => setMessage("Failed to load available slots"));
  }, [forms.doctorId, appointmentDateString, token]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !forms.patientid ||
      !forms.departmentId ||
      !forms.doctorId ||
      !forms.appointmentDate ||
      !forms.startTime ||
      !forms.reason ||
      !forms.status
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      ...forms,
      appointmentDate: appointmentDateString,
    };

    axios
      .post(
        "https://localhost:7058/api/Receptionist/Create-appointment",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setMessage("Appointment created successfully.");
        setForm({
          doctorId: "",
          patientid: "",
          departmentId: "",
          appointmentDate: new Date(),
          startTime: "",
          reason: "",
          status: "",
          createdAt: today,
        });
        setAvailableSlots([]);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to create appointment.");
      });
  };

  useEffect(() => {
    if (!token) {
      toast.error("Restricted Access");
      navigate("/");
      return;
    }

    axios
      .get("https://localhost:7058/api/Admin/docGetAll", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {setdoc(res.data);
        console.log(res.data.availability)
      })
      .catch((err) => console.log(err));

    axios
      .get("https://localhost:7058/api/Receptionist/Getallpatient", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => getpatient(res.data))
      .catch((err) => console.log(err));

    axios
      .get("https://localhost:7058/api/Admin/get-dept", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => getdept(res.data))
      .catch((err) => console.log(err));
  }, [navigate, token]);

  const getDoctorById = (id) =>
    doc.find((d) => d.id === parseInt(id));

  const isDoctorAvailable = (id) =>
    getDoctorById(id)?.availability?.trim().toLowerCase() === "available";


  return (
    <div
      className="d-flex"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <ReceptionistNavbar />
      <div
        className="flex-grow-1 p-4"
        style={{ marginLeft: "260px", width: "calc(100% - 260px)" }}
      >
        <div className="container-fluid py-4">
          <div className="card shadow-sm border-0 p-4">
            <div className="row justify-content-center">
              <form onSubmit={handleSubmit} className="col-6">
                <h3 className="mb-3">Create Appointment</h3>

                {message && (
                  <div className="alert alert-success">{message}</div>
                )}

                <label className="form-label">Patient</label>
                <select
                  className="form-select"
                  name="patientid"
                  value={forms.patientid}
                  onChange={handleChange}
                >
                  <option value="">- Select Patient -</option>
                  {patient.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.patientid}
                    </option>
                  ))}
                </select>

                <label className="form-label mt-3">Department</label>
                <select
                  className="form-select"
                  name="departmentId"
                  value={forms.departmentId}
                  onChange={handleChange}
                >
                  <option value="">- Select Department -</option>
                  {dept.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.departmentName}
                    </option>
                  ))}
                </select>

                <label className="form-label mt-3">Doctor</label>
                <select
                  className="form-select"
                  name="doctorId"
                  value={forms.doctorId}
                  onChange={handleChange}
                >
                  <option value="">- Select Doctor -</option>
                  {(forms.departmentId ? filtered : doc).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.userName}{" "}
                      {item.availability?.trim().toLowerCase() ===
                      "available"
                        ? "🟢"
                        : "🔴"}
                    </option>
                  ))}
                </select>

                {forms.doctorId && (
                  <div className="mt-2">
                    <strong>Status: </strong>
                    <span
                      style={{
                        color: isDoctorAvailable(forms.doctorId)
                          ? "green"
                          : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {getDoctorById(forms.doctorId)?.availability || "Unknown"}
                    </span>
                  </div>
                )}

                <label className="form-label mt-3">Appointment Date</label>
                <DatePicker
                  selected={
                    typeof forms.appointmentDate === "string"
                      ? new Date(forms.appointmentDate)
                      : forms.appointmentDate
                  }
                  onChange={(date) =>
                    setForm((prev) => ({ ...prev, appointmentDate: date }))
                  }
                  minDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                  name="appointmentDate"
                />

                <label className="form-label mt-3">Available Time Slots</label>
                {availableSlots.length > 0 ? (
                  <select
                    className="form-select"
                    name="startTime"
                    value={forms.startTime}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Time</option>
                    {availableSlots.map((slot) => (
                      <option
                        key={slot.time}
                        value={slot.time}
                        disabled={slot.isBooked}
                      >
                        {slot.time} {slot.isBooked ? "(Booked)" : ""}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>No available slots for selected date and doctor</p>
                )}

                <label className="form-label mt-3">Reason</label>
                <input
                  type="text"
                  className="form-control"
                  name="reason"
                  value={forms.reason}
                  onChange={handleChange}
                />

                <label className="form-label mt-3">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={forms.status}
                  onChange={handleChange}
                >
                  <option value="">- Select Status -</option>
                  <option value="Schedule">Schedule</option>
                  <option value="Complete">Complete</option>
                  <option value="Cancel">Cancel</option>
                </select>

                <label className="form-label mt-3">Created At</label>
                <input
                  type="date"
                  className="form-control"
                  name="createdAt"
                  value={forms.createdAt}
                  onChange={handleChange}
                  disabled
                />

                <button type="submit" className="btn btn-primary mt-4 w-100">
                  Create Appointment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Makeappointment;
