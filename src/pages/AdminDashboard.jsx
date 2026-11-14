import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [doctorsList, setDoctorsList] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [faqsList, setFaqsList] = useState([]);
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ success: null, text: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('pmch_admin_user');
    const token = localStorage.getItem('pmch_admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }

    // Fetch dashboard counters
    api.get('/admin/dashboard')
      .then(res => {
        if (res.data?.success) {
          setStats(res.data.counters);
        }
      })
      .catch(err => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('pmch_admin_token');
          navigate('/admin/login');
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const loadDoctors = () => {
    setActiveTab('doctors');
    api.get('/admin/doctors').then(res => {
      if (res.data?.success) setDoctorsList(res.data.data);
    });
  };

  const loadNews = () => {
    setActiveTab('news');
    api.get('/admin/news').then(res => {
      if (res.data?.success) setNewsList(res.data.data);
    });
  };

  const loadFaqs = () => {
    setActiveTab('faqs');
    api.get('/admin/faqs').then(res => {
      if (res.data?.success) setFaqsList(res.data.data);
    });
  };

  const handleToggleStatus = (table, key, id, field, currentVal) => {
    api.post('/admin/toggle-status', { table, key, id, field })
      .then(res => {
        if (res.data?.success) {
          // Update local state
          if (table === 'tbl_doctor') {
            setDoctorsList(prev => prev.map(d => d.dr_id === id ? { ...d, dr_status: d.dr_status === 1 ? 0 : 1 } : d));
          } else if (table === 'tbl_news') {
            setNewsList(prev => prev.map(n => n.news_id === id ? { ...n, news_status: n.news_status === 1 ? 0 : 1 } : n));
          } else if (table === 'tbl_faq') {
            setFaqsList(prev => prev.map(f => f.id === id ? { ...f, status: f.status === 1 ? 0 : 1 } : f));
          }
        }
      })
      .catch(err => alert('Failed to toggle status: ' + (err.response?.data?.msg || err.message)));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordMsg({ success: null, text: '' });
    api.post('/admin/change-password', { oldPassword, newPassword })
      .then(res => {
        if (res.data?.success) {
          setPasswordMsg({ success: true, text: res.data.message });
          setOldPassword('');
          setNewPassword('');
        }
      })
      .catch(err => {
        setPasswordMsg({
          success: false,
          text: err.response?.data?.message || 'Error updating password.'
        });
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('pmch_admin_token');
    localStorage.removeItem('pmch_admin_user');
    navigate('/admin/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#00984a' }}>
        <div className="container-fluid">
          <span className="navbar-brand font-weight-bold d-flex align-items-center">
            <img src="/pmch/img/logo.png" alt="" style={{ height: '35px', background: '#fff', padding: '3px', borderRadius: '3px', marginRight: '10px' }} />
            PMCH Admin Panel
          </span>
          <div className="ml-auto d-flex align-items-center text-white">
            <span className="mr-3 small d-none d-md-inline">
              <i className="fas fa-user-circle mr-1"></i> {user?.name || user?.username || 'Administrator'} ({user?.designation || 'Admin'})
            </span>
            <button onClick={handleLogout} className="btn btn-outline-light btn-sm font-weight-bold">
              <i className="fas fa-sign-out-alt mr-1"></i> Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="container-fluid py-4">
        {/* Navigation Tabs */}
        <div className="d-flex flex-wrap mb-4 bg-white p-2 rounded shadow-sm">
          <button
            className={`btn btn-sm mr-2 mb-1 ${activeTab === 'overview' ? 'btn-success font-weight-bold' : 'btn-light'}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-chart-pie mr-1"></i> Dashboard Overview
          </button>
          <button
            className={`btn btn-sm mr-2 mb-1 ${activeTab === 'doctors' ? 'btn-success font-weight-bold' : 'btn-light'}`}
            onClick={loadDoctors}
          >
            <i className="fas fa-user-md mr-1"></i> Manage Doctors
          </button>
          <button
            className={`btn btn-sm mr-2 mb-1 ${activeTab === 'news' ? 'btn-success font-weight-bold' : 'btn-light'}`}
            onClick={loadNews}
          >
            <i className="fas fa-newspaper mr-1"></i> Manage News
          </button>
          <button
            className={`btn btn-sm mr-2 mb-1 ${activeTab === 'faqs' ? 'btn-success font-weight-bold' : 'btn-light'}`}
            onClick={loadFaqs}
          >
            <i className="fas fa-question-circle mr-1"></i> Manage FAQs
          </button>
          <button
            className={`btn btn-sm mb-1 ${activeTab === 'security' ? 'btn-success font-weight-bold' : 'btn-light'}`}
            onClick={() => setActiveTab('security')}
          >
            <i className="fas fa-shield-alt mr-1"></i> Admin Password & Security
          </button>
        </div>

        {/* Tab 1: Overview Counters */}
        {activeTab === 'overview' && (
          <div>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status"></div>
                <p className="mt-2 text-muted">Loading dashboard analytics...</p>
              </div>
            ) : (
              <div>
                <div className="row">
                  <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card shadow-sm border-0 border-left-success p-3 h-100" style={{ borderLeft: '4px solid #28a745' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="text-muted small font-weight-bold text-uppercase">Active Doctors</div>
                          <div className="h3 font-weight-bold text-dark mb-0">{stats?.active_doctors || 0}</div>
                        </div>
                        <i className="fas fa-user-md fa-2x text-success"></i>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card shadow-sm border-0 p-3 h-100" style={{ borderLeft: '4px solid #dc3545' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="text-muted small font-weight-bold text-uppercase">Inactive Doctors</div>
                          <div className="h3 font-weight-bold text-dark mb-0">{stats?.inactive_doctors || 0}</div>
                        </div>
                        <i className="fas fa-user-slash fa-2x text-danger"></i>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card shadow-sm border-0 p-3 h-100" style={{ borderLeft: '4px solid #007bff' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="text-muted small font-weight-bold text-uppercase">Doctors on Leave</div>
                          <div className="h3 font-weight-bold text-dark mb-0">{stats?.doctors_in_leave || 0}</div>
                        </div>
                        <i className="fas fa-plane-departure fa-2x text-primary"></i>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card shadow-sm border-0 p-3 h-100" style={{ borderLeft: '4px solid #6f42c1' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="text-muted small font-weight-bold text-uppercase">Total News & Posts</div>
                          <div className="h3 font-weight-bold text-dark mb-0">{stats?.news || 0}</div>
                        </div>
                        <i className="fas fa-newspaper fa-2x text-purple" style={{ color: '#6f42c1' }}></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card shadow-sm border-0 p-3 h-100" style={{ borderLeft: '4px solid #fd7e14' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="text-muted small font-weight-bold text-uppercase">Services Count</div>
                          <div className="h3 font-weight-bold text-dark mb-0">{stats?.services || 0}</div>
                        </div>
                        <i className="fas fa-hospital fa-2x text-warning"></i>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card shadow-sm border-0 p-3 h-100" style={{ borderLeft: '4px solid #20c997' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="text-muted small font-weight-bold text-uppercase">Media / Photos</div>
                          <div className="h3 font-weight-bold text-dark mb-0">{stats?.media || 0}</div>
                        </div>
                        <i className="fas fa-photo-video fa-2x text-info"></i>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card shadow-sm border-0 p-3 h-100" style={{ borderLeft: '4px solid #e83e8c' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="text-muted small font-weight-bold text-uppercase">Testimonials</div>
                          <div className="h3 font-weight-bold text-dark mb-0">{stats?.testimonials || 0}</div>
                        </div>
                        <i className="fas fa-comment-dots fa-2x" style={{ color: '#e83e8c' }}></i>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card shadow-sm border-0 p-3 h-100" style={{ borderLeft: '4px solid #17a2b8' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="text-muted small font-weight-bold text-uppercase">Corporate Partners</div>
                          <div className="h3 font-weight-bold text-dark mb-0">{stats?.partners || 0}</div>
                        </div>
                        <i className="fas fa-handshake fa-2x text-info"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Manage Doctors */}
        {activeTab === 'doctors' && (
          <div className="card shadow-sm border-0 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="font-weight-bold text-dark mb-0">Doctor Directory Management</h5>
              <span className="badge badge-success px-3 py-2">Total {doctorsList.length} Doctors</span>
            </div>
            <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <table className="table table-bordered table-hover">
                <thead className="thead-light">
                  <tr>
                    <th>Photo</th>
                    <th>Doctor Name</th>
                    <th>Speciality</th>
                    <th>Visiting Hours</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorsList.map(dr => (
                    <tr key={dr.dr_id}>
                      <td style={{ width: '60px' }}>
                        <img
                          src={dr.dr_image ? `/doctor/${dr.dr_image}` : '/doctor.jpg'}
                          alt=""
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }}
                          onError={(e) => { e.target.src = '/male.jpg'; }}
                        />
                      </td>
                      <td className="font-weight-bold text-dark">{dr.dr_name}</td>
                      <td><span className="badge badge-info">{dr.speciality_names || 'General'}</span></td>
                      <td className="small text-muted">{dr.dr_visit_hrs || 'Available'}</td>
                      <td>
                        <span className={`badge ${dr.dr_status === 1 ? 'badge-success' : 'badge-danger'}`}>
                          {dr.dr_status === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleStatus('tbl_doctor', 'dr_id', dr.dr_id, 'dr_status', dr.dr_status)}
                          className={`btn btn-xs ${dr.dr_status === 1 ? 'btn-outline-danger' : 'btn-outline-success'} font-weight-bold`}
                        >
                          {dr.dr_status === 1 ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Manage News */}
        {activeTab === 'news' && (
          <div className="card shadow-sm border-0 p-4">
            <h5 className="font-weight-bold text-dark mb-3">News & Events Management</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-light">
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {newsList.map(n => (
                    <tr key={n.news_id}>
                      <td>{n.news_id}</td>
                      <td className="font-weight-bold text-dark">{n.news_title}</td>
                      <td className="small text-muted">{n.news_postdate}</td>
                      <td>
                        <span className="badge badge-secondary">
                          {n.news_type === 3 ? 'Career' : 'News'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${n.news_status === 1 ? 'badge-success' : 'badge-danger'}`}>
                          {n.news_status === 1 ? 'Published' : 'Unpublished'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleStatus('tbl_news', 'news_id', n.news_id, 'news_status', n.news_status)}
                          className={`btn btn-xs ${n.news_status === 1 ? 'btn-outline-danger' : 'btn-outline-success'} font-weight-bold`}
                        >
                          {n.news_status === 1 ? 'Unpublish' : 'Publish'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Manage FAQs */}
        {activeTab === 'faqs' && (
          <div className="card shadow-sm border-0 p-4">
            <h5 className="font-weight-bold text-dark mb-3">Frequently Asked Questions Management</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-light">
                  <tr>
                    <th>ID</th>
                    <th>Question</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {faqsList.map(f => (
                    <tr key={f.id}>
                      <td>{f.id}</td>
                      <td className="font-weight-bold text-dark">{f.question}</td>
                      <td>
                        <span className={`badge ${f.status === 1 ? 'badge-success' : 'badge-danger'}`}>
                          {f.status === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleStatus('tbl_faq', 'id', f.id, 'status', f.status)}
                          className={`btn btn-xs ${f.status === 1 ? 'btn-outline-danger' : 'btn-outline-success'} font-weight-bold`}
                        >
                          {f.status === 1 ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Security / Change Password */}
        {activeTab === 'security' && (
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card shadow-sm border-0 p-4 bg-white">
                <h5 className="font-weight-bold text-dark mb-3">Update Administrator Password</h5>
                {passwordMsg.text && (
                  <div className={`alert ${passwordMsg.success ? 'alert-success' : 'alert-danger'} py-2 small mb-3`}>
                    {passwordMsg.text}
                  </div>
                )}
                <form onSubmit={handleChangePassword}>
                  <div className="form-group mb-3">
                    <label className="font-weight-bold text-dark small">Current Old Password *</label>
                    <input
                      type="password"
                      required
                      className="form-control"
                      value={oldPassword}
                      onChange={e => setOldPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label className="font-weight-bold text-dark small">New Secure Password *</label>
                    <input
                      type="password"
                      required
                      minLength="6"
                      className="form-control"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-success font-weight-bold">
                    <i className="fas fa-key mr-1"></i> Update Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
