import React from 'react';
import { Link } from 'react-router-dom';

export default function ChairmanMessage() {
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
                Message From Chairman
              </h1>
              <p className="text-white-50 mb-0 font-weight-light">
                Honoring the foundational vision, legacy, and enduring commitment of Popular Medical College Hospital.
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
                    Chairman Message
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
                    src="/pmch/img/chairman.png"
                    alt="Late Tahera Akhter - Chairman"
                    className="img-fluid w-100"
                    style={{
                      maxHeight: '340px',
                      objectFit: 'contain',
                      transition: 'transform 0.4s ease'
                    }}
                    onError={(e) => {
                      e.target.src = '/team/2004062097-20260408153112-1486274258.png';
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
                  Founding Chairman
                </span>

                <h3 className="font-weight-bold text-dark mb-1" style={{ fontSize: '1.35rem' }}>
                  Late Tahera Akhter
                </h3>
                <p className="text-muted font-weight-semibold small mb-2 text-uppercase" style={{ letterSpacing: '0.8px' }}>
                  Chairman, Popular Group & PMCH
                </p>

                <hr className="my-3" style={{ borderColor: '#eef2f0' }} />

                <div className="small text-muted text-left px-2">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-landmark mr-2" style={{ color: '#00984A' }}></i>
                    <span>Popular Diagnostic Centre Ltd. (Est. 1983)</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-hospital-alt mr-2" style={{ color: '#00984A' }}></i>
                    <span>Popular Medical College Hospital (Est. 2009)</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-heart mr-2" style={{ color: '#00984A' }}></i>
                    <span>Pioneering Affordable Healthcare in Bangladesh</span>
                  </div>
                </div>
              </div>

              {/* Quick Navigation Footer */}
              <div className="p-3 bg-light text-center border-top">
                <Link
                  to="/md-message"
                  className="btn btn-sm btn-outline-success font-weight-bold px-3 py-2 mr-2"
                  style={{ borderColor: '#00984A', color: '#00984A' }}
                >
                  <i className="fas fa-user-tie mr-1"></i> MD Message
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
                  "Our goal was to ensure modern treatment facilities for the mass people of the country and make the path of 'Health for all' smooth and effective."
                </h4>
                <p className="small text-muted mb-0 font-weight-semibold">
                  — Late Tahera Akhter, Chairman
                </p>
              </div>

              {/* Authentic Historical & Visionary Narrative */}
              <div
                className="text-dark font-weight-normal"
                style={{ fontSize: '1.05rem', lineHeight: '1.9', color: '#2d3748' }}
              >
                <p className="mb-4 text-justify">
                  After the liberation war, the health sector of Bangladesh was completely deprived due to various political instability and uncertainty. Unfortunately a significant number of people of this country died on that time only because of incomplete diagnosis of disease and lack of better treatment. When the sufferings were beyond the limit, at that time we established <strong>Popular Diagnostic Centre Ltd.</strong> in Elephant Road, Dhaka. Our goal was to ensure modern treatment facilities for the mass people of the country.
                </p>

                <p className="mb-4 text-justify">
                  Popular started its journey in <strong>June 1983</strong> and within few days due to its accuracy of the reports and quality of the service Popular became an unparallel symbol of reliability and trust from the end of respective doctors and the people of our country.
                </p>

                <p className="mb-4 text-justify">
                  To meet the demand of improving the lives of people through utmost service excellence, <strong>Popular Medical College Hospital</strong> started its operation on <strong>2009</strong>.
                </p>

                <p className="mb-4 text-justify">
                  Popular Medical College Hospital is committed to render the possible standard service to the people of the country at an affordable cost. This will definitely reduce the burden of the government and will make the path of <em>"Health for all"</em> more smooth and effective.
                </p>
              </div>

              {/* Institutional Values Highlights */}
              <div className="row my-4 pt-2">
                <div className="col-md-4 mb-3 mb-md-0">
                  <div className="p-3 rounded text-center h-100" style={{ backgroundColor: '#f9fbf9', border: '1px solid #e5eee8' }}>
                    <div
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                      style={{ width: '48px', height: '48px', backgroundColor: '#e6f5ed', color: '#00984A' }}
                    >
                      <i className="fas fa-calendar-check font-weight-bold"></i>
                    </div>
                    <h6 className="font-weight-bold text-dark mb-1">Since 1983</h6>
                    <p className="text-muted small mb-0">Decades of medical accuracy and unwavering public trust.</p>
                  </div>
                </div>

                <div className="col-md-4 mb-3 mb-md-0">
                  <div className="p-3 rounded text-center h-100" style={{ backgroundColor: '#f9fbf9', border: '1px solid #e5eee8' }}>
                    <div
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                      style={{ width: '48px', height: '48px', backgroundColor: '#e6f5ed', color: '#00984A' }}
                    >
                      <i className="fas fa-hand-holding-heart font-weight-bold"></i>
                    </div>
                    <h6 className="font-weight-bold text-dark mb-1">Health For All</h6>
                    <p className="text-muted small mb-0">High-standard healthcare accessible to every citizen at affordable cost.</p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 rounded text-center h-100" style={{ backgroundColor: '#f9fbf9', border: '1px solid #e5eee8' }}>
                    <div
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                      style={{ width: '48px', height: '48px', backgroundColor: '#e6f5ed', color: '#00984A' }}
                    >
                      <i className="fas fa-hospital font-weight-bold"></i>
                    </div>
                    <h6 className="font-weight-bold text-dark mb-1">Modern Hospital</h6>
                    <p className="text-muted small mb-0">Established in 2009 with 500+ beds and tertiary medical faculties.</p>
                  </div>
                </div>
              </div>

              {/* Signature Block */}
              <div className="border-top pt-4 mt-3 d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <h5 className="font-weight-bold text-dark mb-0">Late Tahera Akhter</h5>
                  <p className="text-muted small mb-0">Chairman, Popular Medical College Hospital</p>
                </div>
                <div className="mt-3 mt-sm-0">
                  <span
                    className="badge badge-light px-3 py-2 text-dark font-weight-semibold shadow-sm"
                    style={{ border: '1px solid #dcdcdc' }}
                  >
                    <i className="fas fa-award mr-1" style={{ color: '#00984A' }}></i> In Loving Memory & Gratitude
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
