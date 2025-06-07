import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReceptionistBooking = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const doctorId = 1; // Dynamic in real-world

  const fetchSlots = async () => {
    const res = await axios.get(`https://localhost:7058/api/receptionist/get-slots/${doctorId}/${selectedDate}`);
    setSlots(res.data);
  };

  const bookSlot = async (slotId) => {
    await axios.post(`https://localhost:7058/api/receptionist/book-slot`, slotId, {
      headers: { 'Content-Type': 'application/json' }
    });
    alert("Booked!");
    fetchSlots();
  };

  return (
    <div>
      <input type="date" onChange={(e) => setSelectedDate(e.target.value)} />
      <button onClick={fetchSlots}>Show Slots</button>

      <div className="slots">
        {slots.map(slot => (
          <button key={slot.id} disabled={slot.isBooked} onClick={() => bookSlot(slot.id)}>
            {slot.slotTime} {slot.isBooked ? "(Booked)" : ""}
          </button>
        ))}
      </div>
    </div>
  );
};
export default ReceptionistBooking;
