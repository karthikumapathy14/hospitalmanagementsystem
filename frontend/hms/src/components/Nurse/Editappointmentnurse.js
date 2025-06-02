import axios from "axios";
import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import Nursesidebar from "./Nursesidebar";

const Editappointmentnurse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://localhost:7058/api/Nurse/getbyidprescibe/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  const handleEdit = (e) => {
    e.preventDefault();
    axios
      .put(`https://localhost:7058/api/Nurse/updateprescription/${id}`, data)

      .then(() => {
        alert("✅ Prescription updated successfully");
        navigate("/Viewappointmentnurse");
      })
      .catch((err) => console.error(err));

  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  if (loading) {

    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );

  }

  if (!data || !data.appointmentId) {
    return (
      <div className="text-center mt-5">
        <h4 className="text-danger">⚠ No prescription record found</h4>

        <h4 className="text-danger">No prescription added</h4>
      </div>
    );
  }

  return (

    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", backgroundColor: "#f8f9fa" }}>
        <Nursesidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#e8f4f8" }}>
        <div className="container">
          <div className="card shadow border-0 rounded-4 mx-auto" style={{ maxWidth: "720px" }}>
            <div className="card-header bg-info text-white text-center rounded-top-4">
              <h4 className="mb-0">🩺 Edit Patient Prescription</h4>
              <small className="d-block">Update notes, diagnosis & medication details</small>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleEdit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Appointment ID</label>
                  <input
                    className="form-control"
                    name="appointmentId"
                    value={data.appointmentId}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Diagnosis</label>
                  <input
                    type="text"
                    className="form-control"
                    name="diagnosis"
                    value={data.diagnosis}
                    onChange={handleChange}
                    placeholder="e.g., Viral fever"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Notes</label>
                  <textarea
                    className="form-control"
                    name="notes"
                    value={data.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Add any specific instructions or observations"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Medications</label>
                  <input
                    type="text"
                    className="form-control"
                    name="medications"
                    value={data.medications}
                    onChange={handleChange}
                    placeholder="e.g., Paracetamol 500mg, 3 times a day"
                  />
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-success px-5">
                    💾 Save Changes
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center text-muted">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
</div>
    </div>
  );
};

export default Editappointmentnurse;
