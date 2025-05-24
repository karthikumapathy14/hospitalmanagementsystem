import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReceptionistNavbar from './ReceptionistNavbar';

const Makeappointment = () => {
  const [forms, setForm] = useState({
    doctorId: '',
    patientid: '',
    departmentId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    status: '',
    createdAt: new Date().toISOString().split("T")[0]
  });

  const [doc, setdoc] = useState([]);
  const [patient, getpatient] = useState([]);
  const [filtered, setfiltered] = useState([]);
  const [dept, getdept] = useState([]);
  const [message, setMessage] = useState('');
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...forms, [name]: value });

    if (name === 'departmentId') {
      const filteredDoctors = doc.filter((d) => d.departmentId == value);
      setfiltered(filteredDoctors);
      setForm(prev => ({ ...prev, doctorId: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic Validation
    if (!forms.patientid || !forms.departmentId || !forms.doctorId || !forms.appointmentDate || !forms.appointmentTime || !forms.reason || !forms.status) {
      alert("Please fill in all required fields.");
      return;
    }

    axios.post("https://localhost:7058/api/Receptionist/Create-appointment", forms)
      .then((res) => {
        setMessage("Appointment created successfully.");
        // Reset form
        setForm({
          doctorId: '',
          patientid: '',
          departmentId: '',
          appointmentDate: '',
          appointmentTime: '',
          reason: '',
          status: '',
          createdAt: today
        });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios.get("https://localhost:7058/api/Admin/docGetAll")
      .then((res) => setdoc(res.data))
      .catch((err) => console.log(err));

    axios.get("https://localhost:7058/api/Receptionist/Getallpatient")
      .then((res) => getpatient(res.data))
      .catch((err) => console.log(err));

    axios.get("https://localhost:7058/api/Admin/get-dept")
      .then((res) => getdept(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <ReceptionistNavbar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: '260px', width: 'calc(100% - 260px)' }}>
        <div className="container-fluid py-4">
          <div className="card shadow-sm border-0 p-4">
            <div className="row justify-content-center">
              <form onSubmit={handleSubmit} className="col-6">
                <h3 className="mb-3">Create Appointment</h3>

                {message && <div className="alert alert-success">{message}</div>}

                <label className="form-label">Patient</label>
                <select className="form-select" name="patientid" value={forms.patientid} onChange={handleChange}>
                  <option value="">- Select Patient -</option>
                  {patient.map((item) => (
                    <option key={item.id} value={item.id}>{item.patientid}</option>
                  ))}
                </select>

                <label className="form-label mt-3">Department</label>
                <select className="form-select" name="departmentId" value={forms.departmentId} onChange={handleChange}>
                  <option value="">- Select Department -</option>
                  {dept.map((item) => (
                    <option key={item.id} value={item.id}>{item.departmentName}</option>
                  ))}
                </select>

                <label className="form-label mt-3">Doctor</label>
                <select className="form-select" name="doctorId" value={forms.doctorId} onChange={handleChange}>
                  <option value="">- Select Doctor -</option>
                  {(forms.departmentId ? filtered : doc).map((item) => (
                    <option key={item.id} value={item.id}>{item.userName}</option>
                  ))}
                </select>

                <label className="form-label mt-3">Appointment Time</label>
                <input
                  type="time"
                  step="1"
                  className="form-control"
                  name="appointmentTime"
                  value={forms.appointmentTime}
                  onChange={handleChange}
                />

                <label className="form-label mt-3">Appointment Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="appointmentDate"
                  value={forms.appointmentDate}
                  onChange={handleChange}
                  min={today}
                />

                <label className="form-label mt-3">Reason</label>
                <input
                  type="text"
                  className="form-control"
                  name="reason"
                  value={forms.reason}
                  onChange={handleChange}
                />

                <label className="form-label mt-3">Status</label>
                <select className="form-select" name="status" value={forms.status} onChange={handleChange}>
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

                <button type="submit" className="btn btn-primary mt-4 w-100">Create Appointment</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Makeappointment;
