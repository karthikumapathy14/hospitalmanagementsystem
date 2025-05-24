import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const DoctorSideEditAppointment = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [appointment, setAppointment] = useState("");
    const [loading, setLoading] = useState(true);

    const [nurses, getnurse] = useState([])

    useEffect(() => {
        if (!id) {
            alert('Invalid appointment ID!');
            return;
        }

        axios
            .get(`https://localhost:7058/api/Doctor/api/appointments/${id}`)
            .then((res) => {
                console.log("Fetched appointment:", res.data);
                setAppointment(res.data);
                // setStatus(res.data.status || '');
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching appointment:', err);
                alert('Invalid appointment ID or failed to fetch!');
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        axios.get("https://localhost:7058/api/Admin/getnurse")
            .then((res) => getnurse(res.data))
            .catch((err) => console.log(err))
    }, [])

    const handleUpdate = (e) => {
        e.preventDefault();

        const payload = {
            appointmentId: appointment.appointmentId,
            status: appointment.status,
            nurseId: parseInt(appointment.nurseId)
        };

        console.log("Sending payload:", payload);

        axios.put(
            `https://localhost:7058/api/Doctor/api/Editappointments/${id}`,
            payload
        )
            .then(() => {
                alert('Appointment updated successfully!');
                navigate('/viewappointment');
            })
            .catch((err) => {
                console.error('Error updating appointment:', err.response?.data || err.message);
                alert('Failed to update appointment');
            });
    };


    if (loading) return <div className="text-center mt-5">Loading...</div>;

    if (!appointment) return <div className="text-danger text-center mt-5">No appointment found</div>;

    console.log(appointment);

    const handleChange = (e) => {
        setAppointment({ ...appointment, [e.target.name]: e.target.value })
    }

    return (
        <div className="container mt-4">
            <h3>Edit Appointment</h3>
            <div className="card p-4 mt-3 shadow">
                <div className="mb-3">
                    <label className="form-label">Patient Name:</label>
                    <input type="text" className="form-control" value={appointment.patientName || ''} disabled />
                </div>
                <div className="mb-3">
                    <label className="form-label">Reason:</label>
                    <input type="text" className="form-control" value={appointment.reason || ''} disabled />
                </div>

                <div className="mb-3">
                    <label className="form-label">Status:</label>
                    <select
                        className="form-select"
                        value={appointment?.status || ''}
                        name='status'
                        onChange={handleChange}
                    >
                        <option value="">-- Select Status --</option>
                        <option value="Schedule">Schedule</option>
                        <option value="Complete">Complete</option>
                        <option value="Cancel">Cancel</option>
                    </select>
                </div >

                <div className='mb-3'>
                    <label className='form-label'>Nurse:</label>
                    <select className='form-select' value={appointment?.nurseId || ''} onChange={handleChange} name='nurseId'>
                        <option value={''}>-select nurse-</option>
                        {nurses.map((item) => <option key={item.id} value={item.id}>{item.userName}</option>)}
                    </select>
                </div>
                <button className="btn btn-success" onClick={handleUpdate}>
                    Update Appointment
                </button>
            </div>
        </div>
    );
};

export default DoctorSideEditAppointment;
