import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReceptionistNavbar from "./ReceptionistNavbar";
import { toast } from "react-toastify";

const EditPatient = () => {
  const [data, setData] = useState({
    userName: "",
    email: "",
    role: "",
    age: "",
    bloodgrp: "",
    gender: "",
    Prescription: "",
    phoneNo: "",
    address: "",
    doctorId: "",
    nurseId: "",
    status: false,
  });

  const [message, setMessage] = useState();
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      toast.error("Restricted Access");
      navigate("/");
      return;
    }
    axios
      .get(`https://localhost:7058/api/Receptionist/getbyid-patient/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: name === "status" ? value === "true" : value,
    }));
  };

  const onsubmit = (e) => {
    e.preventDefault();
    axios
      .put(`https://localhost:7058/api/Receptionist/Editpatient/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res.data);
        setMessage("Patient details updated successfully");
        setTimeout(() => setMessage(navigate(-1)), 3000);
      })
      .catch((err) => {
        setMessage(err.response?.data[0]?.description || "Update failed");
        console.log(err);
      });
  };

  return (
    <div>
      <div
        className="flex-grow-1 d-flex justify-content-center align-items-center p-5"
        
      >
        <div
          className="p-4 shadow-lg rounded-lg"
          style={{
            width: "100%",
            maxWidth: "700px",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
          }}
        >
          <h3 className="text-center mb-5 text-primary">
            <i className="bi bi-person-lines-fill me-2"></i>
            Edit Patient Profile
          </h3>

          {message && (
            <div
              className={`alert ${
                message.includes("success") ? "alert-success" : "alert-danger"
              } mb-4`}
            >
              {message}
            </div>
          )}

          <form onSubmit={onsubmit}>
            <div className="row">
              <div className="col-md-6 mb-4">
                <label className="form-label fw-bold">Username</label>
                <input
                  type="text"
                  name="userName"
                  value={data.userName}
                  onChange={handleChange}
                  className="form-control rounded-pill"
                  required
                />
              </div>

              <div className="col-md-6 mb-4">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  className="form-control rounded-pill"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-4">
                <label className="form-label fw-bold">Age</label>
                <input
                  type="number"
                  name="age"
                  value={data.age}
                  onChange={handleChange}
                  className="form-control rounded-pill"
                  required
                />
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label fw-bold">Role</label>
                <input
                  type="text"
                  name="role"
                  value={data.role}
                  onChange={handleChange}
                  className="form-control rounded-pill"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-4">
                <label className="form-label fw-bold">Phone Number</label>
                <input
                  type="text"
                  name="phoneNo"
                  value={data.phoneNo}
                  onChange={handleChange}
                  className="form-control rounded-pill"
                  required
                />
              </div>

              <div className="col-md-6 mb-4">
                <label className="form-label fw-bold">Blood Group</label>
                <select
                  name="bloodgrp"
                  value={data.bloodgrp}
                  onChange={handleChange}
                  className="form-select rounded-pill"
                  required
                >
                  <option value="" disabled>
                    - Select Blood Group -
                  </option>
                  <option value="A positive">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-bold">Gender</label>
              <div className="d-flex gap-3 mt-1">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={data.gender === "Male"}
                    onChange={handleChange}
                    id="genderMale"
                  />
                  <label className="form-check-label" htmlFor="genderMale">
                    Male
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={data.gender === "Female"}
                    onChange={handleChange}
                    id="genderFemale"
                  />
                  <label className="form-check-label" htmlFor="genderFemale">
                    Female
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Address</label>
              <input
                type="text"
                name="address"
                value={data.address}
                onChange={handleChange}
                className="form-control rounded-pill"
                required
              />
            </div>

            {/* s */}

            <div className="mb-4">
              <label className="form-label fw-bold">Status</label>
              <div className="btn-group w-100" role="group">
                <input
                  type="radio"
                  className="btn-check"
                  name="status"
                  id="active"
                  value="true"
                  checked={data.status === true}
                  onChange={handleChange}
                />
                <label className="btn btn-outline-success" htmlFor="active">
                  Active
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="status"
                  id="inactive"
                  value="false"
                  checked={data.status === false}
                  onChange={handleChange}
                />
                <label className="btn btn-outline-secondary" htmlFor="inactive">
                  Inactive
                </label>
              </div>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 rounded-pill"
              >
                <i className="bi bi-check-circle me-2"></i>
                Update Patient
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary px-4 py-2 rounded-pill"
                onClick={() => navigate(-1)}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPatient;
