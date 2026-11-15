import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

// Helper to sanitize HTML tags and placeholder dots
const cleanField = (str) => {
  if (!str) return '';
  let clean = String(str)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  if (/^[\s.*-]*$/.test(clean)) return '';
  return clean;
};

// Image resolver helper
const getDoctorImage = (img) => {
  if (!img) return '/male.jpg';
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  if (img.startsWith('/')) return img;
  if (img === 'male.jpg' || img === 'female.jpg' || img === 'doctor.jpg') return `/${img}`;
  return `/doctor/${img}`;
};

// Exact Popular Pharmaceuticals Featured Medications Data from Website
const FEATURED_MEDICATIONS = [
  {
    id: 1,
    name: 'Adecard',
    generic: 'Vitamin A, D & E',
    category: 'Nutritional Supplement',
    img: '/medications/adecard.webp',
    link: 'https://www.popular-pharma.com/products/82',
    color: '#00984A'
  },
  {
    id: 2,
    name: 'Vonomax',
    generic: 'Vonoprazan 20mg',
    category: 'Acid Reflux / GERD',
    img: '/medications/vonomax.webp',
    link: 'https://www.popular-pharma.com/products/519',
    color: '#ea7726'
  },
  {
    id: 3,
    name: 'Ambrosol',
    generic: 'Ambroxol Hydrochloride 30mg',
    category: 'Mucolytic Cough Syrup',
    img: '/medications/ambrosol.webp',
    link: 'https://www.popular-pharma.com/products/82',
    color: '#00984A'
  },
  {
    id: 4,
    name: 'Amlovas',
    generic: 'Amlodipine Besilate 5mg',
    category: 'Blood Pressure / Cardiac',
    img: '/medications/amlovas.webp',
    link: 'https://www.popular-pharma.com/products/68',
    color: '#00984A'
  },
  {
    id: 5,
    name: 'Anorel',
    generic: 'Ketorolac Tromethamine 10mg',
    category: 'Pain Relief (NSAID)',
    img: '/medications/anorel.webp',
    link: 'https://www.popular-pharma.com/products/117',
    color: '#00984A'
  },
  {
    id: 6,
    name: 'Cebergol',
    generic: 'Cabergoline 0.5mg',
    category: 'Endocrinology Care',
    img: '/medications/cebergol.webp',
    link: 'https://www.popular-pharma.com/products/129',
    color: '#1d4ed8'
  }
];

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [similarDoctors, setSimilarDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    api.get(`/doctors/${id}`)
      .then((res) => {
        if (res.data?.success && res.data.data) {
          const d = res.data.data;
          setDoctor(d);
          setSimilarDoctors(d.similarDoctors || []);

          // SEO Title update
          const seoTitle = d.seo?.meta_title || `${cleanField(d.dr_name)} - ${cleanField(d.dr_degree)} | Popular Medical College Hospital`;
          document.title = seoTitle;
        } else {
          setDoctor(null);
        }
      })
      .catch((err) => {
        console.error('Error loading doctor details:', err);
        setDoctor(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-5 text-center my-5" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-success" style={{ width: '3.5rem', height: '3.5rem' }} role="status">
          <span className="sr-only">Loading profile...</span>
        </div>
        <h5 className="mt-3 font-weight-bold text-dark">Loading Consultant Profile...</h5>
        <p className="text-muted small">Please wait while credentials and schedules are retrieved.</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="alert alert-warning p-5 rounded-lg shadow-sm">
          <i className="fas fa-user-slash fa-3x text-warning mb-3"></i>
          <h3 className="font-weight-bold text-dark">Doctor Profile Not Found</h3>
          <p className="text-muted">The doctor profile you are seeking could not be found or is currently inactive.</p>
          <Link to="/package" className="btn btn-success px-4 font-weight-bold" style={{ backgroundColor: '#00984A' }}>
            <i className="fas fa-arrow-left mr-1"></i> Return to Doctors Directory
          </Link>
        </div>
      </div>
    );
  }

  const cleanName = cleanField(doctor.dr_name);
  const cleanDegree = cleanField(doctor.dr_degree);
  const cleanEducation = cleanField(doctor.dr_education);
  const cleanExp = cleanField(doctor.dr_exp_sum);
  const cleanVisit = cleanField(doctor.dr_visit_hrs) || 'By Appointment';
  const isAbsent = doctor.dr_absent_from && doctor.dr_absent_to;

  return (
    <div className="doctor-profile-page" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* ========================================================
          1. BREADCRUMBS & HERO SECTION
          ======================================================== */}
      <div
        className="py-4 text-white"
        style={{
          background: 'linear-gradient(135deg, #00984A 0%, #006833 60%, #014d26 100%)',
          boxShadow: '0 4px 15px rgba(0, 152, 74, 0.2)'
        }}
      >
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-transparent p-0 mb-2 small text-white-50">
              <li className="breadcrumb-item">
                <Link to="/" className="text-white">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/package" className="text-white">Doctors</Link>
              </li>
              <li className="breadcrumb-item">
                <span className="text-white-50">{doctor.speciality_names || 'Specialist'}</span>
              </li>
              <li className="breadcrumb-item active text-white font-weight-bold" aria-current="page">
                {cleanName}
              </li>
            </ol>
          </nav>
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <h2 className="font-weight-bold mb-0 text-white" style={{ fontSize: '26px' }}>
              Specialist Consultant Profile
            </h2>
            <Link to="/package" className="btn btn-sm btn-outline-light font-weight-bold mt-2 mt-sm-0" style={{ borderRadius: '20px' }}>
              <i className="fas fa-arrow-left mr-1"></i> View All Doctors
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-4 my-2">
        <div className="row">
          {/* ========================================================
              2. LEFT COLUMN: DOCTOR CARD + SIMILAR DOCTORS
              ======================================================== */}
          <div className="col-lg-4 col-md-5 mb-4">
            {/* Doctor Profile Card */}
            <div
              className="card border-0 shadow-sm rounded-xl p-3 bg-white mb-4 text-center"
              style={{
                borderRadius: '16px',
                borderTop: '5px solid #00984A',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.06)'
              }}
            >
              {/* Photo with status badge */}
              <div
                className="position-relative mx-auto mb-3 rounded-xl overflow-hidden shadow-sm"
                style={{
                  width: '200px',
                  height: '240px',
                  borderRadius: '14px',
                  backgroundColor: '#f1f5f9'
                }}
              >
                <img
                  src={getDoctorImage(doctor.dr_image)}
                  alt={cleanName}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    if (e.target.src.includes('/doctor/')) {
                      e.target.src = e.target.src.replace('/doctor/', '/uploads/');
                    } else if (!e.target.src.includes('male.jpg')) {
                      e.target.src = '/male.jpg';
                    }
                  }}
                />
                {isAbsent ? (
                  <span
                    className="badge badge-danger position-absolute font-weight-bold"
                    style={{ top: '10px', right: '10px', padding: '5px 8px', borderRadius: '6px' }}
                  >
                    ON LEAVE
                  </span>
                ) : (
                  <span
                    className="badge badge-success position-absolute font-weight-bold"
                    style={{ top: '10px', right: '10px', padding: '5px 8px', borderRadius: '6px', backgroundColor: '#00984A' }}
                  >
                    <i className="fas fa-check-circle mr-1"></i> Active
                  </span>
                )}
              </div>

              {/* Name & Speciality */}
              <h4 className="font-weight-bold mb-1" style={{ color: '#00984A', fontSize: '19px', lineHeight: '1.3' }}>
                {cleanName}
              </h4>
              <div className="mb-2">
                <span className="badge px-3 py-1 font-weight-bold" style={{ backgroundColor: '#e6f7ef', color: '#007a3b', borderRadius: '6px' }}>
                  <i className="fas fa-stethoscope mr-1"></i> {doctor.speciality_names || 'Specialist Consultant'}
                </span>
              </div>

              <p className="text-muted small mb-3 px-2" style={{ lineHeight: '1.4' }}>
                {cleanDegree}
              </p>

              {/* Action Buttons */}
              <div className="p-3 bg-light rounded-lg border text-left mb-3 small">
                <div className="mb-2">
                  <i className="fas fa-hospital-alt mr-2" style={{ color: '#00984A' }}></i>
                  <strong>Hospital:</strong> Popular Medical College Hospital
                </div>
                <div className="mb-2">
                  <i className="fas fa-map-marker-alt mr-2 text-danger"></i>
                  <strong>Chamber:</strong> House: 08, Road: 02, Dhanmondi, Dhaka
                </div>
                <div>
                  <i className="far fa-clock mr-2 text-primary"></i>
                  <strong>Visiting:</strong> {cleanVisit}
                </div>
              </div>

              <Link
                to={`/contact-us?doctor=${doctor.dr_id}&name=${encodeURIComponent(cleanName)}`}
                className="btn btn-success btn-block font-weight-bold py-2 shadow-sm"
                style={{ backgroundColor: '#00984A', borderRadius: '10px', fontSize: '15px' }}
              >
                <i className="fas fa-calendar-check mr-2"></i> Book Appointment / Serial
              </Link>
            </div>

            {/* Quick Hotline Call Card */}
            <div
              className="card border-0 shadow-sm rounded-xl p-3 text-white mb-4"
              style={{
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #0c1a14 0%, #172c22 100%)'
              }}
            >
              <div className="d-flex align-items-center mb-2">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mr-3 shadow"
                  style={{ width: '42px', height: '42px', backgroundColor: '#00984A' }}
                >
                  <i className="fas fa-phone-alt text-white"></i>
                </div>
                <div>
                  <div className="small text-white-50">Appointment Serial Hotline</div>
                  <h5 className="font-weight-bold mb-0 text-white">09666 787800</h5>
                </div>
              </div>
              <small className="text-white-50 d-block mt-1">
                Call our direct serial desk for instant schedule confirmation.
              </small>
            </div>

            {/* Similar Doctors in this Department (Sidebar View) */}
            {similarDoctors.length > 0 && (
              <div className="card border-0 shadow-sm rounded-xl p-3 bg-white" style={{ borderRadius: '16px' }}>
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                  <h6 className="font-weight-bold text-dark mb-0">
                    <i className="fas fa-users text-success mr-2"></i>
                    Similar Doctors
                  </h6>
                  <span className="badge badge-light text-primary font-weight-bold">
                    {similarDoctors.length} Specialists
                  </span>
                </div>
                <div className="list-group list-group-flush">
                  {similarDoctors.slice(0, 5).map((simDr) => (
                    <div
                      key={simDr.dr_id}
                      onClick={() => navigate(`/doctor/${simDr.dr_id}`)}
                      className="list-group-item list-group-item-action px-0 py-2 d-flex align-items-center border-0 cursor-pointer"
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={getDoctorImage(simDr.dr_image)}
                        alt={simDr.dr_name}
                        className="rounded-circle mr-3 shadow-sm flex-shrink-0"
                        style={{ width: '44px', height: '44px', objectFit: 'cover' }}
                        onError={(e) => {
                          if (e.target.src.includes('/doctor/')) {
                            e.target.src = e.target.src.replace('/doctor/', '/uploads/');
                          } else if (!e.target.src.includes('male.jpg')) {
                            e.target.src = '/male.jpg';
                          }
                        }}
                      />
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="font-weight-bold text-dark small text-truncate" title={simDr.dr_name}>
                          {cleanField(simDr.dr_name)}
                        </div>
                        <div className="text-muted small text-truncate" style={{ fontSize: '11px' }}>
                          {cleanField(simDr.dr_degree)}
                        </div>
                      </div>
                      <i className="fas fa-chevron-right text-muted small ml-2"></i>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ========================================================
              3. RIGHT COLUMN: DETAILS TABS & CHAMBER INFO
              ======================================================== */}
          <div className="col-lg-8 col-md-7 mb-4">
            {/* Navigation Tabs */}
            <div className="card border-0 shadow-sm rounded-xl bg-white mb-4" style={{ borderRadius: '16px' }}>
              <div className="card-header bg-white border-0 pt-3 px-3 pb-0">
                <ul className="nav nav-pills card-header-pills">
                  <li className="nav-item">
                    <button
                      className={`nav-link font-weight-bold mr-2 ${activeTab === 'overview' ? 'active' : 'text-dark'}`}
                      style={{
                        borderRadius: '8px',
                        backgroundColor: activeTab === 'overview' ? '#00984A' : 'transparent',
                        color: activeTab === 'overview' ? '#ffffff' : '#334155'
                      }}
                      onClick={() => setActiveTab('overview')}
                    >
                      <i className="fas fa-info-circle mr-1"></i> Overview & Schedule
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link font-weight-bold mr-2 ${activeTab === 'qualifications' ? 'active' : 'text-dark'}`}
                      style={{
                        borderRadius: '8px',
                        backgroundColor: activeTab === 'qualifications' ? '#00984A' : 'transparent',
                        color: activeTab === 'qualifications' ? '#ffffff' : '#334155'
                      }}
                      onClick={() => setActiveTab('qualifications')}
                    >
                      <i className="fas fa-graduation-cap mr-1"></i> Qualifications
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link font-weight-bold ${activeTab === 'chamber' ? 'active' : 'text-dark'}`}
                      style={{
                        borderRadius: '8px',
                        backgroundColor: activeTab === 'chamber' ? '#00984A' : 'transparent',
                        color: activeTab === 'chamber' ? '#ffffff' : '#334155'
                      }}
                      onClick={() => setActiveTab('chamber')}
                    >
                      <i className="fas fa-clinic-medical mr-1"></i> Chamber & Serial
                    </button>
                  </li>
                </ul>
              </div>

              <div className="card-body p-4">
                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                  <div>
                    <h5 className="font-weight-bold text-dark mb-3">
                      About {cleanName}
                    </h5>
                    <p className="text-secondary" style={{ lineHeight: '1.7' }}>
                      {cleanExp || `${cleanName} is a prestigious specialist consultant practicing at Popular Medical College Hospital (PMCH), Dhanmondi. With comprehensive clinical training in ${doctor.speciality_names || 'Specialized Medicine'}, they deliver evidence-based, compassionate care for complex clinical ailments.`}
                    </p>

                    <h6 className="font-weight-bold text-dark mt-4 mb-3 border-bottom pb-2">
                      <i className="fas fa-id-card text-success mr-2"></i> Clinical Credentials
                    </h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="p-3 bg-light rounded-lg border">
                          <div className="text-muted small">Speciality Designation:</div>
                          <div className="font-weight-bold text-dark">{doctor.speciality_names || 'General Consultant'}</div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="p-3 bg-light rounded-lg border">
                          <div className="text-muted small">Degrees & Honors:</div>
                          <div className="font-weight-bold text-dark">{cleanDegree}</div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="p-3 bg-light rounded-lg border">
                          <div className="text-muted small">Consultation Hours:</div>
                          <div className="font-weight-bold text-success">{cleanVisit}</div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="p-3 bg-light rounded-lg border">
                          <div className="text-muted small">Practice Branch:</div>
                          <div className="font-weight-bold text-dark">PMCH Main Campus, Dhanmondi</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: QUALIFICATIONS */}
                {activeTab === 'qualifications' && (
                  <div>
                    <h5 className="font-weight-bold text-dark mb-3">
                      Academic Background & Experience
                    </h5>
                    {cleanEducation ? (
                      <div className="p-3 bg-light rounded border mb-3 text-secondary" style={{ lineHeight: '1.7' }}>
                        {cleanEducation}
                      </div>
                    ) : (
                      <div className="p-3 bg-light rounded border mb-3 text-secondary">
                        <div className="font-weight-bold text-dark mb-1">Degrees & Certifications:</div>
                        <div>{cleanDegree}</div>
                      </div>
                    )}

                    {cleanExp && (
                      <div className="mt-4">
                        <h6 className="font-weight-bold text-dark border-bottom pb-2 mb-3">
                          <i className="fas fa-award text-success mr-2"></i> Professional Experience
                        </h6>
                        <div className="p-3 bg-light rounded border text-secondary" style={{ lineHeight: '1.7' }}>
                          {cleanExp}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: CHAMBER & SERIAL */}
                {activeTab === 'chamber' && (
                  <div>
                    <h5 className="font-weight-bold text-dark mb-3">
                      Chamber Details & Visiting Schedule
                    </h5>
                    <div className="card bg-light border p-3 rounded-lg mb-4">
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <h6 className="font-weight-bold text-dark mb-1">
                            Popular Medical College Hospital, Dhanmondi
                          </h6>
                          <div className="text-muted small mb-2">
                            House: 08, Road: 02, Dhanmondi R/A, Dhaka-1205, Bangladesh
                          </div>
                          <div className="text-dark small">
                            <i className="far fa-clock text-success mr-1"></i>
                            <strong>Visiting Hours:</strong> {cleanVisit}
                          </div>
                        </div>
                        <div className="col-md-4 text-md-right mt-3 mt-md-0">
                          <Link
                            to={`/contact-us?doctor=${doctor.dr_id}&name=${encodeURIComponent(cleanName)}`}
                            className="btn btn-success font-weight-bold px-3 py-2"
                            style={{ backgroundColor: '#00984A', borderRadius: '8px' }}
                          >
                            <i className="fas fa-calendar-check mr-1"></i> Book Serial
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="alert alert-info border-0 rounded-lg small">
                      <i className="fas fa-info-circle mr-2"></i>
                      <strong>Important Patient Notice:</strong> Patient serial bookings open everyday from 8:00 AM. We recommend calling early to secure your doctor appointment slot.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ========================================================
                4. FEATURED MEDICATION SECTION (CONTINUOUS SMOOTH ROTATION)
                ======================================================== */}
            <div
              className="card border-0 shadow-sm rounded-xl p-4 bg-white mb-4"
              style={{
                borderRadius: '16px',
                border: '1px solid #eef2f6'
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="font-weight-bold text-dark mb-1">
                    <i className="fas fa-prescription-bottle-alt text-success mr-2"></i>
                    Featured Medications
                  </h5>
                  <div className="small text-muted">
                    Popular Pharmaceuticals Ltd. • Continuous Healthcare Formulations
                  </div>
                </div>
                <span
                  className="badge px-3 py-1 font-weight-bold"
                  style={{
                    backgroundColor: '#e6f7ef',
                    color: '#00984A',
                    borderRadius: '20px',
                    fontSize: '11px'
                  }}
                >
                  <i className="fas fa-sync-alt fa-spin mr-1"></i> Auto Rotating
                </span>
              </div>

              {/* Seamless Infinite Rotating Carousel (Hover to Pause) */}
              <div className="medication-ticker-wrapper overflow-hidden position-relative py-2">
                <div className="medication-track d-flex">
                  {/* Repeated for seamless infinite smooth looping */}
                  {[...FEATURED_MEDICATIONS, ...FEATURED_MEDICATIONS, ...FEATURED_MEDICATIONS].map((med, idx) => (
                    <a
                      key={`${med.id}-${idx}`}
                      href={med.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="medication-card card border-0 shadow-sm flex-shrink-0 mr-3 p-3 text-center text-decoration-none"
                      style={{
                        width: '160px',
                        borderRadius: '14px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title={`${med.name} (${med.generic}) - Popular Pharmaceuticals Ltd.`}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center p-2 mb-2 rounded w-100"
                        style={{
                          height: '75px',
                          backgroundColor: '#f8fafc'
                        }}
                      >
                        <img
                          src={med.img}
                          alt={med.name}
                          style={{
                            maxHeight: '65px',
                            maxWidth: '120px',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))'
                          }}
                          onError={(e) => {
                            if (!e.target.src.includes('populardiagnostic.com')) {
                              e.target.src = `https://www.populardiagnostic.com/assets/${med.name.charAt(0).toUpperCase() + med.name.slice(1).toLowerCase()}-BHtgK95a.webp`;
                            }
                          }}
                        />
                      </div>
                      <h6
                        className="font-weight-bold mb-1 text-truncate w-100"
                        style={{ color: med.color, fontSize: '14px' }}
                      >
                        {med.name}
                      </h6>
                      <div className="text-muted small text-truncate w-100" style={{ fontSize: '11px' }}>
                        {med.generic}
                      </div>
                      <span
                        className="badge mt-2 px-2 py-0.5 text-truncate w-100"
                        style={{
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          fontSize: '10px',
                          borderRadius: '4px'
                        }}
                      >
                        {med.category}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="text-center mt-2">
                <small className="text-muted font-italic">
                  * Hover over any medication card to pause rotation and view formula details.
                </small>
              </div>
            </div>

            {/* FAQ Accordion Section */}
            <div className="card border-0 shadow-sm rounded-xl p-4 bg-white" style={{ borderRadius: '16px' }}>
              <h5 className="font-weight-bold text-dark mb-3">
                <i className="fas fa-question-circle text-primary mr-2"></i>
                Frequently Asked Questions
              </h5>
              <div className="accordion" id="doctorFaq">
                <div className="border-bottom py-2">
                  <div className="font-weight-bold text-dark small mb-1">
                    Q: What are {cleanName}'s chamber hours?
                  </div>
                  <div className="text-muted small">
                    {cleanVisit} at Popular Medical College Hospital Dhanmondi campus.
                  </div>
                </div>
                <div className="border-bottom py-2">
                  <div className="font-weight-bold text-dark small mb-1">
                    Q: How can I book an appointment serial?
                  </div>
                  <div className="text-muted small">
                    You can click the "Book Appointment" button above, or call our direct hospital hotline at <strong>09666 787800</strong>.
                  </div>
                </div>
                <div className="py-2">
                  <div className="font-weight-bold text-dark small mb-1">
                    Q: Where is the hospital chamber located?
                  </div>
                  <div className="text-muted small">
                    Popular Medical College Hospital, House: 08, Road: 02, Dhanmondi, Dhaka-1205.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            5. FULL BOTTOM SECTION: SIMILAR DOCTORS GRID
            ======================================================== */}
        {similarDoctors.length > 0 && (
          <section className="mt-5 pt-4 border-top">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
              <div>
                <h4 className="font-weight-bold text-dark mb-1">
                  More Specialists in {doctor.speciality_names || 'this Department'}
                </h4>
                <p className="text-muted small mb-0">
                  Explore other senior medical consultants and clinical professors available for appointment.
                </p>
              </div>
              <Link to={`/package?speciality_id=${doctor.speciality_ids ? doctor.speciality_ids.split(',')[0] : ''}`} className="btn btn-outline-success btn-sm font-weight-bold mt-2 mt-sm-0" style={{ borderRadius: '20px' }}>
                View All {doctor.speciality_names} Doctors →
              </Link>
            </div>

            <div className="row">
              {similarDoctors.map((simDr) => (
                <div key={simDr.dr_id} className="col-xl-3 col-lg-4 col-md-6 col-12 mb-4 d-flex">
                  <div
                    className="card w-100 border-0 shadow-sm rounded-xl p-3 d-flex flex-column text-center popular-doctor-card"
                    style={{
                      borderRadius: '16px',
                      background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 65%, #f0fff4 100%)',
                      border: '1px solid #eef2f6',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/doctor/${simDr.dr_id}`)}
                  >
                    <div
                      className="mx-auto mb-3 rounded-lg overflow-hidden shadow-sm"
                      style={{ width: '130px', height: '140px', backgroundColor: '#f1f5f9' }}
                    >
                      <img
                        src={getDoctorImage(simDr.dr_image)}
                        alt={simDr.dr_name}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          if (e.target.src.includes('/doctor/')) {
                            e.target.src = e.target.src.replace('/doctor/', '/uploads/');
                          } else if (!e.target.src.includes('male.jpg')) {
                            e.target.src = '/male.jpg';
                          }
                        }}
                      />
                    </div>

                    <h6
                      className="font-weight-bold mb-1 text-truncate"
                      style={{ color: '#00984A', fontSize: '15px' }}
                      title={simDr.dr_name}
                    >
                      {cleanField(simDr.dr_name)}
                    </h6>
                    <div
                      className="text-muted small mb-2 text-truncate"
                      style={{ fontSize: '11px' }}
                      title={simDr.dr_degree}
                    >
                      {cleanField(simDr.dr_degree)}
                    </div>
                    <div className="small text-muted p-1 bg-light rounded mb-3 text-truncate" style={{ fontSize: '11px' }}>
                      <i className="far fa-clock mr-1 text-success"></i>
                      {cleanField(simDr.dr_visit_hrs) || 'By Appointment'}
                    </div>

                    <div className="mt-auto">
                      <Link
                        to={`/doctor/${simDr.dr_id}`}
                        className="btn btn-outline-success btn-sm btn-block font-weight-bold"
                        style={{ borderRadius: '8px', fontSize: '12px' }}
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Embedded CSS for Infinite Smooth Scrolling Medication Ticker */}
      <style>{`
        @keyframes scrollMedications {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .medication-track {
          width: max-content;
          animation: scrollMedications 28s linear infinite;
        }

        .medication-ticker-wrapper:hover .medication-track {
          animation-play-state: paused;
        }

        .medication-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 10px 20px -3px rgba(0, 152, 74, 0.2) !important;
          border-color: #86efac !important;
        }

        .popular-doctor-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 25px -5px rgba(0, 152, 74, 0.15) !important;
          border-color: #86efac !important;
        }
      `}</style>
    </div>
  );
}
