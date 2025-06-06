import React, { useState } from "react";
import axios from "axios";

const WhatsAppSender = () => {
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    try {
      await axios.post("http://localhost:7058/api/WhatsApp/Send", {
  role,
  message,
});

      alert("Message sent via WhatsApp!");
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Send WhatsApp Message</h2>
      <div>
        <label>Select Role: </label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">-- Select Role --</option>
          <option value="Doctor">Doctor</option>
          <option value="Nurse">Nurse</option>
          <option value="Receptionist">Receptionist</option>
          <option value="Admin">Admin</option>
        </select>
      </div>
      <div>
        <label>Message: </label><br />
        <textarea
          rows="4"
          cols="50"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </div>
      <button onClick={handleSend} style={{ marginTop: "10px" }}>
        Send WhatsApp Message
      </button>
    </div>
  );
};

export default WhatsAppSender;
