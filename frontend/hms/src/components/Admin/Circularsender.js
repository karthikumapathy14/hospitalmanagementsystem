import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const rolesList = ["Doctor", "Nurse", "Patient", "Admin", "Receptionist"];

const messageTemplates = {
  urgent: `🚨 Urgent Notice 🚨\n\nPlease take immediate action on the mentioned issue. This is a high-priority concern.\n\nRegards,\nAdmin Team`,
  meeting: `📅 Meeting Reminder\n\nThis is a reminder about the scheduled meeting on [Date] at [Time]. Please be on time.\n\nRegards,\nHR Department`,
  update: `📢 System Update\n\nOur system will undergo maintenance from [Start Time] to [End Time]. You may experience limited access during this period.\n\nThank you for your patience.`,
  holiday: `🎉 Holiday Announcement\n\nWe are pleased to inform you that [Holiday Name] will be observed on [Date]. The hospital will remain closed.\n\nWishing you a happy holiday!`,
  thankyou: `🙏 Thank You Note\n\nThank you for your dedication and commitment. Your contribution is highly appreciated.\n\nBest regards,\nManagement`,
  patientgreeting: `👋 Dear Patient,\n\nWe hope you're feeling better today! Remember, your health is our priority. If you have any concerns or need assistance, don’t hesitate to contact us.\n\nWishing you a speedy recovery!\n\nWarm regards,\nYour Healthcare Team`
};

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
  const [isFetching, setIsFetching] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("https://localhost:7058/api/Admin/departments");
        setDepartments(response.data);
      } catch (error) {
        toast.error("Failed to load departments");
      }
    };
    fetchDepartments();
  }, []);

  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    const updatedRoles = checked
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
      toast.warning("Please select at least one role");
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
        response = await axios.get(`https://localhost:7058/api/Message/emails?${params}`);
      }

      setEmails(response.data);
      setSelectedEmails(response.data);
      toast.success(`Fetched ${response.data.length} emails`);
    } catch (error) {
      toast.error("Failed to fetch emails");
    } finally {
      setIsFetching(false);
    }
  };

  const clearEmails = () => {
    setEmails([]);
    setSelectedEmails([]);
    toast.info("Recipient list cleared");
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (selectedEmails.length === 0) {
      toast.warning("No emails selected");
      return;
    }
    if (!subject || !message) {
      toast.warning("Enter both subject and message");
      return;
    }

    const formattedMessage = message.replace(/\n/g, "<br/>");
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #2E86C1;">${subject}</h2>
        <p>${formattedMessage}</p>
        <hr />
        <p style="font-size: 0.9em; color: #888;">This is an automated message. Please do not reply.</p>
      </div>
    `;

    const payload = {
      emails: selectedEmails,
      subject,
      message: htmlTemplate,
    };

    setIsSending(true);
    try {
      await axios.post("https://localhost:7058/api/Message/send", payload);
      toast.success("Message sent successfully");
      setSubject("");
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const filteredEmails = emails.filter((email) =>
    email.toLowerCase().includes(emailFilter.toLowerCase())
  );

  return (
    <div className="container py-5">
      <ToastContainer theme="colored" />
      <div className="card shadow-sm p-4">
        <h3 className="mb-3 text-primary">Send Circular Message</h3>

        {/* Role selection */}
        <div className="mb-4">
          <label className="form-label fw-bold">Select Roles:</label>
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              checked={selectAll}
              onChange={handleSelectAll}
              id="select-all"
            />
            <label className="form-check-label" htmlFor="select-all">Select All Roles</label>
          </div>
          {rolesList.map((role) => (
            <div key={role} className="form-check form-check-inline">
              <input
                type="checkbox"
                className="form-check-input"
                id={`role-${role}`}
                value={role}
                checked={selectedRoles.includes(role)}
                onChange={handleRoleChange}
              />
              <label className="form-check-label" htmlFor={`role-${role}`}>{role}</label>
            </div>
          ))}
        </div>

        {/* Department selection */}
        {selectedRoles.length === 1 && selectedRoles[0] === "Doctor" && (
          <div className="mb-4">
            <label className="form-label">Department</label>
            <select
              className="form-select"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">-- All Departments --</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.departmentName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Buttons */}
        <div className="mb-4 d-flex gap-2">
          <button className="btn btn-primary" onClick={fetchEmails} disabled={isFetching}>
            {isFetching ? "Fetching..." : "Get Recipients"}
          </button>
          {emails.length > 0 && (
            <button className="btn btn-danger" onClick={clearEmails}>Clear List</button>
          )}
        </div>

        {/* Email List */}
        {emails.length > 0 && (
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span>
                Showing {filteredEmails.length} of {emails.length} emails
              </span>
              <input
                type="text"
                className="form-control form-control-sm w-25"
                placeholder="Filter..."
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
              />
            </div>
            <div className="border p-2" style={{ maxHeight: 200, overflowY: "auto" }}>
              {filteredEmails.map((email, i) => (
                <div key={i} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`email-${i}`}
                    value={email}
                    checked={selectedEmails.includes(email)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSelectedEmails((prev) =>
                        checked ? [...prev, email] : prev.filter((em) => em !== email)
                      );
                    }}
                  />
                  <label className="form-check-label" htmlFor={`email-${i}`}>
                    {email}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Template Dropdown */}
        <div className="mb-4">
          <label className="form-label fw-bold">Choose Message Template</label>
          <select
            className="form-select"
            onChange={(e) => {
              const selected = e.target.value;
              if (messageTemplates[selected]) setMessage(messageTemplates[selected]);
            }}
          >
            <option value="">-- Select Template --</option>
            <option value="urgent">🚨 Urgent Notice</option>
            <option value="meeting">📅 Meeting Reminder</option>
            <option value="update">📢 System Update</option>
            <option value="holiday">🎉 Holiday Announcement</option>
            <option value="thankyou">🙏 Thank You Note</option>
            <option value="patientgreeting">👋 Patient Greeting</option>
          </select>
        </div>

        {/* Compose form */}
        <form onSubmit={sendMessage}>
          <div className="mb-3">
            <label className="form-label fw-bold">Subject</label>
            <input
              type="text"
              className="form-control"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Message</label>
            <textarea
              className="form-control"
              rows="6"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          {/* Live Preview */}
          {message && (
            <div className="border rounded p-3 bg-light mb-3">
              <h6 className="text-secondary">Live Preview:</h6>
              <div dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, "<br/>") }} />
            </div>
          )}

          <div className="d-grid">
            <button className="btn btn-success btn-lg" type="submit" disabled={isSending}>
              {isSending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageSender;
