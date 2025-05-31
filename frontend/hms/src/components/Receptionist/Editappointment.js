import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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

  const [dept, getdept] = useState([]);
  const [doc, getdoc] = useState([]);
  const [filtered, setfiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlechange = (e) => {
    const { name, value } = e.target;

    if (name === 'departmentId') {
      const filteredDoctors = doc.filter((d) => d.departmentId === value);
      setfiltered(filteredDoctors);
      setforms((prev) => ({
        ...prev,
        departmentId: value,
        doctorId: ''
      }));
    } else {
      setforms((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  useEffect(() => {
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
        const filteredDoctors = doc.filter((d) => d.departmentId === res.data.departmentId);
        setfiltered(filteredDoctors);
      })
      .catch(console.error);
  }, [id, doc]);

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
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg rounded-4 border-0">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Edit Appointment</h3>
              <form onSubmit={handlesubmit}>

                <div className="mb-3">
                  <label className="form-label">Patient ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="patientId"
                    value={forms.patientId}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Department</label>
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

                <div className="mb-3">
                  <label className="form-label">Doctor</label>
                  <select
                    className="form-select"
                    name="doctorId"
                    value={forms.doctorId}
                    onChange={handlechange}
                    required
                    disabled={!forms.departmentId}
                  >
                    <option value="">Select Doctor</option>
                    {(forms.departmentId ? filtered : doc).map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.userName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Appointment Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="appointmentDate"
                    value={forms.appointmentDate}
                    onChange={handlechange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Appointment Time</label>
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

                <div className="mb-3">
                  <label className="form-label">Reason</label>
                  <input
                    type="text"
                    className="form-control"
                    name="reason"
                    value={forms.reason}
                    onChange={handlechange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Status</label>
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

                <div className="text-end">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary ms-2"
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
