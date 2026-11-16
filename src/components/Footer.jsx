import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Footer() {
  const [project, setProject] = useState(null);
  const [views, setViews] = useState(0);

  useEffect(() => {
    api.get('/project-details')
      .then(res => {
        if (res.data?.success) {
          setProject(res.data.data);
          setViews(res.data.data.views || 0);
        }
      })
      .catch(err => console.error('Error loading project details in footer:', err));
  }, []);

  return (
    <footer
      id="footer"
      className="border-0 mt-0"
      style={{
        background: "url('/pmch/img/footer-back.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: '0 100%'
      }}
    >
      <div className="container">
        <div className="row justify-content-md-center py-5">
          {/* Col 1: About & Info */}
          <div className="col-md-4 col-lg-4 text-center text-lg-left mb-5 mb-lg-0">
            <img
              alt="Popular Logo"
              width="90%"
              height="auto"
              src="/pmch/img/logo.png"
              style={{ background: 'white', padding: '10px', borderRadius: '4px' }}
            />
            <div className="footer-contact-info mt-3" style={{ fontSize: '17px', lineHeight: '1.85', color: '#ffffff' }}>
              <div className="d-flex align-items-start mb-2 justify-content-center justify-content-lg-start">
                <i className="fas fa-map-marker-alt mt-1 mr-2 text-white" style={{ fontSize: '16px', opacity: 0.9 }}></i>
                <span style={{ color: '#ffffff', fontWeight: 400 }}>
                  House: 08, Road: 02, Dhanmondi, Dhaka-1205, Bangladesh
                </span>
              </div>
              <div className="d-flex align-items-center mb-2 justify-content-center justify-content-lg-start">
                <i className="fas fa-phone-alt mr-2 text-white" style={{ fontSize: '15px', opacity: 0.9 }}></i>
                <span style={{ color: '#ffffff' }}>
                  <strong style={{ color: '#ffffff' }}>Phone:</strong>{' '}
                  <a href="tel:09666787800" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 500 }}>
                    09666 787800
                  </a>
                </span>
              </div>
              <div className="d-flex align-items-center mb-2 justify-content-center justify-content-lg-start">
                <i className="fas fa-envelope mr-2 text-white" style={{ fontSize: '15px', opacity: 0.9 }}></i>
                <span style={{ color: '#ffffff' }}>
                  <strong style={{ color: '#ffffff' }}>E-mail:</strong>{' '}
                  <a href="mailto:info@popular-hospital.com" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 500 }}>
                    info@popular-hospital.com
                  </a>
                </span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="mt-3 pt-2">
              <span className="text-white-50 small d-block mb-2 font-weight-semibold">Stay Connected:</span>
              <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                <a
                  href="https://www.facebook.com/popularhospital.official"
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-btn mr-2"
                  title="Popular Hospital Facebook"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="https://twitter.com/PMCHBD"
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-btn mr-2"
                  title="Popular Hospital Twitter"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-btn mr-2"
                  title="Popular Hospital Instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon-btn"
                  title="Popular Hospital YouTube"
                >
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="col-md-2 col-lg-2 text-center text-lg-left mb-5 mb-lg-0">
            <h5 className="text-5 text-transform-none font-weight-semibold text-white mb-4">
              Services
            </h5>
            <ul className="list list-unstyled" style={{ lineHeight: '2' }}>
              <li><Link to="/indoor" className="text-white text-decoration-none">Indoor Service</Link></li>
              <li><Link to="/outdoor" className="text-white text-decoration-none">Outdoor Service</Link></li>
              <li><Link to="/patient-facilities" className="text-white text-decoration-none">In-Patient Facilities</Link></li>
              <li><Link to="/contact-us" className="text-white text-decoration-none">Online Appointment</Link></li>
              <li><Link to="/rates" className="text-white text-decoration-none">Rate Charts</Link></li>
              <li><Link to="/vaccination" className="text-white text-decoration-none">Vaccination Centre</Link></li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="col-md-2 col-lg-2 text-center text-lg-left mb-5 mb-lg-0">
            <h5 className="text-5 text-transform-none font-weight-semibold text-white mb-4">
              Quick Links
            </h5>
            <ul className="list list-unstyled" style={{ lineHeight: '2' }}>
              <li><Link to="/admission" className="text-white text-decoration-none">Admission</Link></li>
              <li><Link to="/amenities" className="text-white text-decoration-none">Amenities</Link></li>
              <li><Link to="/career" className="text-white text-decoration-none">Career</Link></li>
              <li><Link to="/news-event" className="text-white text-decoration-none">News and Events</Link></li>
              <li><Link to="/testimonial" className="text-white text-decoration-none">Patient Testimonials</Link></li>
              <li><Link to="/sitemap" className="text-white text-decoration-none">Sitemap</Link></li>
            </ul>
          </div>

          {/* Col 4: Hospital Location Thumbnail */}
          <div className="col-md-4 col-lg-4 text-center text-lg-left mb-5 mb-lg-0">
            <Link to="/location-map">
              <img
                alt="PMCH Location"
                width="90%"
                height="auto"
                src="/pmch/img/pmchlocation.png"
                style={{ background: 'white', padding: '5px', borderRadius: '4px' }}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="footer-copyright border-top border-secondary py-3">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 text-center text-lg-left text-white mb-2 mb-lg-0">
              <p className="mb-0 copyright-text" style={{ color: '#ffffff', fontSize: '15.5px', fontWeight: 400 }}>
                © Copyright {new Date().getFullYear()}. Popular Medical College Hospital. All Rights Reserved.
              </p>
            </div>
            <div className="col-lg-6 text-center text-lg-right text-white">
              <p className="mb-0 footer-views-counter" style={{ color: '#ffffff', fontSize: '15.5px', fontWeight: 500, background: 'none' }}>
                <i className="fas fa-eye mr-2" style={{ color: '#ffffff', opacity: 0.9 }}></i>
                <span style={{ color: '#ffffff' }}>{views.toLocaleString()} Total Views</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
