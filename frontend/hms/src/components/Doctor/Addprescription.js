import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../Common/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Addprescription = () => {
  const [prescriptionDays, setPrescriptionDays] = useState([]);
  const [activeDay, setActiveDay] = useState(0);
  const { doctorId, appid } = useAuth();
  const { prescriptionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Restricted Access");
      navigate("/");
      return;
    }

    axios
      .get(
        `https://localhost:7058/api/Doctor/getprescriptionbyprescription/${prescriptionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        if (res.data && res.data.prescriptionDays) {
          const formatted = res.data.prescriptionDays.map((day) => ({
            ...day,
            prescribedDate: day.prescribedDate?.split("T")[0] || "",
          }));
          setPrescriptionDays(formatted);
        }
      })
      .catch(() => {
        console.log("No existing prescription found, starting fresh");
      });
  }, [prescriptionId, navigate]);

  const handleDayChange = (index, field, value) => {
    const updated = [...prescriptionDays];
    updated[index][field] = value;
    setPrescriptionDays(updated);
  };

  const addDay = () => {
    const dayNumbers = prescriptionDays.map((d) => d.dayNumber);
    let nextDay = 1;
    while (dayNumbers.includes(nextDay)) nextDay++;

    const newDay = {
      dayNumber: nextDay,
      diagnosis: "",
      medications: "",
      notes: "",
      prescribedDate: "",
    };

    setPrescriptionDays([...prescriptionDays, newDay]);
    setActiveDay(prescriptionDays.length);
  };

  const removeDay = (index) => {
    if (prescriptionDays.length <= 1) {
      toast.warning("You must have at least one day");
      return;
    }

    const updated = prescriptionDays.filter((_, i) => i !== index);
    setPrescriptionDays(updated);
    setActiveDay(Math.min(activeDay, updated.length - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      appointmentId: parseInt(appid),
      id: parseInt(prescriptionId) || 0 ,
      prescribedby: parseInt(doctorId),
      prescribedDate: new Date().toISOString().split("T")[0],
      prescriptionDays,
    };

    try {
      await axios.post(
        "https://localhost:7058/api/Doctor/postprescription",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Prescription saved successfully!");
      navigate("/doctor/viewappointment");
    } catch (err) {
      console.error(err);
      toast.error("Error saving prescription.");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="h4 mb-0 text-center">Multi-Day Prescription</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-4">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Appointment ID</label>
                    <input className="form-control bg-light" value={appid} readOnly />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Prescription ID</label>
                    <input className="form-control bg-light" value={prescriptionId||""} readOnly />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Prescribed By</label>
                    <input className="form-control bg-light" value={doctorId} readOnly />
                  </div>
                </div>

                {prescriptionDays.length === 0 ? (
                  <div className="alert alert-info text-center">No prescription days added yet.</div>
                ) : (
                  <>
                    <ul className="nav nav-tabs" id="dayTabs" role="tablist">
                      {prescriptionDays.map((day, index) => (
                        <li className="nav-item d-flex align-items-center" key={index}>
                          <button
                            className={`nav-link ${activeDay === index ? "active" : ""}`}
                            type="button"
                            onClick={() => setActiveDay(index)}
                          >
                            Day {day.dayNumber}

                            {prescriptionDays.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger ms-2"
                              onClick={() => removeDay(index)}
                            >
                              ×
                            </button>
                          )}
                          </button>
                          
                        </li>
                      ))}
                    </ul>

         
                    <div className="tab-content p-3 border border-top-0 rounded-bottom">
                      {prescriptionDays[activeDay] && (
                        <div className="tab-pane fade show active">
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Prescribed Date</label>
                            <input
                              type="date"
                              className="form-control"
                              value={prescriptionDays[activeDay].prescribedDate || ""}
                              onChange={(e) =>
                                handleDayChange(activeDay, "prescribedDate", e.target.value)
                              }
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label fw-bold">Diagnosis</label>
                            <textarea
                              className="form-control"
                              rows="3"
                              value={prescriptionDays[activeDay].diagnosis}
                              onChange={(e) =>
                                handleDayChange(activeDay, "diagnosis", e.target.value)
                              }
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label fw-bold">Medications</label>
                            <textarea
                              className="form-control"
                              rows="3"
                              value={prescriptionDays[activeDay].medications}
                              onChange={(e) =>
                                handleDayChange(activeDay, "medications", e.target.value)
                              }
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label fw-bold">Notes</label>
                            <textarea
                              className="form-control"
                              rows="2"
                              value={prescriptionDays[activeDay].notes}
                              onChange={(e) =>
                                handleDayChange(activeDay, "notes", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="d-flex justify-content-between my-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={addDay}
                  >
                    <i className="bi bi-plus-circle me-2"></i>Add Day
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-save me-2"></i>Save Prescription
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addprescription;
