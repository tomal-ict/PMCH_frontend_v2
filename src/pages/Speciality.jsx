import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function Speciality() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/specialities/${id}`)
      .then(res => {
        if (res.data?.success) {
          setData(res.data.data);
        }
      })
      .catch(err => console.error('Error fetching speciality:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading department information...</p>
      </div>
    );
  }

  if (!data?.speciality) {
    return (
      <div className="container py-5 text-center">
        <h3>Speciality Not Found</h3>
        <Link to="/" className="btn btn-primary mt-3">Return to Home</Link>
      </div>
    );
  }

  const { speciality, doctors } = data;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>Department of {speciality.sp_name}</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/package">Specialities</Link></li>
                <li className="breadcrumb-item active text-white">{speciality.sp_name}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row mb-5">
          <div className="col-lg-8">
            <h3 className="font-weight-bold text-dark mb-3">Overview & Clinical Services</h3>
            <div
              className="text-muted leading-relaxed mb-4"
              style={{ lineHeight: '1.8' }}
              dangerouslySetInnerHTML={{ __html: speciality.sp_desc || speciality.sp_info || 'Comprehensive clinical care and medical evaluation provided by our senior consultant physicians.' }}
            />
          </div>

          <div className="col-lg-4">
            {speciality.sp_desc_img && (
              <div className="card shadow-sm border-0 mb-4 overflow-hidden">
                <img
                  src={`/speciality/${speciality.sp_desc_img}`}
                  alt={speciality.sp_name}
                  className="img-fluid"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
            <div className="card p-4 border-0 shadow-sm bg-light">
              <h5 className="font-weight-bold text-dark mb-2">Book an Appointment</h5>
              <p className="text-muted small">Consult with our expert doctors in {speciality.sp_name}.</p>
              <Link to="/contact-us" className="btn btn-primary btn-block font-weight-bold">
                Get Appointment Now
              </Link>
            </div>
          </div>
        </div>

        {/* Doctors in this speciality */}
        <div className="mt-5">
          <h3 className="font-weight-bold text-dark mb-4">Consultant Doctors in {speciality.sp_name}</h3>
          {doctors?.length === 0 ? (
            <p className="text-muted">No doctor schedules currently published for this department.</p>
          ) : (
            <div className="row">
              {doctors.map((dr) => (
                <div key={dr.dr_id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card h-100 shadow-sm border-0 p-4 text-center">
                    <div className="mb-3">
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
                    {dr.dr_visit_hrs && (
                      <div className="bg-light p-2 rounded small text-dark mb-3">
                        <i className="far fa-clock text-primary mr-1"></i> <strong>Visiting Hours:</strong> {dr.dr_visit_hrs}
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
          )}
        </div>
      </div>
    </div>
  );
}
