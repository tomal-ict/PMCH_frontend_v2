import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Enquiry() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ success: null, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ success: null, message: '' });

    api.post('/contact', formData)
      .then(res => {
        if (res.data?.success) {
          setStatus({ success: true, message: res.data.message });
          setFormData({ name: '', email: '', subject: '', message: '' });
        } else {
          setStatus({ success: false, message: res.data?.message || 'Failed to submit enquiry.' });
        }
      })
      .catch(err => {
        setStatus({
          success: false,
          message: err.response?.data?.message || 'Error communicating with server.'
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>Online Patient Inquiry</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">Online Inquiry</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 p-4 p-md-5">
              <h3 className="font-weight-bold text-dark mb-2">Submit Your Inquiry</h3>
              <p className="text-muted mb-4">
                Have questions about treatment costs, doctor availability, admission, or general services? Our customer relations desk will respond promptly.
              </p>

              {status.message && (
                <div className={`alert ${status.success ? 'alert-success' : 'alert-danger'} mb-4`}>
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="font-weight-bold text-dark">Your Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="font-weight-bold text-dark">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="font-weight-bold text-dark">Inquiry Subject *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Doctor appointment, Admission cost"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="font-weight-bold text-dark">Your Message / Query *</label>
                  <textarea
                    required
                    rows="5"
                    className="form-control"
                    placeholder="Describe your question or requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary font-weight-bold px-4 py-2"
                >
                  {loading ? 'Submitting...' : 'Send Inquiry Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
