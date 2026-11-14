import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function VideoGallery() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/media?type=video')
      .then(res => {
        if (res.data?.success) {
          setVideos(res.data.data || []);
        }
      })
      .catch(err => console.error('Error fetching videos:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>Video Gallery</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">Video Gallery</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="text-center mb-5">
          <h2 className="font-weight-bold text-dark">Documentaries & Health Awareness Videos</h2>
          <p className="text-muted">Health guidance, surgical milestones, and clinical overview documentaries.</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="alert alert-info text-center p-4">
            <p className="mb-0">No videos currently published in the gallery.</p>
          </div>
        ) : (
          <div className="row">
            {videos.map((item) => (
              <div key={item.med_id} className="col-lg-6 mb-4">
                <div className="card h-100 shadow-sm border-0 p-3">
                  <div className="embed-responsive embed-responsive-16by9 mb-3">
                    <iframe
                      className="embed-responsive-item"
                      src={item.med_link?.includes('youtube') ? item.med_link : `https://www.youtube.com/embed/${item.med_link}`}
                      title={item.med_title}
                      allowFullScreen
                    ></iframe>
                  </div>
                  <h5 className="font-weight-bold text-dark mb-0">{item.med_title}</h5>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
