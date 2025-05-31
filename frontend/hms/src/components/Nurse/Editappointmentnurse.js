import axios from "axios";
import React, { useEffect, useState } from "react";
<<<<<<< Updated upstream


import { useParams, useNavigate } from "react-router-dom";
import Nursesidebar from "./Nursesidebar";

const Editappointmentnurse = () => {
  const { id } = useParams();
  const navigate = useNavigate();


=======
import { useParams } from "react-router-dom";

const Editappointmentnurse = () => {
  const { id } = useParams();
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

        console.error(err);
=======
        console.log(err);
>>>>>>> Stashed changes
        setLoading(false);
      });
  }, [id]);

  const handleEdit = (e) => {
    e.preventDefault();
    axios
      .put(`https://localhost:7058/api/Nurse/updateprescription/${id}`, data)
<<<<<<< Updated upstream


      .then(() => {
        alert("✅ Prescription updated successfully");
        navigate("/Viewappointmentnurse");
      })
      .catch((err) => console.error(err));


=======
      .then((res) => {
        console.log(res.data);
        alert("Prescription updated successfully");
      })
      .catch((err) => console.log(err));
>>>>>>> Stashed changes
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  if (loading) {
<<<<<<< Updated upstream


    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );


=======
    return <div className="text-center mt-5">Loading...</div>;
>>>>>>> Stashed changes
  }

  if (!data || !data.appointmentId) {
    return (
      <div className="text-center mt-5">
<<<<<<< Updated upstream


        <h4 className="text-danger">⚠ No prescription record found</h4>


=======
        <h4 className="text-danger">No prescription added</h4>
>>>>>>> Stashed changes
      </div>
    );
  }

  return (
<<<<<<< Updated upstream

    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", backgroundColor: "#f8f9fa" }}>
        <Nursesidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f0f2f5" }}>
        <div className="card shadow-lg border-0 mx-auto" style={{ maxWidth: "700px" }}>
          <div className="card-header bg-primary text-white text-center">
            <h4 className="mb-0">📝 Edit Prescription</h4>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleEdit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Appointment ID</label>
                <input
                  className="form-control"
                  name="appointmentId"
                  value={data.appointmentId}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Diagnosis</label>
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
                <label className="form-label fw-bold">Notes</label>
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
                <label className="form-label fw-bold">Medications</label>
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
        </div>


=======
    <div className="container mt-5">
      <div className="card shadow-sm p-4">
        <h3 className="mb-4 text-center text-primary">Edit Prescription Details</h3>
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
              placeholder="Enter diagnosis"
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
              placeholder="Enter notes"
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Medications</label>
            <input
              type="text"
              className="form-control"
              name="medications"
              value={data.medications}
              onChange={handleChange}
              placeholder="Enter medications"
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-success px-4">
              Save Changes
            </button>
          </div>
        </form>
>>>>>>> Stashed changes
      </div>
    </div>
  );
};

export default Editappointmentnurse;
