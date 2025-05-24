import React, { useState } from 'react';
import axios from 'axios';
import Adminnavbar from './Adminnavbar';

const Department = () => {
  const [formData, setFormData] = useState({
    departmentName: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7058/api/Admin/create-dept', formData);
      setMessage(response.data);
      setFormData({ departmentName: '' }); // Clear form after successful submission
    } catch (error) {
      console.error(error);
      if (error.response) {
        setMessage(error.response.data || "Something went wrong");
      } else {
        setMessage("Something went wrong.");
      }
    }
  };

  return (
    <div className='d-flex'>
      <Adminnavbar />
      <div className='flex-grow-1 d-flex justify-content-center align-items-center bg-light' style={{ minHeight: '100vh' }}>
        <div className="p-4 shadow-lg rounded-lg" style={{ width: '100%', maxWidth: '500px', backgroundColor: '#ffffff' ,borderRadius:"20px"}}>
          <h3 className="text-center mb-5 text-dark">Add Department</h3>
          {message && (
            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} mb-4`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold">Department Name</label>
              <input
                type="text"
                name="departmentName"
                className="form-control rounded-pill"
                placeholder="Enter department name"
                value={formData.departmentName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="d-flex justify-content-center mt-4">
              <button type="submit" className="btn btn-primary px-4 py-2 rounded-pill" style={{ width: '200px' }}>
                Add Department
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Department;