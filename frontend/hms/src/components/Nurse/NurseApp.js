import React from "react";
import Viewappointmentnurse from "./Viewappointmentnurse";
import Editappointmentnurse from "./Editappointmentnurse";
import { Route, Routes } from "react-router-dom";
import Nursesidebar from "./Nursesidebar";
import ChangePassword from "../Common/ChangePassword";

const NurseApp = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }} className="bg-light">
      <div
        style={{
          width: "250px",
          backgroundColor: "#f8f9fa",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <Nursesidebar />
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start" }}>
        <div style={{ width: "100%" }} >
          <Routes>
            <Route
              path="Viewappointmentnurse"
              element={<Viewappointmentnurse />}
            ></Route>
            <Route
              path="Editappointmentnurse/:prescriptionId"
              element={<Editappointmentnurse />}
            ></Route>
             <Route path="ChangePassword" element={<ChangePassword/>}></Route>
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default NurseApp;
