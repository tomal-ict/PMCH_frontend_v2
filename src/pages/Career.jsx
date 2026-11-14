import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Career() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/news?type=career')
      .then(res => {
        if (res.data?.success) {
          setJobs(res.data.data || []);
        }
      })
      .catch(err => console.error('Error fetching career jobs:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>Career Opportunities</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">Career</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="text-center mb-5">
          <h2 className="font-weight-bold text-dark">Build Your Career at PMCH</h2>
          <p className="text-muted">Join a leading team of compassionate healthcare providers, specialists, and professionals.</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Loading job openings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="alert alert-info text-center p-4">
            <h5 className="font-weight-bold mb-2">No Active Job Circulars Right Now</h5>
            <p className="mb-0">Please check back soon or send your CV to <strong>hr@popular-hospital.com</strong>.</p>
          </div>
        ) : (
          <div className="row">
            {jobs.map((job) => (
              <div key={job.news_id} className="col-lg-6 mb-4">
                <div className="card h-100 shadow-sm border-0 p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge badge-primary px-3 py-1 font-weight-bold">Job Circular</span>
                    <small className="text-muted">
                      <i className="far fa-calendar-alt mr-1"></i> {job.news_postdate}
                    </small>
                  </div>
                  <h4 className="font-weight-bold text-dark mb-2">{job.news_title}</h4>
                  <div
                    className="text-muted small mb-3 flex-grow-1"
                    dangerouslySetInnerHTML={{ __html: job.news_remark || job.news_detail || '' }}
                  />
                  <div>
                    <Link to={`/news-details/${job.news_id}`} className="btn btn-outline-primary btn-sm font-weight-bold">
                      View Details & Apply <i className="fas fa-chevron-right ml-1"></i>
                    </Link>
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
