import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PatientHistory = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHistory, setFilteredHistory] = useState([]);
  const navigate=useNavigate();

  const token = localStorage.getItem("token");
 
  useEffect(() => {
      if (!token) {
      toast.error("Restricted Access");
      navigate("/");
      return;
    }
    axios
      .get("https://localhost:7058/api/Doctor/history", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setHistory(res.data);
        setFilteredHistory(res.data); 
      })
      .catch((err) => console.log(err));
  }, [navigate]);

  
  useEffect(() => {
    const term = searchTerm.toLowerCase();

    const filtered = history.filter((item) => {
      const patientId = String(item?.patient?.patientid || "");
      const patientDbId = String(item?.patient?.id || "");
      const appointmentId = String(item?.appointmentId || "");
      const appointmentDate = String(item?.appointmentDate || "");
      const reason = String(item?.reason || "");
      const doctorName = String(item?.doctor?.docname || "");
      const departmentName = String(
        item?.doctor?.department?.departmentName || ""
      );
      const diagnosis = String(item?.prescription?.diagnosis || "");
      const medications = String(item?.prescription?.medications || "");
      const notes = String(item?.prescription?.notes || "");
      const prescribedDate = String(item?.prescription?.prescribedDate || "");

      return (
        patientId.toLowerCase().includes(term) ||
        patientDbId.toLowerCase().includes(term) ||
        appointmentId.toLowerCase().includes(term) ||
        appointmentDate.toLowerCase().includes(term) ||
        reason.toLowerCase().includes(term) ||
        doctorName.toLowerCase().includes(term) ||
        departmentName.toLowerCase().includes(term) ||
        diagnosis.toLowerCase().includes(term) ||
        medications.toLowerCase().includes(term) ||
        notes.toLowerCase().includes(term) ||
        prescribedDate.toLowerCase().includes(term)
      );
    });

    setFilteredHistory(filtered);
  }, [searchTerm, history]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Patient History</h1>
      <div className="mb-3 d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Patient ID or Doctor Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Patient Unique Id</th>

              <th>Appointment Date</th>
              <th>Reason</th>
              <th>Doctor Name</th>
              <th>Department Name</th>
              <th>Diagnosis</th>
              <th>Medications</th>
              <th>Notes</th>
              <th>Prescribed Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item, index) => (
                <tr key={index}>
                  {/* <td>{item.patient.id}</td> */}
                  <td>{item.patient.patientid}</td>
                  {/* <td>{item.appointmentId}</td> */}
                  <td>{item.appointmentDate}</td>
                  <td>{item.reason}</td>
                  <td>{item.doctor?.docname || "-"}</td>
                  <td>{item.doctor?.department?.departmentName || "-"}</td>
                  <td>{item.prescription?.diagnosis}</td>
                  <td>{item.prescription?.medications || "N/A"}</td>
                  <td>{item.prescription?.notes || "N/A"}</td>
                  <td>
                    {item.prescription?.prescribedDate
                      ? new Date(
                          item.prescription.prescribedDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center">
                  No history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientHistory;
