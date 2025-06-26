import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ReceptionistNavbar from "./ReceptionistNavbar";
import { useAuth } from "../Common/AuthContext";
import { toast } from "react-toastify";
import { FaSearch, FaEdit, FaMoneyBillWave, FaFileInvoiceDollar, FaSpinner } from "react-icons/fa";
import { BsFilterSquare, BsCheckCircleFill, BsClockFill, BsExclamationTriangleFill } from "react-icons/bs";

const ListAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAppid } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFetching, setIsFetching] = useState(false);

  const fetchBills = async () => {
    try {
      const res = await axios.get("https://localhost:7058/api/Receptionist/bill");
      setBills(res.data);
    } catch (err) {
      console.error("Failed to fetch bills:", err);
      toast.error("Failed to load bills data");
    }
  };

  const fetchAppointments = async () => {
    setIsFetching(true);
    try {
      const res = await axios.get("https://localhost:7058/api/Receptionist/getappointment");
      setAppointments(res.data);
      console.log(res.data)
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      toast.error("Failed to load appointments data");
    } finally {
      setIsFetching(false);
    }
  };

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      toast.error("Restricted Access");
      navigate("/");
      return;
    }
    fetchAppointments();
    fetchBills();
  }, [location]);

  const filteredAppointments = appointments.filter((item) => {
    const matchesSearch =
      item.patientid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.doctorName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleBillNavigation = async (appointmentId) => {
    try {
      const response = await axios.get(
        `https://localhost:7058/api/Receptionist/billbyid/${appointmentId}`
      );
      if (response.data.exists) {
        toast.info("Bill already generated for this appointment.");
      } else {
        setAppid(appointmentId);
        navigate("/receptionist/BillPrescription");
      }
    } catch (error) {
      console.error("Error checking bill existence:", error);
      toast.error("Error checking bill. Please try again.");
    }
  };

  const handleBillStatusUpdate = async (appointmentId, newStatus) => {
    const confirmChange = window.confirm(
      `Are you sure you want to mark this bill as ${newStatus}?`
    );
    if (!confirmChange) return;

    setLoading(true);
    try {
      await axios.put(
        `https://localhost:7058/api/Receptionist/update-bill-status/${appointmentId}`,
        { billstatus: newStatus }
      );

      setBills((prevBills) =>
        prevBills.map((bill) =>
          bill.appointmentId === appointmentId
            ? { ...bill, billstatus: newStatus }
            : bill
        )
      );

      toast.success("Bill status updated successfully!");
    } catch (err) {
      console.error("Failed to update bill status:", err);
      toast.error("Failed to update bill status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Complete":
        return <span className="badge bg-success"><BsCheckCircleFill className="me-1" /> Complete</span>;
      case "Schedule":
        return <span className="badge bg-primary"><BsClockFill className="me-1" /> Scheduled</span>;
      case "Pending":
        return <span className="badge bg-warning text-dark"><BsExclamationTriangleFill className="me-1" /> Pending</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
  
      <div className="flex-grow-1 p-4" >
        <div className="container-fluid py-3">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-primary text-white py-3">
              <h2 className="h5 mb-0">
                <i className="fas fa-calendar-check me-2"></i>Appointments List
              </h2>
            </div>
            <div className="card-body p-4">
              {/* Search and Filter Section */}
              <div className="row mb-4 g-3">
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <FaSearch className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search by Patient ID, Department, or Doctor"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center h-100">
                    <span className="me-2 text-muted"><BsFilterSquare /></span>
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Complete">Completed</option>
                      <option value="Schedule">Scheduled</option>
                      <option value="Cancel">Cancel</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Appointments Table */}
              {isFetching ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading appointments...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
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
                        <th>Actions</th>
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
                              <td className="fw-semibold">{item.patientid}</td>
                              <td>{item.departmentName}</td>
                              <td>{item.doctorName}</td>
                              <td>
                                {new Date(item.appointmentDate).toLocaleDateString()}
                              </td>
                              <td>{item.startTime}</td>
                              <td className="text-truncate" style={{ maxWidth: "150px" }} title={item.reason}>
                                {item.reason}
                              </td>
                              <td>{getStatusBadge(item.status)}</td>
                              <td>
                                {bill ? (
                                  <div className="d-flex align-items-center gap-2">
                                    <div className="form-check form-switch mb-0">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`billSwitch-${item.appointmentId}`}
                                        checked={billStatus.toLowerCase() === "paid"}
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
                                    </div>
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
                                  <span className="badge bg-warning text-dark">Pending</span>
                                )}
                              </td>
                              <td>{new Date(item.createdAt).toLocaleString()}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Link
                                    to={`/receptionist/editappointment/${item.appointmentId}`}
                                    className="btn btn-sm btn-outline-primary"
                                    title="Edit Appointment"
                                  >
                                    <FaEdit /> Edit
                                  </Link>
                                  <button
                                    className={`btn btn-sm ${
                                      billId 
                                        ? "btn-outline-secondary disabled" 
                                        : "btn-outline-success"
                                    }`}
                                    onClick={() => handleBillNavigation(item.appointmentId)}
                                    disabled={!!billId}
                                    title={billId ? "Bill already generated" : "Generate bill"}
                                  >
                                    <FaMoneyBillWave /> Bill Generate
                                  </button>
                                  <Link
                                    to={`/receptionist/billpatientview/${item.appointmentId}`}
                                    className="btn btn-sm btn-outline-info"
                                    title="View Bill"
                                  >
                                    <FaFileInvoiceDollar /> Invoice
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="10" className="text-center py-4 text-muted">
                            <div className="d-flex flex-column align-items-center">
                              <i className="fas fa-calendar-times fs-1 text-muted mb-2"></i>
                              <p className="mb-0">No appointments found matching your criteria</p>
                              {searchTerm && (
                                <button 
                                  className="btn btn-link btn-sm mt-2"
                                  onClick={() => setSearchTerm("")}
                                >
                                  Clear search
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

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
  );
};

export default ListAppointment;