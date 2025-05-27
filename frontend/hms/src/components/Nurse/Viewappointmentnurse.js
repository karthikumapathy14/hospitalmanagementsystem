import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Viewappointmentnurse = () => {

    const[data,getdata]=useState([])
    const navigate=useNavigate()
    
    useEffect(()=>{
        axios.get('https://localhost:7058/api/Nurse/appointmentnurse',{ headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },})
        .then((res)=>{getdata(res.data);console.log('Appointments fetched:', res.data);})
        .catch((err)=>console.log(err))
    },[])

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

export default Viewappointmentnurse
