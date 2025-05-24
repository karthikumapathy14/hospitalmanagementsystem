import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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

  const { id } = useParams();
  const [dept, getdept] = useState([]);
  const [doc, getdoc] = useState([]);
  const [filtered, setfiltered] = useState([]);

  const handlechange = (e) => {
    const { name, value } = e.target;

    if (name === 'departmentId') {
      const filteredDoctors = doc.filter((d) => d.departmentId === value);
      setfiltered(filteredDoctors);

      setforms((prev) => ({
        ...prev,
        departmentId: value,
        doctorId: '' // Reset doctor if department changes
      }));
    } else {
      setforms((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  useEffect(() => {
    // Fetch all departments and doctors
    axios.get("https://localhost:7058/api/Admin/get-dept")
      .then((res) => getdept(res.data))
      .catch((err) => console.log(err));

    axios.get("https://localhost:7058/api/Admin/docGetAll")
      .then((res) => getdoc(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // Fetch appointment by ID
    axios.get(`https://localhost:7058/api/Receptionist/getappointmentid/${id}`)
      .then((res) => {
        setforms(res.data);

        // Filter doctors once doc list is ready
        const filteredDoctors = doc.filter((d) => d.departmentId === res.data.departmentId);
        setfiltered(filteredDoctors);
      })
      .catch((err) => console.log(err));
  }, [id, doc]);

  const handlesubmit = (e) => {
    e.preventDefault();

    console.log("Sending data:", forms);

    axios.put(`https://localhost:7058/api/Receptionist/Edit-appointment/${id}`, forms)
      .then((res) => {
        console.log(res.data);
        alert("Updated successfully");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='row justify-content-center'>
      <form onSubmit={handlesubmit} className='col-5'>
        <h2>Edit Appointment</h2>

        <label className='form-label'>Patient ID</label>
        <input
          className='form-control'
          name='patientId'
          value={forms.patientId}
          onChange={handlechange}
          disabled={true}
        />

        <label className='form-label'>Department</label>
        <select
          className='form-select'
          name='departmentId'
          value={forms.departmentId}
          onChange={handlechange}
        >
          <option value=''>-select-</option>
          {dept.map((d) => (
            <option key={d.id} value={d.id}>
              {d.departmentName}
            </option>
          ))}
        </select>

        <label className='form-label'>Doctor Name</label>
        <select
          className='form-select'
          name='doctorId'
          value={forms.doctorId}
          onChange={handlechange}
        >
          <option value=''>-select-</option>
          {(forms.departmentId ? filtered : doc).map((d) => (
            <option key={d.id} value={d.id}>
              {d.userName}
            </option>
          ))}
        </select>

        <label className='form-label'>Appointment Date</label>
        <input
          className='form-control'
          type='date'
          name='appointmentDate'
          value={forms.appointmentDate}
          onChange={handlechange}
        />

        <label className='form-label'>Appointment Time</label>
        <input
          className='form-control'
          type='time'
          step='1'
          name='appointmentTime'
          value={forms.appointmentTime}
          onChange={handlechange}
        />

        <label className='form-label'>Reason</label>
        <input
          className='form-control'
          name='reason'
          value={forms.reason}
          onChange={handlechange}
        />

        <label className='form-label'>Status</label>
        <select
          className='form-select'
          name='status'
          value={forms.status}
          onChange={handlechange}
        >
          <option value='' disabled>
            -select status-
          </option>
          <option value='Schedule'>Schedule</option>
          <option value='Complete'>Complete</option>
          <option value='Cancel'>Cancel</option>
        </select>

        <button type='submit' className='btn btn-outline-primary mt-3'>
          Save
        </button>
      </form>
    </div>
  );
};

export default Editappointment;
