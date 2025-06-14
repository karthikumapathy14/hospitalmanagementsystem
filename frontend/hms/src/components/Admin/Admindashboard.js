import React, { useEffect, useState } from "react";
import Adminnavbar from "./Adminnavbar";
import axios from "axios";
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
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Admindashboard = () => {
  const [counts, setCounts] = useState({
    doctors: 0,
    availableDoctors: 0,
    nurses: 0,
    availableNurses: 0,
    patients: 0,
    receptionist: 0,
    availableReceptionists: 0,
    appointments: 0,
    todaysAppointments: 0,
  });

  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Restricted Access");
      navigate("/");
      return;
    }
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [
          doctorsRes,
          availableDoctorsRes,
          nursesRes,
          availableNursesRes,
          patientsRes,
          receptionistRes,
          availableReceptionistsRes,
          appointmentsRes,
          todayRes,
        ] = await Promise.all([
          axios.get("https://localhost:7058/api/Admin/totaldoctors"),
          axios.get("https://localhost:7058/api/Admin/getdocavailablecount"),
          axios.get("https://localhost:7058/api/Admin/totalnurses"),
          axios.get("https://localhost:7058/api/Admin/getnurseavailablecount"),
          axios.get("https://localhost:7058/api/Admin/totalpatients"),
          axios.get("https://localhost:7058/api/Admin/totalreceptionist"),
          axios.get("https://localhost:7058/api/Admin/getrecavailablecount"),
          axios.get("https://localhost:7058/api/Admin/totalappointments"),
          axios.get("https://localhost:7058/api/Admin/today-appointments"),
        ]);

        setCounts({
          doctors: doctorsRes.data,
          availableDoctors: availableDoctorsRes.data,
          nurses: nursesRes.data,
          availableNurses: availableNursesRes.data,
          patients: patientsRes.data,
          receptionist: receptionistRes.data,
          availableReceptionists: availableReceptionistsRes.data,
          appointments: appointmentsRes.data,
          todaysAppointments: todayRes.data,
        });
      } catch (err) {
        console.error("Error fetching dashboard counts:", err);
      }
    };

    fetchCounts();
  }, []);

  const fetchDaywiseAppointments = async () => {
    try {
      const res = await axios.get("https://localhost:7058/api/Admin/getdaywisereport");
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

  const cardStyle = {
    borderRadius: "8px",
    padding: "0.75rem",
    height: "100%",
  };

  const cardBodyStyle = {
    padding: "1rem",
    textAlign: "center",
  };

  return (
    <div className="d-flex">
    
      <div className="flex-grow-1">
        <div className="container mt-4">
          <h4 className="text-center mb-4">Admin Dashboard</h4>
          <div className="row g-3">
            {/* Doctor Card */}
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card shadow-sm" style={{ ...cardStyle, backgroundColor: "#e0f7fa" }}>
                <div style={cardBodyStyle}>
                  <FaUserMd size={28} color="#00796b" />
                  <h6 className="mt-2">{counts.doctors}</h6>
                  <p className="text-muted mb-1">Total Doctors</p>
                  <p className="text-success small mb-0">Available: {counts.availableDoctors}</p>
                </div>
              </div>
            </div>

            {/* Nurse Card */}
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card shadow-sm" style={{ ...cardStyle, backgroundColor: "#f1f8e9" }}>
                <div style={cardBodyStyle}>
                  <FaUserNurse size={28} color="#558b2f" />
                  <h6 className="mt-2">{counts.nurses}</h6>
                  <p className="text-muted mb-1">Total Nurses</p>
                  <p className="text-success small mb-0">Available: {counts.availableNurses}</p>
                </div>
              </div>
            </div>

            {/* Patient Card */}
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card shadow-sm" style={{ ...cardStyle, backgroundColor: "#fff3e0" }}>
                <div style={cardBodyStyle}>
                  <FaUsers size={28} color="#ef6c00" />
                  <h6 className="mt-2">{counts.patients}</h6>
                  <p className="text-muted mb-1">Total Patients</p>
                </div>
              </div>
            </div>

            {/* Receptionist Card */}
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card shadow-sm" style={{ ...cardStyle, backgroundColor: "#f3e5f5" }}>
                <div style={cardBodyStyle}>
                  <FaUserTie size={28} color="#6a1b9a" />
                  <h6 className="mt-2">{counts.receptionist}</h6>
                  <p className="text-muted mb-1">Receptionists Registered</p>
                  <p className="text-success small mb-0">Available: {counts.availableReceptionists}</p>
                </div>
              </div>
            </div>

            {/* Total Appointments Card */}
            <div className="col-12 col-sm-6 col-lg-4">
              <div
                className="card shadow-sm"
                style={{ ...cardStyle, backgroundColor: "#e1f5fe", cursor: "pointer" }}
                onClick={fetchDaywiseAppointments}
              >
                <div style={cardBodyStyle}>
                  <FaCalendarCheck size={28} color="#0288d1" />
                  <h6 className="mt-2">{counts.appointments}</h6>
                  <p className="text-muted mb-1">Total Appointments</p>
                </div>
              </div>
            </div>

            {/* Today's Appointments */}
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card shadow-sm" style={{ ...cardStyle, backgroundColor: "#ffe0b2" }}>
                <div style={cardBodyStyle}>
                  <FaCalendarDay size={28} color="#f57c00" />
                  <h6 className="mt-2">{counts.todaysAppointments}</h6>
                  <p className="text-muted mb-1">Today's Appointments</p>
                </div>
              </div>
            </div>

            {/* Chart */}
            {showChart && (
              <div className="col-12 mt-3">
                <h6 className="text-center">Daywise Appointments Trend</h6>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#42a5f5" strokeWidth={2} />
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
