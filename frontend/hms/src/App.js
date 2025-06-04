import Reg from './components/Admin/Reg.jsx';
import  './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter, Links, Route, Routes } from 'react-router-dom'
import { ToastContainer } from "react-toastify";


import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login.jsx';
import Department from './components/Admin/Department.js';
import ListDoc from './components/Admin/ListDoc.js';
import EditDoct from './components/Admin/EditDoct.js';

import Admindashboard from './components/Admin/Admindashboard.js';
import ListNurse from './components/Admin/ListNurse.js';
import EditNurse from './components/Admin/EditNurse.js';
import ListReceptionist from './components/Admin/ListReceptionist.js';
import EditRecep from './components/Admin/EditRecep.js';
import ListPatient from './components/Receptionist/ListPatient.js';
import EditPaient from './components/Receptionist/EditPaient.js';
import CreatePatient from './components/Receptionist/CreatePatient.js';


import Makeappointment from './components/Receptionist/Makeappointment.js';
import ListAppointment from './components/Receptionist/ListAppointment.js';
import Editappointment from './components/Receptionist/Editappointment.js';
import DoctorDashboard from './components/Doctor/DoctorDashboard.js';
import DoctorSideEditAppointment from './components/Doctor/DoctorSideEditAppointment.js';
import Viewappointment from './components/Doctor/Viewappointment.js';
import Addprescription from './components/Doctor/Addprescription.js';
import PatientHistory from './components/Doctor/PatientHistory.js';
import Viewappointmentnurse from './components/Nurse/Viewappointmentnurse.js';
import Editappointmentnurse from './components/Nurse/Editappointmentnurse.js';


import Bill from './components/Receptionist/Bill.js';
import Viewapatientappointment from './components/Patient.js/viewpatientappointment.js'
import Billpatientview from './components/Patient.js/Billpatientview.js';
import ChangePassword from './components/ChangePassword.js';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} />
        {/* <DoctorSidebar doctor={doctorData} /> */}

        <div className='d-flex'>
          <div className='flex-grow-1'>
            <Routes>
              {/* common */}
              <Route path="/" element={<Login />} />
              <Route path='/changepassword' element={<ChangePassword/>}></Route>

              {/* Admin navbar */}
              <Route path="/reg" element={<Reg />} />
              <Route path='/department' element={<Department />}></Route>
              <Route path='/listdoc' element={<ListDoc />}></Route>
              <Route path='/listdoc/:id' element={<EditDoct />}></Route>
              <Route path='/Admindashboard' element={<Admindashboard />}></Route>
              <Route path='/ListNurse' element={<ListNurse />}></Route>
              <Route path='/ListNurse/:id' element={<EditNurse />}></Route>
              <Route path='/listrecep' element={<ListReceptionist />}></Route>
              <Route path='/listrecep/:id' element={<EditRecep />}></Route>

              {/* receptionist dashboard */}
        
              <Route path='/listPatient' element={<ListPatient />}></Route>
              <Route path='/listPatient/:id' element={<EditPaient />}></Route>
              <Route path='/CreatePatient' element={<CreatePatient />}></Route>
              {/* <Route path='/createApponitment' element={<Appointment/>}></Route>
              <Route path='/createApponitment/:id' element={<Makeappointment/>}></Route> */}
              <Route path='/Createappointment' element={<Makeappointment />}></Route>
              <Route path='/Listappointment' element={<ListAppointment />}></Route>
              <Route path='/editappointment/:id' element={<Editappointment />}></Route>
              <Route path='/billgenerate' element={<Bill/>}></Route>

              {/* Doctor dashboard */}
              {/* <Route path='/DoctorDashboard' element={<DoctorDashboard/>}></Route> */}
              <Route path='/viewappointment' element={<Viewappointment />}> </Route>
              <Route path="/DoctorSideEditAppointment/:id" element={<DoctorSideEditAppointment />} />
              <Route path='/Addprescription' element={<Addprescription/>}></Route>
              <Route path='/PatientHistory' element={<PatientHistory/>}></Route>

              {/* nurse dashboard */}
              <Route path='/Viewappointmentnurse' element={<Viewappointmentnurse/>}></Route>
              <Route path='/Editappointmentnurse/:id' element={<Editappointmentnurse/>}></Route>

              {/* {patient dashboard} */}
              <Route path='/Viewapatientappointment' element={<Viewapatientappointment/>}></Route>
              <Route path='/billpatientview/:id' element={<Billpatientview/>}></Route>
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>


  );
}

export default App;
