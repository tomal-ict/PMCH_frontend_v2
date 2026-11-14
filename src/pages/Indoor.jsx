import React from 'react';
import { Link } from 'react-router-dom';

export default function Indoor() {
  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>Indoor Medical Services</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">Indoor Services</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row align-items-center mb-5">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h2 className="font-weight-bold text-dark mb-3">Comprehensive Inpatient Healthcare</h2>
            <p className="text-muted leading-relaxed">
              Popular Medical College Hospital provides comprehensive indoor treatment facilities across all core medical and surgical specialties. Our dedicated indoor wings are staffed by registered resident medical officers (RMOs), experienced nursing staff, and specialized critical care teams.
            </p>
            <h5 className="font-weight-bold text-dark mt-4 mb-3">Specialized Inpatient Units Include:</h5>
            <ul className="text-muted pl-4">
              <li>General Medicine & Nephrology Wards</li>
              <li>General & Laparoscopic Surgery Wards</li>
              <li>Obstetrics & Gynecology (Labor Suites, Postnatal Care)</li>
              <li>Pediatrics & Neonatology Ward</li>
              <li>Intensive Care Unit (ICU) & Coronary Care Unit (CCU)</li>
              <li>Neonatal Intensive Care Unit (NICU)</li>
              <li>Hemodialysis & Renal Care Wing</li>
            </ul>
          </div>
          <div className="col-lg-6 text-center">
            <img src="/pmch/img/indor001.jpg" alt="Indoor Services" className="img-fluid rounded shadow" />
          </div>
        </div>

        <div className="card shadow-sm border-0 p-4 bg-light text-center">
          <h4 className="font-weight-bold text-dark mb-2">Need Inpatient Bed Reservation or Doctor Inquiry?</h4>
          <p className="text-muted mb-3">Contact our 24-hour admission counter for immediate guidance and bed status.</p>
          <div>
            <Link to="/rates" className="btn btn-outline-primary mr-2 font-weight-bold">View Bed Rates</Link>
            <Link to="/contact-us" className="btn btn-primary font-weight-bold">Inquire Admission</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
