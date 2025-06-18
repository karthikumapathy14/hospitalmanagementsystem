import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../Common/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Addprescription = () => {
  const [prescribe, setPrescribe] = useState({
    diagnosis: "",
    medications: "",
    notes: "",
    prescribedDate: "",
  });
  const navigate = useNavigate();

  const { doctorId, appid } = useAuth();
  console.log("prescription", appid);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Restricted Access");
    navigate("/");
    return;
  }
}, []);

  const handleChange = (e) => {
    setPrescribe({ ...prescribe, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...prescribe,
      appointmentId: parseInt(appid, 10),
      prescribedby: parseInt(doctorId, 10),
    };
    console.log("payload", payload);
    const token = localStorage.getItem("token");

    axios
      .post("https://localhost:7058/api/Doctor/postprescription", payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        alert("Prescription saved!");
        navigate("/doctor/viewappointment");
        setPrescribe({
          appointmentId: "",
          diagnosis: "",
          medications: "",
          notes: "",
          prescribedDate: "",
          prescribedby: "",
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="row card">
      <div
        className="d-flex align-items-center justify-content-center "
        style={{ minHeight: "100vh", maxWidth: "100%" }}
      >
        <form className="" style={{ minWidth: "50%" }} onSubmit={handleSubmit}>
          <h2 className="text-center card card-header ">Prescription</h2>
          <div className="card card-body ">
            {/* <p>Welcome Doctor ID: {doctorId}</p> */}

            <label className="form-label">Appointment Id</label>
            <input
              className="form-control"
              name="appointmentId"
              value={appid}
              onChange={handleChange}
              required
              readOnly
            />

            <label className="form-label">Diagnosis</label>
            <textarea
              className="form-control"
              name="diagnosis"
              value={prescribe.diagnosis}
              onChange={handleChange}
              required
            />

            <label className="form-label">Medication</label>
            <textarea
              className="form-control"
              name="medications"
              value={prescribe.medications}
              onChange={handleChange}
              required
            />

            <label className="form-label">Notes</label>
            <textarea
              className="form-control"
              name="notes"
              value={prescribe.notes}
              onChange={handleChange}
            />

            <label className="form-label">Prescribed Date</label>
            <input
              type="date"
              className="form-control"
              name="prescribedDate"
              value={prescribe.prescribedDate}
              onChange={handleChange}
              required
            />

            <label className="form-label">Prescribed By</label>
            <input
              className="form-control"
              name="prescribedby"
              value={doctorId}
              readOnly
            />
            <button type="submit" className="btn btn-primary mt-3">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addprescription;
