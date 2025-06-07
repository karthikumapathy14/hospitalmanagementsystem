import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorAvailabilityForm = () => {
  const [availability, setAvailability] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAvailability((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://localhost:7058/api/Doctor/add-availability", availability, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Availability added successfully!");
      setAvailability({ date: "", startTime: "", endTime: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add availability");
    }
  };

  return (
    <div className="container mt-4">
      <h4>🗓️ Set Availability</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Date</label>
          <input type="date" name="date" value={availability.date} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Start Time</label>
          <input type="time" name="startTime" value={availability.startTime} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>End Time</label>
          <input type="time" name="endTime" value={availability.endTime} onChange={handleChange} className="form-control" required />
        </div>
        <button className="btn btn-primary">Add Availability</button>
      </form>
    </div>
  );
};

export default DoctorAvailabilityForm;
