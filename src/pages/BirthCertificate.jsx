import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function BirthCertificate() {
  const [receiptNo, setReceiptNo] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!receiptNo.trim() || !phone.trim()) {
      setErrorMsg('Please write Receipt no & Phone no.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setResult(null);

    api.post('/search-birth-certificate', {
      receipt_no: receiptNo.trim(),
      phone: phone.trim()
    })
      .then(res => {
        if (res.data?.success && res.data.certificate) {
          setResult(res.data.certificate);
        } else {
          setErrorMsg(res.data?.msg || 'Sorry! No Birth Certificate found!');
        }
      })
      .catch(err => {
        setErrorMsg(err.response?.data?.msg || 'Error searching birth certificate.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>Online Birth Certificate Verification</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">Birth Certificate</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 p-4 p-md-5 mb-4">
              <h3 className="font-weight-bold text-dark mb-2 text-center">Verify PMCH Hospital Birth Certificate</h3>
              <p className="text-muted text-center mb-4">
                Enter your issued Hospital Money Receipt Number and Registered Mobile Number to verify or download birth certificate records.
              </p>

              {errorMsg && (
                <div className="alert alert-danger text-center mb-4">
                  <i className="fas fa-exclamation-triangle mr-2"></i> {errorMsg}
                </div>
              )}

              <form onSubmit={handleSearch}>
                <div className="form-group">
                  <label className="font-weight-bold text-dark">Hospital Money Receipt No *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. MR-2024-XXXX"
                    value={receiptNo}
                    onChange={(e) => setReceiptNo(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="font-weight-bold text-dark">Registered Mobile Phone Number *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. 017XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-block font-weight-bold py-2"
                >
                  {loading ? 'Verifying Records...' : 'Verify Birth Certificate'}
                </button>
              </form>
            </div>

            {/* Result Box */}
            {result && (
              <div className="card border-success shadow p-4 text-center">
                <div className="text-success mb-2">
                  <i className="fas fa-check-circle fa-3x"></i>
                </div>
                <h4 className="font-weight-bold text-success mb-3">Birth Certificate Verified!</h4>
                <div className="table-responsive text-left">
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th style={{ width: '40%' }}>Patient / Baby Name:</th>
                        <td>{result.client_name || 'N/A'}</td>
                      </tr>
                      <tr>
                        <th>Receipt No:</th>
                        <td>{result.receipt_no}</td>
                      </tr>
                      <tr>
                        <th>Contact Phone:</th>
                        <td>{result.phone}</td>
                      </tr>
                      {result.file && (
                        <tr>
                          <th>Digital Copy:</th>
                          <td>
                            <a
                              href={`/birth-certificate/${result.file}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-success font-weight-bold"
                            >
                              <i className="fas fa-download mr-1"></i> Download Certificate File
                            </a>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
