import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { usePDF } from 'react-to-pdf';

const BillPatientView = () => {
  const [billData, setBillData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const { toPDF, targetRef } = usePDF({ filename: 'medical-bill.pdf' });

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
          <div className="col-lg-10 col-xl-8">
            {/* Download PDF button (excluded from PDF) */}
            <div className="d-flex justify-content-end gap-2 mb-3">
              <button 
                className="btn btn-outline-primary"
                onClick={() => toPDF()}
              >
                <i className="bi bi-file-earmark-pdf me-2"></i>Download PDF
              </button>
            </div>

            {/* PDF content starts here */}
            <div 
              ref={targetRef} 
              style={{ width: '794px', margin: '0 auto', backgroundColor: '#fff' }}
            >
              <div className="card shadow-sm border-0 overflow-hidden">
                <div className="bg-primary text-white p-2 text-center">
                  <h2 className="h3 fw-bold mb-1">Healing Touch Multi-Specialty Hospital</h2>
                  <p className="mb-0 opacity-75">123, Health Street, Wellness City, India - 560001</p>
                  <div className="d-flex justify-content-center gap-3 mt-2">
                    <small><i className="bi bi-telephone me-1"></i> +91-9876543210</small>
                    <small><i className="bi bi-envelope me-1"></i> contact@healingtouch.com</small>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger text-center rounded-0 mb-0">
                    {error}
                  </div>
                )}

                {billData && (
                  <div className="p-2 p-md-2">
                    <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
                      <div>
                        <h3 className="h4 fw-bold text-primary">MEDICAL BILL</h3>
                        <p className="text-muted mb-0">Bill No: <span className="fw-bold">{billData.billId}</span></p>
                      </div>
                      <div className="text-end">
                        <p className="mb-1"><span className="text-muted">Date:</span> <strong>{formatDate(billData.billDate)}</strong></p>
                        <p className="mb-0"><span className="text-muted">Appointment:</span> <strong>{billData.appointmentId}</strong></p>
                      </div>
                    </div>

                    <div className="alert alert-info bg-light border-0 mb-1">
                      <p className="mb-0">
                        Dear <strong>{billData.patientName}</strong>,<br />
                        Thank you for choosing Healing Touch Hospital. Below is your detailed medical bill.
                      </p>
                    </div>

                    <div className="row mb-2">
                      <div className="col-md-6 mb-0 mb-md-0">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="card-header bg-light">
                            <h5 className="mb-0 fw-bold"><i className="bi bi-person me-2"></i>Patient Details</h5>
                          </div>
                          <div className="card-body">
                            <ul className="list-unstyled mb-0">
                              <li className="mb-2"><strong>ID:</strong> {billData.patientId}</li>
                              <li className="mb-2"><strong>Name:</strong> {billData.patientName}</li>
                              <li className="mb-2"><strong>Age/Gender:</strong> {billData.age}/{billData.gender}</li>
                              <li className="mb-2"><strong>Blood Group:</strong> {billData.bloodGroup}</li>
                              <li className="mb-2"><strong>Contact:</strong> {billData.patientPhone}</li>
                              <li className="mb-2"><strong>Email:</strong> {billData.patientEmail}</li>
                              <li><strong>Address:</strong> {billData.patientAddress}</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="card-header bg-light">
                            <h5 className="mb-0 fw-bold"><i className="bi bi-heart-pulse me-2"></i>Medical Details</h5>
                          </div>
                          <div className="card-body">
                            <ul className="list-unstyled mb-0">
                              <li className="mb-2"><strong>Doctor:</strong> Dr. {billData.doctorName}</li>
                              <li className="mb-2"><strong>Department:</strong> {billData.departmentName}</li>
                              <li className="mb-2"><strong>Appointment Date:</strong> {formatDate(billData.appointmentDate)}</li>
                              <li className="mb-2"><strong>Time:</strong> {billData.appointmentTime}</li>
                              <li className="mb-2"><strong>Reason:</strong> {billData.reason}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card border-0 shadow-sm mb-2">
                      <div className="card-header bg-light">
                        <h5 className="mb-0 fw-bold"><i className="bi bi-receipt me-2"></i>Charges Breakdown</h5>
                      </div>
                      <div className="card-body p-0">
                        <div className="table-responsive">
                          <table className="table table-hover mb-0">
                            <thead className="table-light">
                              <tr>
                                <th width="70%">Description</th>
                                <th width="30%" className="text-end">Amount</th>
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
                              <tr className="table-active fw-bold">
                                <td>TOTAL AMOUNT</td>
                                <td className="text-end">{formatCurrency(billData.totalAmount)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-2 mb-md-0">
                        <div className="card border-0 shadow-sm h-100">
                          <div className="card-header bg-light">
                            <h5 className="mb-0 fw-bold"><i className="bi bi-credit-card me-2"></i>Payment Information</h5>
                          </div>
                          <div className="card-body">
                            <p className="mb-2"><strong>Payment Status:</strong> <span className="badge bg-success">Paid</span></p>
                            <p className="mb-0"><strong>Payment Method:</strong> Cash/Card/UPI</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card border-0 shadow-sm h-100">
                          <div className="card-header bg-light">
                            <h5 className="mb-0 fw-bold"><i className="bi bi-info-circle me-2"></i>Important Notes</h5>
                          </div>
                          <div className="card-body">
                            <ul className="list-unstyled small mb-0">
                              <li className="mb-1">• This bill includes all taxes</li>
                              <li className="mb-1">• Prescription attached separately</li>
                              <li>• Keep this bill for future reference</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-2 pt-1 border-top">
                      <p className="text-muted mb-0">We wish you a speedy recovery and good health!</p>
                      <p className="small text-muted mb-0">
                        This is a computer-generated bill and does not require a physical signature.
                      </p>
                      <p className="small fst-italic text-primary mt-0">
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
