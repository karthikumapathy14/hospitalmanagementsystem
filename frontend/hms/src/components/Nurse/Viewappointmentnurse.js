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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

<<<<<<< Updated upstream
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
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
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        console.log(err);
        toast.error("Failed to load appointments");
      });
  }, [navigate, token]);
=======
    const handleEdit=(appointmentId)=>{
        navigate(`/Editappointmentnurse/${appointmentId}`)
    }

  return (
    <div>
      <h2>View Appointment</h2>
      <table className='table table-bordered table-striped'>
        <thead>
            <tr>
            <th>Patient Id</th>
            <th>Patient Name</th>
            <th>Date</th>
            <th>Reason</th>
            <th>status</th>
            <th>Doctor Name</th>
            <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {data.map((item)=><tr key={item.appointmentId}>
                <td>{item.patientId}</td>
                <td>{item.patientName}</td>
                <td>{item.appointmentDate}</td>
                <td>{item.reason}</td>
                <td>{item.status}</td>
                <td>{item.doctorName}</td>
                <td><button className='btn btn-warning' onClick={()=>handleEdit(item.appointmentId)}>Edit</button></td>
                </tr>)}
        </tbody>
      </table>
    </div>
  )
}
>>>>>>> Stashed changes

  const handleEdit = (appointmentId) => {
    navigate(`/Editappointmentnurse/${appointmentId}`);
  };

  // Search and filter
  const filteredData = data.filter(item => {
    const search = searchTerm.toLowerCase();
   const matchesSearch =
  (item.patientName?.toLowerCase()?.includes(search) ?? false) ||
  (item.doctorName?.toLowerCase()?.includes(search) ?? false);

    const matchesStatus =
      statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderTable = (appointments, title) => (
    <div className="container-fluid px-0 px-md-3">
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-info text-white py-2 py-md-3">
          <h4 className="mb-0 text-center">
            <i className="bi bi-calendar-check me-2"></i> {title}
          </h4>
        </div>
        <div className="card-body p-0 p-md-3">
          <div className="d-md-flex justify-content-between align-items-center mb-3 px-2">
            <input
              type="text"
              className="form-control mb-2 mb-md-0 me-md-3"
              placeholder="Search by patient or doctor"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <select
              className="form-select w-auto"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Status</option>
              <option value="Schedule">Schedule</option>
              <option value="Complete">Complete</option>
              <option value="Cancel">Cancel</option>
            </select>
          </div>

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
                    <th>Action</th>
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
                          item.status === 'Schedule' ? 'bg-warning' :
                          item.status === 'Complete' ? 'bg-success' :
                          'bg-secondary'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="d-none d-xl-table-cell">{item.doctorName}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleEdit(item.appointmentId)}
                        >
                          <i className="bi bi-pencil-square"></i>
                          <span className="d-none d-md-inline ms-1">Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination controls */}
              <div className="d-flex justify-content-center align-items-center mt-3">
                <Button variant="light" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  ◀
                </Button>
                <span className="mx-3">
                  Page {currentPage} of {totalPages}
                </span>
                <Button variant="light" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  ▶
                </Button>
              </div>
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
          {renderTable(paginatedData, "All Appointments")}
        </div>
      </div>
    </div>
  );
};

export default Viewappointmentnurse;
