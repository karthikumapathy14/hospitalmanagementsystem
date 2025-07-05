import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Common/Homepage.css"
import d1 from "../image/qcGc-Photoroom.png";
import d2 from "../image/7f7955a81f8a0a76fb3ebbdbed63477c.jpg"
import d3 from "../image/65c083be05f55430af5959a62b16cd07.jpg";
import d4 from "../image/indian-doctor-mature-male-medical-standing-isolated-white-background-handsome-model-portrait-31871541.jpg";
 import { FaHeartbeat,
  FaClinicMedical,
  FaProcedures,
  FaUserMd,
  FaHospital,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaAmbulance,
  FaCalendarAlt,
  FaUserNurse,
  FaStethoscope,
  FaBaby,
  FaPills,
  FaXRay,
  FaWheelchair,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn
} from "react-icons/fa";

const App = () => {

  const [physiciansCount, setPhysiciansCount] = useState(0);
  const [specialtiesCount, setSpecialtiesCount] = useState(0);
  const [nursingCount, setNursingCount] = useState(0);
  const [emergencyCount, setEmergencyCount] = useState(0);
  const countersRef = useRef(null);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          animateCount(250, setPhysiciansCount);
          animateCount(50, setSpecialtiesCount);
          animateCount(500, setNursingCount);
          animateCount(24, setEmergencyCount);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (countersRef.current) {
      observer.observe(countersRef.current);
    }

    return () => {
      if (countersRef.current) {
        observer.unobserve(countersRef.current);
      }
    };
  }, []);

  const animateCount = (target, setter, duration = 1500) => {
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(easedProgress * target);

      setter(current);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setter(target);
      }
    };

    requestAnimationFrame(updateCount);
  };


  const specialties = [
    {
      icon: <FaHeartbeat className="display-4 text-danger" />,
      title: "Cardiology",
      description: "Comprehensive cardiac care with advanced diagnostics and rehabilitation programs.",
      link: "#cardiology"
    },
    {
      icon: <FaProcedures className="display-4 text-primary" />,
      title: "Surgery",
      description: "State-of-the-art surgical suites for various procedures.",
      link: "#surgery"
    },
    {
      icon: <FaStethoscope className="display-4 text-success" />,
      title: "Pediatrics",
      description: "Specialized care for infants, children, and adolescents.",
      link: "#pediatrics"
    },
    {
      icon: <FaUserMd className="display-4 text-info" />,
      title: "Internal Medicine",
      description: "Personalized healthcare for adults with complex diseases.",
      link: "#internal-medicine"
    },
    {
      icon: <FaBaby className="display-4 text-warning" />,
      title: "Obstetrics & Gynecology",
      description: "Comprehensive women's health services including prenatal care.",
      link: "#obgyn"
    },
    {
      icon: <FaPills className="display-4 text-secondary" />,
      title: "Oncology",
      description: "Multidisciplinary cancer care with advanced treatments.",
      link: "#oncology"
    },
    {
      icon: <FaXRay className="display-4 text-dark" />,
      title: "Radiology",
      description: "Advanced imaging services including MRI and CT scans.",
      link: "#radiology"
    },
    {
      icon: <FaWheelchair className="display-4 text-success" />,
      title: "Rehabilitation",
      description: "Therapy services to help patients regain independence.",
      link: "#rehabilitation"
    }
  ];

  const facilities = [
    { name: "Advanced Diagnostic Center", icon: <FaXRay /> },
    { name: "24/7 Pharmacy", icon: <FaPills /> },
    { name: "Labor & Delivery Suites", icon: <FaBaby /> },
    { name: "Intensive Care Units", icon: <FaHeartbeat /> },
    { name: "Physical Therapy Center", icon: <FaWheelchair /> },
    { name: "Cafeteria & Lounges", icon: <FaClinicMedical /> },
    { name: "On-site Laboratory", icon: <FaClinicMedical /> },
    { name: "Emergency Trauma Center", icon: <FaAmbulance /> }
  ];

  const doctors = [
    {
      name: "Dr. Sri Venkatesan",
      specialty: "Cardiologist",
      image: d2
    },
    {
      name: "Dr. Kamalesh Sathyamurthi",
      specialty: "Neurosurgeon",
      image: d4
    },
    {
      name: "Dr. Kowsi Karthik",
      specialty: "Pediatrician",
      image: d1
    },
    {
      name: "Dr. Yeswanth Bawan",
      specialty: "Orthopedic Surgeon",
      image: d3
    }
  ];


  const testimonials = [
    {
      quote: "The care I received was exceptional. The staff was attentive and facilities top-notch.",
      author: "Sarah Thompson",
      role: "Cardiac Patient",
      image: "https://randomuser.me/api/portraits/women/43.jpg",
      rating: 5
    },
    {
      quote: "Every team member was professional and compassionate throughout my treatment.",
      author: "James Wilson",
      role: "Orthopedic Patient",
      image: "https://randomuser.me/api/portraits/men/65.jpg",
      rating: 5
    },
    {
      quote: "The pediatric team was amazing with my daughter. Highly recommend!",
      author: "Lisa Rodriguez",
      role: "Parent",
      image: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 5
    }
  ];

  return (
    <div className="hospital-website">


      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold d-flex align-items-center" >
            <FaHospital className="text-primary me-2" size={28} />
            <span className="fs-4">MedCare Hospital</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link fw-medium" href="#Home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium" href="#About">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium" href="#services">Services</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium" href="#doctors">Doctors</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium" href="#contact">Contact</a>
              </li>
            </ul>

            <Link to="/login" className="btn btn-primary ms-lg-3 mt-2 mt-lg-0">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-medical position-relative overflow-hidden" id="Home">
        <div className="hero-background position-absolute w-100 h-100">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
            alt="Modern hospital facility"
            className="w-100 h-100 object-fit-cover"
            style={{ objectPosition: 'center center' }}
          />
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-overlay"></div>
        </div>

        {/* Content Container */}
        <div className="container position-relative d-flex align-items-center" style={{ minHeight: "80vh" }}>
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center text-lg-start">
              {/*  Heading  */}
              <h1 className="hero-heading display-3 fw-bold text-white mb-4">
                Exceptional Care for Life
              </h1>

              {/* Subtitlet */}
              <div className="hero-subtitle-wrapper position-relative mb-5">
                <p className="lead text-white mb-0">
                  At MedCare Hospital, we blend world-class medical expertise with heartfelt compassion to provide exceptional healthcare services.
                </p>
                <div className="decorative-line"></div>
              </div>

             
            </div>
          </div>
        </div>

  
        <div className="floating-elements">
          <div className="floating-circle circle-1"></div>
          <div className="floating-circle circle-2"></div>
          <div className="floating-circle circle-3"></div>
        </div>
      </section>

      {/* About */}
      <section className="py-5 bg-light" id="About">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="pe-lg-5">
                <h2 className="fw-bold mb-4 display-5">About MedCare Hospital</h2>
                <p className="lead mb-4">
                  Founded in 1985, MedCare Hospital has grown to become a leading healthcare provider in the region, recognized for clinical excellence and patient-centered care.
                </p>
                <p className="mb-4">
                  Our 350-bed facility houses state-of-the-art technology and a team of highly skilled medical professionals dedicated to delivering exceptional healthcare services across all major specialties.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <a href="#services" className="btn btn-primary">
                    Our Services
                  </a>

                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="rounded-4 overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop"
                  alt="Hospital Building"
                  className="img-fluid w-100"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={countersRef} className="py-5">
        <div className="container py-4">
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100 text-center p-4 hover-effect">
                <div className="card-body">
                  <FaUserMd className="fs-1 mb-3 text-primary" />
                  <h3 className="fw-bold display-5">{physiciansCount}+</h3>
                  <p className="mb-0 text-muted">Expert Physicians</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100 text-center p-4 hover-effect">
                <div className="card-body">
                  <FaProcedures className="fs-1 mb-3 text-success" />
                  <h3 className="fw-bold display-5">{specialtiesCount}+</h3>
                  <p className="mb-0 text-muted">Medical Specialties</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100 text-center p-4 hover-effect">
                <div className="card-body">
                  <FaUserNurse className="fs-1 mb-3 text-info" />
                  <h3 className="fw-bold display-5">{nursingCount}+</h3>
                  <p className="mb-0 text-muted">Nursing Staff</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100 text-center p-4 hover-effect">
                <div className="card-body">
                  <FaAmbulance className="fs-1 mb-3 text-danger" />
                  <h3 className="fw-bold display-5">{emergencyCount}/7</h3>
                  <p className="mb-0 text-muted">Emergency Care</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Services */}
      <section id="services" className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-5">Our Medical Specialties</h2>
            <p className="lead text-muted">
              Comprehensive healthcare services across all major specialties
            </p>
          </div>
          <div className="row g-4">
            {specialties.map((spec, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div className="card border-0 h-100 shadow-sm text-center p-4 hover-effect">
                  <div className="mb-3">{spec.icon}</div>
                  <h5 className="fw-bold">{spec.title}</h5>
                  <p className="text-muted mb-3">{spec.description}</p>
                  <a href={spec.link} className="btn btn-sm btn-outline-primary">
                    Learn More
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-5">Our Facilities</h2>
            <p className="lead text-muted">
              Modern amenities designed for patient comfort and care
            </p>
          </div>
          <div className="row g-4">
            {facilities.map((facility, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div className="card border-0 h-100 shadow-sm p-4 text-center">
                  <div className="text-primary mb-3 fs-1">{facility.icon}</div>
                  <h5 className="fw-bold">{facility.name}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor */}
      <section id="doctors" className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-5">Meet Our Specialists</h2>
            <p className="lead text-muted">
              Board-certified physicians dedicated to your health
            </p>
          </div>
          <div className="row g-4">
            {doctors.map((doctor, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div className="card border-0 h-100 shadow-sm overflow-hidden">
                  <div className="ratio ratio-1x1">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="object-fit-cover"
                    />
                  </div>
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold">{doctor.name}</h5>
                    <p className="card-text text-muted">{doctor.specialty}</p>
                    <button className="btn btn-sm btn-outline-primary">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-5 text-white">
        <div className="container py-5">
          <div className="text-center text-black mb-5">
            <h2 className="fw-bold display-5">Patient Testimonials</h2>
            <p className="lead opacity-75">What our patients say about us</p>
          </div>
          <div className="row g-4">
            {testimonials.map((testimonial, index) => (
              <div className="col-md-4" key={index}>
                <div className="card border-0 h-100 p-4 bg-dark bg-opacity-25">
                  <div className="mb-3 text-warning">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="mb-4 fst-italic">"{testimonial.quote}"</p>
                  <div className="d-flex align-items-center mt-auto">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="rounded-circle me-3"
                      width="50"
                      height="50"
                    />
                    <div>
                      <h6 className="mb-0 fw-bold">{testimonial.author}</h6>
                      <small className="opacity-75">{testimonial.role}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Contact  */}
      <section id="contact" className="py-5 bg-light">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-5">Contact Information</h2>
            <p className="lead text-muted">Reach us anytime through our various channels</p>
          </div>

          <div className="row g-4">
            {/* Address */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 hover-effect">
                <div className="card-body text-center p-4">
                  <div className="icon-container bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <FaMapMarkerAlt className="fs-3 text-primary" />
                  </div>
                  <h5 className="fw-bold mb-3">Location</h5>
                  <p className="mb-0">
                    123 Health Avenue<br />
                    Wellness District<br />
                    Medical City, MC 12345
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 hover-effect">
                <div className="card-body text-center p-4">
                  <div className="icon-container bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <FaPhone className="fs-3 text-success" />
                  </div>
                  <h5 className="fw-bold mb-3">Contact Numbers</h5>
                  <p className="mb-1">
                    <strong>Main:</strong> 9865741025
                  </p>
                  <p className="mb-1">
                    <strong>Emergency:</strong> 9748557211
                  </p>
                  <p className="mb-0">
                    <strong>Appointments:</strong> 7884965754
                  </p>
                </div>
              </div>
            </div>

            {/* Hours  */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 hover-effect">
                <div className="card-body text-center p-4">
                  <div className="icon-container bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <FaClock className="fs-3 text-info" />
                  </div>
                  <h5 className="fw-bold mb-3">Operating Hours</h5>
                  <p className="mb-1">
                    <strong>Emergency:</strong> 24/7
                  </p>
                  <p className="mb-1">
                    <strong>Outpatient:</strong> Mon-Fri 8am-8pm
                  </p>
                  <p className="mb-0">
                    <strong>Visiting:</strong> 10am-8pm daily
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <div className="container py-4">
          <div className="row g-5">
            <div className="col-lg-4">
              <div className="d-flex align-items-center mb-4">
                <FaHospital className="text-primary me-2 fs-2" />
                <span className="fs-4 fw-bold">MedCare Hospital</span>
              </div>
              <p className="mb-4">
                Providing exceptional healthcare services to our community for over
                35 years. Accredited by the Joint Commission and recognized for
                clinical excellence.
              </p>
              <div className="d-flex gap-3">
                <a href="#" className="text-white opacity-75 hover-opacity-100">
                  <FaFacebookF />
                </a>
                <a href="#" className="text-white opacity-75 hover-opacity-100">
                  <FaTwitter />
                </a>
                <a href="#" className="text-white opacity-75 hover-opacity-100">
                  <FaInstagram />
                </a>
                <a href="#" className="text-white opacity-75 hover-opacity-100">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
            <div className="col-lg-2 col-md-4">
              <h6 className="fw-bold mb-4">Quick Links</h6>
              <ul className="nav flex-column">
                <li className="nav-item mb-2">
                  <a href="#Home" className="nav-link p-0 text-white-50">Home</a>
                </li>
                <li className="nav-item mb-2">
                  <a href="#services" className="nav-link p-0 text-white-50">Services</a>
                </li>
                <li className="nav-item mb-2">
                  <a href="#doctors" className="nav-link p-0 text-white-50">Doctors</a>
                </li>
                <li className="nav-item mb-2">
                  <a href="#contact" className="nav-link p-0 text-white-50">Contact</a>
                </li>
                <li className="nav-item mb-2">
                  <Link to="/login" className="nav-link p-0 text-white-50">Login Portal</Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-4">
              <h6 className="fw-bold mb-4">Services</h6>
              <ul className="nav flex-column">
                <li className="nav-item mb-2">
                  <a href="#" className="nav-link p-0 text-white-50">Emergency Care</a>
                </li>
                <li className="nav-item mb-2">
                  <a href="#" className="nav-link p-0 text-white-50">Primary Care</a>
                </li>
                <li className="nav-item mb-2">
                  <a href="#" className="nav-link p-0 text-white-50">Surgical Services</a>
                </li>
                <li className="nav-item mb-2">
                  <a href="#" className="nav-link p-0 text-white-50">Women's Health</a>
                </li>
                <li className="nav-item mb-2">
                  <a href="#" className="nav-link p-0 text-white-50">Diagnostics</a>
                </li>
              </ul>
            </div>

          </div>
          <hr className="my-4 border-secondary" />
          <div className="row">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0">
                © 2025 MedCare Hospital. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <ul className="nav justify-content-center justify-content-md-end">
                <li className="nav-item">
                  <a href="#" className="nav-link px-2 text-white-50">Privacy Policy</a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link px-2 text-white-50">Terms of Use</a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link px-2 text-white-50">Accessibility</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;