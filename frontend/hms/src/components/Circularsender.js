import React, { useState } from "react";
import axios from "axios";

const rolesList = ["Doctor", "Nurse", "Patient", "Admin", "Receptionist"];

const MessageSender = () => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [subject, setSubject] = useState("");
 
  const [message, setMessage] = useState("");
  const [emails, setEmails] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isFetching, setIsFetching] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    setSelectedRoles((prev) =>
      checked ? [...prev, value] : prev.filter((role) => role !== value)
    );
  };

  const fetchEmails = async () => {
    if (selectedRoles.length === 0) {
      setStatus({ type: "danger", message: "Please select at least one role." });
      return;
    }

    setIsFetching(true);
    const params = new URLSearchParams();
    selectedRoles.forEach((role) => params.append("role", role));

    try {
      const response = await axios.get(
        `https://localhost:7058/api/Message/emails?${params.toString()}`
      );
      setEmails(response.data);
      setStatus({ type: "success", message: `${response.data.length} emails fetched successfully.` });
    } catch (error) {
      console.error("Error fetching emails:", error);
      setStatus({ type: "danger", message: "Failed to fetch emails." });
    } finally {
      setIsFetching(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (emails.length === 0) {
      setStatus({ type: "warning", message: "No emails fetched. Please fetch recipients first." });
      return;
    }

    setIsSending(true);
    const payload = {
      emails,
      subject,

      message,
    };

    try {
      await axios.post("https://localhost:7058/api/Message/send", payload);
      setStatus({ type: "success", message: `Email sent successfully to ${emails.length} recipients!` });
      // Clear form after successful send
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error sending:", error);
      setStatus({ type: "danger", message: "Failed to send email." });
    } finally {
      setIsSending(false);
    }
  };

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

              <div className="mb-4">
                <h5 className="mb-3">Select Recipient Roles</h5>
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

              {emails.length > 0 && (
                <div className="mb-4">
                  <h5 className="mb-3">Recipient List ({emails.length})</h5>
                  <div className="border rounded p-3 bg-light" style={{ maxHeight: "200px", overflowY: "auto" }}>
                    <div className="row row-cols-1 row-cols-md-2 g-2">
                      {emails.map((email, idx) => (
                        <div key={idx} className="col">
                          <div className="bg-white p-2 rounded text-truncate">
                            <small>{email}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

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
                    disabled={emails.length === 0 || isSending}
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