import React, { useEffect, useState } from "react";
import Adminnavbar from "./Adminnavbar";
import axios from "axios";
import {toast} from 'react-toastify';
import {
  FaUserMd,
  FaUserNurse,
  FaUsers,
  FaUserTie,
  FaCalendarCheck,
  FaCalendarDay,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

const Admindashboard = () => {
  const [counts, setCounts] = useState({
    doctors: 0,
    nurses: 0,
    patients: 0,
    receptionist: 0,
    appointments: 0,
    todaysAppointments: 0,
  });
  const navigate = useNavigate();
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState([]);

useEffect(() => {
  const fetchCounts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Restricted Access"); // 👈 Toast shown
      navigate("/"); // 👈 Navigate to login
      return; // 👈 Prevent further execution
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [
        doctorsRes,
        nursesRes,
        patientsRes,
        receptionistRes,
        appointmentsRes,
        todayRes,
      ] = await Promise.all([
        axios.get("https://localhost:7058/api/Admin/totaldoctors", config),
        axios.get("https://localhost:7058/api/Admin/totalnurses", config),
        axios.get("https://localhost:7058/api/Admin/totalpatients", config),
        axios.get("https://localhost:7058/api/Admin/totalreceptionist", config),
        axios.get("https://localhost:7058/api/Admin/totalappointments", config),
        axios.get("https://localhost:7058/api/Admin/today-appointments", config),
      ]);

      setCounts({
        doctors: doctorsRes.data,
        nurses: nursesRes.data,
        patients: patientsRes.data,
        receptionist: receptionistRes.data,
        appointments: appointmentsRes.data,
        todaysAppointments: todayRes.data,
      });
    } catch (err) {
      console.error("Error fetching dashboard counts:", err);
    }
  };

  fetchCounts();
}, [navigate]);


  const fetchDaywiseAppointments = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        "https://localhost:7058/api/Admin/getdaywisereport",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formattedData = res.data.map((item) => ({
        date: new Date(item.date).toLocaleDateString(),
        count: item.count,
      }));
      setChartData(formattedData);
      setShowChart(true);
    } catch (err) {
      console.error("Error fetching daywise appointments:", err);
    }
  };

  return (
    <div className="d-flex">
      <Adminnavbar />
      <div className="flex-grow-1">
        <div className="container mt-4">
          <h2 className="text-center mb-4">Admin Dashboard</h2>
          <div className="row g-4">
            {/* Doctors */}
            <div className="col-md-4">
              <div
                className="card shadow-sm border-0"
                style={{ backgroundColor: "#e0f7fa" }}
              >
                <div className="card-body text-center">
                  <FaUserMd size={40} color="#00796b" />
                  <h5 className="mt-3">{counts.doctors}</h5>
                  <p className="text-muted">Total Doctors</p>
                </div>
              </div>
            </div>

            {/* Nurses */}
            <div className="col-md-4">
              <div
                className="card shadow-sm border-0"
                style={{ backgroundColor: "#f1f8e9" }}
              >
                <div className="card-body text-center">
                  <FaUserNurse size={40} color="#558b2f" />
                  <h5 className="mt-3">{counts.nurses}</h5>
                  <p className="text-muted">Total Nurses</p>
                </div>
              </div>
            </div>

            {/* Patients */}
            <div className="col-md-4">
              <div
                className="card shadow-sm border-0"
                style={{ backgroundColor: "#fff3e0" }}
              >
                <div className="card-body text-center">
                  <FaUsers size={40} color="#ef6c00" />
                  <h5 className="mt-3">{counts.patients}</h5>
                  <p className="text-muted">Total Patients</p>
                </div>
              </div>
            </div>

            {/* Receptionist */}
            <div className="col-md-6">
              <div
                className="card shadow-sm border-0"
                style={{ backgroundColor: "#f3e5f5" }}
              >
                <div className="card-body text-center">
                  <FaUserTie size={40} color="#6a1b9a" />
                  <h5 className="mt-3">{counts.receptionist}</h5>
                  <p className="text-muted">Receptionists Registered</p>
                </div>
              </div>
            </div>

            {/* Appointments */}
            <div className="col-md-6">
              <div
                className="card shadow-sm border-0"
                style={{ backgroundColor: "#e1f5fe", cursor: "pointer" }}
                onClick={fetchDaywiseAppointments}
              >
                <div className="card-body text-center">
                  <FaCalendarCheck size={40} color="#0288d1" />
                  <h5 className="mt-3">{counts.appointments}</h5>
                  <p className="text-muted">Total Appointments</p>
                </div>
              </div>
            </div>

            {/* Today's Appointments */}
            <div className="col-md-6">
              <div
                className="card shadow-sm border-0"
                style={{ backgroundColor: "#ffe0b2" }}
              >
                <div className="card-body text-center">
                  <FaCalendarDay size={40} color="#f57c00" />
                  <h5 className="mt-3">{counts.todaysAppointments}</h5>
                  <p className="text-muted">Today's Appointments</p>
                </div>
              </div>
            </div>

            {/* Line Chart */}
            {showChart && (
              <div className="col-12 mt-4">
                <h5 className="text-center">Daywise Appointments Trend</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#42a5f5"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admindashboard;
