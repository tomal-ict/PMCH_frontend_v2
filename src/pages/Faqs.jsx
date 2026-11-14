import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [openIdx, setOpenIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/faqs')
      .then(res => {
        if (res.data?.success) {
          setFaqs(res.data.data || []);
        }
      })
      .catch(err => console.error('Error fetching FAQs:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>Frequently Asked Questions (FAQs)</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">FAQs</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="text-center mb-5">
          <h2 className="font-weight-bold text-dark">Common Questions & Answers</h2>
          <p className="text-muted">Find quick answers to common queries regarding hospital policies, billing, and care.</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : faqs.length === 0 ? (
          <div className="alert alert-info text-center">No FAQ records currently found.</div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-lg-9">
              {faqs.map((faq, idx) => (
                <div key={faq.id || idx} className="card mb-3 border shadow-sm rounded">
                  <div
                    className="card-header bg-white py-3 cursor-pointer d-flex justify-content-between align-items-center"
                    onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                    style={{ cursor: 'pointer' }}
                  >
                    <h5 className="mb-0 font-weight-bold text-dark text-4">
                      {faq.question}
                    </h5>
                    <i className={`fas ${openIdx === idx ? 'fa-chevron-up text-primary' : 'fa-chevron-down text-muted'}`}></i>
                  </div>
                  {openIdx === idx && (
                    <div className="card-body py-3 text-muted">
                      <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
