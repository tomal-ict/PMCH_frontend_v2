import React from 'react';
import { Link } from 'react-router-dom';

export default function MdMessage() {
  return (
    <div className="bg-light">
      {/* Modern Page Header Banner */}
      <section
        className="page-header position-relative py-5 m-0 text-white"
        style={{
          background: 'linear-gradient(135deg, rgba(7, 30, 18, 0.92) 0%, rgba(0, 75, 36, 0.88) 100%), url("/pmch/img/sliderTwo.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: 'inset 0 -10px 25px rgba(0,0,0,0.2)'
        }}
      >
        <div className="container" style={{ maxWidth: '1240px' }}>
          <div className="row align-items-center">
            <div className="col-lg-8 text-center text-lg-left">
              <span
                className="badge px-3 py-1 text-uppercase font-weight-bold mb-2 shadow-sm"
                style={{
                  backgroundColor: '#00984A',
                  color: '#ffffff',
                  letterSpacing: '1.2px',
                  fontSize: '11px'
                }}
              >
                About PMCH • Executive Leadership
              </span>
              <h1 className="font-weight-extra-bold text-white mb-2" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
                Message From Managing Director
              </h1>
              <p className="text-white-50 mb-0 font-weight-light">
                A personal message on clinical excellence, humanitarian healthcare, and our ongoing journey of service.
              </p>
            </div>
            <div className="col-lg-4 text-center text-lg-right mt-3 mt-lg-0">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent p-0 mb-0 justify-content-center justify-content-lg-end">
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-white-50 text-decoration-none">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <span className="text-white-50">About PMCH</span>
                  </li>
                  <li className="breadcrumb-item active text-white font-weight-semibold" aria-current="page">
                    MD Message
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container py-5" style={{ maxWidth: '1240px' }}>
        <div className="row justify-content-center">
          {/* Executive Portrait Card (Left Column) */}
          <div className="col-lg-4 col-md-5 mb-4 mb-lg-0">
            <div
              className="card border-0 shadow-sm rounded-lg overflow-hidden position-sticky"
              style={{ top: '100px', backgroundColor: '#ffffff' }}
            >
              <div
                className="p-3 text-center position-relative"
                style={{
                  background: 'linear-gradient(180deg, #f0f7f3 0%, #ffffff 100%)',
                  borderBottom: '3px solid #00984A'
                }}
              >
                <div
                  className="mx-auto mb-3 shadow-sm rounded-lg overflow-hidden"
                  style={{
                    width: '100%',
                    maxWidth: '280px',
                    border: '4px solid #ffffff',
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <img
                    src="/pmch/img/md.png"
                    alt="Dr. Mostafizur Rahman - Managing Director"
                    className="img-fluid w-100"
                    style={{
                      maxHeight: '340px',
                      objectFit: 'contain',
                      transition: 'transform 0.4s ease'
                    }}
                    onError={(e) => {
                      e.target.src = '/team/483877393-20260408152857-743861522.jpeg';
                    }}
                  />
                </div>

                <span
                  className="badge px-3 py-1 font-weight-bold mb-2 shadow-sm"
                  style={{
                    backgroundColor: 'rgba(0, 152, 74, 0.12)',
                    color: '#00984A',
                    fontSize: '11px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}
                >
                  Managing Director
                </span>

                <h3 className="font-weight-bold text-dark mb-1" style={{ fontSize: '1.35rem' }}>
                  Dr. Mostafizur Rahman
                </h3>
                <p className="text-muted font-weight-semibold small mb-2 text-uppercase" style={{ letterSpacing: '0.8px' }}>
                  Managing Director, Popular Group & PMCH
                </p>

                <hr className="my-3" style={{ borderColor: '#eef2f0' }} />

                <div className="small text-muted text-left px-2">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-stethoscope mr-2" style={{ color: '#00984A' }}></i>
                    <span>Renowned Physician, Pathologist & Visionary</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-bed mr-2" style={{ color: '#00984A' }}></i>
                    <span>Leading 500+ Bed Tertiary Care Facility</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-user-md mr-2" style={{ color: '#00984A' }}></i>
                    <span>400+ Specialist Consultants & Faculty</span>
                  </div>
                </div>
              </div>

              {/* Quick Navigation Footer */}
              <div className="p-3 bg-light text-center border-top">
                <Link
                  to="/chairman-message"
                  className="btn btn-sm btn-outline-success font-weight-bold px-3 py-2 mr-2"
                  style={{ borderColor: '#00984A', color: '#00984A' }}
                >
                  <i className="fas fa-landmark mr-1"></i> Chairman Message
                </Link>
                <Link
                  to="/management-team"
                  className="btn btn-sm btn-success font-weight-bold px-3 py-2"
                  style={{ backgroundColor: '#00984A', borderColor: '#00984A' }}
                >
                  <i className="fas fa-users mr-1"></i> Management Team
                </Link>
              </div>
            </div>
          </div>

          {/* Editorial Content Column (Right Column) */}
          <div className="col-lg-8 col-md-7">
            <div className="card border-0 shadow-sm rounded-lg p-4 p-md-5 bg-white">
              {/* Inspirational Quote Callout */}
              <div
                className="p-4 mb-4 rounded-lg position-relative"
                style={{
                  backgroundColor: '#f2f9f5',
                  borderLeft: '5px solid #00984A'
                }}
              >
                <i
                  className="fas fa-quote-left position-absolute"
                  style={{
                    top: '15px',
                    right: '20px',
                    fontSize: '2.5rem',
                    color: 'rgba(0, 152, 74, 0.15)'
                  }}
                ></i>
                <h4
                  className="font-weight-bold mb-2"
                  style={{ color: '#007a3b', fontSize: '1.2rem', lineHeight: '1.4' }}
                >
                  "Success is nothing but a goal of achievement. In every success has positive productivity, which is dedicated for the welfare of mankind."
                </h4>
                <p className="small text-muted mb-0 font-weight-semibold">
                  — Dr. Mostafizur Rahman, Managing Director
                </p>
              </div>

              {/* Authentic Historical & Visionary Narrative */}
              <div
                className="text-dark font-weight-normal"
                style={{ fontSize: '1.05rem', lineHeight: '1.9', color: '#2d3748' }}
              >
                <p className="mb-4 text-justify">
                  Popular started its journey as diagnostic centre in <strong>June 1983</strong> with a Promise to render the possible standard service to the people of the country at an affordable cost and in turn to limit the outflow of the patient abroad at the expense of hard-earned foreign currency. When I started working in pathology department of Dhaka Medical College Hospital, I saw that thousands of people of our country are going abroad every year only for treatment. The country was losing millions of taka worth foreign currency. That time I felt, as a Doctor I must do something about it. I had the spirit but didn't have the resources.
                </p>

                <p className="mb-4 text-justify">
                  From that inspiration I started <strong>Popular Medical College Hospital on 2009</strong>. And now Popular Medical College Hospital is a <strong>500+ beds care hospital</strong> and the leading contributor of private healthcare services in Bangladesh.
                </p>

                <p className="mb-4 text-justify">
                  To achieve the goal and ensure the quality service need highly skilled manpower who will continue to produce high level productivity relentlessly maintaining high standard of medical services. I always hire the skilled manpower and motivate them. Being an entrepreneur of a health services provider organization I always concern to ensure the right man in the right place.
                </p>

                <p className="mb-4 text-justify">
                  I believe that if a person whether he is a doctor or not works hard, has merit, good behaviour and remains honest, he will be a successful businessman. Success is nothing but a goal of achievement. In every success has positive productivity, which is dedicated for the welfare of mankind. Almighty God, Honorable Doctors and my beloved colleagues are always inspiring me to do good and take challenges. My all effort is to make them happy.
                </p>
              </div>

              {/* Milestone Metrics Row */}
              <div className="row my-4 pt-2">
                <div className="col-md-3 col-6 mb-3 mb-md-0 text-center">
                  <div className="p-3 rounded h-100" style={{ backgroundColor: '#f9fbf9', border: '1px solid #e5eee8' }}>
                    <h3 className="font-weight-extra-bold mb-1" style={{ color: '#00984A' }}>500+</h3>
                    <p className="text-muted small mb-0 font-weight-semibold">Hospital Beds</p>
                  </div>
                </div>

                <div className="col-md-3 col-6 mb-3 mb-md-0 text-center">
                  <div className="p-3 rounded h-100" style={{ backgroundColor: '#f9fbf9', border: '1px solid #e5eee8' }}>
                    <h3 className="font-weight-extra-bold mb-1" style={{ color: '#00984A' }}>400+</h3>
                    <p className="text-muted small mb-0 font-weight-semibold">Specialist Doctors</p>
                  </div>
                </div>

                <div className="col-md-3 col-6 mb-3 mb-md-0 text-center">
                  <div className="p-3 rounded h-100" style={{ backgroundColor: '#f9fbf9', border: '1px solid #e5eee8' }}>
                    <h3 className="font-weight-extra-bold mb-1" style={{ color: '#00984A' }}>1983</h3>
                    <p className="text-muted small mb-0 font-weight-semibold">Founded In</p>
                  </div>
                </div>

                <div className="col-md-3 col-6 mb-3 mb-md-0 text-center">
                  <div className="p-3 rounded h-100" style={{ backgroundColor: '#f9fbf9', border: '1px solid #e5eee8' }}>
                    <h3 className="font-weight-extra-bold mb-1" style={{ color: '#00984A' }}>24/7</h3>
                    <p className="text-muted small mb-0 font-weight-semibold">Emergency & ICU</p>
                  </div>
                </div>
              </div>

              {/* Signature Block */}
              <div className="border-top pt-4 mt-3 d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <h5 className="font-weight-bold text-dark mb-0">Dr. Mostafizur Rahman</h5>
                  <p className="text-muted small mb-0">Managing Director, Popular Medical College Hospital</p>
                </div>
                <div className="mt-3 mt-sm-0">
                  <span
                    className="badge badge-light px-3 py-2 text-dark font-weight-semibold shadow-sm"
                    style={{ border: '1px solid #dcdcdc' }}
                  >
                    <i className="fas fa-check-circle mr-1" style={{ color: '#00984A' }}></i> Visionary Healthcare Pioneer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
