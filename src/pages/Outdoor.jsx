import React from 'react';
import { Link } from 'react-router-dom';

export default function Outdoor() {
  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>Outdoor (OPD) Medical Services</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">Outdoor Services</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row align-items-center mb-5">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h2 className="font-weight-bold text-dark mb-3">Outpatient Consultation & Clinics</h2>
            <p className="text-muted leading-relaxed">
              Our Outpatient Department (OPD) offers consultations with over 400 distinguished specialist consultants spanning all disciplines. We maintain organized appointment schedules to minimize patient waiting times and provide comfortable, air-conditioned consultation chambers.
            </p>
            <h5 className="font-weight-bold text-dark mt-4 mb-3">OPD Department Features:</h5>
            <ul className="text-muted pl-4">
              <li>Open daily (except Friday) across morning, afternoon, and evening shifts</li>
              <li>Emergency Outpatient department operational 24/7/365</li>
              <li>Dedicated registration and serial booking counters</li>
              <li>Rapid diagnostic testing with same-day report delivery for routine tests</li>
              <li>Adjacent outpatient pharmacy and dressing/minor OT rooms</li>
            </ul>
          </div>
          <div className="col-lg-6 text-center">
            <img src="/pmch/img/outdoor.jpg" alt="Outdoor Services" className="img-fluid rounded shadow" />
          </div>
        </div>

        <div className="card shadow-sm border-0 p-4 bg-light text-center">
          <h4 className="font-weight-bold text-dark mb-2">Book Your Doctor Serial Online or Over Phone</h4>
          <p className="text-muted mb-3">Avoid long waiting queues by booking your doctor serial in advance.</p>
          <div>
            <Link to="/package" className="btn btn-primary mr-2 font-weight-bold">Browse Doctor Schedules</Link>
            <a href="tel:09666787800" className="btn btn-success font-weight-bold">
              <i className="fas fa-phone mr-1"></i> Call 09666 787800
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
