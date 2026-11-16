import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';

export default function Header() {
  const [specialities, setSpecialities] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'about' | 'specialities' | 'patients' | 'media' | null
  const [lockedDropdown, setLockedDropdown] = useState(null);
  const [specSearch, setSpecSearch] = useState('');
  const [mobileAccordions, setMobileAccordions] = useState({
    about: false,
    specialities: false,
    patients: false,
    media: false
  });
  const [isScrolled, setIsScrolled] = useState(false);

  const headerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const location = useLocation();

  // Scroll listener to update sticky shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 35);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load specialities list dynamically for mega menu
  useEffect(() => {
    api.get('/specialities')
      .then(res => {
        if (res.data?.success) {
          setSpecialities(res.data.data || []);
        }
      })
      .catch(err => console.error('Error fetching specialities for header:', err));
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setActiveDropdown(null);
    setLockedDropdown(null);
    setMobileMenuOpen(false);
    setSpecSearch('');
  }, [location.pathname]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveDropdown(null);
        setLockedDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hover management with grace period (350ms delay)
  const handleMouseEnter = (name) => {
    if (window.innerWidth >= 992) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
      setActiveDropdown(name);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 992) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
      closeTimerRef.current = setTimeout(() => {
        // If the user locked this dropdown by clicking, do not auto-close it on mouse leave!
        setActiveDropdown(prev => (prev === lockedDropdown ? prev : null));
      }, 350);
    }
  };

  // Click handler: Clicking locks the dropdown open or toggles it
  const handleDropdownClick = (name, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);

    if (activeDropdown === name && lockedDropdown === name) {
      setActiveDropdown(null);
      setLockedDropdown(null);
    } else {
      setActiveDropdown(name);
      setLockedDropdown(name);
    }
  };

  const toggleMobileAccordion = (section) => {
    setMobileAccordions(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Filter specialities by search keyword
  const filteredSpecs = specialities.filter(s =>
    s.sp_name.toLowerCase().includes(specSearch.toLowerCase())
  );

  // Group specialities into 4 balanced columns for desktop mega-menu
  const chunkCount = 4;
  const itemsPerChunk = Math.ceil(filteredSpecs.length / chunkCount) || 1;
  const specColumns = [];
  for (let i = 0; i < chunkCount; i++) {
    specColumns.push(filteredSpecs.slice(i * itemsPerChunk, (i + 1) * itemsPerChunk));
  }

  return (
    <>
      {/* 1. TOP HEADER BAR (Popular Brand Gradient - naturally scrolls off-screen as page scrolls down) */}
      <div
        className="header-top py-2 d-none d-md-block"
        style={{
          background: 'linear-gradient(135deg, #006642 0%, #00984A 100%)',
          color: '#ffffff',
          position: 'relative',
          zIndex: 1000
        }}
      >
        <div className="container" style={{ maxWidth: '1360px' }}>
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            {/* Left Top Links & Helplines */}
            <div className="d-flex align-items-center flex-wrap small" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px' }}>
              <Link to="/admission" className="text-white mr-3 d-none d-md-inline-block text-decoration-none">
                <i className="fas fa-angle-right mr-1" style={{ opacity: 0.7 }}></i> Admission
              </Link>
              <Link to="/amenities" className="text-white mr-3 d-none d-md-inline-block text-decoration-none">
                <i className="fas fa-angle-right mr-1" style={{ opacity: 0.7 }}></i> Amenities
              </Link>
              <Link to="/career" className="text-white mr-3 d-none d-md-inline-block text-decoration-none">
                <i className="fas fa-angle-right mr-1" style={{ opacity: 0.7 }}></i> Career
              </Link>
              <Link to="/news-event" className="text-white mr-3 d-none d-md-inline-block text-decoration-none">
                <i className="fas fa-angle-right mr-1" style={{ opacity: 0.7 }}></i> News & Events
              </Link>
              <a href="tel:09666787800" className="text-white mr-3 text-decoration-none font-weight-bold">
                <i className="fas fa-phone-alt mr-1"></i> 09666 787800
              </a>
              <a href="mailto:info@popular-hospital.com" className="text-white text-decoration-none d-none d-sm-inline-block">
                <i className="fas fa-envelope-open-text mr-1"></i> info@popular-hospital.com
              </a>
            </div>

            {/* Right Social Icons */}
            <div className="d-flex align-items-center">
              <a
                href="https://www.facebook.com/popularhospital.official"
                target="_blank"
                rel="noreferrer"
                className="text-white mr-3 hover-opacity"
                title="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://twitter.com/PMCHBD"
                target="_blank"
                rel="noreferrer"
                className="text-white mr-3 hover-opacity"
                title="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-white mr-3 hover-opacity"
                title="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
                className="text-white mr-3 hover-opacity"
                title="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR (ROCK-SOLID FIXED STICKY AT TOP: 0 - NEVER HIDES ON SCROLL) */}
      <header
        id="header"
        ref={headerRef}
        className={`main-sticky-navbar ${isScrolled ? 'is-scrolled' : ''}`}
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 9999,
          backgroundColor: '#ffffff',
          boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderBottom: '1px solid #e5e7eb'
        }}
      >
        <div className="header-body border-top-0 bg-transparent">
          {/* Main Brand & Nav Bar (ELEGANT MARGINS ON BOTH SIDES & STRICT SINGLE LINE) */}
          <div className="container position-relative" style={{ maxWidth: '1360px' }}>
          <div className="d-flex justify-content-between align-items-center py-2 flex-nowrap" style={{ minHeight: '74px' }}>
            {/* Logo - Dynamically Responsive & Prominently Sized */}
            <div className="header-logo flex-shrink-0 mr-2 mr-lg-3">
              <Link to="/" className="d-inline-flex align-items-center text-decoration-none">
                <img
                  alt="PMCH Hospital Logo"
                  className="pmch-header-logo img-fluid"
                  src="/pmch/img/logo.png"
                />
              </Link>
            </div>

            {/* Desktop Navigation (>= 992px) - STRICT SINGLE LINE */}
            <nav className="d-none d-lg-flex align-items-center flex-nowrap position-static">
              <ul className="nav nav-pills align-items-center mb-0 flex-nowrap" style={{ whiteSpace: 'nowrap' }}>
                {/* Home */}
                <li className="nav-item flex-shrink-0">
                  <Link
                    to="/"
                    className="nav-link font-weight-bold px-2 px-xl-3"
                    style={{
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      color: location.pathname === '/' ? '#00984A' : '#222222'
                    }}
                  >
                    Home
                  </Link>
                </li>

                {/* About PMCH Dropdown */}
                <li
                  className="nav-item dropdown position-relative flex-shrink-0"
                  onMouseEnter={() => handleMouseEnter('about')}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href="#about"
                    onClick={(e) => handleDropdownClick('about', e)}
                    className="nav-link font-weight-bold px-2 px-xl-3 dropdown-toggle"
                    style={{
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      color: activeDropdown === 'about' ? '#00984A' : '#222222'
                    }}
                  >
                    About PMCH <i className={`fas fa-chevron-down small ml-1 transition-transform ${activeDropdown === 'about' ? 'fa-rotate-180' : ''}`} style={{ color: activeDropdown === 'about' ? '#00984A' : '#777' }}></i>
                  </a>
                  <div
                    className="dropdown-menu shadow border-0 py-2"
                    onMouseEnter={() => handleMouseEnter('about')}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      display: activeDropdown === 'about' ? 'block' : 'none',
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      minWidth: '240px',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                      padding: '10px 0',
                      zIndex: 10000
                    }}
                  >
                    <Link to="/about-us" className="dropdown-item py-2 px-3 font-weight-semibold">
                      <i className="fas fa-hospital mr-2" style={{ color: '#00984A' }}></i> At a glance
                    </Link>
                    <Link to="/chairman-message" className="dropdown-item py-2 px-3 font-weight-semibold">
                      <i className="fas fa-user-tie mr-2" style={{ color: '#00984A' }}></i> Message From Chairman
                    </Link>
                    <Link to="/md-message" className="dropdown-item py-2 px-3 font-weight-semibold">
                      <i className="fas fa-user-md mr-2" style={{ color: '#00984A' }}></i> Message From MD
                    </Link>
                    <Link to="/management-team" className="dropdown-item py-2 px-3 font-weight-semibold">
                      <i className="fas fa-users mr-2" style={{ color: '#00984A' }}></i> Management Team
                    </Link>
                    <Link to="/history" className="dropdown-item py-2 px-3 font-weight-semibold">
                      <i className="fas fa-history mr-2" style={{ color: '#00984A' }}></i> Hospital History
                    </Link>
                  </div>
                </li>

                {/* Specialities Mega Menu */}
                <li
                  className="nav-item dropdown position-static flex-shrink-0"
                  onMouseEnter={() => handleMouseEnter('specialities')}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href="#specialities"
                    onClick={(e) => handleDropdownClick('specialities', e)}
                    className="nav-link font-weight-bold px-2 px-xl-3 dropdown-toggle"
                    style={{
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      color: activeDropdown === 'specialities' ? '#00984A' : '#222222'
                    }}
                  >
                    Specialities <i className={`fas fa-chevron-down small ml-1 ${activeDropdown === 'specialities' ? 'fa-rotate-180' : ''}`} style={{ color: activeDropdown === 'specialities' ? '#00984A' : '#777' }}></i>
                  </a>
                  <div
                    className="dropdown-menu shadow-lg border-0 p-4 w-100"
                    onMouseEnter={() => handleMouseEnter('specialities')}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      display: activeDropdown === 'specialities' ? 'block' : 'none',
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: '100%',
                      maxHeight: '520px',
                      overflowY: 'auto',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                      zIndex: 10000
                    }}
                  >
                    {/* Header bar inside Mega Menu */}
                    <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom flex-wrap">
                      <div className="d-flex align-items-center mb-2 mb-md-0">
                        <h5 className="font-weight-bold mb-0 mr-3" style={{ color: '#00984A' }}>
                          <i className="fas fa-stethoscope mr-2"></i> Clinical Specialities & Departments ({specialities.length})
                        </h5>
                        <Link to="/package" className="btn btn-sm btn-outline-success font-weight-bold">
                          View Doctors Directory
                        </Link>
                      </div>

                      {/* Live Quick Filter Input */}
                      <div style={{ maxWidth: '280px', width: '100%' }}>
                        <div className="input-group input-group-sm">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Filter department..."
                            value={specSearch}
                            onChange={(e) => setSpecSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="input-group-append">
                            <span className="input-group-text bg-light">
                              <i className="fas fa-search text-muted"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Columns of Specialities */}
                    <div className="row">
                      {specColumns.map((col, cIdx) => (
                        <div key={cIdx} className="col-lg-3 col-md-6 mb-3">
                          <ul className="list-unstyled mb-0">
                            {col.map((sp) => (
                              <li key={sp.sp_id} className="mb-2">
                                <Link
                                  to={`/speciality/${sp.sp_id}`}
                                  className="dropdown-link text-dark small font-weight-semibold text-decoration-none d-block text-truncate py-1 px-2 rounded hover-bg-light"
                                  title={sp.sp_name}
                                  style={{ transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
                                >
                                  <i className="fas fa-check-circle mr-2" style={{ fontSize: '11px', color: '#00984A' }}></i>
                                  <span className="text-truncate">{sp.sp_name}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>

                {/* Patients Mega Menu */}
                <li
                  className="nav-item dropdown position-static flex-shrink-0"
                  onMouseEnter={() => handleMouseEnter('patients')}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href="#patients"
                    onClick={(e) => handleDropdownClick('patients', e)}
                    className="nav-link font-weight-bold px-2 px-xl-3 dropdown-toggle"
                    style={{
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      color: activeDropdown === 'patients' ? '#00984A' : '#222222'
                    }}
                  >
                    Patients <i className={`fas fa-chevron-down small ml-1 ${activeDropdown === 'patients' ? 'fa-rotate-180' : ''}`} style={{ color: activeDropdown === 'patients' ? '#00984A' : '#777' }}></i>
                  </a>
                  <div
                    className="dropdown-menu shadow-lg border-0 p-4 w-100"
                    onMouseEnter={() => handleMouseEnter('patients')}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      display: activeDropdown === 'patients' ? 'block' : 'none',
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: '100%',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                      zIndex: 10000
                    }}
                  >
                    <div className="row">
                      {/* Col 1 */}
                      <div className="col-lg-4 mb-3 border-right pr-4">
                        <h6 className="font-weight-bold text-uppercase mb-3" style={{ color: '#00984A' }}>
                          <i className="fas fa-file-invoice-dollar mr-2"></i> Admission & Tariff
                        </h6>
                        <ul className="list-unstyled mb-0" style={{ lineHeight: '2.4' }}>
                          <li><Link to="/admission" className="text-dark small font-weight-semibold text-decoration-none d-block py-1 hover-text-primary"><i className="fas fa-angle-right text-muted mr-2"></i> Admission & Payment Guide</Link></li>
                          <li><Link to="/rates" className="text-dark small font-weight-semibold text-decoration-none d-block py-1 hover-text-primary"><i className="fas fa-angle-right text-muted mr-2"></i> Rate Charts & Bed Rent</Link></li>
                          <li><Link to="/corporate-patients" className="text-dark small font-weight-semibold text-decoration-none d-block py-1 hover-text-primary"><i className="fas fa-angle-right text-muted mr-2"></i> Corporate Patients Service</Link></li>
                          <li><Link to="/amenities" className="text-dark small font-weight-semibold text-decoration-none d-block py-1 hover-text-primary"><i className="fas fa-angle-right text-muted mr-2"></i> Hospital Amenities</Link></li>
                          <li><Link to="/vaccination" className="text-dark small font-weight-semibold text-decoration-none d-block py-1 hover-text-primary"><i className="fas fa-angle-right text-muted mr-2"></i> Vaccination Centre</Link></li>
                        </ul>
                      </div>

                      {/* Col 2 */}
                      <div className="col-lg-4 mb-3 border-right px-4">
                        <h6 className="font-weight-bold text-uppercase mb-3" style={{ color: '#00984A' }}>
                          <i className="fas fa-procedures mr-2"></i> Inpatient & Outpatient
                        </h6>
                        <ul className="list-unstyled mb-0" style={{ lineHeight: '2.4' }}>
                          <li><Link to="/location-map" className="text-dark small font-weight-semibold text-decoration-none d-block py-1 hover-text-primary"><i className="fas fa-angle-right text-muted mr-2"></i> Hospital Location Map</Link></li>
                          <li><Link to="/patient-facilities" className="text-dark small font-weight-semibold text-decoration-none d-block py-1 hover-text-primary"><i className="fas fa-angle-right text-muted mr-2"></i> In-Patient Facilities</Link></li>
                          <li><Link to="/indoor" className="text-dark small font-weight-semibold text-decoration-none d-block py-1 hover-text-primary"><i className="fas fa-angle-right text-muted mr-2"></i> Indoor Service</Link></li>
                          <li><Link to="/outdoor" className="text-dark small font-weight-semibold text-decoration-none d-block py-1 hover-text-primary"><i className="fas fa-angle-right text-muted mr-2"></i> Outdoor Service (OPD)</Link></li>
                        </ul>
                      </div>

                      {/* Col 3 */}
                      <div className="col-lg-4 mb-3 pl-4">
                        <h6 className="font-weight-bold text-uppercase mb-3" style={{ color: '#00984A' }}>
                          <i className="fas fa-hand-holding-medical mr-2"></i> Patient Support & Services
                        </h6>
                        <ul className="list-unstyled mb-0" style={{ lineHeight: '2.4' }}>
                          <li><Link to="/enquiry" className="text-dark small font-weight-semibold text-decoration-none d-block py-1 hover-text-primary"><i className="fas fa-angle-right text-muted mr-2"></i> Your Enquiry</Link></li>
                          <li><Link to="/faqs" className="text-dark small font-weight-semibold text-decoration-none d-block py-1 hover-text-primary"><i className="fas fa-angle-right text-muted mr-2"></i> FAQs (Questions & Answers)</Link></li>
                          <li><Link to="/birth-certificate" className="small font-weight-bold text-decoration-none d-block py-1 hover-text-primary" style={{ color: '#00984A' }}><i className="fas fa-certificate mr-2"></i> Verify Birth Certificate</Link></li>
                          <li><Link to="/blood-bank" className="text-dark small font-weight-semibold text-decoration-none d-block py-1 hover-text-primary"><i className="fas fa-angle-right text-muted mr-2"></i> Blood Bank & Apheresis</Link></li>
                          <li><Link to="/testimonial" className="text-dark small font-weight-semibold text-decoration-none d-block py-1 hover-text-primary"><i className="fas fa-angle-right text-muted mr-2"></i> Patient Testimonials</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>

                {/* Media Dropdown */}
                <li
                  className="nav-item dropdown position-relative flex-shrink-0"
                  onMouseEnter={() => handleMouseEnter('media')}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href="#media"
                    onClick={(e) => handleDropdownClick('media', e)}
                    className="nav-link font-weight-bold px-2 px-xl-3 dropdown-toggle"
                    style={{
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      color: activeDropdown === 'media' ? '#00984A' : '#222222'
                    }}
                  >
                    Media <i className={`fas fa-chevron-down small ml-1 ${activeDropdown === 'media' ? 'fa-rotate-180' : ''}`} style={{ color: activeDropdown === 'media' ? '#00984A' : '#777' }}></i>
                  </a>
                  <div
                    className="dropdown-menu shadow border-0 py-2"
                    onMouseEnter={() => handleMouseEnter('media')}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      display: activeDropdown === 'media' ? 'block' : 'none',
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      minWidth: '220px',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                      padding: '10px 0',
                      zIndex: 10000
                    }}
                  >
                    <Link to="/news-event" className="dropdown-item py-2 px-3 font-weight-semibold">
                      <i className="fas fa-newspaper mr-2" style={{ color: '#00984A' }}></i> News and Events
                    </Link>
                    <Link to="/photo-gallery" className="dropdown-item py-2 px-3 font-weight-semibold">
                      <i className="fas fa-images mr-2" style={{ color: '#00984A' }}></i> Photo Gallery
                    </Link>
                    <Link to="/video-gallery" className="dropdown-item py-2 px-3 font-weight-semibold">
                      <i className="fas fa-video mr-2" style={{ color: '#00984A' }}></i> Video Gallery
                    </Link>
                  </div>
                </li>

                {/* Find Doctors */}
                <li className="nav-item flex-shrink-0">
                  <Link
                    to="/package"
                    className="nav-link font-weight-bold px-2 px-xl-3"
                    style={{ fontSize: '14px', whiteSpace: 'nowrap', color: location.pathname === '/package' ? '#00984A' : '#222222' }}
                  >
                    Find Doctors
                  </Link>
                </li>

                {/* Contact Us */}
                <li className="nav-item flex-shrink-0">
                  <Link
                    to="/contact-us"
                    className="nav-link font-weight-bold px-2 px-xl-3"
                    style={{ fontSize: '14px', whiteSpace: 'nowrap', color: location.pathname === '/contact-us' ? '#00984A' : '#222222' }}
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Mobile / Tablet Hamburger Button */}
            <div className="d-lg-none d-flex align-items-center">
              <a
                href="tel:09666787800"
                className="btn btn-sm btn-outline-success mr-2 font-weight-bold"
                title="Call PMCH Emergency"
              >
                <i className="fas fa-phone-alt"></i> Call
              </a>
              <button
                className="btn btn-outline-dark px-3 py-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation"
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} fa-lg`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Full Responsive Menu Drawer */}
        {mobileMenuOpen && (
          <div
            className="d-lg-none border-top shadow-lg"
            style={{
              maxHeight: '80vh',
              overflowY: 'auto',
              backgroundColor: '#ffffff',
              padding: '15px'
            }}
          >
            {/* Quick Mobile Action Links */}
            <div className="d-flex mb-3 pb-2 border-bottom">
              <Link to="/contact-us" className="btn btn-sm btn-block mr-2 font-weight-bold text-white" style={{ backgroundColor: '#00984A' }}>
                <i className="fas fa-calendar-check mr-1"></i> Get Appointment
              </Link>
              <Link to="/birth-certificate" className="btn btn-outline-success btn-sm btn-block mt-0 font-weight-bold">
                <i className="fas fa-certificate mr-1"></i> Birth Certificate
              </Link>
            </div>

            <ul className="list-unstyled mb-0" style={{ fontSize: '15px' }}>
              {/* Home */}
              <li className="border-bottom py-2">
                <Link to="/" className="text-dark font-weight-bold d-block">
                  <i className="fas fa-home mr-2" style={{ color: '#00984A' }}></i> Home
                </Link>
              </li>

              {/* About PMCH Accordion */}
              <li className="border-bottom py-2">
                <div
                  className="d-flex justify-content-between align-items-center cursor-pointer"
                  onClick={() => toggleMobileAccordion('about')}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="font-weight-bold text-dark">
                    <i className="fas fa-info-circle mr-2" style={{ color: '#00984A' }}></i> About PMCH
                  </span>
                  <i className={`fas ${mobileAccordions.about ? 'fa-chevron-up' : 'fa-chevron-down text-muted'}`} style={{ color: mobileAccordions.about ? '#00984A' : undefined }}></i>
                </div>
                {mobileAccordions.about && (
                  <ul className="list-unstyled pl-4 mt-2" style={{ lineHeight: '2.2' }}>
                    <li><Link to="/about-us" className="text-muted d-block">At a glance</Link></li>
                    <li><Link to="/chairman-message" className="text-muted d-block">Message From Chairman</Link></li>
                    <li><Link to="/md-message" className="text-muted d-block">Message From MD</Link></li>
                    <li><Link to="/management-team" className="text-muted d-block">Management Team</Link></li>
                    <li><Link to="/history" className="text-muted d-block">Hospital History</Link></li>
                  </ul>
                )}
              </li>

              {/* Specialities Accordion */}
              <li className="border-bottom py-2">
                <div
                  className="d-flex justify-content-between align-items-center cursor-pointer"
                  onClick={() => toggleMobileAccordion('specialities')}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="font-weight-bold text-dark">
                    <i className="fas fa-stethoscope mr-2" style={{ color: '#00984A' }}></i> Specialities ({specialities.length})
                  </span>
                  <i className={`fas ${mobileAccordions.specialities ? 'fa-chevron-up' : 'fa-chevron-down text-muted'}`} style={{ color: mobileAccordions.specialities ? '#00984A' : undefined }}></i>
                </div>
                {mobileAccordions.specialities && (
                  <div className="pl-3 mt-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    <Link to="/package" className="font-weight-bold d-block py-1 mb-1" style={{ color: '#00984A' }}>
                      → View All Doctor Schedules
                    </Link>
                    {specialities.map((sp) => (
                      <Link
                        key={sp.sp_id}
                        to={`/speciality/${sp.sp_id}`}
                        className="text-muted d-block py-1 text-truncate"
                      >
                        • {sp.sp_name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>

              {/* Patients Accordion */}
              <li className="border-bottom py-2">
                <div
                  className="d-flex justify-content-between align-items-center cursor-pointer"
                  onClick={() => toggleMobileAccordion('patients')}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="font-weight-bold text-dark">
                    <i className="fas fa-user-injured mr-2" style={{ color: '#00984A' }}></i> Patients & Services
                  </span>
                  <i className={`fas ${mobileAccordions.patients ? 'fa-chevron-up' : 'fa-chevron-down text-muted'}`} style={{ color: mobileAccordions.patients ? '#00984A' : undefined }}></i>
                </div>
                {mobileAccordions.patients && (
                  <ul className="list-unstyled pl-4 mt-2" style={{ lineHeight: '2.2' }}>
                    <li><Link to="/admission" className="text-muted d-block">Admission Guide</Link></li>
                    <li><Link to="/rates" className="text-muted d-block">Rate Charts & Bed Rent</Link></li>
                    <li><Link to="/corporate-patients" className="text-muted d-block">Corporate Patients</Link></li>
                    <li><Link to="/amenities" className="text-muted d-block">Hospital Amenities</Link></li>
                    <li><Link to="/vaccination" className="text-muted d-block">Vaccination Centre</Link></li>
                    <li><Link to="/indoor" className="text-muted d-block">Indoor Services</Link></li>
                    <li><Link to="/outdoor" className="text-muted d-block">Outdoor Services (OPD)</Link></li>
                    <li><Link to="/patient-facilities" className="text-muted d-block">In-Patient Facilities</Link></li>
                    <li><Link to="/location-map" className="text-muted d-block">Hospital Location Map</Link></li>
                    <li><Link to="/enquiry" className="text-muted d-block">Your Enquiry</Link></li>
                    <li><Link to="/faqs" className="text-muted d-block">FAQs</Link></li>
                    <li><Link to="/birth-certificate" className="font-weight-bold d-block" style={{ color: '#00984A' }}>Verify Birth Certificate</Link></li>
                    <li><Link to="/blood-bank" className="text-muted d-block">Blood Bank</Link></li>
                    <li><Link to="/testimonial" className="text-muted d-block">Patient Testimonials</Link></li>
                  </ul>
                )}
              </li>

              {/* Media Accordion */}
              <li className="border-bottom py-2">
                <div
                  className="d-flex justify-content-between align-items-center cursor-pointer"
                  onClick={() => toggleMobileAccordion('media')}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="font-weight-bold text-dark">
                    <i className="fas fa-photo-video mr-2" style={{ color: '#00984A' }}></i> Media & News
                  </span>
                  <i className={`fas ${mobileAccordions.media ? 'fa-chevron-up' : 'fa-chevron-down text-muted'}`} style={{ color: mobileAccordions.media ? '#00984A' : undefined }}></i>
                </div>
                {mobileAccordions.media && (
                  <ul className="list-unstyled pl-4 mt-2" style={{ lineHeight: '2.2' }}>
                    <li><Link to="/news-event" className="text-muted d-block">News and Events</Link></li>
                    <li><Link to="/photo-gallery" className="text-muted d-block">Photo Gallery</Link></li>
                    <li><Link to="/video-gallery" className="text-muted d-block">Video Gallery</Link></li>
                  </ul>
                )}
              </li>

              {/* Find Doctors */}
              <li className="border-bottom py-2">
                <Link to="/package" className="text-dark font-weight-bold d-block">
                  <i className="fas fa-user-md mr-2" style={{ color: '#00984A' }}></i> Find Doctors
                </Link>
              </li>

              {/* Contact Us */}
              <li className="py-2">
                <Link to="/contact-us" className="text-dark font-weight-bold d-block">
                  <i className="fas fa-map-marker-alt mr-2" style={{ color: '#00984A' }}></i> Contact Us
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
    </>
  );
}
