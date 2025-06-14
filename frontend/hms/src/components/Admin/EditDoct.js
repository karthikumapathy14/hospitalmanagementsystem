import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Adminnavbar from "./Adminnavbar";
import { toast } from "react-toastify";

const EditDoct = () => {
  const [doctor, setDoctor] = useState({
    userName: "",
    email: "",
    role: "",
    phoneNo: "",
    qualification: "",
    address: "",
    departmentId: "",
    status: false,
  });
  const [dept, setDepartments] = useState([]); // Corrected to an array
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get("https://localhost:7058/api/Admin/get-dept", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDepartments(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
      if (!token) {
      toast.error("Restricted Access");
      navigate("/");
      return;
    }
    axios
      .get(`https://localhost:7058/api/Admin/docGetbyid/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDoctor(res.data))
      .catch((err) => console.log(err));
  }, [id,navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({
      ...prev,
      [name]:
        name === "status"
          ? value === "true"
          : //   : name === "departmentId"
            //   ? parseInt(value)  // Ensure departmentId is an integer
            value,
    }));
  };

  const onsubmit = (e) => {
    e.preventDefault();
    axios
      .put(`https://localhost:7058/api/Admin/docedit/${id}`, doctor, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Doctor Details Updated Successfully");
        navigate("/admin/listdoc");
      })
      .catch((err) => console.log(err));
  };

  const deletes = () => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      axios
        .delete(`https://localhost:7058/api/Admin/docdelete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => navigate("/admin/listdoc"))
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="d-flex">
    
      <div
        className="flex-grow-1 d-flex justify-content-center align-items-center bg-light"
        style={{ minHeight: "100vh" }}
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
          <h3 className="text-center mb-5 text-dark">Edit Doctor Profile</h3>
          <form onSubmit={onsubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold">Username</label>
              <input
                type="text"
                name="userName"
                value={doctor.userName}
                onChange={handleChange}
                className="form-control rounded-pill"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                name="email"
                value={doctor.email}
                onChange={handleChange}
                className="form-control rounded-pill"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Role</label>
              <input
                type="text"
                name="role"
                value={doctor.role}
                onChange={handleChange}
                className="form-control rounded-pill"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Phone Number</label>
              <input
                type="text"
                name="phoneNo"
                value={doctor.phoneNo}
                onChange={handleChange}
                className="form-control rounded-pill"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Qualification</label>
              <input
                type="text"
                name="qualification"
                value={doctor.qualification}
                onChange={handleChange}
                className="form-control rounded-pill"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Address</label>
              <input
                type="text"
                name="address"
                value={doctor.address}
                onChange={handleChange}
                className="form-control rounded-pill"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Department</label>
              <select
                name="departmentId"
                value={doctor.departmentId || ""}
                onChange={handleChange}
                className="form-select rounded-pill"
                required
              >
                <option value="" disabled>
                  - Select Department -
                </option>
                {dept.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Status</label>
              <div className="btn-group w-100" role="group">
                <input
                  type="radio"
                  className="btn-check"
                  name="status"
                  id="active"
                  value="true"
                  checked={doctor.status === true}
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
                  checked={doctor.status === false}
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
                className="btn btn-primary px-4 py-2 rounded-pill w-48"
              >
                Update
              </button>
              <button
                type="button"
                onClick={deletes}
                className="btn btn-danger px-4 py-2 rounded-pill w-48"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDoct;
