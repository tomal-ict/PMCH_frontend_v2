import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

// Clean raw HTML tags & entities
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

// Image resolver helper (All doctor photos are in /doctor/)
const getDoctorImage = (img) => {
  if (!img || img === 'male.jpg' || img === 'female.jpg' || img === 'doctor.jpg') {
    return '/male.jpg';
  }
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  if (img.startsWith('/')) return img;
  return `/doctor/${img}`;
};

export default function Package() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || searchParams.get('name') || '');
  const [selectedSpec, setSelectedSpec] = useState(searchParams.get('speciality_id') || searchParams.get('sp_id') || '');
  const [selectedDay, setSelectedDay] = useState('');
  const [loading, setLoading] = useState(true);

  // Pagination / Load More state (24 doctors per batch)
  const [visibleCount, setVisibleCount] = useState(24);

  // Doctor Detail Quick View Modal
  const [selectedDoctorModal, setSelectedDoctorModal] = useState(null);

  useEffect(() => {
    // Initial fetch of specialities and all doctors
    Promise.all([
      api.get('/specialities'),
      api.get('/doctors')
    ])
      .then(([specRes, drRes]) => {
        if (specRes.data?.success) setSpecialities(specRes.data.data || []);
        if (drRes.data?.success) setDoctors(drRes.data.data || []);
      })
      .catch((err) => console.error('Error fetching doctors directory:', err))
      .finally(() => setLoading(false));
  }, []);

  // Filter doctors locally for instantaneous responsiveness
  const filteredDoctors = useMemo(() => {
    return doctors.filter((dr) => {
      // 1. Name or Degree search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const nameMatch = cleanField(dr.dr_name).toLowerCase().includes(query);
        const degreeMatch = cleanField(dr.dr_degree).toLowerCase().includes(query);
        const specMatch = (dr.speciality_names || '').toLowerCase().includes(query);
        if (!nameMatch && !degreeMatch && !specMatch) return false;
      }

      // 2. Speciality filter
      if (selectedSpec) {
        const specIds = (dr.speciality_ids || '').split(',').map((id) => id.trim());
        if (!specIds.includes(String(selectedSpec))) return false;
      }

      // 3. Day filter
      if (selectedDay) {
        const visit = (dr.dr_visit_hrs || '').toLowerCase();
        const practice = (dr.practice_days || '').toLowerCase();
        const dayQuery = selectedDay.toLowerCase();
        if (
          !visit.includes(dayQuery) &&
          !practice.includes(dayQuery) &&
          !practice.includes('everyday') &&
          !visit.includes('everyday') &&
          !visit.includes('daily')
        ) {
          return false;
        }
      }

      return true;
    });
  }, [doctors, searchTerm, selectedSpec, selectedDay]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSpec('');
    setSelectedDay('');
    setVisibleCount(24);
    setSearchParams({});
  };

  // Doctors currently visible in grid
  const displayedDoctors = filteredDoctors.slice(0, visibleCount);

  // Handle Load More
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 24);
  };

  return (
    <div className="find-doctors-page" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* ========================================================
          1. HEADER BANNER SECTION
          ======================================================== */}
      <section
        className="position-relative text-center text-white py-5"
        style={{
          background: 'linear-gradient(135deg, #00984A 0%, #006833 60%, #014d26 100%)',
          boxShadow: '0 4px 20px rgba(0, 152, 74, 0.25)'
        }}
      >
        <div className="container py-3">
          <div className="badge badge-light px-3 py-1 font-weight-bold mb-3 text-uppercase" style={{ color: '#00984A', letterSpacing: '1px', fontSize: '11px', borderRadius: '20px' }}>
            <i className="fas fa-hospital-user mr-1"></i> Popular Medical College Hospital
          </div>
          <h1 className="font-weight-bold display-4 mb-2 text-white" style={{ letterSpacing: '-0.5px' }}>
            Find Our Doctors & Specialists
          </h1>
          <p className="lead mx-auto mb-3 text-white-50" style={{ maxWidth: '720px', fontSize: '17px' }}>
            Consult with our world-class medical professors, senior specialist consultants, and healthcare experts.
          </p>

          <div className="d-inline-flex align-items-center bg-white rounded-pill px-4 py-2 shadow-sm text-dark font-weight-bold small">
            <span className="text-success mr-2">
              <i className="fas fa-check-circle"></i>
            </span>
            <span>
              Showing <strong style={{ color: '#00984A' }}>{filteredDoctors.length}</strong> Qualified Doctors & Faculty
            </span>
            <span className="mx-2 text-muted">•</span>
            <span className="text-muted">{specialities.length} Clinical Specialities</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. STICKY FILTER & SEARCH TOOLBAR (Popular Diagnostic Style)
          ======================================================== */}
      <div
        className="container"
        style={{
          marginTop: '-30px',
          position: 'sticky',
          top: '70px',
          zIndex: 100
        }}
      >
        <div
          className="card border-0 shadow-lg rounded-xl p-3 p-md-4 bg-white"
          style={{
            borderRadius: '16px',
            border: '1px solid rgba(0, 152, 74, 0.15)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div className="row align-items-center">
            {/* Search by doctor name */}
            <div className="col-lg-4 col-md-6 mb-2 mb-lg-0">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text bg-light border-right-0" style={{ borderRadius: '10px 0 0 10px' }}>
                    <i className="fas fa-search text-muted"></i>
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control bg-light border-left-0"
                  placeholder="Search by doctor's name, degree..."
                  style={{ borderRadius: '0 10px 10px 0', height: '46px', fontSize: '14px' }}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setVisibleCount(24);
                  }}
                />
              </div>
            </div>

            {/* Speciality Filter */}
            <div className="col-lg-4 col-md-6 mb-2 mb-lg-0">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text bg-light border-right-0" style={{ borderRadius: '10px 0 0 10px' }}>
                    <i className="fas fa-stethoscope" style={{ color: '#00984A' }}></i>
                  </span>
                </div>
                <select
                  className="form-control bg-light border-left-0"
                  style={{ borderRadius: '0 10px 10px 0', height: '46px', fontSize: '14px' }}
                  value={selectedSpec}
                  onChange={(e) => {
                    setSelectedSpec(e.target.value);
                    setVisibleCount(24);
                  }}
                >
                  <option value="">All Specializations ({specialities.length})</option>
                  {specialities.map((sp) => (
                    <option key={sp.sp_id} value={sp.sp_id}>
                      {sp.sp_name} {sp.doctor_count ? `(${sp.doctor_count})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Day Filter */}
            <div className="col-lg-3 col-md-6 mb-2 mb-lg-0">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text bg-light border-right-0" style={{ borderRadius: '10px 0 0 10px' }}>
                    <i className="far fa-calendar-alt text-muted"></i>
                  </span>
                </div>
                <select
                  className="form-control bg-light border-left-0"
                  style={{ borderRadius: '0 10px 10px 0', height: '46px', fontSize: '14px' }}
                  value={selectedDay}
                  onChange={(e) => {
                    setSelectedDay(e.target.value);
                    setVisibleCount(24);
                  }}
                >
                  <option value="">All Days</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="col-lg-1 col-md-6 text-center text-lg-right">
              {(searchTerm || selectedSpec || selectedDay) ? (
                <button
                  onClick={handleResetFilters}
                  className="btn btn-outline-danger btn-block d-flex align-items-center justify-content-center"
                  style={{ height: '46px', borderRadius: '10px', fontSize: '13px' }}
                  title="Clear all filters"
                >
                  <i className="fas fa-times mr-1"></i> Reset
                </button>
              ) : (
                <button
                  disabled
                  className="btn btn-light btn-block text-muted d-flex align-items-center justify-content-center"
                  style={{ height: '46px', borderRadius: '10px', fontSize: '13px', opacity: 0.6 }}
                >
                  <i className="fas fa-filter mr-1"></i> Filter
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. DOCTORS GRID (Popular Diagnostic Style Modern Cards)
          ======================================================== */}
      <section className="container py-5">
        {loading ? (
          <div className="text-center py-5 my-5">
            <div className="spinner-border text-success" style={{ width: '3.5rem', height: '3.5rem' }} role="status">
              <span className="sr-only">Loading doctors...</span>
            </div>
            <h5 className="mt-3 font-weight-bold text-dark">Loading Specialist Doctors...</h5>
            <p className="text-muted small">Please wait while clinical schedules are retrieved.</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-lg p-5 text-center my-4 bg-white">
            <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px', backgroundColor: '#fef2f2' }}>
              <i className="fas fa-user-md-slash fa-2x text-danger"></i>
            </div>
            <h4 className="font-weight-bold text-dark mb-2">No Doctors Found</h4>
            <p className="text-muted mx-auto mb-4" style={{ maxWidth: '480px' }}>
              We could not find any doctors matching your search query "<strong>{searchTerm || selectedSpec || selectedDay}</strong>". Please try searching with a different name or speciality.
            </p>
            <div>
              <button onClick={handleResetFilters} className="btn btn-success px-4 font-weight-bold" style={{ backgroundColor: '#00984A', borderRadius: '8px' }}>
                <i className="fas fa-undo mr-1"></i> View All Doctors
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
              <div className="font-weight-bold text-secondary small">
                Showing <strong className="text-dark">{displayedDoctors.length}</strong> of <strong className="text-dark">{filteredDoctors.length}</strong> Doctors
              </div>
              {selectedSpec && (
                <span className="badge badge-success px-3 py-2 font-weight-normal" style={{ backgroundColor: '#00984A', fontSize: '13px', borderRadius: '20px' }}>
                  Filter: {specialities.find((s) => String(s.sp_id) === String(selectedSpec))?.sp_name || 'Speciality'}
                  <i className="fas fa-times ml-2 cursor-pointer" onClick={() => setSelectedSpec('')}></i>
                </span>
              )}
            </div>

            <div className="row">
              {displayedDoctors.map((dr) => {
                const isAbsent = dr.dr_absent_from && dr.dr_absent_to;
                const cleanName = cleanField(dr.dr_name);
                const cleanDegree = cleanField(dr.dr_degree);
                const cleanVisit = cleanField(dr.dr_visit_hrs) || 'By Appointment';

                return (
                  <div key={dr.dr_id} className="col-xl-3 col-lg-4 col-md-6 col-12 mb-4 d-flex">
                    <div
                      className="popular-doctor-card card w-100 border-0 shadow-sm d-flex flex-column"
                      style={{
                        borderRadius: '16px',
                        background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 65%, #f0fff4 100%)',
                        border: '1px solid #eef2f6',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer'
                      }}
                      onClick={() => navigate(`/doctor/${dr.dr_id}`)}
                    >
                      {/* Doctor Photo with Zoom Container & Status Ribbon */}
                      <div
                        className="doctor-photo-wrap position-relative mx-3 mt-3 overflow-hidden rounded-lg shadow-sm"
                        style={{
                          height: '240px',
                          borderRadius: '12px',
                          backgroundColor: '#f1f5f9'
                        }}
                      >
                        <img
                          src={getDoctorImage(dr.dr_image)}
                          alt={cleanName}
                          className="doctor-photo-img w-100 h-100"
                          style={{
                            objectFit: 'cover',
                            transition: 'transform 0.4s ease'
                          }}
                          onError={(e) => {
                            if (e.target.src.includes('/doctor/')) {
                              e.target.src = e.target.src.replace('/doctor/', '/uploads/');
                            } else if (!e.target.src.includes('male.jpg')) {
                              e.target.src = '/male.jpg';
                            }
                          }}
                        />

                        {/* Top Status Ribbon (Popular Diagnostic Style) */}
                        {isAbsent ? (
                          <div
                            className="position-absolute badge badge-danger shadow-sm font-weight-bold"
                            style={{
                              top: '10px',
                              right: '10px',
                              fontSize: '11px',
                              padding: '5px 8px',
                              borderRadius: '6px',
                              backgroundColor: '#ef4444'
                            }}
                          >
                            <i className="fas fa-calendar-times mr-1"></i> ON LEAVE
                          </div>
                        ) : (
                          <div
                            className="position-absolute badge text-white shadow-sm font-weight-bold"
                            style={{
                              top: '10px',
                              right: '10px',
                              fontSize: '11px',
                              padding: '5px 8px',
                              borderRadius: '6px',
                              backgroundColor: '#00984A'
                            }}
                          >
                            <i className="fas fa-check-circle mr-1"></i> Available
                          </div>
                        )}
                      </div>

                      {/* Doctor Content Body */}
                      <div className="card-body p-3 d-flex flex-column flex-grow-1 text-center">
                        {/* Doctor Name */}
                        <h5
                          className="doctor-name font-weight-bold mb-1"
                          style={{
                            color: '#00984A',
                            fontSize: '16px',
                            lineHeight: '1.35',
                            height: '44px',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                          title={cleanName}
                        >
                          {cleanName}
                        </h5>

                        {/* Speciality Badge */}
                        <div className="mb-2">
                          <span
                            className="badge text-truncate d-inline-block font-weight-bold"
                            style={{
                              backgroundColor: '#e6f7ef',
                              color: '#007a3b',
                              fontSize: '11px',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              maxWidth: '100%'
                            }}
                          >
                            <i className="fas fa-stethoscope mr-1"></i>
                            {dr.speciality_names || 'Specialist Consultant'}
                          </span>
                        </div>

                        {/* Degrees & Qualifications (Clamped) */}
                        <div
                          className="text-muted small mb-2 text-left px-1"
                          style={{
                            fontSize: '12px',
                            lineHeight: '1.4',
                            height: '52px',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical'
                          }}
                          title={cleanDegree}
                        >
                          <span className="font-weight-bold text-dark">Degrees:</span> {cleanDegree || 'Specialist Medical Consultant'}
                        </div>

                        {/* Visiting Hours & Chamber */}
                        <div
                          className="p-2 mb-3 rounded text-left small"
                          style={{
                            backgroundColor: '#f8fafc',
                            border: '1px dashed #cbd5e1',
                            fontSize: '11px',
                            lineHeight: '1.3',
                            color: '#334155'
                          }}
                        >
                          <div>
                            <i className="far fa-clock mr-1" style={{ color: '#00984A' }}></i>
                            <strong>Visiting:</strong> {cleanVisit}
                          </div>
                          <div>
                            <i className="fas fa-hospital-alt mr-1 text-muted"></i>
                            <strong>Branch:</strong> PMCH Dhanmondi
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto pt-2 border-top d-flex">
                          <Link
                            to={`/doctor/${dr.dr_id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="btn btn-outline-success btn-sm flex-grow-1 font-weight-bold mr-2"
                            style={{ borderRadius: '8px', fontSize: '12px' }}
                          >
                            <i className="fas fa-user-md mr-1"></i> View Profile
                          </Link>
                          <Link
                            to={`/contact-us?doctor=${dr.dr_id}&name=${encodeURIComponent(cleanName)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="btn btn-success btn-sm font-weight-bold text-white px-3"
                            style={{
                              backgroundColor: '#00984A',
                              borderColor: '#00984A',
                              borderRadius: '8px',
                              fontSize: '12px'
                            }}
                          >
                            <i className="fas fa-calendar-check mr-1"></i> Book
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button (Popular Diagnostic Style Batching) */}
            {visibleCount < filteredDoctors.length && (
              <div className="text-center py-4 mt-2">
                <button
                  onClick={handleLoadMore}
                  className="btn btn-lg btn-success font-weight-bold px-5 shadow-sm"
                  style={{
                    backgroundColor: '#00984A',
                    borderRadius: '30px',
                    fontSize: '15px',
                    padding: '12px 35px'
                  }}
                >
                  <i className="fas fa-spinner fa-spin mr-2 d-none"></i>
                  Load More Doctors ({filteredDoctors.length - visibleCount} Remaining)
                </button>
                <div className="small text-muted mt-2">
                  Showing {visibleCount} of {filteredDoctors.length} total consultants
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* ========================================================
          4. DOCTOR PROFILE POPUP MODAL (Quick View)
          ======================================================== */}
      {selectedDoctorModal && (
        <div
          className="position-fixed w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 999999,
            padding: '20px'
          }}
          onClick={() => setSelectedDoctorModal(null)}
        >
          <div
            className="card border-0 shadow-lg rounded-xl overflow-hidden w-100"
            style={{
              maxWidth: '720px',
              maxHeight: '90vh',
              borderRadius: '20px',
              backgroundColor: '#ffffff'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="px-4 py-3 text-white d-flex align-items-center justify-content-between"
              style={{
                background: 'linear-gradient(135deg, #00984A 0%, #007a3b 100%)'
              }}
            >
              <div className="font-weight-bold text-white" style={{ fontSize: '16px' }}>
                <i className="fas fa-user-md mr-2"></i> Doctor Specialist Profile
              </div>
              <button
                type="button"
                className="btn btn-link text-white p-0"
                onClick={() => setSelectedDoctorModal(null)}
              >
                <i className="fas fa-times fa-lg"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-auto" style={{ maxHeight: 'calc(90vh - 130px)' }}>
              <div className="row align-items-center mb-4">
                <div className="col-sm-4 text-center mb-3 mb-sm-0">
                  <img
                    src={getDoctorImage(selectedDoctorModal.dr_image)}
                    alt={cleanField(selectedDoctorModal.dr_name)}
                    className="rounded-xl shadow"
                    style={{
                      width: '150px',
                      height: '180px',
                      objectFit: 'cover',
                      borderRadius: '12px'
                    }}
                    onError={(e) => {
                      if (!e.target.src.includes('male.jpg')) e.target.src = '/male.jpg';
                    }}
                  />
                </div>
                <div className="col-sm-8">
                  <h4 className="font-weight-bold mb-1" style={{ color: '#00984A' }}>
                    {cleanField(selectedDoctorModal.dr_name)}
                  </h4>
                  <div className="badge badge-light text-primary font-weight-bold px-3 py-1 mb-2 border" style={{ fontSize: '13px' }}>
                    <i className="fas fa-stethoscope mr-1"></i>
                    {selectedDoctorModal.speciality_names || 'Specialist Consultant'}
                  </div>
                  <p className="text-muted small mb-2">
                    <strong>Degrees:</strong> {cleanField(selectedDoctorModal.dr_degree)}
                  </p>
                  <div className="small text-dark bg-light p-2 rounded">
                    <div>
                      <i className="far fa-clock text-success mr-1"></i>
                      <strong>Visiting Hours:</strong> {cleanField(selectedDoctorModal.dr_visit_hrs) || 'By Appointment'}
                    </div>
                    <div>
                      <i className="fas fa-map-marker-alt text-danger mr-1"></i>
                      <strong>Hospital:</strong> Popular Medical College Hospital, Dhanmondi
                    </div>
                  </div>
                </div>
              </div>

              {/* Education / Qualifications */}
              {cleanField(selectedDoctorModal.dr_education) && (
                <div className="mb-3">
                  <h6 className="font-weight-bold text-dark border-bottom pb-1">
                    <i className="fas fa-graduation-cap text-success mr-2"></i> Education & Qualifications
                  </h6>
                  <p className="text-muted small">{cleanField(selectedDoctorModal.dr_education)}</p>
                </div>
              )}

              {/* Experience Summary */}
              {cleanField(selectedDoctorModal.dr_exp_sum) && (
                <div className="mb-3">
                  <h6 className="font-weight-bold text-dark border-bottom pb-1">
                    <i className="fas fa-briefcase text-success mr-2"></i> Experience & Specialization
                  </h6>
                  <p className="text-muted small">{cleanField(selectedDoctorModal.dr_exp_sum)}</p>
                </div>
              )}

              {/* Emergency & Hotline Appointment */}
              <div
                className="p-3 rounded text-white d-flex align-items-center justify-content-between flex-wrap"
                style={{ backgroundColor: '#0c1a14' }}
              >
                <div>
                  <div className="small font-weight-bold text-success">Appointment Hotline:</div>
                  <h5 className="font-weight-bold mb-0 text-white">09666 787800 / 09613 787800</h5>
                </div>
                <Link
                  to={`/contact-us?doctor=${selectedDoctorModal.dr_id}&name=${encodeURIComponent(cleanField(selectedDoctorModal.dr_name))}`}
                  className="btn btn-success font-weight-bold px-4 mt-2 mt-sm-0"
                  style={{ backgroundColor: '#00984A', borderRadius: '8px' }}
                >
                  <i className="fas fa-calendar-check mr-1"></i> Book Appointment Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. FLOATING QUICK ACTION WIDGET (Popular Diagnostic Style)
          ======================================================== */}
      <div
        className="floating-doctor-widget position-fixed d-flex flex-column"
        style={{
          right: '20px',
          bottom: '25px',
          zIndex: 9999,
          gap: '10px'
        }}
      >
        <a
          href="tel:09666787800"
          className="btn btn-success rounded-circle shadow-lg d-flex align-items-center justify-content-center"
          style={{
            width: '52px',
            height: '52px',
            backgroundColor: '#00984A',
            border: '2px solid #ffffff'
          }}
          title="Direct PMCH Hotline"
        >
          <i className="fas fa-phone-alt fa-lg text-white"></i>
        </a>
        <Link
          to="/contact-us"
          className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
          style={{
            width: '52px',
            height: '52px',
            backgroundColor: '#0284c7',
            border: '2px solid #ffffff'
          }}
          title="Book Serial Online"
        >
          <i className="fas fa-calendar-plus fa-lg text-white"></i>
        </Link>
      </div>

      {/* Embedded CSS Micro-interactions */}
      <style>{`
        .popular-doctor-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 152, 74, 0.15), 0 10px 10px -5px rgba(0, 152, 74, 0.05) !important;
          border-color: #86efac !important;
        }
        .popular-doctor-card:hover .doctor-photo-img {
          transform: scale(1.06);
        }
        .popular-doctor-card:hover .doctor-name {
          color: #007a3b !important;
        }
      `}</style>
    </div>
  );
}
