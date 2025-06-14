import React from "react";
import RegisterForm from "./Reg";
import Department from "./Department";
import ListDoc from "./ListDoc";
import EditDoct from "./EditDoct";
import Admindashboard from "./Admindashboard";
import ListNurse from "./ListNurse";
import EditNurse from "./EditNurse";
import ListReceptionist from "./ListReceptionist";
import EditRecep from "./EditRecep";
import { Route, Routes } from "react-router-dom";
import Adminnavbar from "./Adminnavbar";
import ChangePassword from "../ChangePassword";
import WhatsAppSender from "../WhatsAppSender";
import MessageSender from "../Circularsender";
import Staffavailable from "./Staffavailable";

const AdminApp = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }} className="bg-light">
      <div
        style={{
          width: "250px",
          backgroundColor: "#f8f9fa",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <Adminnavbar />
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start" }}>
        <div style={{ width: "100%" }}>
          <Routes>
            <Route path="reg" element={<RegisterForm />} />
            <Route path="department" element={<Department />}></Route>
            <Route path="listdoc" element={<ListDoc />}></Route>
            <Route path="listdoc/:id" element={<EditDoct />}></Route>
            <Route path="Admindashboard" element={<Admindashboard />}></Route>
            <Route path="ListNurse" element={<ListNurse />}></Route>
            <Route path="ListNurse/:id" element={<EditNurse />}></Route>
            <Route path="listrecep" element={<ListReceptionist />}></Route>
            <Route path="listrecep/:id" element={<EditRecep />}></Route>
            <Route path="ChangePassword" element={<ChangePassword />}></Route>
            <Route path="Circularsender" element={<MessageSender />}></Route>
            <Route path="Staffavailable" element={<Staffavailable/>}></Route>
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminApp;
