import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Adminnavbar from './Adminnavbar';

const ListDoc = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const handleEdit = (id) => {
        navigate(`/listdoc/${id}`);
    };

    useEffect(() => {
        axios.get('https://localhost:7058/api/Admin/docGetAll')
            .then((res) => setData(res.data))
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className="d-flex" style={{
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
            backgroundImage: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)'
        }}>
            <Adminnavbar />
            <div className="flex-grow-1 p-4 p-lg-5">
                <div className="container">
                    <h2 className="mb-4 mb-lg-5 text-dark" style={{
                        fontWeight: '600',
                        color: '#1e293b'
                    }}>
                        Doctor List
                    </h2>

                    <div className="row g-4">
                        {data.length > 0 ? (
                            data.map((item, id) => (
                                <div className="col-xl-3 col-lg-4 col-md-6" key={id}>
                                    <div className="card h-100" style={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                                        transition: 'all 0.3s ease',
                                        borderRadius: '12px',
                                        ':hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.08)'
                                        }
                                    }}>
                                        <div className="card-body d-flex flex-column p-4">
                                            <div>
                                                <h5 className="card-title mb-3" style={{
                                                    fontWeight: '500',
                                                    color: '#1e293b'
                                                }}>
                                                    Dr. {item.userName}
                                                </h5>

                                                <div className="d-flex align-items-center mb-3">
                                                    <span className="bg-light-primary rounded-circle p-2 me-3">
                                                        <i className="bi bi-envelope text-primary"></i>
                                                    </span>
                                                    <span className="text-muted">{item.email}</span>
                                                </div>

                                                <div className="d-flex align-items-center mb-3">
                                                    <span className="bg-light-success rounded-circle p-2 me-3">
                                                        <i className="bi bi-telephone text-success"></i>
                                                    </span>{console.log(item.department)}
                                                    <span className="text-muted">{item.phoneNo || 'Not provided'}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-3">
                                                    <span className="bg-light-success rounded-circle p-2 me-3">
                                                        <i className="bi bi-building text-info"></i>
                                                    </span>
                                                    <span className="text-muted">
                                                                {item.departmentName || "No department name"}
                                                            </span>
                                                       
                                                   
                                                </div>

                                                {/* {item.department && (
                                                    <div className="d-flex align-items-center mb-3">
                                                        <span className="bg-light-info rounded-circle p-2 me-3">
                                                            <i className="bi bi-building text-info"></i>
                                                        </span>
                                                        <span className="text-muted">
                                                            Department: <span className="text-dark">
                                                                {item.department.departmentName || "No department name"}
                                                            </span>
                                                        </span>
                                                    </div>
                                                )} */}
                                            </div>

                                            <div className="mt-auto pt-3">
                                                <button
                                                    onClick={() => handleEdit(item.id)}
                                                    className="btn btn-light-primary w-100"
                                                    style={{
                                                        borderRadius: '8px',
                                                        border: '1px solid #e2e8f0',
                                                        backgroundColor: '#f1f5f9',
                                                        color: '#3b82f6'
                                                    }}
                                                >
                                                    <i className="bi bi-pencil-square me-2"></i>
                                                    Manage Doctor
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12">
                                <div className="card border-0 p-5 text-center" style={{
                                    backgroundColor: '#ffffff',
                                    border: '1px dashed #e2e8f0',
                                    borderRadius: '12px'
                                }}>
                                    <div className="bg-light-danger rounded-circle p-3 d-inline-block mb-3">
                                        <i className="bi bi-heart-pulse text-danger" style={{ fontSize: '1.75rem' }}></i>
                                    </div>
                                    <h5 className="text-dark mb-2">No doctors found</h5>
                                    <p className="text-muted">Currently there are no doctors in the system</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListDoc;