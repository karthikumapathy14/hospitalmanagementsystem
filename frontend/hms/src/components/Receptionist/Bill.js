import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Bill = () => {
  const { appid } = useAuth(); // Get appointment ID from context
  const today = new Date().toISOString().split('T')[0];
  const navigate=useNavigate()

  const [formData, setFormData] = useState({
    appointmentId: '',
    consultationFee: '',
    treatmentCharges: '',
    medicationCharges: '',
    otherCharges: '',
    totalAmount: '',
    billDate: today
  });

  const [billExists, setBillExists] = useState(false);  // Track if bill exists
  const [loading, setLoading] = useState(true);         // Loading state for bill check

  useEffect(() => {
  if (appid) {
    setFormData((prev) => ({ ...prev, appointmentId: appid }));

    axios.get(`https://localhost:7058/api/Receptionist/billbyid/${appid}`)
      .then(response => {
        setBillExists(response.data.exists);
        if (response.data.exists) {
          axios.get(`https://localhost:7058/api/Receptionist/getbill/${appid}`)
            .then(res => {
              setFormData(res.data); // Prefill form
            })
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


  // Auto calculate total amount
  useEffect(() => {
    const total =
      Number(formData.consultationFee) +
      Number(formData.treatmentCharges) +
      Number(formData.medicationCharges) +
      Number(formData.otherCharges);

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
      alert("Bill has already been generated for this appointment.");
      return;
    }
    try {
      await axios.post("https://localhost:7058/api/Receptionist/create-bill", formData);
      console.log("Bill created successfully!");
      setBillExists(true); 
      navigate(-1);// Prevent further edits
    } catch (error) {
      console.error("Error creating bill:", error);
      alert("Failed to create bill.");
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Optional spinner or loader
  }

  return (
    <div className="container mt-5">
      <h2>Bill Generation</h2>
      
      {billExists && (
        <div className="alert alert-info" role="alert">
          Bill created for this appointment.
        </div>
        
      )}

      <form onSubmit={handleSubmit}>
        <label className='form-label'>Appointment ID</label>
        <input className='form-control' name="appointmentId" value={formData.appointmentId} readOnly />

        <label className='form-label'>Consultation Fee</label>
        <input className='form-control' type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} disabled={billExists} />

        <label className='form-label'>Treatment Charges</label>
        <input className='form-control' type="number" name="treatmentCharges" value={formData.treatmentCharges} onChange={handleChange} disabled={billExists} />

        <label className='form-label'>Medication Charges</label>
        <input className='form-control' type="number" name="medicationCharges" value={formData.medicationCharges} onChange={handleChange} disabled={billExists} />

        <label className='form-label'>Other Charges</label>
        <input className='form-control' type="number" name="otherCharges" value={formData.otherCharges} onChange={handleChange} disabled={billExists} />

        <label className='form-label'>Total Amount</label>
        <input className='form-control' name="totalAmount" value={formData.totalAmount} readOnly />

        <label className='form-label'>Bill Date</label>
        <input className='form-control' type="date" name="billDate" value={formData.billDate} onChange={handleChange} disabled={billExists} />

        <button type="submit" className="btn btn-primary mt-3" disabled={billExists}>Create Bill</button>
      </form>
    </div>
  );
};

export default Bill;
