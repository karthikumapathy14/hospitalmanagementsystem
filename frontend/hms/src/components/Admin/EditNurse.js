import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Adminnavbar from './Adminnavbar';

const EditNurse = () => {
  const [nurse, setNurse] = useState({ userName: '', email: '', role: '', phoneNo: '', address: '', doctorId: '', status: false });
  const [doc, setDoctors] = useState([]);
 
  const { id } = useParams();
  const navigate = useNavigate();

  // useEffect(() => {
  //   axios.get('https://localhost:7058/api/Admin/docGetAll')
  //     .then(res => setDoctors(res.data))
  //     .catch(err => console.log(err));
  // }, []);

  useEffect(() => {
    axios.get(`https://localhost:7058/api/Admin/getbyid-nurse/${id}`)
      .then(res => setNurse(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNurse(prev => ({
      ...prev,
      [name]: name === "status" ? value === "true" : value
    }));
  };

  const onsubmit = (e) => {
    e.preventDefault();
    axios.put(`https://localhost:7058/api/Admin/edit-Nurse/${id}`, nurse)
      .then(() => {
        alert("Nurse Details Updated Successfully");
        navigate('/listNurse');
      })
      .catch(err => console.log(err));
  };

  const deletes = () => {
    if (window.confirm("Are you sure you want to delete this nurse?")) {
      axios.delete(`https://localhost:7058/api/Admin/delete-nurse/${id}`)
        .then(() => navigate('/listNurse'))
        .catch(err => console.log(err));
    }
  };

  return (
    <div className='d-flex'>
      <Adminnavbar />
      <div className='flex-grow-1 d-flex justify-content-center align-items-center bg-light' style={{ minHeight: '100vh' }}>
        <div className="p-4 shadow-lg rounded-lg" style={{ width: '100%', maxWidth: '700px', backgroundColor: '#ffffff',borderRadius:"20px" }}>
          <h3 className="text-center mb-5 text-dark">Edit Nurse Profile</h3>
          <form onSubmit={onsubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold">Username</label>
              <input type="text" name="userName" value={nurse.userName} onChange={handleChange} className="form-control rounded-pill" required />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Email</label>
              <input type="email" name="email" value={nurse.email} onChange={handleChange} className="form-control rounded-pill" required />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Role</label>
              <input type="text" name="role" value={nurse.role} onChange={handleChange} className="form-control rounded-pill" required />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Phone Number</label>
              <input type="text" name="phoneNo" value={nurse.phoneNo} onChange={handleChange} className="form-control rounded-pill" required />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Address</label>
              <input type="text" name="address" value={nurse.address} onChange={handleChange} className="form-control rounded-pill" required />
            </div>

            {/* <div className="mb-4">
              <label className="form-label fw-bold">Doctor</label>
              <select name="doctorId" value={nurse.doctorId} onChange={handleChange} className="form-select rounded-pill" required>
                <option value="" disabled>- Select Doctor -</option>
                {doc.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>{doctor.userName}</option>
                ))}
              </select>
            </div> */}

            <div className="mb-4">
              <label className="form-label fw-bold">Status</label>
              <div className="btn-group w-100" role="group">
                <input type="radio" className="btn-check" name="status" id="active" value="true" checked={nurse.status === true} onChange={handleChange} />
                <label className="btn btn-outline-success" htmlFor="active">Active</label>

                <input type="radio" className="btn-check" name="status" id="inactive" value="false" checked={nurse.status === false} onChange={handleChange} />
                <label className="btn btn-outline-secondary" htmlFor="inactive">Inactive</label>
              </div>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button type="submit" className="btn btn-primary px-4 py-2 rounded-pill w-48">Update</button>
              <button type="button" onClick={deletes} className="btn btn-danger px-4 py-2 rounded-pill w-48">Delete</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditNurse;