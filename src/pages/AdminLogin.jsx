import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    api.post('/admin/login', { username, password })
      .then(res => {
        if (res.data?.success && res.data.token) {
          localStorage.setItem('pmch_admin_token', res.data.token);
          localStorage.setItem('pmch_admin_user', JSON.stringify(res.data.user));
          const target = location.pathname.startsWith('/myadmin') ? '/myadmin/dashboard' : '/admin/dashboard';
          navigate(target);
        } else {
          setError(res.data?.message || 'Login failed.');
        }
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Authentication error.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="card shadow-lg border-0" style={{ maxWidth: '450px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ backgroundColor: '#00984a', padding: '30px 20px', textAlign: 'center', color: '#fff' }}>
          <img
            src="/pmch/img/logo.png"
            alt="PMCH"
            style={{ maxHeight: '60px', background: '#fff', padding: '6px', borderRadius: '4px', marginBottom: '15px' }}
          />
          <h4 className="font-weight-bold mb-1 text-white">Hospital Administration</h4>
          <p className="mb-0 small text-white-50">Popular Medical College & Hospital</p>
        </div>

        <div className="card-body p-4 p-md-5">
          {error && (
            <div className="alert alert-danger py-2 small text-center mb-4">
              <i className="fas fa-exclamation-circle mr-1"></i> {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <label className="font-weight-bold text-dark small">Username or User ID</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text bg-light border-right-0"><i className="fas fa-user text-muted"></i></span>
                </div>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ borderColor: '#00984a' }}
                />
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="font-weight-bold text-dark small">Password</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text bg-light border-right-0"><i className="fas fa-lock text-muted"></i></span>
                </div>
                <input
                  type="password"
                  required
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ borderColor: '#00984a' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-block font-weight-bold py-2 text-white"
              style={{ backgroundColor: '#00984a' }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-2" role="status"></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <small className="text-muted">
              Protected by Enterprise Rate-limiting & JWT Security.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
