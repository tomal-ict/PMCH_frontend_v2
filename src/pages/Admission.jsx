import React from 'react';
import { Link } from 'react-router-dom';

export default function Admission() {
  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>Admission Procedure & Guidelines</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">Admission</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row">
          <div className="col-lg-8">
            <h3 className="font-weight-bold text-dark mb-3">Inpatient Admission</h3>
            <p className="text-muted leading-relaxed">
              At Popular Medical College Hospital, our admission procedure is designed to be seamless, compassionate, and efficient. Patients can be admitted through the Emergency Department 24/7 or via outpatient physician recommendation.
            </p>

            <h4 className="font-weight-bold text-dark mt-4 mb-2">Admission Process Steps</h4>
            <div className="list-group mb-4">
              <div className="list-group-item">
                <h6 className="font-weight-bold text-primary mb-1">1. Doctor's Admission Advice</h6>
                <p className="mb-0 text-muted small">An admission note or prescription from the treating doctor is required detailing the bed category and medical urgency.</p>
              </div>
              <div className="list-group-item">
                <h6 className="font-weight-bold text-primary mb-1">2. Registration & Bed Allotment</h6>
                <p className="mb-0 text-muted small">Our 24-hour Admission Desk will guide you to select the appropriate accommodation (General Ward, Cabin, VIP Suite, CCU/ICU) based on availability and patient preference.</p>
              </div>
              <div className="list-group-item">
                <h6 className="font-weight-bold text-primary mb-1">3. Financial Deposit</h6>
                <p className="mb-0 text-muted small">An initial admission deposit is submitted at the billing desk. Receipts with MR numbers will be handed over immediately.</p>
              </div>
              <div className="list-group-item">
                <h6 className="font-weight-bold text-primary mb-1">4. Transfer to Floor / Room</h6>
                <p className="mb-0 text-muted small">Dedicated nursing and patient assistance staff will escort the patient to the designated room and initiate medical management.</p>
              </div>
            </div>

            <h4 className="font-weight-bold text-dark mt-4 mb-2">Required Documents</h4>
            <ul className="text-muted mb-4 pl-4">
              <li>Doctor’s prescription recommending hospital admission</li>
              <li>Patient National ID card (NID) / Birth Certificate / Passport copy</li>
              <li>Previous diagnostic reports and medication history</li>
              <li>Corporate health card (if applicable)</li>
            </ul>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm border-0 p-4 bg-light mb-4">
              <h5 className="font-weight-bold text-dark mb-3">Admission Helpline</h5>
              <p className="text-muted small">Our admission coordination desk is operational 24 hours a day, 7 days a week.</p>
              <div className="d-flex align-items-center mb-3">
                <i className="fas fa-phone-alt fa-2x text-primary mr-3"></i>
                <div>
                  <div className="text-muted small">Emergency Hotline</div>
                  <strong className="text-dark h5 mb-0">09666 787800</strong>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <i className="fas fa-envelope fa-2x text-primary mr-3"></i>
                <div>
                  <div className="text-muted small">Admission Inquiries</div>
                  <strong className="text-dark small">info@popular-hospital.com</strong>
                </div>
              </div>
              <Link to="/contact-us" className="btn btn-primary btn-block font-weight-bold mt-2">
                Contact Admission Desk
              </Link>
            </div>

            <div className="card shadow-sm border-0 p-4">
              <h5 className="font-weight-bold text-dark mb-2">Hospital Amenities</h5>
              <p className="text-muted small">Learn more about our cabins, ICU, CCU, NICU and in-patient support.</p>
              <Link to="/amenities" className="btn btn-outline-dark btn-sm font-weight-bold">
                View Amenities <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
