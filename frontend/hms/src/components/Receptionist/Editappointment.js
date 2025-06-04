import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const Editappointment = () => {
  const [forms, setforms] = useState({
    patientId: "",
    doctorId: "",
    departmentId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    status: ""
  });

  const navigate = useNavigate();
  const { id } = useParams();
const token = localStorage.getItem("token");
  const [dept, getdept] = useState([]);
  const [doc, getdoc] = useState([]);
  const [filtered, setfiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlechange = (e) => {
    const { name, value } = e.target;

    if (name === 'departmentId') {
      setforms((prev) => ({
        ...prev,
        departmentId: value,
        doctorId: ''
      }));

      const filteredDoctors = doc.filter((d) => d.departmentId === value);
      setfiltered(filteredDoctors);
    } else {
      setforms((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  useEffect(() => {
      if (!token) {
      toast.error("Restricted Access");
      navigate("/");
      return;
    }

    axios.get("https://localhost:7058/api/Admin/get-dept")
      .then((res) => getdept(res.data))
      .catch(console.error);

    axios.get("https://localhost:7058/api/Admin/docGetAll")
      .then((res) => getdoc(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    axios.get(`https://localhost:7058/api/Receptionist/getappointmentid/${id}`)
      .then((res) => {
        setforms(res.data);
      })
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    if (forms.departmentId && doc.length > 0) {
      const filteredDoctors = doc.filter(
        (d) => d.departmentId === forms.departmentId || d.id === forms.doctorId
      );
      console.log(filteredDoctors);
      setfiltered(filteredDoctors);
    }
  }, [forms.departmentId, doc, forms.doctorId]);

  const handlesubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.put(`https://localhost:7058/api/Receptionist/Edit-appointment/${id}`, forms)
      .then(() => {
        alert("Appointment updated successfully!");
        navigate(-1);
      })
      .catch((err) => {
        console.error(err);
        alert("Update failed. Try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body p-4">
              <h2 className="text-center text-primary fw-bold mb-4">Edit Appointment</h2>
              <form onSubmit={handlesubmit}>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Patient ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="patientId"
                    value={forms.patientId}
                    disabled
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Department</label>
                  <select
                    className="form-select"
                    name="departmentId"
                    value={forms.departmentId}
                    onChange={handlechange}
                    required
                  >
                    <option value="">Select Department</option>
                    {dept.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.departmentName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Doctor</label>
                  <select
                    className="form-select"
                    name="doctorId"
                    value={forms.doctorId || ""}
                    onChange={handlechange}
                    required
                    disabled={!forms.departmentId}
                  >
                    <option value="">Select Doctor</option>
                    {filtered.length > 0 ? (
                      filtered.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.userName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No doctors found</option>
                    )}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Appointment Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="appointmentDate"
                    value={forms.appointmentDate}
                    onChange={handlechange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Appointment Time</label>
                  <input
                    type="time"
                    className="form-control"
                    name="appointmentTime"
                    step="1"
                    value={forms.appointmentTime}
                    onChange={handlechange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Reason</label>
                  <input
                    type="text"
                    className="form-control"
                    name="reason"
                    value={forms.reason}
                    onChange={handlechange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={forms.status}
                    onChange={handlechange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Schedule">Schedule</option>
                    <option value="Complete">Complete</option>
                    <option value="Cancel">Cancel</option>
                  </select>
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-success px-4 me-2"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editappointment;
