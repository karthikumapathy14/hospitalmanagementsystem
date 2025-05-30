import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReceptionistNavbar from './ReceptionistNavbar';
import { useAuth } from '../AuthContext';

const ListAppointment = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const { setAppid } = useAuth();
  const [bills, setBills] = useState([]);

  // ✅ Fetch bills as a reusable function
  const fetchBills = () => {
    axios.get("https://localhost:7058/api/Receptionist/bill")
      .then(res => setBills(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    axios.get("https://localhost:7058/api/Receptionist/getappointment")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));

    fetchBills();
  }, []);

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

  const isPaid = (appointmentId) => {
    return bills.some(bill => bill.appointmentId === appointmentId && bill.status === "Paid");
  };

  const getBillIdByAppointmentId = (appointmentId) => {
    const bill = bills.find(b => b.appointmentId === appointmentId);
    return bill?.id;
  };

  const handleBillStatusUpdate = (billId, newStatus) => {
    axios.put(`https://localhost:7058/api/Receptionist/update-bill-status/${billId}`, {
      status: newStatus
    })
      .then(() => {
        alert("Bill status updated!");
        fetchBills(); // ✅ Refresh bill list
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to update bill status");
      });
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
                        const billId = getBillIdByAppointmentId(item.appointmentId);
                        const billPaid = isPaid(item.appointmentId);

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
                              {billPaid ? (
                                <span className="badge bg-success">Paid</span>
                              ) : billId ? (
                                <button
                                  className="btn btn-sm btn-warning"
                                  onClick={() => handleBillStatusUpdate(billId, "Paid")}
                                >
                                  Mark as Paid
                                </button>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListAppointment;
