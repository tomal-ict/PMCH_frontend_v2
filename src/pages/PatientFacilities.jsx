import React from 'react';
import { Link } from 'react-router-dom';

export default function PatientFacilities() {
  const facilities = [
    { title: 'Modern Clean Ward & Cabin Rooms', desc: 'Maintained with continuous sanitization protocols, comfortable beds, attached clean bathrooms, and round-the-clock nursing bells.' },
    { title: 'Nutritious Dietetics & Cafeteria', desc: 'Clinical dieticians customize meal plans suited for diabetic, renal, hypertensive, post-surgical, and pediatric patients.' },
    { title: '24-Hour Emergency Ambulance Service', desc: 'Fully equipped life-support ambulances with oxygen, defibrillators, and paramedics ready for rapid transit.' },
    { title: 'Comprehensive Transfusion Medicine & Blood Bank', desc: 'Certified blood separation, cross-matching, apheresis, and safety screening available around the clock.' },
    { title: 'In-House Specialized Pharmacy', desc: 'Immediate bedside dispensing of authentic medications, surgical instruments, and orthopedic implants.' },
    { title: 'Prayer Room & Attendant Lounges', desc: 'Dedicated comfortable waiting spaces, prayer rooms, and filtered drinking water points on all patient floors.' }
  ];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>In-Patient Facilities & Patient Care</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">Patient Facilities</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="text-center mb-5">
          <h2 className="font-weight-bold text-dark">Dedicated to Patient Comfort & Well-being</h2>
          <p className="text-muted">Explore the medical, dietary, and supportive facilities designed to ensure speedy recovery.</p>
        </div>

        <div className="row">
          {facilities.map((fac, idx) => (
            <div key={idx} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm border-0 p-4">
                <div className="mb-3 text-primary">
                  <i className="fas fa-hospital-alt fa-2x"></i>
                </div>
                <h5 className="font-weight-bold text-dark mb-2">{fac.title}</h5>
                <p className="text-muted small mb-0">{fac.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <Link to="/contact-us" className="btn btn-primary font-weight-bold px-4 py-2">
            Have Questions? Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
