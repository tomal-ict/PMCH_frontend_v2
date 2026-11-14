import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/media?type=image')
      .then(res => {
        if (res.data?.success) {
          setPhotos(res.data.data || []);
        }
      })
      .catch(err => console.error('Error fetching photos:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>Photo Gallery</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">Photo Gallery</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="text-center mb-5">
          <h2 className="font-weight-bold text-dark">Moments & Facilities at PMCH</h2>
          <p className="text-muted">A visual glimpse into our hospital infrastructure, academic ceremonies, and medical workshops.</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : photos.length === 0 ? (
          <div className="alert alert-info text-center">No photos available at the moment.</div>
        ) : (
          <div className="row">
            {photos.map((item) => (
              <div key={item.med_id} className="col-lg-4 col-md-6 mb-4">
                <div className="card h-100 shadow-sm border-0 overflow-hidden">
                  <div style={{ height: '250px', overflow: 'hidden' }}>
                    <img
                      src={`/media/${item.med_link}`}
                      alt={item.med_title}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                      onError={(e) => { e.target.src = '/banner.jpg'; }}
                    />
                  </div>
                  <div className="card-body p-3">
                    <h6 className="font-weight-bold text-dark mb-0 text-truncate" title={item.med_title}>
                      {item.med_title}
                    </h6>
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
