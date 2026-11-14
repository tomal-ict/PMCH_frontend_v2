import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Package() {
  const [doctors, setDoctors] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load specialities and doctors in parallel
    Promise.all([
      api.get('/specialities'),
      api.get('/doctors')
    ])
      .then(([specRes, drRes]) => {
        if (specRes.data?.success) setSpecialities(specRes.data.data || []);
        if (drRes.data?.success) setDoctors(drRes.data.data || []);
      })
      .catch(err => console.error('Error loading doctors directory:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    let url = `/doctors?name=${encodeURIComponent(searchTerm)}`;
    if (selectedSpec) {
      url += `&speciality_id=${selectedSpec}`;
    }
    api.get(url)
      .then(res => {
        if (res.data?.success) setDoctors(res.data.data || []);
      })
      .catch(err => console.error('Error filtering doctors:', err))
      .finally(() => setLoading(false));
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedSpec('');
    setLoading(true);
    api.get('/doctors')
      .then(res => {
        if (res.data?.success) setDoctors(res.data.data || []);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>Find Our Doctors & Specialists</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">Doctors Directory</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        {/* Search & Filter Bar */}
        <div className="card shadow-sm border-0 p-4 mb-5 bg-light">
          <form onSubmit={handleSearch} className="row align-items-end">
            <div className="col-lg-5 col-md-6 mb-3 mb-lg-0">
              <label className="font-weight-bold text-dark mb-1">Search Doctor by Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Dr. Rahman, Prof. Kabir"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="col-lg-4 col-md-6 mb-3 mb-lg-0">
              <label className="font-weight-bold text-dark mb-1">Filter by Speciality</label>
              <select
                className="form-control"
                value={selectedSpec}
                onChange={(e) => setSelectedSpec(e.target.value)}
              >
                <option value="">All Specialities</option>
                {specialities.map((sp) => (
                  <option key={sp.sp_id} value={sp.sp_id}>
                    {sp.sp_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-3 col-md-12 d-flex">
              <button type="submit" className="btn btn-primary font-weight-bold flex-grow-1 mr-2">
                <i className="fas fa-search mr-1"></i> Search
              </button>
              <button type="button" onClick={handleReset} className="btn btn-outline-secondary font-weight-bold">
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Doctor Results */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Searching doctors...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="alert alert-warning text-center p-4">
            <h5 className="font-weight-bold">No Doctors Found</h5>
            <p className="mb-0">Try searching with a different doctor name or speciality.</p>
          </div>
        ) : (
          <div>
            <p className="text-muted mb-4 font-weight-semibold">
              Showing <strong>{doctors.length}</strong> specialized consultants
            </p>

            <div className="row">
              {doctors.map((dr) => (
                <div key={dr.dr_id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card h-100 shadow-sm border-0 p-4 text-center">
                    <div className="mb-3 text-center">
                      <img
                        src={dr.dr_image ? `/doctor/${dr.dr_image}` : '/doctor.jpg'}
                        alt={dr.dr_name}
                        className="rounded-circle img-thumbnail"
                        style={{ width: '130px', height: '130px', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = '/male.jpg'; }}
                      />
                    </div>
                    <h5 className="font-weight-bold text-primary mb-1">{dr.dr_name}</h5>
                    <p className="text-muted small mb-2">{dr.dr_degree}</p>
                    <span className="badge badge-light text-secondary mb-3 py-1 px-2">
                      <i className="fas fa-stethoscope mr-1"></i> {dr.speciality_names || 'General Specialist'}
                    </span>
                    {dr.dr_visit_hrs && (
                      <div className="bg-light p-2 rounded small text-dark mb-3">
                        <i className="far fa-clock text-primary mr-1"></i> {dr.dr_visit_hrs}
                      </div>
                    )}
                    <div className="mt-auto">
                      <Link to="/contact-us" className="btn btn-outline-primary btn-sm btn-block">
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
