import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nursesidebar from './Nursesidebar';
import { toast } from 'react-toastify';
import { Button, Offcanvas } from 'react-bootstrap';

const Viewappointmentnurse = () => {
  const [data, setData] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!token) {
      toast.error("Restricted Access");
      navigate("/");
      return;
    }

    axios
      .get('https://localhost:7058/api/Nurse/appointmentnurse', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, [navigate, token]);

  const handleEdit = (appointmentId) => {
    navigate(`/Editappointmentnurse/${appointmentId}`);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = data.filter(item => {
    const appointmentDate = new Date(item.appointmentDate);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate >= today;
  });

  const pastAppointments = data.filter(item => {
    const appointmentDate = new Date(item.appointmentDate);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate < today;
  });

  const renderTable = (appointments, title, isPast = false) => (
    <div className="container-fluid px-0 px-md-3">
      <div className="card shadow-sm border-0 mb-4">
        <div className={`card-header ${isPast ? 'bg-secondary' : 'bg-info'} text-white py-2 py-md-3`}>
          <h4 className="mb-0 text-center">
            <i className="bi bi-calendar-check me-2"></i> {title}
          </h4>
        </div>
        <div className="card-body p-0 p-md-3">
          {appointments.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No {title.toLowerCase()} found.</p>
            </div>
          ) : (
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <table className="table table-hover mb-0" style={{ minWidth: '700px' }}>
                <thead className="table-primary">
                  <tr>
                    <th>Patient</th>
                    <th className="d-none d-md-table-cell">ID</th>
                    <th>Date</th>
                    <th className="d-none d-lg-table-cell">Reason</th>
                    <th>Status</th>
                    <th className="d-none d-xl-table-cell">Doctor</th>
                    {!isPast && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((item) => (
                    <tr key={item.appointmentId}>
                      <td className="text-nowrap">{item.patientName}</td>
                      <td className="d-none d-md-table-cell">{item.patientId}</td>
                      <td className="text-nowrap">
                        {new Date(item.appointmentDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="d-none d-lg-table-cell">{item.reason}</td>
                      <td>
                        <span className={`badge ${
                          item.status === 'Pending' ? 'bg-warning' :
                          item.status === 'Approved' ? 'bg-success' :
                          'bg-secondary'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="d-none d-xl-table-cell">{item.doctorName}</td>
                      {!isPast && (
                        <td>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleEdit(item.appointmentId)}
                          >
                            <i className="bi bi-pencil-square"></i>
                            <span className="d-none d-md-inline ms-1">Edit</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div style={{ width: "260px", flexShrink: 0 }}>
          <Nursesidebar />
        </div>
      )}

      {/* Mobile Sidebar Offcanvas */}
      {isMobile && (
        <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)}>
          <Offcanvas.Header closeButton className="bg-info text-white">
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="p-0">
            <Nursesidebar isMobile={true} closeSidebar={() => setShowSidebar(false)} />
          </Offcanvas.Body>
        </Offcanvas>
      )}

      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        {/* Mobile Header */}
        {isMobile && (
          <div className="sticky-top bg-info text-white p-2 shadow-sm">
            <div className="d-flex align-items-center">
              <Button 
                variant="outline-light" 
                className="me-3"
                onClick={() => setShowSidebar(true)}
              >
                <i className="bi bi-list"></i>
              </Button>
              <h5 className="mb-0">Appointments</h5>
            </div>
          </div>
        )}

        <div className="p-2 p-md-4">
          {renderTable(upcomingAppointments, "Upcoming Appointments")}
          {renderTable(pastAppointments, "Past Appointments", true)}
        </div>
      </div>
    </div>
  );
};

export default Viewappointmentnurse;