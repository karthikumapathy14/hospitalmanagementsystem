import React from 'react'
import Adminnavbar from './Adminnavbar'

const Admindashboard = () => {
    return (


    <div className='d-flex'>
      <Adminnavbar />
      <div className='flex-grow-1'>

        <div className="container mt-4">
          <div className="row">

            {/* Doctors Card */}
            <div className="col-md-4">
              <div className="card text-white bg-primary mb-3">
                <div className="card-header">Doctors</div>
                <div className="card-body">
                  <h5 className="card-title">12</h5>
                  <p className="card-text">Total Doctors Available</p>
                </div>
              </div>
            </div>

            {/* Nurses Card */}
            <div className="col-md-4">
              <div className="card text-white bg-success mb-3">
                <div className="card-header">Nurses</div>
                <div className="card-body">
                  <h5 className="card-title">20</h5>
                  <p className="card-text">Total Nurses Available</p>
                </div>
              </div>
            </div>

            {/* Patients Card */}
            <div className="col-md-4">
              <div className="card text-white bg-danger mb-3">
                <div className="card-header">Patients</div>
                <div className="card-body">
                  <h5 className="card-title">135</h5>
                  <p className="card-text">Total Patients Entered</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Admindashboard
