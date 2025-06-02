import React, { useState } from "react";
import { FaLock, FaKey, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://localhost:7058/api/Authentication/changepassword",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message);
      setTimeout(() => navigate(-1), 1500); // redirect after success
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(", "));
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h2 style={styles.title}>Change Password</h2>

        {message && (
          <div style={{ ...styles.alert, ...styles.success }}>
            <FaCheckCircle style={{ marginRight: 8 }} />
            {message}
          </div>
        )}
        {error && (
          <div style={{ ...styles.alert, ...styles.error }}>
            <FaExclamationCircle style={{ marginRight: 8 }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            <FaLock style={styles.icon} /> Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            style={styles.input}
            placeholder="Enter current password"
            required
          />

          <label style={styles.label}>
            <FaKey style={styles.icon} /> New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            style={styles.input}
            placeholder="Enter new password"
            required
          />

          <label style={styles.label}>
            <FaKey style={styles.icon} /> Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            placeholder="Confirm new password"
            required
          />

          <button type="submit" style={styles.button}>
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

// Styles object
const styles = {
  pageContainer: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #d1e8ff 0%, #f9fbfd 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    width: 360,
  },
  title: {
    textAlign: "center",
    color: "#0d47a1", // hospital blue
    marginBottom: 25,
    fontWeight: "700",
    fontSize: 24,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: 6,
    color: "#0d47a1",
    fontWeight: "600",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
    color: "#1976d2",
  },
  input: {
    padding: 10,
    fontSize: 14,
    marginBottom: 20,
    borderRadius: 6,
    border: "1.5px solid #90caf9",
    outline: "none",
    transition: "border-color 0.3s",
  },
  button: {
    backgroundColor: "#1976d2",
    color: "white",
    padding: 12,
    borderRadius: 6,
    fontWeight: "600",
    fontSize: 16,
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  alert: {
    display: "flex",
    alignItems: "center",
    padding: 12,
    marginBottom: 20,
    borderRadius: 6,
    fontSize: 14,
  },
  success: {
    backgroundColor: "#dcedc8",
    color: "#33691e",
  },
  error: {
    backgroundColor: "#ffcdd2",
    color: "#b71c1c",
  },
};

export default ChangePassword;
