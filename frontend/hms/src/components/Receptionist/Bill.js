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
    billDate: today,
  });

  const [billExists, setBillExists] = useState(false);
  const [appointmentStatus, setAppointmentStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (appid) {
      setFormData((prev) => ({ ...prev, appointmentId: appid }));

      axios
        .get(`https://localhost:7058/api/Receptionist/getappointmentid/${appid}`)
        .then((response) => setAppointmentStatus(response.data.status))
        .catch((error) => console.error('Error fetching appointment status:', error));

      axios
        .get(`https://localhost:7058/api/Receptionist/billbyid/${appid}`)
        .then((response) => {
          setBillExists(response.data.exists);

          if (response.data.exists) {
            axios
              .get(`https://localhost:7058/api/Receptionist/getbill/${appid}`)
              .then((res) => setFormData(res.data))
              .catch((err) => console.error('Error fetching bill data', err));
          }

          setLoading(false);
        })
        .catch((error) => {
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
    formData.otherCharges,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (billExists) return alert('Bill has already been generated.');
    if (appointmentStatus !== 'Complete')
      return alert("Bill can only be created when appointment status is 'Complete'.");

    try {
      await axios.post('https://localhost:7058/api/Receptionist/create-bill', formData);
      alert('Bill created successfully!');
      setBillExists(true);
      navigate(-1);
    } catch (error) {
      console.error('Error creating bill:', error);
      alert('Failed to create bill.');
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow rounded-4 border-0">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4">Generate Patient Bill</h3>

              {billExists && (
                <div className="alert alert-info text-center" role="alert">
                  A bill has already been generated for this appointment.
                </div>
              )}

              {appointmentStatus !== 'Complete' && !billExists && (
                <div className="alert alert-warning text-center">
                  This appointment is not completed yet. Please complete it before generating a bill.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {[
                  { label: 'Appointment ID', name: 'appointmentId', readOnly: true },
                  { label: 'Consultation Fee', name: 'consultationFee', type: 'number' },
                  { label: 'Treatment Charges', name: 'treatmentCharges', type: 'number' },
                  { label: 'Medication Charges', name: 'medicationCharges', type: 'number' },
                  { label: 'Other Charges', name: 'otherCharges', type: 'number' },
                  { label: 'Total Amount', name: 'totalAmount', type: 'number', readOnly: true },
                  { label: 'Bill Date', name: 'billDate', type: 'date' },
                ].map((field, index) => (
                  <div className="mb-3" key={index}>
                    <label className="form-label">{field.label}</label>
                    <input
                      type={field.type || 'text'}
                      className="form-control"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      readOnly={field.readOnly}
                      disabled={
                        field.readOnly || billExists || appointmentStatus !== 'Complete'
                      }
                      min={field.type === 'number' ? '0' : undefined}
                    />
                  </div>
                ))}

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={billExists || appointmentStatus !== 'Complete'}
                  >
                    <i className="bi bi-receipt-cutoff me-2"></i>
                    Create Bill
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    <i className="bi bi-x-circle me-2"></i>
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
