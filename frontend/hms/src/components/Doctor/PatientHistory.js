import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const PatientHistory = () => {

  const { patientId } = useParams()
  const [history, gethistory] = useState([])

  useEffect(() => {
    if (!patientId) return;

    axios.get(`https://localhost:7058/api/Doctor/history/${patientId}`)
      .then((res) => gethistory(res.data))
      .catch((err) => console.log(err))
  }, [])

  return (
    <div>
      <h1>Patient History</h1>

      <table className='table table-bordered table-striped'>
        <thead>
          <tr>
            <td>Patient Id</td>
            <td>Patient Unique Id</td>
            <td>AppointmentDate</td>
            <td>DoctorName</td>
            <td>DepartmentName</td>
            <td>Diagnosis</td>
            <td>Medications</td>
            <td>Notes</td>
            <td>PrescribedDate</td>
          </tr>
        </thead>
        <tbody>
          {history.map((item, index) => (
            <tr key={index}>
              <td>{item.patientId}</td>
              <td>{item.patientUniqueId}</td>
              <td>{item.appointmentDate}</td>
              <td>{item.doctor?.userName || '-'}</td>
              <td>{item.doctor?.department?.departmentName || '-'}</td>
              <td>{item.prescription?.diagnosis || 'N/A'}</td>
              <td>{item.prescription?.medications || 'N/A'}</td>
              <td>{item.prescription?.notes || 'N/A'}</td>
              <td>{item.prescription?.prescribedDate ? new Date(item.prescription.prescribedDate).toLocaleDateString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

export default PatientHistory
