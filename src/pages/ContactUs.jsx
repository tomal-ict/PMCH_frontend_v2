import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function ContactUs() {
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
          setStatus({ success: false, message: res.data?.message || 'Failed to send message.' });
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
              <h1>Contact Us & Location Map</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">Contact Us</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row mb-5">
          {/* Contact Details Column */}
          <div className="col-lg-5 mb-5 mb-lg-0">
            <h3 className="font-weight-bold text-dark mb-4">Get In Touch</h3>
            <p className="text-muted leading-relaxed mb-4">
              We are here to answer your questions, coordinate patient admissions, and provide reliable healthcare services 24/7.
            </p>

            <div className="d-flex mb-4">
              <div className="p-3 bg-light rounded text-primary mr-3 text-center" style={{ width: '55px', height: '55px' }}>
                <i className="fas fa-map-marker-alt fa-lg"></i>
              </div>
              <div>
                <h6 className="font-weight-bold text-dark mb-1">Hospital Location</h6>
                <p className="text-muted small mb-0">
                  House: 08, Road: 02, Dhanmondi, Dhaka-1205, Bangladesh
                </p>
              </div>
            </div>

            <div className="d-flex mb-4">
              <div className="p-3 bg-light rounded text-primary mr-3 text-center" style={{ width: '55px', height: '55px' }}>
                <i className="fas fa-phone-alt fa-lg"></i>
              </div>
              <div>
                <h6 className="font-weight-bold text-dark mb-1">Phone Helpline</h6>
                <p className="text-muted small mb-0">
                  <strong>09666 787800</strong> (Call Center / Serial Desk)
                </p>
              </div>
            </div>

            <div className="d-flex mb-4">
              <div className="p-3 bg-light rounded text-primary mr-3 text-center" style={{ width: '55px', height: '55px' }}>
                <i className="fas fa-envelope fa-lg"></i>
              </div>
              <div>
                <h6 className="font-weight-bold text-dark mb-1">Email Inquiries</h6>
                <p className="text-muted small mb-0">info@popular-hospital.com</p>
              </div>
            </div>

            <div className="d-flex mb-4">
              <div className="p-3 bg-light rounded text-primary mr-3 text-center" style={{ width: '55px', height: '55px' }}>
                <i className="fas fa-clock fa-lg"></i>
              </div>
              <div>
                <h6 className="font-weight-bold text-dark mb-1">Working Hours</h6>
                <p className="text-muted small mb-0">
                  Emergency & Inpatient: <strong>24/7 Operational</strong><br />
                  OPD Doctors: 8:00 AM – 10:00 PM (Daily except Friday)
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="col-lg-7">
            <div className="card shadow-sm border-0 p-4 p-md-5 bg-white">
              <h4 className="font-weight-bold text-dark mb-3">Send Us a Direct Message</h4>

              {status.message && (
                <div className={`alert ${status.success ? 'alert-success' : 'alert-danger'} mb-4`}>
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold text-dark small">Your Name *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold text-dark small">Your Email *</label>
                    <input
                      type="email"
                      required
                      className="form-control"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="font-weight-bold text-dark small">Subject *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Subject of your message"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="font-weight-bold text-dark small">Message *</label>
                  <textarea
                    required
                    rows="5"
                    className="form-control"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary font-weight-bold px-4 py-2"
                >
                  {loading ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="card shadow-sm border-0 overflow-hidden mt-4">
          <div className="card-header bg-dark text-white font-weight-bold">
            <i className="fas fa-map-marked-alt mr-2"></i> PMCH Hospital Location Map (Dhanmondi, Dhaka)
          </div>
          <div style={{ height: '400px', width: '100%' }}>
            <iframe
              title="PMCH Google Map"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src="https://maps.google.com/maps?q=Popular%20Medical%20College%20Hospital,%20Dhanmondi,%20Dhaka&t=&z=16&ie=UTF8&iwloc=&output=embed"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
