import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReceptionistBookingForm = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientContact, setPatientContact] = useState("");
  const [message, setMessage] = useState("");

  // Load doctors for dropdown on mount
  useEffect(() => {
    axios.get("https://localhost:7058/api/doctor")
      .then((res) => setDoctors(res.data))
      .catch(() => setMessage("Failed to load doctors"));
  }, []);

  // Fetch available slots when doctor or date changes
  useEffect(() => {
    if (!selectedDoctorId || !selectedDate) {
      setAvailableSlots([]);
      return;
    }

    // Format date to yyyy-MM-dd for backend query param
    const formattedDate = selectedDate.toISOString().split("T")[0];

    axios.get(
      `https://localhost:7058/api/availability/slots?doctorId=${selectedDoctorId}&date=${formattedDate}`
    )
      .then((res) => {
        setAvailableSlots(res.data); // assuming backend returns list of times as strings, e.g. ["09:00", "09:15", ...]
        setSelectedTime(""); // reset time when date or doctor changes
      })
      .catch(() => setMessage("Failed to load available slots"));
  }, [selectedDoctorId, selectedDate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId || !selectedDate || !selectedTime || !patientName || !patientContact) {
      setMessage("Please fill all fields and select a slot.");
      return;
    }

    const payload = {
      doctorId: parseInt(selectedDoctorId),
      appointmentDate: selectedDate.toISOString().split("T")[0],
      appointmentTime: selectedTime,
      reason: "Receptionist Booking",
      patient: {
        name: patientName,
        contact: patientContact
      }
    };

    try {
      await axios.post("https://localhost:7058/api/Receptionist/book", payload);
      setMessage("Appointment booked successfully!");
      // reset form
      setSelectedDoctorId("");
      setSelectedTime("");
      setPatientName("");
      setPatientContact("");
      setAvailableSlots([]);
      setSelectedDate(new Date());
    } catch (error) {
      setMessage("Failed to book appointment.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h3>Receptionist Appointment Booking</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleBooking}>
        <div>
          <label>Doctor:</label>
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map((doc) => (
              <option key={doc.doctorId} value={doc.doctorId}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Date:</label><br />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Available Time Slots:</label><br />
          {availableSlots.length > 0 ? (
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
            >
              <option value="">Select Time</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          ) : (
            <p>No available slots for selected date</p>
          )}
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Patient Name:</label><br />
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Patient Contact:</label><br />
          <input
            type="text"
            value={patientContact}
            onChange={(e) => setPatientContact(e.target.value)}
            required
          />
        </div>

        <button type="submit" style={{ marginTop: 20 }}>Book Appointment</button>
      </form>
    </div>
  );
};

export default ReceptionistBookingForm;
