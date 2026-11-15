import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

// Helper to convert any YouTube URL/ID into a clean embed URL
const getYoutubeEmbed = (url) => {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) return url;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url.startsWith('http') ? url : `https://www.youtube.com/embed/${url}`;
};

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
            {videos.map((item) => {
              const videoUrl = item.med_url || item.med_file || item.med_link;
              const embedSrc = getYoutubeEmbed(videoUrl);

              return (
                <div key={item.med_id} className="col-lg-6 mb-4">
                  <div className="card h-100 shadow-sm border-0 p-3 rounded-lg overflow-hidden">
                    <div className="embed-responsive embed-responsive-16by9 mb-3 rounded shadow-sm">
                      <iframe
                        className="embed-responsive-item"
                        src={embedSrc}
                        title={item.med_title}
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      ></iframe>
                    </div>
                    <h5 className="font-weight-bold text-dark mb-1">{item.med_title}</h5>
                    {item.med_desc && (
                      <p className="text-muted small mb-0">{item.med_desc}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
