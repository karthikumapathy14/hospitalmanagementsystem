import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Viewprescription = () => {
  const { id } = useParams(); // get id from URL params
  const navigate = useNavigate();

  const [data, setData] = useState({
    appointmentId: "",
    diagnosis: "",
    notes: "",
    medications: "",
  });
  const [loading, setLoading] = useState(true);

   const token = localStorage.getItem("token");
   
  useEffect(() => {

     if (!token) {
          toast.error("Restricted Access");
          navigate("/");
          return;
        }

 axios
    .get(`https://localhost:7058/api/Nurse/getbyidprescibe/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setData(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching prescription:", err);
      toast.error("Failed to load prescription");
      setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center mt-5">Loading Prescription...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (e) => {
    e.preventDefault();

    axios
      .put(`https://localhost:7058/api/Nurse/updateprescription/${id}`, data)
      .then(() => {
        toast.success("Prescription updated successfully!");
        navigate(-1);
      })
      .catch((err) => {
        console.error("Error updating prescription:", err);
        toast.error("Failed to update prescription");
      });
  };

  return (
    <div>
      <div
        className="flex-grow-1 p-4"
        style={{ backgroundColor: "#e8f4f8", height: "100vh" }}
      >
        <div className="container">
          <div
            className="card shadow border-0 rounded-4 mx-auto"
            style={{ maxWidth: "720px" }}
          >
            <div className="card-header bg-info text-white text-center rounded-top-4">
              <h4 className="mb-0">🩺 View/Edit Patient Prescription</h4>
              <small className="d-block">
                Update notes, diagnosis & medication details
              </small>
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
            <div className="card-footer text-center text-muted"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewprescription;
