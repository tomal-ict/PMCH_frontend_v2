import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>About Popular Medical College Hospital</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">About Us</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row align-items-center mb-5">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h2 className="font-weight-extra-bold text-dark mb-3">At A Glance</h2>
            <p className="lead text-muted">
              Popular Medical College Hospital (PMCH) is a premier tertiary healthcare institution established under the renowned Popular Group in Dhanmondi, Dhaka.
            </p>
            <p className="text-muted leading-relaxed">
              Established with the vision to provide high-quality medical education and healthcare services at an affordable cost, PMCH combines academic excellence with compassionate clinical care. Our hospital features comprehensive in-patient and out-patient departments, round-the-clock emergency and trauma care, specialized modular operation theatres, and intensive care units.
            </p>
          </div>
          <div className="col-lg-6 text-center">
            <img src="/pmch/img/slides/slider-building.jpg" alt="PMCH Building" className="img-fluid rounded shadow" />
          </div>
        </div>

        {/* Vision, Mission, Values */}
        <div className="row mb-5">
          <div className="col-md-4 mb-4">
            <div className="card h-100 p-4 border-0 shadow-sm text-center">
              <div className="mb-3 text-primary">
                <i className="fas fa-eye fa-3x"></i>
              </div>
              <h4 className="font-weight-bold text-dark">Our Vision</h4>
              <p className="text-muted small mb-0">
                To be the center of excellence in medical care, healthcare education, and clinical research, maintaining the highest ethical and quality standards in South Asia.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 p-4 border-0 shadow-sm text-center">
              <div className="mb-3 text-primary">
                <i className="fas fa-bullseye fa-3x"></i>
              </div>
              <h4 className="font-weight-bold text-dark">Our Mission</h4>
              <p className="text-muted small mb-0">
                To deliver patient-centric, empathetic, and evidence-based clinical treatments while fostering an inspiring environment for doctors, nurses, and medical trainees.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 p-4 border-0 shadow-sm text-center">
              <div className="mb-3 text-primary">
                <i className="fas fa-heart fa-3x"></i>
              </div>
              <h4 className="font-weight-bold text-dark">Core Values</h4>
              <p className="text-muted small mb-0">
                Integrity, clinical transparency, patient safety, uncompromising commitment to quality, and continuous innovation in treatment modalities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
