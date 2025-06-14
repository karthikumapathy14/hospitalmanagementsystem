import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Staffavailable = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

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
        console.log(response.data);
      } catch (error) {
        console.error(`Error fetching ${role} data:`, error);
        setError(`Failed to load ${role.toLowerCase()} data.`);
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

    // Search filter
    if (searchTerm) {
      result = result.filter(staff =>
        (staff.name || staff.userName)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.department?.departmentName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Availability filter
    if (availabilityFilter === 'available') {
      result = result.filter(staff => staff.availability?.toLowerCase() === 'available');
    } else if (availabilityFilter === 'unavailable') {
      result = result.filter(staff => staff.availability?.toLowerCase() !== 'available');
    }

    setFilteredList(result);
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-white border-bottom">
          <h4 className="mb-0">Staff Availability</h4>
        </div>

        <div className="card-body">
          {/* Filters */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <select
                className="form-select"
                onChange={handleRoleChange}
                value={selectedRole}
                disabled={isLoading}
              >
                <option value="">Select Role</option>
                <option value="Doctor">Doctors</option>
                <option value="Nurse">Nurses</option>
                <option value="Receptionist">Receptionists</option>
              </select>
            </div>

            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder={`Search ${selectedRole ? selectedRole.toLowerCase() + 's' : 'staff'} by name or department...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!selectedRole}
              />
            </div>

            <div className="col-md-3">
              <div className="btn-group w-100" role="group">
                <button
                  type="button"
                  className={`btn ${availabilityFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setAvailabilityFilter('all')}
                  disabled={!selectedRole}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`btn ${availabilityFilter === 'available' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setAvailabilityFilter('available')}
                  disabled={!selectedRole}
                >
                  Available
                </button>
                <button
                  type="button"
                  className={`btn ${availabilityFilter === 'unavailable' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setAvailabilityFilter('unavailable')}
                  disabled={!selectedRole}
                >
                  Unavailable
                </button>
              </div>
            </div>
          </div>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Staff Table */}
          {!isLoading && filteredList.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                   
                    <th>Name</th>
                    {selectedRole === 'Doctor' && <th>Department</th>}
                    <th className="text-end">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((staff) => (
                    <tr key={staff.id}>
                      
                      <td>{staff.name || staff.userName}</td>
                      {selectedRole === 'Doctor' && (
                        <td>{staff.department?.departmentName || 'N/A'}</td>
                      )}
                      <td className="text-end">
                        <span className={`badge ${staff.availability?.toLowerCase() === 'available' ? 'bg-success' : 'bg-secondary'}`}>
                          {staff.availability}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : !isLoading && selectedRole ? (
            <div className="text-center py-4 text-muted">
              No staff members found matching your criteria.
            </div>
          ) : !isLoading && (
            <div className="text-center py-4 text-muted">
              Please select a staff role to view availability.
            </div>
          )}
        </div>

        <div className="card-footer bg-white border-top text-muted small">
          {selectedRole && `${filteredList.length} ${filteredList.length === 1 ? 'record' : 'records'} shown`}
        </div>
      </div>
    </div>
  );
};

export default Staffavailable;
