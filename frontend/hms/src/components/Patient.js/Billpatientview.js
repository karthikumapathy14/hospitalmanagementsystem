import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { usePDF } from 'react-to-pdf';

const BillPatientView = () => {
  const [billData, setBillData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const { toPDF, targetRef } = usePDF({ 
    filename: 'medical-bill.pdf',
    page: {
      orientation: 'landscape'
    }
  });

  useEffect(() => {
    const fetchBillDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7058/api/PatientContoller/BillView/getbyid/${id}`);
        setBillData(response.data);
        setError('');
      } catch (err) {
        setBillData(null);
        setError('Bill not found or server error');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchBillDetails();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            {/* Download PDF button (excluded from PDF) */}
            <div className="d-flex justify-content-end mb-4">
              <button 
                className="btn btn-primary"
                onClick={() => toPDF()}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: '500',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <i className="bi bi-file-earmark-pdf me-2"></i>Download PDF
              </button>
            </div>

            {/* PDF content starts here */}
            <div 
              ref={targetRef} 
              style={{ 
                width: '1123px',
                height: '794px',
                margin: '0 auto', 
                backgroundColor: '#fff',
                boxShadow: '0 0 20px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            >
              <div className="border-0">
                {/* Header */}
                <div 
                  className="p-3 text-center"
                  style={{
                    backgroundColor: '#1a5276',
                    color: 'white',
                    borderBottom: '4px solid #f39c12'
                  }}
                >
                  <h2 
                    className="mb-1 fw-bold"
                    style={{ fontSize: '24px', letterSpacing: '1px' }}
                  >
                    Healing Touch Multi-Specialty Hospital
                  </h2>
                  <p className="mb-1" style={{ opacity: '0.9', fontSize: '14px' }}>
                    123, Health Street, Wellness City, India - 560001
                  </p>
                  <div className="d-flex justify-content-center gap-3" style={{ fontSize: '13px' }}>
                    <span><i className="bi bi-telephone me-1"></i> +91-9876543210</span>
                    <span><i className="bi bi-envelope me-1"></i> contact@healingtouch.com</span>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger text-center rounded-0 mb-0">
                    {error}
                  </div>
                )}

                {billData && (
                  <div className="p-3">
                    {/* Bill header */}
                    <div 
                      className="d-flex justify-content-between align-items-center mb-3 pb-2"
                      style={{ borderBottom: '1px dashed #ddd' }}
                    >
                      <div>
                        <h3 
                          className="fw-bold mb-0"
                          style={{ 
                            color: '#1a5276',
                            fontSize: '20px',
                            letterSpacing: '0.5px'
                          }}
                        >
                          MEDICAL BILL
                        </h3>
                        <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                          Bill No: <span className="fw-bold text-dark">{billData.billId}</span>
                        </p>
                      </div>
                      <div className="text-end">
                        <p className="mb-1" style={{ fontSize: '14px' }}>
                          <span className="text-muted">Date:</span> 
                          <strong className="ms-1">{formatDate(billData.billDate)}</strong>
                        </p>
                        <p className="mb-0" style={{ fontSize: '14px' }}>
                          <span className="text-muted">Appointment:</span> 
                          <strong className="ms-1">{billData.appointmentId}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Patient greeting */}
                    <div 
                      className="mb-3 p-2"
                      style={{
                        backgroundColor: '#f8f9fa',
                        borderLeft: '4px solid #1a5276',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    >
                      <p className="mb-0">
                        Dear <strong>{billData.patientName}</strong>,<br />
                        Thank you for choosing Healing Touch Hospital. Below is your detailed medical bill.
                      </p>
                    </div>

                    {/* Main content row */}
                    <div className="row mb-3" style={{ minHeight: '400px' }}>
                      {/* Left column - Patient and Medical Details */}
                      <div className="col-md-5 pe-2 d-flex flex-column" style={{ gap: '10px' }}>
                        {/* Patient Details - Reduced height */}
                        <div 
                          className="p-2"
                          style={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '6px',
                            backgroundColor: '#f8f9fa',
                            flex: '0 0 auto' // Remove flex grow to prevent expansion
                          }}
                        >
                          <h5 
                            className="mb-2 fw-bold"
                            style={{
                              color: '#1a5276',
                              paddingBottom: '6px',
                              borderBottom: '2px solid #1a5276',
                              fontSize: '16px'
                            }}
                          >
                            <i className="bi bi-person me-2"></i>Patient Details
                          </h5>
                          <ul className="list-unstyled mb-0" style={{ fontSize: '14px' }}>
                            <li className="mb-1 d-flex">
                              <span className="text-muted" style={{ width: '100px' }}>ID:</span>
                              <span>{billData.patientId}</span>
                            </li>
                            <li className="mb-1 d-flex">
                              <span className="text-muted" style={{ width: '100px' }}>Name:</span>
                              <span>{billData.patientName}</span>
                            </li>
                            <li className="mb-1 d-flex">
                              <span className="text-muted" style={{ width: '100px' }}>Age/Gender:</span>
                              <span>{billData.age}/{billData.gender}</span>
                            </li>
                            <li className="mb-1 d-flex">
                              <span className="text-muted" style={{ width: '100px' }}>Blood Group:</span>
                              <span>{billData.bloodGroup}</span>
                            </li>
                            <li className="mb-1 d-flex">
                              <span className="text-muted" style={{ width: '100px' }}>Contact:</span>
                              <span>{billData.patientPhone}</span>
                            </li>
                            <li className="mb-1 d-flex">
                              <span className="text-muted" style={{ width: '100px' }}>Email:</span>
                              <span>{billData.patientEmail}</span>
                            </li>
                            <li className="d-flex">
                              <span className="text-muted" style={{ width: '100px' }}>Address:</span>
                              <span>{billData.patientAddress}</span>
                            </li>
                          </ul>
                        </div>

                        {/* Medical Details - Now has more space */}
                        <div 
                          className="p-2 flex-grow-1"
                          style={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '6px',
                            backgroundColor: '#f8f9fa'
                          }}
                        >
                          <h5 
                            className="mb-2 fw-bold"
                            style={{
                              color: '#1a5276',
                              paddingBottom: '6px',
                              borderBottom: '2px solid #1a5276',
                              fontSize: '16px'
                            }}
                          >
                            <i className="bi bi-heart-pulse me-2"></i>Medical Details
                          </h5>
                          <ul className="list-unstyled mb-0" style={{ fontSize: '14px' }}>
                            <li className="mb-1 d-flex">
                              <span className="text-muted" style={{ width: '100px' }}>Doctor:</span>
                              <span>Dr. {billData.doctorName}</span>
                            </li>
                            <li className="mb-1 d-flex">
                              <span className="text-muted" style={{ width: '100px' }}>Department:</span>
                              <span>{billData.departmentName}</span>
                            </li>
                            <li className="mb-1 d-flex">
                              <span className="text-muted" style={{ width: '100px' }}>Appointment Date:</span>
                              <span>{formatDate(billData.appointmentDate)}</span>
                            </li>
                            <li className="mb-1 d-flex">
                              <span className="text-muted" style={{ width: '100px' }}>Time:</span>
                              <span>{billData.appointmentTime}</span>
                            </li>
                            <li className="d-flex">
                              <span className="text-muted" style={{ width: '100px' }}>Reason:</span>
                              <span>{billData.reason}</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Right column - Charges and Payment */}
                      <div className="col-md-7 ps-2 d-flex flex-column" style={{ gap: '10px' }}>
                        {/* Charges Breakdown */}
                        <div 
                          className="p-0 flex-grow-1"
                          style={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '6px',
                            overflow: 'hidden'
                          }}
                        >
                          <div 
                            className="p-2"
                            style={{
                              backgroundColor: '#f8f9fa',
                              borderBottom: '1px solid #e0e0e0'
                            }}
                          >
                            <h5 
                              className="mb-0 fw-bold"
                              style={{
                                color: '#1a5276',
                                fontSize: '16px'
                              }}
                            >
                              <i className="bi bi-receipt me-2"></i>Charges Breakdown
                            </h5>
                          </div>
                          <div className="p-0" style={{ height: 'calc(100% - 42px)', overflow: 'auto' }}>
                            <table className="table mb-0" style={{ fontSize: '14px' }}>
                              <thead style={{ backgroundColor: '#f1f1f1' }}>
                                <tr>
                                  <th 
                                    width="70%" 
                                    style={{ 
                                      fontWeight: '600',
                                      color: '#555'
                                    }}
                                  >
                                    Description
                                  </th>
                                  <th 
                                    width="30%" 
                                    className="text-end"
                                    style={{ 
                                      fontWeight: '600',
                                      color: '#555'
                                    }}
                                  >
                                    Amount
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Consultation Fee</td>
                                  <td className="text-end">{formatCurrency(billData.consultationFee)}</td>
                                </tr>
                                <tr>
                                  <td>Treatment Charges</td>
                                  <td className="text-end">{formatCurrency(billData.treatmentCharges)}</td>
                                </tr>
                                <tr>
                                  <td>Medication Charges</td>
                                  <td className="text-end">{formatCurrency(billData.medicationCharges)}</td>
                                </tr>
                                <tr>
                                  <td>Other Charges</td>
                                  <td className="text-end">{formatCurrency(billData.otherCharges)}</td>
                                </tr>
                                <tr 
                                  style={{ 
                                    backgroundColor: '#f8f9fa',
                                    fontWeight: '600'
                                  }}
                                >
                                  <td>TOTAL AMOUNT</td>
                                  <td className="text-end">{formatCurrency(billData.totalAmount)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Payment and Notes */}
                        <div className="row g-2" style={{ flex: '0 0 auto' }}>
                          <div className="col-md-6">
                            <div 
                              className="h-100 p-2"
                              style={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '6px',
                                backgroundColor: '#f8f9fa'
                              }}
                            >
                              <h5 
                                className="mb-2 fw-bold"
                                style={{
                                  color: '#1a5276',
                                  paddingBottom: '6px',
                                  borderBottom: '2px solid #1a5276',
                                  fontSize: '16px'
                                }}
                              >
                                <i className="bi bi-credit-card me-2"></i>Payment Information
                              </h5>
                              <div style={{ fontSize: '14px' }}>
                                <p className="mb-1">
                                  <span className="text-muted">Status:</span> 
                                  <span className="badge bg-success ms-2">Paid</span>
                                </p>
                                <p className="mb-1">
                                  <span className="text-muted">Method:</span> 
                                  <span className="ms-2">Cash/Card/UPI</span>
                                </p>
                                <p className="mb-0">
                                  <span className="text-muted">Date:</span> 
                                  <span className="ms-2">{formatDate(billData.billDate)}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div 
                              className="h-100 p-2"
                              style={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '6px',
                                backgroundColor: '#f8f9fa'
                              }}
                            >
                              <h5 
                                className="mb-2 fw-bold"
                                style={{
                                  color: '#1a5276',
                                  paddingBottom: '6px',
                                  borderBottom: '2px solid #1a5276',
                                  fontSize: '16px'
                                }}
                              >
                                <i className="bi bi-info-circle me-2"></i>Important Notes
                              </h5>
                              <ul className="list-unstyled mb-0" style={{ fontSize: '13px' }}>
                                <li className="mb-1 d-flex">
                                  <i className="bi bi-dot text-primary me-1"></i>
                                  <span>This bill includes all taxes</span>
                                </li>
                                <li className="mb-1 d-flex">
                                  <i className="bi bi-dot text-primary me-1"></i>
                                  <span>Prescription attached separately</span>
                                </li>
                                <li className="mb-1 d-flex">
                                  <i className="bi bi-dot text-primary me-1"></i>
                                  <span>Keep this bill for future reference</span>
                                </li>
                                <li className="mb-1 d-flex">
                                  <i className="bi bi-dot text-primary me-1"></i>
                                  <span>Valid for insurance claims</span>
                                </li>
                                <li className="d-flex">
                                  <i className="bi bi-dot text-primary me-1"></i>
                                  <span>For queries, contact billing department</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div 
                      className="text-center mt-2 pt-2"
                      style={{ 
                        borderTop: '1px dashed #ddd',
                        color: '#666',
                        fontSize: '13px'
                      }}
                    >
                      <p className="mb-1">We wish you a speedy recovery and good health!</p>
                      <p className="mb-1">
                        This is a computer-generated bill and does not require a physical signature.
                      </p>
                      <p className="mb-0 fst-italic" style={{ color: '#1a5276' }}>
                        <strong>Healing Touch</strong> – Where Care Comes First.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillPatientView;