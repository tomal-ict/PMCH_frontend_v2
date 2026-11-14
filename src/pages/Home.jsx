import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from '../components/Slider';
import api from '../services/api';

export default function Home() {
  const [homeData, setHomeData] = useState({
    latestNews: [],
    specialities: [],
    doctors: [],
    testimonials: [],
    partners: []
  });
  const [activeAccordion, setActiveAccordion] = useState(0);

  useEffect(() => {
    api.get('/home')
      .then(res => {
        if (res.data?.success) {
          setHomeData(res.data.data);
        }
      })
      .catch(err => console.error('Error fetching home data:', err));
  }, []);

  const accordionItems = [
    {
      title: 'More Experience',
      content: 'In the healthcare sector, service excellence is the facility of the hospital as a healthcare service provider to consistently meet patient needs with the highest clinical standards.'
    },
    {
      title: 'The Right Answers',
      content: 'Popular Medical College Hospital aims to provide unparalleled service to the people of Bangladesh by delivering the highest possible level of compassionate care.'
    },
    {
      title: 'Seamless Care',
      content: 'The outpatient services are open daily, except Friday, in convenient morning, afternoon, and late evening hours. Our ER (Emergency dept) is fully operational 24/7 round the year.'
    },
    {
      title: 'Unparalleled Expertise',
      content: 'Medical services are provided as both outpatient and inpatient services as well as round-the-clock Ambulance service.'
    }
  ];

  // Double partners list for seamless infinite loop ticker
  const marqueePartners = [...(homeData.partners || []), ...(homeData.partners || [])];

  return (
    <div role="main" className="main">
      {/* 1. Hero Carousel Slider with 3D Glassmorphism Float */}
      <Slider />

      {/* 2. Three Quick Action Boxes (SEAMLESS DARK THEME with POPULAR BRAND ACCENT #00984A) */}
      <section
        className="py-5"
        style={{
          backgroundColor: '#25332c',
          borderTop: '2px solid rgba(0, 152, 74, 0.4)',
          borderBottom: '3px solid #00984A'
        }}
      >
        <div className="container" style={{ maxWidth: '1280px' }}>
          <div className="row text-center">
            {/* Box 1: Our Doctors */}
            <div className="col-lg-4 mb-4 mb-lg-0">
              <div className="p-3 d-flex flex-column align-items-center h-100">
                <img
                  src="/pmch/img/doctor.svg"
                  alt="Our Doctors"
                  height="60"
                  width="60"
                  className="mb-3"
                  style={{ filter: 'invert(1)' }}
                />
                <h4 className="font-weight-bold text-white mb-2">Our Doctors</h4>
                <p className="text-white-50 mb-4" style={{ fontSize: '14.5px', lineHeight: '1.6' }}>
                  Best doctors team for all specialized treatments and operations.
                </p>
                <div className="mt-auto">
                  <Link
                    to="/package"
                    className="btn font-weight-bold shadow-sm"
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#00984A',
                      borderRadius: '4px',
                      padding: '10px 30px',
                      letterSpacing: '0.5px',
                      fontSize: '13.5px',
                      border: 'none',
                      transition: 'all 0.25s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#00984A';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 152, 74, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.color = '#00984A';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    Find our Doctors
                  </Link>
                </div>
              </div>
            </div>

            {/* Box 2: Services */}
            <div className="col-lg-4 mb-4 mb-lg-0">
              <div className="p-3 d-flex flex-column align-items-center h-100">
                <img
                  src="/pmch/img/support.svg"
                  alt="Services"
                  height="60"
                  width="60"
                  className="mb-3"
                  style={{ filter: 'invert(1)' }}
                />
                <h4 className="font-weight-bold text-white mb-2">Services</h4>
                <p className="text-white-50 mb-4" style={{ fontSize: '14.5px', lineHeight: '1.6' }}>
                  Check out our specialized services for our beloved patients.
                </p>
                <div className="mt-auto">
                  <Link
                    to="/amenities"
                    className="btn font-weight-bold shadow-sm"
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#00984A',
                      borderRadius: '4px',
                      padding: '10px 30px',
                      letterSpacing: '0.5px',
                      fontSize: '13.5px',
                      border: 'none',
                      transition: 'all 0.25s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#00984A';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 152, 74, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.color = '#00984A';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    Check Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Box 3: Appointments */}
            <div className="col-lg-4">
              <div className="p-3 d-flex flex-column align-items-center h-100">
                <img
                  src="/pmch/img/appointment.svg"
                  alt="Appointments"
                  height="60"
                  width="60"
                  className="mb-3"
                  style={{ filter: 'invert(1)' }}
                />
                <h4 className="font-weight-bold text-white mb-2">Appointments</h4>
                <p className="text-white-50 mb-4" style={{ fontSize: '14.5px', lineHeight: '1.6' }}>
                  Click in, Walk in or Call us anytime for your need.
                </p>
                <div className="mt-auto">
                  <Link
                    to="/contact-us"
                    className="btn font-weight-bold shadow-sm"
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#00984A',
                      borderRadius: '4px',
                      padding: '10px 30px',
                      letterSpacing: '0.5px',
                      fontSize: '13.5px',
                      border: 'none',
                      transition: 'all 0.25s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#00984A';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 152, 74, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.color = '#00984A';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    Get Appointment
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Welcome & Service Blocks */}
      <div className="container py-5" style={{ maxWidth: '1280px' }}>
        <div className="row my-4 align-items-center">
          <div className="col-md-5 mb-4 mb-md-0">
            <h1 className="text-color-dark font-weight-bold text-6">
              Welcome to <br />
              <span style={{ color: '#00984A' }}>Popular Medical College Hospital</span>
            </h1>
          </div>
          <div className="col-md-7">
            <p className="text-3 line-height-8 mb-0 text-muted">
              The most prestigious concern of popular group, the Popular Medical College started its journey in the year 2010 and by the grace of Almighty Allah it is now able to boast about a sound infrastructure and an enviable faculty. The dedicated workforce with their committed adherence to quality and uncompromising perfection has been the root of this success.
            </p>
          </div>
        </div>

        {/* 3 Full Width Banner Boxes */}
        <div className="row text-center mt-4">
          <div className="col-lg-4 mb-3">
            <Link to="/contact-us" className="d-block p-4 text-decoration-none shadow-sm rounded hover-elevate" style={{ backgroundColor: '#bbb', transition: 'all 0.2s' }}>
              <i className="fas fa-phone-volume fa-2x text-color-dark mb-2"></i>
              <h4 className="text-color-dark font-weight-bold mb-0">24 Hours Service</h4>
            </Link>
          </div>
          <div className="col-lg-4 mb-3">
            <Link to="/enquiry" className="d-block p-4 text-decoration-none shadow-sm rounded hover-elevate" style={{ backgroundColor: '#ccc', transition: 'all 0.2s' }}>
              <i className="fas fa-paste fa-2x text-color-dark mb-2"></i>
              <h4 className="text-color-dark font-weight-bold mb-0">Online Inquiry</h4>
            </Link>
          </div>
          <div className="col-lg-4 mb-3">
            <Link to="/rates" className="d-block p-4 text-decoration-none shadow-sm rounded hover-elevate" style={{ backgroundColor: '#ddd', transition: 'all 0.2s' }}>
              <i className="far fa-life-ring fa-2x text-color-dark mb-2"></i>
              <h4 className="text-color-dark font-weight-bold mb-0">Rate Charts</h4>
            </Link>
          </div>
        </div>

        {/* Indoor & Outdoor Service Visual Cards */}
        <div className="row mt-3">
          <div className="col-lg-6 mb-3">
            <div
              className="p-5 text-center text-white rounded shadow hover-elevate"
              style={{
                backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/pmch/img/indor001.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '160px',
                transition: 'all 0.3s'
              }}
            >
              <h3 className="font-weight-bold mb-2">
                <Link to="/indoor" className="text-white text-decoration-none">Indoor Service</Link>
              </h3>
              <Link to="/indoor" className="btn btn-outline-light btn-sm font-weight-bold">View Facilities</Link>
            </div>
          </div>

          <div className="col-lg-6 mb-3">
            <div
              className="p-5 text-center text-white rounded shadow hover-elevate"
              style={{
                backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/pmch/img/outdoor.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '160px',
                transition: 'all 0.3s'
              }}
            >
              <h3 className="font-weight-bold mb-2">
                <Link to="/outdoor" className="text-white text-decoration-none">Outdoor Service</Link>
              </h3>
              <Link to="/outdoor" className="btn btn-outline-light btn-sm font-weight-bold">View OPD Hours</Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Why Choose Us Section */}
      <section className="section border-0 my-5 py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '1280px' }}>
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0 text-center">
              <img src="/pmch/img/icu.jpg" alt="ICU Facility" className="img-fluid rounded shadow" />
            </div>
            <div className="col-lg-6">
              <h2 className="font-weight-extra-bold text-color-dark text-7 mb-4">
                <em>Why Choose Us</em>
              </h2>
              <div className="accordion" id="pmchAccordion">
                {accordionItems.map((item, idx) => (
                  <div className="card mb-2 border rounded" key={idx}>
                    <div
                      className="card-header bg-white py-3 cursor-pointer d-flex justify-content-between align-items-center"
                      onClick={() => setActiveAccordion(activeAccordion === idx ? -1 : idx)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h5 className="mb-0 font-weight-bold text-dark text-4">
                        {item.title}
                      </h5>
                      <i className={`fas ${activeAccordion === idx ? 'fa-minus' : 'fa-plus text-muted'}`} style={{ color: activeAccordion === idx ? '#00984A' : undefined }}></i>
                    </div>
                    {activeAccordion === idx && (
                      <div className="card-body py-3 text-muted">
                        <p className="mb-0">{item.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Doctors Section */}
      {homeData.doctors?.length > 0 && (
        <div className="container my-5" style={{ maxWidth: '1280px' }}>
          <div className="text-center mb-4">
            <h2 className="font-weight-extra-bold text-dark mb-1">Our Renowned Doctors</h2>
            <p className="text-muted">Dedicated medical practitioners providing exceptional care</p>
          </div>
          <div className="row">
            {homeData.doctors.map((dr) => (
              <div key={dr.dr_id} className="col-lg-3 col-md-6 mb-4">
                <div className="card h-100 shadow-sm border-0 text-center p-3 hover-elevate" style={{ transition: 'all 0.2s' }}>
                  <div className="mb-3 text-center">
                    <img
                      src={dr.dr_image ? `/doctor/${dr.dr_image}` : '/doctor.jpg'}
                      alt={dr.dr_name}
                      className="rounded-circle img-thumbnail"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = '/male.jpg'; }}
                    />
                  </div>
                  <h5 className="font-weight-bold mb-1 text-truncate" title={dr.dr_name} style={{ color: '#00984A' }}>
                    {dr.dr_name}
                  </h5>
                  <p className="text-muted small mb-2 text-truncate" title={dr.dr_degree}>
                    {dr.dr_degree || 'Specialist Consultant'}
                  </p>
                  <span className="badge badge-light text-secondary mb-3 text-truncate">
                    {dr.speciality_names || 'Consultant'}
                  </span>
                  <div className="mt-auto">
                    <Link
                      to={`/package`}
                      className="btn btn-sm btn-block font-weight-bold"
                      style={{
                        borderColor: '#00984A',
                        color: '#00984A'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#00984A';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#00984A';
                      }}
                    >
                      View Profile & Schedule
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Latest News & Events Section */}
      <div className="container my-5" style={{ maxWidth: '1280px' }}>
        <div className="row mb-4 align-items-center">
          <div className="col-8">
            <h3 className="font-weight-bold text-dark mb-0">Latest News & Events</h3>
          </div>
          <div className="col-4 text-right">
            <Link to="/news-event" className="btn btn-outline-dark btn-sm font-weight-bold">
              View All <i className="fas fa-arrow-right ml-1"></i>
            </Link>
          </div>
        </div>
        <hr className="mt-2 mb-4" />

        <div className="row">
          {homeData.latestNews?.map((item) => {
            const dateObj = new Date(item.news_postdate);
            const day = !isNaN(dateObj.getDate()) ? dateObj.getDate() : '';
            const month = !isNaN(dateObj.getMonth()) ? dateObj.toLocaleString('en-US', { month: 'short' }) : '';
            const year = !isNaN(dateObj.getFullYear()) ? dateObj.getFullYear() : '';
            const firstImg = item.images?.[0] ? `/news/${item.images[0]}` : '/banner.jpg';

            return (
              <div key={item.news_id} className="col-lg-4 mb-4">
                <div className="card h-100 shadow-sm border-0 overflow-hidden hover-elevate" style={{ transition: 'all 0.2s' }}>
                  <div style={{ height: '220px', overflow: 'hidden' }}>
                    <Link to={`/news-details/${item.news_id}`}>
                      <img
                        src={firstImg}
                        alt={item.news_title}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => { e.target.src = '/banner.jpg'; }}
                      />
                    </Link>
                  </div>
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="text-muted small mb-2">
                      <i className="far fa-calendar-alt mr-1" style={{ color: '#00984A' }}></i> {day} {month}, {year}
                    </div>
                    <h5 className="font-weight-bold text-dark mb-2" style={{ maxHeight: '50px', overflow: 'hidden' }}>
                      <Link to={`/news-details/${item.news_id}`} className="text-dark text-decoration-none">
                        {item.news_title}
                      </Link>
                    </h5>
                    <p className="text-muted small flex-grow-1" style={{ maxHeight: '60px', overflow: 'hidden' }}>
                      {item.news_remark ? item.news_remark.replace(/<[^>]+>/g, '') : ''}
                    </p>
                    <Link to={`/news-details/${item.news_id}`} className="font-weight-bold mt-2 small" style={{ color: '#00984A' }}>
                      Read More <i className="fas fa-chevron-right ml-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Corporate Tie-ups & Partners (CONTINUOUS INFINITE LOOP MARQUEE - RIGHT TO LEFT) */}
      {homeData.partners?.length > 0 && (
        <section className="py-5 border-top bg-light overflow-hidden position-relative">
          <div className="container text-center mb-4" style={{ maxWidth: '1280px' }}>
            <h5 className="font-weight-bold text-uppercase letter-spacing-1 mb-1" style={{ color: '#00984A' }}>
              Corporate Tie-ups & Partners
            </h5>
            <small className="text-muted">Proudly affiliated with leading organizations & corporate bodies</small>
          </div>

          {/* Marquee Loop Track */}
          <div className="marquee-container position-relative overflow-hidden w-100">
            <div className="marquee-track d-flex align-items-center">
              {marqueePartners.map((partner, pIdx) => (
                <div key={pIdx} className="marquee-item px-4 flex-shrink-0 text-center">
                  <div
                    className="p-3 bg-white rounded shadow-sm d-flex align-items-center justify-content-center"
                    style={{
                      height: '75px',
                      width: '180px',
                      transition: 'transform 0.3s, box-shadow 0.3s'
                    }}
                  >
                    <img
                      src={`/partner/${partner.partner_image}`}
                      alt={partner.partner_name}
                      style={{
                        maxHeight: '45px',
                        maxWidth: '140px',
                        objectFit: 'contain',
                        filter: 'grayscale(30%)',
                        transition: 'filter 0.3s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.filter = 'grayscale(0%)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.filter = 'grayscale(30%)'; }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
