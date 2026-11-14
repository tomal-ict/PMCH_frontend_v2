import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Testimonial() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/testimonials')
      .then(res => {
        if (res.data?.success) {
          setTestimonials(res.data.data || []);
        }
      })
      .catch(err => console.error('Error fetching testimonials:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>Patient Testimonials & Reviews</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">Testimonials</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="text-center mb-5">
          <h2 className="font-weight-bold text-dark">Words from Our Patients & Families</h2>
          <p className="text-muted">Real stories of care, recovery, and compassionate service experienced at PMCH.</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="alert alert-info text-center">No testimonials published yet.</div>
        ) : (
          <div className="row">
            {testimonials.map((item) => (
              <div key={item.tes_id} className="col-lg-6 mb-4">
                <div className="card h-100 shadow-sm border-0 p-4">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={item.tes_image ? `/testimonial/${item.tes_image}` : '/male.jpg'}
                      alt={item.tes_person}
                      className="rounded-circle mr-3 img-thumbnail"
                      style={{ width: '65px', height: '65px', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = '/male.jpg'; }}
                    />
                    <div>
                      <h5 className="font-weight-bold text-dark mb-0">{item.tes_person}</h5>
                      <small className="text-muted">{item.tes_designation || item.tes_company || 'Patient'}</small>
                    </div>
                  </div>
                  <div className="text-muted font-italic leading-relaxed flex-grow-1">
                    "{item.tes_comment}"
                  </div>
                  <div className="mt-3 text-warning">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
