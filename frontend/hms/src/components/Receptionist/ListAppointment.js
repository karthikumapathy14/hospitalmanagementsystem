import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReceptionistNavbar from './ReceptionistNavbar';
import { useAuth } from '../AuthContext';

const ListAppointment = () => {
  const navigate = useNavigate();
  const { setAppid } = useAuth();
  const [data, setData] = useState([]);
  const [bills, setBills] = useState([]);
  const [billsts,getbillsts]=useState([])
  const [loading, setLoading] = useState(false); // Optional loading state for debugging

  // ✅ Fetch bills as async
  const fetchBills = async () => {
    try {
      const res = await axios.get("https://localhost:7058/api/Receptionist/bill");
      setBills(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Fetch appointments and bills
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("https://localhost:7058/api/Receptionist/getappointment");
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAppointments();
    fetchBills();

    axios.get("https://localhost:7058/api/Receptionist/bill")
    .then((res)=>getbillsts(res.data))
    .catch((err)=>console.log(err))
  }, []);

  // ✅ Navigate to billing page
  const billnavi = async (appointmentId) => {
    try {
      const response = await axios.get(`https://localhost:7058/api/Receptionist/billbyid/${appointmentId}`);
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

  // ✅ Update bill status using appointmentId
  const handleBillStatusUpdate = async (appointmentId, newStatus) => {
    setLoading(true);
    try {
      await axios.put(`https://localhost:7058/api/Receptionist/update-bill-status/${appointmentId}`, {
        status: newStatus
      });
      alert("Bill status updated!");
      await fetchBills(); // Ensure latest data
    } catch (err) {
      console.error(err);
      alert("Failed to update bill status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <ReceptionistNavbar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: '260px', width: 'calc(100% - 260px)' }}>
        <div className="container-fluid py-4">
          <div className="card shadow-sm border-0">
            <div className="container mt-5">
              <h2 className="text-center mb-4">Appointments List</h2>
              <div className="table-responsive">
                <table className="table table-hover table-striped table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th>Patient ID</th>
                      <th>Department</th>
                      <th>Doctor</th>
                      <th>Appointment Date</th>
                      <th>Appointment Time</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Bill Status</th>
                      <th>Created At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((item) => {
                        const bill = bills.find(b => b.appointmentId === item.appointmentId);
                        const billStatus = bill?.status || "Pending";
                        const billId = bill?.id;

                        return (
                          <tr key={item.appointmentId}>
                            <td>{item.patientid}</td>
                            <td>{item.departmentName}</td>
                            <td>{item.doctorName}</td>
                            <td>{new Date(item.appointmentDate).toLocaleDateString()}</td>
                            <td>{item.appointmentTime}</td>
                            <td>{item.reason}</td>
                            <td>
                              <span className={`badge ${item.status === 'Confirmed' ? 'bg-success' : 'bg-secondary'}`}>
                                {item.status}
                              </span>
                            </td>
                            <td>
                              {bill ? (
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`billSwitch-${item.appointmentId}`}
                                    checked={billStatus === "Paid"}
                                    onChange={(e) => {
                                      const newStatus = e.target.checked ? "Paid" : "Pending";
                                      handleBillStatusUpdate(item.appointmentId, newStatus);
                                    }}
                                    disabled={loading} // Optionally disable during update
                                  />
                                  <label
                                    className={`form-check-label ${billStatus === "Paid" ? "text-success" : "text-warning"}`}
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
                              <Link to={`/editappointment/${item.appointmentId}`}>
                                <button className="btn btn-sm btn-outline-primary">
                                  <i className="bi bi-pencil-square"></i> Edit
                                </button>
                              </Link>
                              <button
                                className="btn btn-outline-secondary ms-2"
                                onClick={() => billnavi(item.appointmentId)}
                                disabled={billId !== undefined}
                                title={billId ? "Bill already generated" : "Generate bill"}
                              >
                                Bill Generate
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-center">No appointments found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {loading && <p className="text-center mt-3 text-muted">Updating bill status...</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListAppointment;
