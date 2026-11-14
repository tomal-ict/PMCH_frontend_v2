import React from 'react';
import { Link } from 'react-router-dom';

export default function BloodBank() {
  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>PMCH Transfusion Medicine & Blood Bank</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">Blood Bank</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row align-items-center mb-5">
          <div className="col-lg-7 mb-4 mb-lg-0">
            <h2 className="font-weight-bold text-dark mb-3">Safe Blood Transfusion Around the Clock</h2>
            <p className="text-muted leading-relaxed">
              The Department of Transfusion Medicine and Blood Bank at Popular Medical College Hospital is a certified, fully accredited blood banking unit operating 24 hours a day, 365 days a year. We adhere strictly to national blood safety guidelines and WHO standards.
            </p>
            <p className="text-muted leading-relaxed">
              Our blood bank achieved a historic milestone by conducting advanced Stem Cell collection via Apheresis. We are equipped with state-of-the-art cell separators, temperature-controlled blood storage refrigerators, platelet agitators, and automated screening analyzers.
            </p>
            <h5 className="font-weight-bold text-dark mt-4 mb-3">Available Blood Components:</h5>
            <ul className="text-muted pl-4">
              <li>Whole Blood</li>
              <li>Packed Red Blood Cells (PRBC)</li>
              <li>Fresh Frozen Plasma (FFP)</li>
              <li>Platelet Concentrate (Random & Single Donor Apheresis Platelets - SDAP)</li>
              <li>Cryoprecipitate</li>
            </ul>
          </div>
          <div className="col-lg-5 text-center">
            <div className="card shadow-sm border-0 p-4 bg-light">
              <i className="fas fa-tint fa-3x text-danger mb-3"></i>
              <h4 className="font-weight-bold text-dark mb-2">Blood Bank Emergency Helpline</h4>
              <p className="text-muted small">For urgent blood requisitions, donor inquiries, or cross-matching status:</p>
              <h4 className="text-danger font-weight-bold mb-3">09666 787800</h4>
              <Link to="/contact-us" className="btn btn-danger font-weight-bold btn-block">
                Inquire Requisition
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
