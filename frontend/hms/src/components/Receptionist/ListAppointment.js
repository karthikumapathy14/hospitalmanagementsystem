import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ReceptionistNavbar from "./ReceptionistNavbar";
import { useAuth } from "../AuthContext";
import BillPatientView from "../Patient.js/Billpatientview";
import { toast } from "react-toastify";

const ListAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAppid } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  
  // Fetch all bills
  const fetchBills = async () => {
    try {
      const res = await axios.get(
        "https://localhost:7058/api/Receptionist/bill",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBills(res.data);
    } catch (err) {
      console.error("Failed to fetch bills:", err);
    }
  };

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        "https://localhost:7058/api/Receptionist/getappointment",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Restricted Access");
      navigate("/");
      return;
    }
    fetchAppointments();
    fetchBills();
  }, [location, navigate]);

  // Search filter
  const filteredAppointments = appointments.filter(
    (item) =>
      item.patientid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Navigate to bill page
  const handleBillNavigation = async (appointmentId) => {
    if (!token) {
      toast.error("Restricted Access");
      navigate("/");
      return;
    }
    try {
      const response = await axios.get(
        `https://localhost:7058/api/Receptionist/billbyid/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.exists) {
        alert("Bill already generated for this appointment.");
      } else {
        setAppid(appointmentId);
        navigate("/billgenerate");
      }
    } catch (error) {
      console.error("Error checking bill existence:", error);
      alert("Error checking bill. Please try again.");
    }
  };

  // Update bill status
  const handleBillStatusUpdate = async (appointmentId, newStatus) => {
    const confirmChange = window.confirm(
      `Are you sure you want to mark this bill as ${newStatus}?`
    );
    if (!confirmChange) return;

    setLoading(true);
    try {
      await axios.put(
        `https://localhost:7058/api/Receptionist/update-bill-status/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
        { billstatus: newStatus }
      );

      setBills((prevBills) =>
        prevBills.map((bill) =>
          bill.appointmentId === appointmentId
            ? { ...bill, billstatus: newStatus }
            : bill
        )
      );

      alert("Bill status updated!");
    } catch (err) {
      console.error("Failed to update bill status:", err);
      alert("Failed to update bill status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <ReceptionistNavbar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: "230px" }}>
        <div className="container-fluid py-3">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="container mt-4">
              <h2 className="text-center mb-4">Appointments List</h2>

              <div className="input-group w-100 mb-4">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by Patient ID, Department, Doctor "
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="table-responsive">
                <table className="table table-hover table-striped table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th>Patient ID</th>
                      <th>Department</th>
                      <th>Doctor</th>
                      <th>Appointment Date</th>
                      <th>Time</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Bill Status</th>
                      <th>Created At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.length > 0 ? (
                      filteredAppointments.map((item) => {
                        const bill = bills.find(
                          (b) => b.appointmentId === item.appointmentId
                        );
                        const billStatus = bill?.billstatus || "Pending";
                        const billId = bill?.id;

                        return (
                          <tr key={item.appointmentId}>
                            <td>{item.patientid}</td>
                            <td>{item.departmentName}</td>
                            <td>{item.doctorName}</td>
                            <td>
                              {new Date(
                                item.appointmentDate
                              ).toLocaleDateString()}
                            </td>
                            <td>{item.appointmentTime}</td>
                            <td>{item.reason}</td>
                            <td>
                              <span
                                className={`badge ${
                                  item.status === "Confirmed"
                                    ? "bg-success"
                                    : "bg-secondary"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td>
                              {bill ? (
                                <div className="form-check form-switch d-flex align-items-center gap-2">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`billSwitch-${item.appointmentId}`}
                                    checked={
                                      billStatus.toLowerCase() === "paid"
                                    }
                                    onChange={(e) => {
                                      const newStatus = e.target.checked
                                        ? "Paid"
                                        : "Pending";
                                      handleBillStatusUpdate(
                                        item.appointmentId,
                                        newStatus
                                      );
                                    }}
                                    disabled={loading}
                                  />
                                  <label
                                    className={`form-check-label fw-semibold ${
                                      billStatus.toLowerCase() === "paid"
                                        ? "text-success"
                                        : "text-warning"
                                    }`}
                                    htmlFor={`billSwitch-${item.appointmentId}`}
                                  >
                                    {billStatus}
                                  </label>
                                </div>
                              ) : (
                                <span className="badge bg-warning text-dark">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td>{new Date(item.createdAt).toLocaleString()}</td>
                            <td>
                              <Link
                                to={`/editappointment/${item.appointmentId}`}
                              >
                                <button className="btn btn-sm btn-outline-primary">
                                  <i className="bi bi-pencil-square me-1"></i>{" "}
                                  Edit
                                </button>
                              </Link>
                              <button
                                className="btn btn-sm btn-outline-secondary ms-2"
                                onClick={() =>
                                  handleBillNavigation(item.appointmentId)
                                }
                                disabled={!!billId}
                                title={
                                  billId
                                    ? "Bill already generated"
                                    : "Generate bill"
                                }
                              >
                                <i className="bi bi-cash-stack me-1"></i> Bill
                              </button>

                              <Link
                                to={`/billpatientview/${item.appointmentId}`}
                              >
                                <button className="btn btn-outline-primary">
                                  Bill View
                                </button>
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-center text-muted">
                          No appointments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {loading && (
                  <div className="text-center my-3">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Updating bill status...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListAppointment;
