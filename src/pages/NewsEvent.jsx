import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function NewsEvent() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/news?type=news')
      .then(res => {
        if (res.data?.success) {
          setNewsList(res.data.data || []);
        }
      })
      .catch(err => console.error('Error fetching news:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>News & Events</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">News & Events</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Loading news & events...</p>
          </div>
        ) : newsList.length === 0 ? (
          <div className="alert alert-info text-center p-4">
            <p className="mb-0">No published news available at this moment.</p>
          </div>
        ) : (
          <div className="row">
            {newsList.map((item) => {
              const firstImg = item.images?.[0] ? `/news/${item.images[0]}` : '/banner.jpg';
              const dateObj = new Date(item.news_postdate);
              const day = !isNaN(dateObj.getDate()) ? dateObj.getDate() : '';
              const month = !isNaN(dateObj.getMonth()) ? dateObj.toLocaleString('en-US', { month: 'short' }) : '';
              const year = !isNaN(dateObj.getFullYear()) ? dateObj.getFullYear() : '';

              return (
                <div key={item.news_id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card h-100 shadow-sm border-0 overflow-hidden">
                    <div style={{ height: '220px', overflow: 'hidden' }}>
                      <Link to={`/news-details/${item.news_id}`}>
                        <img
                          src={firstImg}
                          alt={item.news_title}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                          onError={(e) => { e.target.src = '/banner.jpg'; }}
                        />
                      </Link>
                    </div>
                    <div className="card-body p-4 d-flex flex-column">
                      <div className="text-muted small mb-2">
                        <i className="far fa-calendar-alt text-primary mr-1"></i> {day} {month}, {year}
                      </div>
                      <h5 className="font-weight-bold text-dark mb-2" style={{ maxHeight: '55px', overflow: 'hidden' }}>
                        <Link to={`/news-details/${item.news_id}`} className="text-dark text-decoration-none">
                          {item.news_title}
                        </Link>
                      </h5>
                      <p className="text-muted small flex-grow-1" style={{ maxHeight: '70px', overflow: 'hidden' }}>
                        {item.news_remark ? item.news_remark.replace(/<[^>]+>/g, '') : ''}
                      </p>
                      <Link to={`/news-details/${item.news_id}`} className="font-weight-bold text-primary mt-2 small">
                        Read More <i className="fas fa-chevron-right ml-1"></i>
                      </Link>
                    </div>
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
