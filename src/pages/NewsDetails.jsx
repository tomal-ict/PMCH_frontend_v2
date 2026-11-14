import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function NewsDetails() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/news/${id}`)
      .then(res => {
        if (res.data?.success) {
          setArticle(res.data.data);
        }
      })
      .catch(err => console.error('Error fetching article:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container py-5 text-center">
        <h3>Article Not Found</h3>
        <Link to="/news-event" className="btn btn-primary mt-3">Back to News</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="text-truncate">{article.news_title}</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/news-event">News</Link></li>
                <li className="breadcrumb-item active text-white">Details</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="card border-0 shadow-sm p-4 p-md-5">
              <div className="d-flex align-items-center text-muted mb-3">
                <span className="badge badge-primary px-3 py-1 mr-3">
                  {article.news_type === 3 ? 'Career' : 'Hospital News'}
                </span>
                <span>
                  <i className="far fa-calendar-alt text-primary mr-1"></i> {article.news_postdate}
                </span>
              </div>

              <h2 className="font-weight-bold text-dark mb-4">{article.news_title}</h2>

              {article.images?.length > 0 && (
                <div className="mb-4 text-center">
                  <img
                    src={`/news/${article.images[0]}`}
                    alt={article.news_title}
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: '450px', objectFit: 'contain' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}

              <div
                className="article-content leading-relaxed text-dark"
                style={{ fontSize: '1.05rem', lineHeight: '1.8' }}
                dangerouslySetInnerHTML={{ __html: article.news_detail || article.news_remark || '' }}
              />

              {article.images?.length > 1 && (
                <div className="row mt-4">
                  {article.images.slice(1).map((img, i) => (
                    <div key={i} className="col-md-6 mb-3">
                      <img
                        src={`/news/${img}`}
                        alt=""
                        className="img-fluid rounded shadow-sm"
                        style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 pt-3 border-top d-flex justify-content-between">
                <Link to="/news-event" className="btn btn-outline-dark">
                  <i className="fas fa-arrow-left mr-1"></i> Back to News
                </Link>
                <Link to="/contact-us" className="btn btn-primary">
                  Inquire Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
