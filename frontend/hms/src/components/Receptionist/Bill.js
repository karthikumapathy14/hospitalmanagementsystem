import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Bill = () => {
  const { appid } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    appointmentId: '',
    consultationFee: '',
    treatmentCharges: '',
    medicationCharges: '',
    otherCharges: '',
    totalAmount: '',
    billDate: today
  });

  const [billExists, setBillExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (appid) {
      setFormData((prev) => ({ ...prev, appointmentId: appid }));

      axios.get(`https://localhost:7058/api/Receptionist/billbyid/${appid}`)
        .then(response => {
          setBillExists(response.data.exists);
          if (response.data.exists) {
            axios.get(`https://localhost:7058/api/Receptionist/getbill/${appid}`)
              .then(res => setFormData(res.data))
              .catch(err => console.error("Error fetching bill data", err));
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error checking bill existence:', error);
          setLoading(false);
        });
    }
  }, [appid]);

  useEffect(() => {
    const total =
      Number(formData.consultationFee || 0) +
      Number(formData.treatmentCharges || 0) +
      Number(formData.medicationCharges || 0) +
      Number(formData.otherCharges || 0);

    setFormData((prev) => ({ ...prev, totalAmount: total }));
  }, [
    formData.consultationFee,
    formData.treatmentCharges,
    formData.medicationCharges,
    formData.otherCharges
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (billExists) {
      alert("Bill has already been generated.");
      return;
    }

    try {
      await axios.post("https://localhost:7058/api/Receptionist/create-bill", formData);
      alert("Bill created successfully!");
      setBillExists(true);
      navigate(-1);
    } catch (error) {
      console.error("Error creating bill:", error);
      alert("Failed to create bill.");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow rounded-4 border-0">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Generate Bill</h3>

              {billExists && (
                <div className="alert alert-info text-center" role="alert">
                  A bill has already been generated for this appointment.
                </div>
              )}

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">Appointment ID</label>
                  <input
                    className="form-control"
                    name="appointmentId"
                    value={formData.appointmentId}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Consultation Fee</label>
                  <input
                    type="number"
                    className="form-control"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    disabled={billExists}
                    min="0"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Treatment Charges</label>
                  <input
                    type="number"
                    className="form-control"
                    name="treatmentCharges"
                    value={formData.treatmentCharges}
                    onChange={handleChange}
                    disabled={billExists}
                    min="0"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Medication Charges</label>
                  <input
                    type="number"
                    className="form-control"
                    name="medicationCharges"
                    value={formData.medicationCharges}
                    onChange={handleChange}
                    disabled={billExists}
                    min="0"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Other Charges</label>
                  <input
                    type="number"
                    className="form-control"
                    name="otherCharges"
                    value={formData.otherCharges}
                    onChange={handleChange}
                    disabled={billExists}
                    min="0"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Total Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    name="totalAmount"
                    value={formData.totalAmount}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Bill Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="billDate"
                    value={formData.billDate}
                    onChange={handleChange}
                    disabled={billExists}
                  />
                </div>

                <div className="text-end">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={billExists}
                  >
                    Create Bill
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary ms-2"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
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

export default Bill;
