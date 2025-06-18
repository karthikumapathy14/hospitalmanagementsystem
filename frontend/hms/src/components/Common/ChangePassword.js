import React, { useEffect, useState } from "react";
import {
  FaLock,
  FaCheckCircle,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Restricted Access");
      navigate("/");
    }
  }, [navigate, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: "", color: "secondary" };
    if (password.length < 6) return { strength: 25, text: "Weak", color: "danger" };
    if (password.length < 8) return { strength: 50, text: "Fair", color: "warning" };
    if (password.length < 12) return { strength: 75, text: "Good", color: "info" };
    return { strength: 100, text: "Strong", color: "success" };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}\-_+=~`|:;"'<>,.?/\\]).{6,}$/;

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match");
      setIsLoading(false);
      return;
    }

    if (!passwordRegex.test(formData.newPassword)) {
      setError(
        "Password must be at least 6 characters and include an uppercase letter, lowercase letter, number, and special character"
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7058/api/Authentication/changepassword",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message);
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(", "));
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card border-0 shadow-sm rounded-3" style={{ width: "100%", maxWidth: "450px" }}>
        <div className="card-body p-4">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="bg-primary bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3">
              <FaLock className="text-primary" size={24} />
            </div>
            <h4 className="mb-1">Change Password</h4>
            <p className="text-muted mb-0">Secure your account with a new password</p>
          </div>

          {/* Back Button */}
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm mb-3"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="me-1" />
            Back
          </button>

          {/* Messages */}
          {message && (
            <div className="alert alert-success d-flex align-items-center mb-3">
              <FaCheckCircle className="me-2" />
              <div>{message}</div>
            </div>
          )}

          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-3">
              <FaExclamationCircle className="me-2" />
              <div>{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Current Password */}
            <div className="mb-3">
              <label className="form-label">Current Password</label>
              <div className="input-group">
                <input
                  type={showPassword.current ? "text" : "password"}
                  name="currentPassword"
                  className="form-control"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <div className="input-group mb-2">
                <input
                  type={showPassword.new ? "text" : "password"}
                  name="newPassword"
                  className="form-control"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formData.newPassword && (
                <>
                  <div className="progress mb-1" style={{ height: "5px" }}>
                    <div
                      className={`progress-bar bg-${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                  <small className={`text-${passwordStrength.color}`}>
                    Password Strength: {passwordStrength.text}
                  </small>
                  <br />
                  <small className="text-muted">
                    Must be 6+ characters, include uppercase, lowercase, number & special character.
                  </small>
                </>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="form-label">Confirm Password</label>
              <div className="input-group">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  className={`form-control ${
                    formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                      ? "is-invalid"
                      : ""
                  }`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formData.confirmPassword &&
                formData.newPassword !== formData.confirmPassword && (
                  <div className="invalid-feedback d-block">
                    Passwords do not match
                  </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
