import axios from 'axios';
import React, { useEffect, useState } from 'react';


const PatientHistory = () => {

  const [history, gethistory] = useState([]);

  useEffect(() => {
   

    axios.get('https://localhost:7058/api/Doctor/history')
      .then((res) => gethistory(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Patient History</h1>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Patient Id</th>
              <th>Patient Unique Id</th>
              <th>Appointment ID</th>
              <th>Appointment Date</th>
              <th>Reason</th>
              <th>Doctor Name</th>
              <th>Department Name</th>
              <th>Diagnosis</th>
              <th>Medications</th>
              <th>Notes</th>
              <th>Prescribed Date</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? history.map((item, index) => (
              <tr key={index}>
                <td>{item.patient.id}</td>
                <td>{item.patient.patientid}</td>
                <td>{item.appointmentId}</td>
                <td>{item.appointmentDate}</td>
                <td>{item.reason}</td>
                <td>{item.doctor?.docname || '-'}</td>
                <td>{item.doctor?.department?.departmentName || '-'}</td>
                <td>{item.prescription?.diagnosis }</td>
                <td>{item.prescription?.medications || 'N/A'}</td>
                <td>{item.prescription?.notes || 'N/A'}</td>
                <td>{item.prescription?.prescribedDate ? new Date(item.prescription.prescribedDate).toLocaleDateString() : 'N/A'}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="10" className="text-center">No history available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientHistory;
