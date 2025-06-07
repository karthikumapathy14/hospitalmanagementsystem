import React, { useEffect, useState } from "react";
import axios from "axios";

const ReceptionistViewAvailability = ({ selectedDoctorId }) => {
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    if (selectedDoctorId) {
      axios
        .get(`https://localhost:7058/api/doctor/availability/${selectedDoctorId}`)
        .then((res) => setAvailability(res.data))
        .catch((err) => console.error("Error fetching availability", err));
    }
  }, [selectedDoctorId]);

  return (
    <div className="container mt-4">
      <h4>📅 Doctor Availability</h4>
      {availability.length === 0 ? (
        <p>No available slots.</p>
      ) : (
        <div className="list-group">
          {availability.map((slot, index) => (
            <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{slot.date}</strong> - {slot.startTime} to {slot.endTime}
              </div>
              <button className="btn btn-success btn-sm">Assign Patient</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceptionistViewAvailability;
