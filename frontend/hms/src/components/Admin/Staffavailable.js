import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import axios from 'axios';

const Staffavailable = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  const navigate = useNavigate();

  const apiEndpoints = {
    Doctor: 'https://localhost:7058/api/Admin/getdocavailabledetails',
    Nurse: 'https://localhost:7058/api/Admin/getnurseavailabledetials',
    Receptionist: 'https://localhost:7058/api/Admin/getrecavailabledetials'
  };

  useEffect(() => {
    if (staffList.length > 0) {
      filterStaff();
    }
  }, [searchTerm, availabilityFilter, staffList]);

  const handleRoleChange = async (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    setError(null);
    setSearchTerm('');
    setAvailabilityFilter('all');

    if (role) {
      setIsLoading(true);
      try {
        const response = await axios.get(apiEndpoints[role]);
        setStaffList(response.data);
      } catch (error) {
        setError(`Failed to load ${role.toLowerCase()} data. Please try again.`);
        setStaffList([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setStaffList([]);
    }
  };

  const filterStaff = () => {
    let result = staffList;
    if (searchTerm) {
      result = result.filter(staff =>
        (staff.name || staff.userName)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.department?.departmentName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (availabilityFilter === 'available') {
      result = result.filter(staff => staff.availability?.toLowerCase() === 'available');
    } else if (availabilityFilter === 'unavailable') {
      result = result.filter(staff => staff.availability?.toLowerCase() !== 'available');
    }
    setFilteredList(result);
  };

  return (
    
    <div className="container-fluid py-4">
      
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom-0 pb-0">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="mb-3">
                  <h2 className="h4 mb-1">Staff Availability</h2>
                  <p className="text-muted mb-0">Manage and monitor your team's status</p>
                </div>
                <div className="d-flex mb-3">
                  <div className="me-3">
                    <h6 className="small text-muted mb-1">Total Staff</h6>
                    <h4 className="mb-0">{filteredList.length}</h4>
                  </div>
                  <div className="me-3">
                    <h6 className="small text-muted mb-1">Available</h6>
                    <h4 className="mb-0">
                      {filteredList.filter(s => s.availability?.toLowerCase() === 'available').length}
                    </h4>
                  </div>
                  <div>
                    <h6 className="small text-muted mb-1">Unavailable</h6>
                    <h4 className="mb-0">
                      {filteredList.filter(s => s.availability?.toLowerCase() !== 'available').length}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body pt-0">
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <label className="form-label">Staff Role</label>
                  <select className="form-select" onChange={handleRoleChange} value={selectedRole} disabled={isLoading}>
                    <option value="">All Roles</option>
                    <option value="Doctor">Doctors</option>
                    <option value="Nurse">Nurses</option>
                    <option value="Receptionist">Receptionists</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Search</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bi bi-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search staff..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={!selectedRole}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Availability</label>
                  <select
                    className="form-select"
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    disabled={!selectedRole}
                  >
                    <option value="all">All Statuses</option>
                    <option value="available">Available Only</option>
                    <option value="unavailable">Unavailable Only</option>
                  </select>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="mt-2 text-muted">Loading staff data...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                </div>
              ) : selectedRole && filteredList.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        {selectedRole === 'Doctor' && <th>Department</th>}
                        <th>Role</th>
                        <th>Status</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredList.map((staff) => (
                        <tr key={staff.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar bg-light text-primary rounded-circle me-2">
                                {(staff.name || staff.userName).charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h6 className="mb-0">{staff.name || staff.userName}</h6>
                              </div>
                            </div>
                          </td>
                          {selectedRole === 'Doctor' && (
                            <td>{staff.department?.departmentName || 'N/A'}</td>
                          )}
                          <td>{selectedRole}</td>
                          <td className="pt-3">
                            <span className={`badge rounded-pill ${staff.availability?.toLowerCase() === 'available' ? 'bg-success' : 'bg-secondary'}`}>
                              {staff.availability}
                            </span>
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => navigate(`/admin/staff/details/${selectedRole}/${staff.id}`)}
                            >
                              Details
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : selectedRole ? (
                <div className="text-center py-5">
                  <h5 className="text-muted">No staff members found</h5>
                </div>
              ) : (
                <div className="text-center py-5">
                  <h5 className="text-muted">Select a staff role</h5>
                </div>
              )}
            </div>

            <div className="card-footer bg-white border-top-0">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Showing {filteredList.length} of {staffList.length} records
                </small>
                <small className="text-muted">
                  Last updated: {new Date().toLocaleTimeString()}
                </small>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Staffavailable;