import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";
import "./DoctorAvailabilityForm.css"; 

const DoctorAvailibility = () => {
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const doctorId = decodedToken?.DoctorId;

  const [availability, setAvailability] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    startTime: "09:00",
    endTime: "17:00",
    bufferBefore: 15,
    bufferAfter: 15,
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAvailability((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date, field) => {
    setAvailability((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handlePreset = (e) => {
    const [start, end] = e.target.value.split("-");
    if (start && end) {
      setAvailability((prev) => ({
        ...prev,
        startTime: start,
        endTime: end,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, message: "", variant: "success" });

    if (new Date(availability.startDate) > new Date(availability.endDate)) {
      setAlert({
        show: true,
        message: "End date must be after start date.",
        variant: "danger",
      });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...availability,
        doctorId: parseInt(doctorId),
      };

      await axios.post("https://localhost:7058/api/Doctor/availability", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAlert({
        show: true,
        message: "Availability saved successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error("Error saving availability:", error);
      setAlert({
        show: true,
        message: "Failed to save availability. Please check your token and try again.",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header className="text-center bg-primary text-white">
              Set Your Availability
            </Card.Header>
            <Card.Body>
              {alert.show && (
                <Alert
                  variant={alert.variant}
                  dismissible
                  onClose={() => setAlert({ ...alert, show: false })}
                >
                  {alert.message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Start Date</Form.Label>
                    <DatePicker
                      selected={availability.startDate}
                      onChange={(date) => handleDateChange(date, "startDate")}
                      className="form-control"
                      minDate={new Date()}
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>End Date</Form.Label>
                    <DatePicker
                      selected={availability.endDate}
                      onChange={(date) => handleDateChange(date, "endDate")}
                      className="form-control"
                      minDate={availability.startDate}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      type="time"
                      name="startTime"
                      value={availability.startTime}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      type="time"
                      name="endTime"
                      value={availability.endTime}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Preset Time Slots</Form.Label>
                    <Form.Select onChange={handlePreset}>
                      <option value="">-- Select preset --</option>
                      <option value="09:00-13:00">Morning (9 AM – 1 PM)</option>
                      <option value="14:00-18:00">Afternoon (2 PM – 6 PM)</option>
                      <option value="10:00-16:00">Midday (10 AM – 4 PM)</option>
                    </Form.Select>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Buffer Before (minutes)</Form.Label>
                    <Form.Control
                      type="number"
                      name="bufferBefore"
                      value={availability.bufferBefore}
                      onChange={handleChange}
                      min="0"
                      max="60"
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Buffer After (minutes)</Form.Label>
                    <Form.Control
                      type="number"
                      name="bufferAfter"
                      value={availability.bufferAfter}
                      onChange={handleChange}
                      min="0"
                      max="60"
                    />
                  </Form.Group>
                </Row>

                <div className="d-grid">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" /> Saving...
                      </>
                    ) : (
                      "Save Availability"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorAvailibility;
