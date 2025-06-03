import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReceptionistNavbar from "./ReceptionistNavbar";
import { toast } from "react-toastify";

const ListPatient = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setfiltered] = useState([]);
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/Listpatient/${id}`);
  };
  const token = localStorage.getItem("token");
  useEffect(() => {
          if (!token) {
      toast.error("Restricted Access");
      navigate("/");
      return;
    }
    axios
      .get("https://localhost:7058/api/Receptionist/Getallpatient", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res.data);
        setfiltered(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [navigate]);

  useEffect(() => {
    const filters = data.filter(
      (patient) =>
        patient.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patientid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phoneNo?.includes(searchTerm)
    );
    setfiltered(filters);
  }, [searchTerm, data]);

  return (
    <div
      className="d-flex"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <ReceptionistNavbar />
      <div
        className="flex-grow-1 p-4"
        style={{ marginLeft: "260px", width: "calc(100% - 260px)" }}
      >
        <div className="container-fluid py-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h2 className="mb-0 text-primary">
                <i className="bi bi-people-fill me-2"></i>
                Patient List
              </h2>
              <div className="input-group w-50">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by name, email, ID or PhoneNo"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading patient data...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Patient Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length > 0 ? (
                        filtered.map((item, id) => (
                          <tr key={id}>
                            <td>{item.patientid}</td>
                            <td>{item.userName}</td>
                            <td>{item.email}</td>
                            <td>{item.phoneNo || "N/A"}</td>
                            <td>
                              <div className="d-flex gap-2 justify-content-start">
                                <button
                                  onClick={() => handleEdit(item.id)}
                                  className="btn btn-sm btn-outline-primary"
                                  title="Edit Patient"
                                >
                                  <i className="bi bi-pencil-square"></i> Edit
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center py-4">
                            <div className="text-muted">
                              <i className="bi bi-people display-6"></i>
                              <p className="mt-2">No patient records found</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListPatient;
