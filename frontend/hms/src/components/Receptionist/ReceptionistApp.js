import React from "react";
import { Route, Routes } from "react-router-dom";
import ListPatient from "./ListPatient";
import CreatePatient from "./CreatePatient";
import Makeappointment from "./Makeappointment";
import ListAppointment from "./ListAppointment";
import Editappointment from "./Editappointment";
import Bill from "./Bill";
import EditPatient from "./EditPaient";
import ReceptionistNavbar from "./ReceptionistNavbar";
import ChangePassword from "../Common/ChangePassword";
import BillPatientView from "../Patient.js/Billpatientview";

const ReceptionistApp = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }} >
      <div
        style={{
          width: "250px",
          backgroundColor: "#f8f9fa",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <ReceptionistNavbar />
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start" }} className="bg-light">
        <div style={{ width: "100%" }}>
          <Routes>
            <Route
              path="listPatient"
              element={<ListPatient />}
            ></Route>
            <Route
              path="listPatient/:id"
              element={<EditPatient />}
            ></Route>
            <Route
              path="CreatePatient"
              element={<CreatePatient />}
            ></Route>
            {/* <Route path='/createApponitment' element={<Appointment/>}></Route>
              <Route path='/createApponitment/:id' element={<Makeappointment/>}></Route> */}
            <Route
              path="Createappointment"
              element={<Makeappointment />}
            ></Route>
            <Route
              path="Listappointment"
              element={<ListAppointment />}
            ></Route>
            <Route
              path="editappointment/:id"
              element={<Editappointment />}
            ></Route>
            <Route path="billgenerate" element={<Bill />}></Route>
            <Route path="changepassword" element={<ChangePassword/>}></Route>
            <Route path="billpatientview/:id" element={<BillPatientView />}></Route>
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistApp;
