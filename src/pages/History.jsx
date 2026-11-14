import React from 'react';
import { Link } from 'react-router-dom';

export default function History() {
  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>Hospital History & Milestones</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">History</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row">
          <div className="col-lg-8">
            <h2 className="font-weight-bold text-dark mb-4">Our Journey of Compassion and Healing</h2>
            <p className="text-muted leading-relaxed">
              Popular Medical College Hospital was conceived as an integral pillar of Popular Group's healthcare mission. Recognized as a pioneer in diagnostic and clinical healthcare in Bangladesh since the 1980s, Popular Group ventured into medical education and tertiary patient care with the formal establishment of Popular Medical College and its associated teaching hospital in 2010.
            </p>
            <p className="text-muted leading-relaxed">
              From an initial setup focused on general medicine and surgery, the institution swiftly expanded into multi-disciplinary super-specialities, including Advanced Cardiology, Hemodialysis, Neonatal & Pediatric Intensive Care (NICU/PICU), Laparoscopic Surgery, and Comprehensive Blood Transfusion services.
            </p>

            <h4 className="font-weight-bold text-dark mt-4 mb-3">Key Milestones</h4>
            <ul className="list-group list-group-flush mb-4">
              <li className="list-group-item px-0">
                <strong className="text-primary mr-2">2010:</strong>
                Popular Medical College commenced its academic and clinical service journey in Dhanmondi, Dhaka.
              </li>
              <li className="list-group-item px-0">
                <strong className="text-primary mr-2">2014:</strong>
                Commissioning of modular surgical suites, CCU, and digital endoscopy/colonoscopy suites.
              </li>
              <li className="list-group-item px-0">
                <strong className="text-primary mr-2">2018:</strong>
                Expansion of emergency resuscitation bays and introduction of specialized Stem Cell Apheresis collection in the Blood Bank.
              </li>
              <li className="list-group-item px-0">
                <strong className="text-primary mr-2">2020 - Present:</strong>
                Continuous adoption of modern healthcare technologies, international quality guidelines, and community outreach health camps.
              </li>
            </ul>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm border-0 p-4 bg-light mb-4">
              <h5 className="font-weight-bold text-dark mb-3">Quick Overview</h5>
              <ul className="list-unstyled text-muted small mb-0" style={{ lineHeight: '2' }}>
                <li><i className="fas fa-check-circle text-success mr-2"></i> Over 500 Bed Capacity</li>
                <li><i className="fas fa-check-circle text-success mr-2"></i> 400+ Specialist Consultants</li>
                <li><i className="fas fa-check-circle text-success mr-2"></i> 30+ Medical Specialities</li>
                <li><i className="fas fa-check-circle text-success mr-2"></i> 24/7 Emergency & ICU</li>
              </ul>
            </div>
            <Link to="/contact-us" className="btn btn-primary btn-block font-weight-bold">
              Inquire or Visit Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
