import React, { useState, useEffect } from "react";
import axios from "axios";

const rolesList = ["Doctor", "Nurse", "Patient", "Admin", "Receptionist"];

const MessageSender = () => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [emails, setEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isFetching, setIsFetching] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("https://localhost:7058/api/Admin/departments");
        setDepartments(response.data);

      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);
  
  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    let updatedRoles = checked
      ? [...selectedRoles, value]
      : selectedRoles.filter((role) => role !== value);

    setSelectedRoles(updatedRoles);
    setSelectAll(updatedRoles.length === rolesList.length);
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    setSelectedRoles(isChecked ? [...rolesList] : []);
  };

  const fetchEmails = async () => {
    if (selectedRoles.length === 0) {
      setStatus({ type: "danger", message: "Please select at least one role." });
      return;
    }

    setIsFetching(true);
    try {
      let response;

      if (selectedRoles.length === 1 && selectedRoles[0] === "Doctor" && selectedDepartment) {
        response = await axios.get(
          `https://localhost:7058/api/Admin/emailsbydepartment?department=${selectedDepartment}`
        );
      } else {
        const params = new URLSearchParams();
        selectedRoles.forEach((role) => params.append("role", role));
        response = await axios.get(`https://localhost:7058/api/Message/emails?${params.toString()}`);
      }

      setEmails(response.data);
      setSelectedEmails(response.data);
      setStatus({ type: "success", message: `${response.data.length} emails fetched successfully.` });
    } catch (error) {
      console.error("Error fetching emails:", error);
      setStatus({ type: "danger", message: "Failed to fetch emails." });
    } finally {
      setIsFetching(false);
    }
  };

  const clearEmails = () => {
    setEmails([]);
    setSelectedEmails([]);
    setStatus({ type: "info", message: "Recipient list cleared." });
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (selectedEmails.length === 0) {
      setStatus({ type: "warning", message: "No emails selected to send." });
      return;
    }

    setIsSending(true);
    const payload = {
      emails: selectedEmails,
      subject,
      message,
    };

    try {
      await axios.post("https://localhost:7058/api/Message/send", payload);
      setStatus({
        type: "success",
        message: `Email sent successfully to ${selectedEmails.length} recipients!`,
      });
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error sending:", error);
      setStatus({ type: "danger", message: "Failed to send email." });
    } finally {
      setIsSending(false);
    }
  };

  const filteredEmails = emails.filter((email) =>
    email.toLowerCase().includes(emailFilter.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="h4 mb-0">Circular Sender</h2>
            </div>

            <div className="card-body p-4">
              {status.message && (
                <div className={`alert alert-${status.type} alert-dismissible fade show mb-4`}>
                  {status.message}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setStatus({ type: "", message: "" })}
                  ></button>
                </div>
              )}

              {/* Role Selection */}
              <div className="mb-4">
                <h5 className="mb-3">Select Recipient Roles</h5>
                <div className="d-flex flex-column gap-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="select-all"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    <label className="form-check-label fw-bold" htmlFor="select-all">
                      Select All
                    </label>
                  </div>
                  <div className="d-flex flex-wrap gap-3">
                    {rolesList.map((role) => (
                      <div className="form-check" key={role}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`role-${role}`}
                          value={role}
                          onChange={handleRoleChange}
                          checked={selectedRoles.includes(role)}
                        />
                        <label className="form-check-label fw-medium" htmlFor={`role-${role}`}>
                          {role}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Department filter for Doctor */}
              {selectedRoles.length === 1 && selectedRoles.includes("Doctor") && (
                <div className="mb-4">
                  <label className="form-label fw-medium">Filter by Department</label>
                  <select
                    className="form-select"
                    
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.departmentName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Fetch Recipients */}
              <div className="d-grid mb-4">
                <button
                  className={`btn btn-primary ${isFetching ? "disabled" : ""}`}
                  onClick={fetchEmails}
                  disabled={selectedRoles.length === 0 || isFetching}
                >
                  {isFetching ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Fetching...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-people-fill me-2"></i>
                      Fetch Recipients
                    </>
                  )}
                </button>
              </div>

              {/* Email List */}
              {emails.length > 0 && (
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0">
                      Recipient List ({selectedEmails.length}/{emails.length}) • Showing {filteredEmails.length}
                    </h5>
                    <button className="btn btn-outline-danger btn-sm" onClick={clearEmails}>
                      <i className="bi bi-x-circle me-1"></i> Clear Recipients
                    </button>
                  </div>

                  {/* Email Filter Input */}
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search email..."
                      value={emailFilter}
                      onChange={(e) => setEmailFilter(e.target.value)}
                    />
                  </div>

                  <div className="border rounded p-3 bg-light" style={{ maxHeight: "200px", overflowY: "auto" }}>
                    <div className="row row-cols-1 row-cols-md-2 g-2">
                      {filteredEmails.map((email, idx) => (
                        <div key={idx} className="col">
                          <div className="form-check bg-white p-2 rounded">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`email-${idx}`}
                              value={email}
                              checked={selectedEmails.includes(email)}
                              onChange={(e) => {
                                const { checked, value } = e.target;
                                setSelectedEmails((prev) =>
                                  checked ? [...prev, value] : prev.filter((em) => em !== value)
                                );
                              }}
                            />
                            <label className="form-check-label text-truncate" htmlFor={`email-${idx}`}>
                              <small>{email}</small>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Compose Message */}
              <form onSubmit={sendMessage}>
                <h5 className="mb-3">Compose Message</h5>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label fw-medium">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    placeholder="Enter email subject"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="message" className="form-label fw-medium">
                    Message
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="5"
                    required
                    placeholder="Write your message here..."
                  />
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className={`btn btn-success ${isSending ? "disabled" : ""}`}
                    disabled={selectedEmails.length === 0 || isSending}
                  >
                    {isSending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send-fill me-2"></i>
                        Send Email
                      </>
                    )}
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

export default MessageSender;
