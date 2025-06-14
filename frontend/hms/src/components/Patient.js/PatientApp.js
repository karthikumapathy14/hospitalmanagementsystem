import React from "react";
import Viewapatientappointment from "./viewpatientappointment";
import BillPatientView from "./Billpatientview";
import { Route, Routes } from "react-router-dom";
import PatientNavbar from "./PatientNavbar";
import ChangePassword from "../ChangePassword";

const PatientApp = () => {
  return (
    <div style={{ minWidth: "100vw" }} className="bg-light vh-100">
      <div
        style={{
          width: "100%",
          backgroundColor: "#f8f9fa",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <PatientNavbar />
      </div>
      <div style={{ alignItems: "flex-start" }}>
        <div style={{ width: "100%"}}>
          <Routes>
            <Route
              path="Viewapatientappointment"
              element={<Viewapatientappointment />}
            ></Route>
           <Route path="/billpatientview/:id" element={<BillPatientView />}></Route>
            <Route path="changepassword" element={<ChangePassword/>}></Route>
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default PatientApp;
