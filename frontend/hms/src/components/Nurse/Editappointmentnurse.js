import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Editappointmentnurse = () => {
  const { id } = useParams();
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
      .then((res) => {
        console.log(res.data);
        alert("Prescription updated successfully");
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!data || !data.appointmentId) {
    return (
      <div className="text-center mt-5">
        <h4 className="text-danger">No prescription added</h4>
      </div>
    );
  }

  return (
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
      </div>
    </div>
  );
};

export default Editappointmentnurse;
