import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Adminnavbar from "./Adminnavbar";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    UserName: "",
    Email: "",
    PasswordHash: "",
    Role: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Restricted Access");
      navigate("/");
      return;
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://localhost:7058/api/Authentication/Register",
        formData
      );
      setMessage("✅ " + response.data);
    } catch (error) {
      if (error.response) {
        setMessage(
          "❌ " +
            (error.response.data[0]?.description || "Registration failed.")
        );
      } else {
        setMessage("❌ Something went wrong.");
      }
    }
  };

  return (
    <div className="d-flex">
      <div className="flex-grow-1 bg-light">
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <div
            className="card shadow rounded-4 p-4"
            style={{ maxWidth: "500px", width: "100%" }}
          >
            <h3 className="text-center text-primary mb-4">
              🏥 User Registration
            </h3>

            {message && <div className="alert alert-info">{message}</div>}

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="mb-3">
                <label className="form-label">Username</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    name="UserName"
                    className="form-control border-start-0"
                    placeholder="Enter username"
                    value={formData.UserName}
                    onChange={handleChange}
                    // required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    name="Email"
                    className="form-control border-start-0"
                    placeholder="Enter email"
                    value={formData.Email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FaLock />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="PasswordHash"
                    className="form-control border-start-0 border-end-0"
                    placeholder="Enter password"
                    value={formData.PasswordHash}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="input-group-text bg-white"
                    style={{ cursor: "pointer" }}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {/* Role */}
              <div className="mb-4">
                <label className="form-label">Role</label>
                <select
                  name="Role"
                  className="form-select"
                  value={formData.Role}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Role --</option>
                  <option value="Admin">Admin</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Receptionist">Receptionist</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 fw-semibold"
              >
                ➕ Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
