import React from 'react'
import ReceptionistNavbar from './ReceptionistNavbar'

const ReceptionistDashboard = () => {
  return (
    <div>
      <div className='d-flex'>
        <ReceptionistNavbar />
        <div className='flex-grow-1'>
          <h2>ReceptionistDashboard</h2>
        </div>
      </div>
    </div>
  )
}

export default ReceptionistDashboard
