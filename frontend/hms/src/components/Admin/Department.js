import React, { useEffect, useState } from "react";
import axios from "axios";
import Adminnavbar from "./Adminnavbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const Department = () => {
  const [formData, setFormData] = useState({
    departmentName: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Restricted Access");
      navigate("/");
    }
  }, [navigate, token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://localhost:7058/api/Admin/create-dept",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Department added successfully ✅");
      setFormData({ departmentName: "" }); 
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Something went wrong ❌");
      }
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
            maxWidth: "500px",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
          }}
        >
          <h3 className="text-center mb-5 text-primary fw-bold">
            Add Department
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold">Department Name</label>
              <input
                type="text"
                name="departmentName"
                className="form-control rounded-pill"
                placeholder="Enter department name"
                value={formData.departmentName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="d-flex justify-content-center mt-4">
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 rounded-pill"
                style={{ width: "200px" }}
              >
                Add Department
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Department;
