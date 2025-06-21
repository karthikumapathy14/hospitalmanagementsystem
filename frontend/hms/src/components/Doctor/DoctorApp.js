import React from 'react'
import DoctorSidebar from './DoctorDashboard'
import DoctorSideEditAppointment from './DoctorSideEditAppointment'
import Addprescription from './Addprescription'

import DoctorAvailibility from './DoctorAvailibility'
import { Route, Routes } from 'react-router-dom'
import PatientHistory from './PatientHistory'
import Appointments from './Viewappointment'
import ChangePassword from '../Common/ChangePassword'


const DoctorApp = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }} className='bg-light'>
        <div style={{ width: '250px', backgroundColor: '#f8f9fa', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}>
    <DoctorSidebar />
  </div>
         <div style={{ flex: 1, display: 'flex',  alignItems: 'flex-start' }}>
    <div style={{ width: '100%'}}>
            <Routes>
            <Route path="viewappointment" element={<Appointments/>}> </Route>
              <Route path="DoctorSideEditAppointment/:id" element={<DoctorSideEditAppointment />} />
              <Route path="Addprescription/:prescriptionId" element={<Addprescription/>}></Route>
              <Route path='Addprescription/0' element={<Addprescription/>}></Route>
              <Route path="PatientHistory" element={<PatientHistory/>}></Route>
              {/* <Route path="Viewprescription/:id" element={<Viewprescription/>}></Route> */}
              <Route path="ChangePassword" element={<ChangePassword/>}></Route>
             <Route path="DoctorAvailibility" element={<DoctorAvailibility/>}></Route>    
             
             </Routes>
             </div>
        </div>
    </div>
  )
}

export default DoctorApp
