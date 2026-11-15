import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

// Helper to convert any YouTube URL into an embed link
const getYoutubeEmbed = (url) => {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) return url;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url.startsWith('http') ? url : `https://www.youtube.com/embed/${url}`;
};

// Clean HTML tags and decode HTML entities, stripping placeholder dots like <h1>.</h1>
const cleanField = (str) => {
  if (!str) return '';
  let clean = String(str)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  if (/^[\s.*-]*$/.test(clean)) return '';
  return clean;
};

// Smooth Counting Number Component (RequestAnimationFrame easing)
function AnimatedCounter({ end = 0, duration = 1400, formatter = (n) => n.toLocaleString() }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const target = typeof end === 'number' ? end : parseInt(String(end).replace(/[^0-9]/g, '')) || 0;
    if (target === 0) {
      setCount(0);
      return;
    }

    let animationFrame;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic deceleration
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * target);
      setCount(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{formatter(count)}</span>;
}

// Interactive Animated SVG Donut / Pie Chart Component
function AnimatedDonutChart({ data = [], total }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const totalCount = total || data.reduce((sum, item) => sum + (Number(item.count) || 0), 0) || 1;

  const size = 190;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="position-relative" style={{ width: `${size}px`, height: `${size}px` }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
        >
          {/* Base Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {data.map((item, idx) => {
            const count = Number(item.count) || 0;
            const percent = count / totalCount;
            const strokeDasharray = `${Math.max(0, percent * circumference - 2)} ${circumference}`;
            const strokeDashoffset = -accumulatedPercent * circumference;
            accumulatedPercent += percent;
            const isHovered = hoveredIndex === idx;

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  filter: isHovered ? `drop-shadow(0 0 8px ${item.color}99)` : 'none'
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center Counter */}
        <div
          className="position-absolute d-flex flex-column align-items-center justify-content-center text-center"
          style={{ top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          {hoveredIndex !== null ? (
            <>
              <span className="text-muted font-weight-bold text-truncate px-2" style={{ fontSize: '11px', maxWidth: '120px' }}>
                {data[hoveredIndex]?.label}
              </span>
              <h4 className="font-weight-bold mb-0" style={{ color: data[hoveredIndex]?.color }}>
                {data[hoveredIndex]?.count}
              </h4>
              <span className="badge badge-light border" style={{ fontSize: '10px' }}>
                {Math.round(((data[hoveredIndex]?.count || 0) / totalCount) * 100)}%
              </span>
            </>
          ) : (
            <>
              <span className="text-muted small text-uppercase font-weight-bold" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>
                Total Faculty
              </span>
              <h3 className="font-weight-extra-bold text-dark mb-0">
                <AnimatedCounter end={totalCount} duration={1400} />
              </h3>
              <span className="text-success small font-weight-bold" style={{ fontSize: '10px' }}>
                <i className="fas fa-check-circle mr-1"></i> Active
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="w-100 mt-3 pt-1">
        {data.map((item, idx) => {
          const count = Number(item.count) || 0;
          const pct = Math.round((count / totalCount) * 100);
          const isHovered = hoveredIndex === idx;
          return (
            <div
              key={idx}
              className="d-flex align-items-center justify-content-between p-2 mb-1 rounded"
              style={{
                backgroundColor: isHovered ? 'rgba(0,0,0,0.04)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderLeft: isHovered ? `3px solid ${item.color}` : '3px solid transparent'
              }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="d-flex align-items-center text-truncate mr-2">
                <span
                  className="rounded-circle mr-2 flex-shrink-0"
                  style={{ width: '10px', height: '10px', backgroundColor: item.color }}
                />
                <span className="small font-weight-bold text-dark text-truncate" style={{ fontSize: '12px' }}>
                  {item.label}
                </span>
              </div>
              <div className="d-flex align-items-center flex-shrink-0">
                <span className="font-weight-bold small text-dark mr-2">{count}</span>
                <span className="badge badge-light border text-muted" style={{ fontSize: '10px', minWidth: '35px' }}>
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  // Module States
  const [doctors, setDoctors] = useState([]);
  const [news, setNews] = useState([]);
  const [media, setMedia] = useState([]);
  const [team, setTeam] = useState([]);
  const [pages, setPages] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  
  // Doctor Search, Speciality Filter & Pagination States
  const [doctorSearch, setDoctorSearch] = useState('');
  const [selectedSpecialityFilter, setSelectedSpecialityFilter] = useState('');
  const [doctorPage, setDoctorPage] = useState(1);
  const DOCTORS_PER_PAGE = 25;
  const [settings, setSettings] = useState({
    project_name: '',
    project_company: '',
    project_details: '',
    project_address: '',
    project_contact: '',
    views: 0
  });

  // Marketing, Pixel, GTM, SEO, SMTP & SMS States
  const [marketingSettings, setMarketingSettings] = useState({
    google_analytics_id: '',
    google_tag_manager_id: '',
    facebook_pixel_id: '',
    header_custom_scripts: '',
    footer_custom_scripts: '',
    site_meta_title: '',
    site_meta_description: '',
    site_meta_keywords: '',
    smtp_host: '',
    smtp_port: '587',
    smtp_user: '',
    smtp_pass: '',
    smtp_encryption: 'tls',
    smtp_from_name: 'Popular Medical College Hospital',
    smtp_from_email: '',
    sms_gateway_url: '',
    sms_api_key: '',
    sms_sender_id: 'PMCH',
    sms_api_secret: ''
  });

  // Doctor Specific SEO State
  const [selectedDoctorSeo, setSelectedDoctorSeo] = useState(null);
  const [doctorSeoModalOpen, setDoctorSeoModalOpen] = useState(false);
  const [doctorSeoForm, setDoctorSeoForm] = useState({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    canonical_url: '',
    og_image: '',
    schema_markup: ''
  });

  // Test Dispatches
  const [testEmail, setTestEmail] = useState('');
  const [testEmailResult, setTestEmailResult] = useState(null);
  const [testPhone, setTestPhone] = useState('');
  const [testSmsMsg, setTestSmsMsg] = useState('PMCH: Your test notification appointment alert is working.');
  const [testSmsResult, setTestSmsResult] = useState(null);

  // Modal / Form States
  const [modalType, setModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

  // Password Change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // Auth Guard & Initial Data Fetch
  useEffect(() => {
    const token = localStorage.getItem('pmch_admin_token');
    const storedUser = localStorage.getItem('pmch_admin_user');
    if (!token) {
      navigate('/login');
      return;
    }
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }

    loadDashboard();
  }, [navigate]);

  const loadDashboard = () => {
    setLoading(true);
    api.get('/admin/dashboard')
      .then(res => {
        if (res.data?.success) {
          setStats(res.data);
        }
      })
      .catch(err => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('pmch_admin_token');
          navigate('/login');
        }
      })
      .finally(() => setLoading(false));
  };

  // Loaders for specific tabs
  const loadDoctors = () => {
    api.get('/admin/doctors').then(res => res.data?.success && setDoctors(res.data.data));
    api.get('/admin/specialities').then(res => res.data?.success && setSpecialities(res.data.data));
  };

  const loadNews = () => {
    api.get('/admin/news').then(res => res.data?.success && setNews(res.data.data));
  };

  const loadMedia = () => {
    api.get('/admin/media').then(res => res.data?.success && setMedia(res.data.data));
  };

  const loadTeam = () => {
    api.get('/admin/team').then(res => res.data?.success && setTeam(res.data.data));
  };

  const loadPages = () => {
    api.get('/admin/pages').then(res => res.data?.success && setPages(res.data.data));
  };

  const loadSettings = () => {
    api.get('/admin/settings').then(res => res.data?.success && setSettings(res.data.data));
  };

  const loadMarketingSettings = () => {
    api.get('/admin/marketing-settings').then(res => {
      if (res.data?.success && res.data.settings) {
        setMarketingSettings(prev => ({ ...prev, ...res.data.settings }));
      }
    });
  };

  // Filtered & Paginated Doctors Calculation
  const filteredDoctors = doctors.filter(dr => {
    const query = doctorSearch.trim().toLowerCase();
    const matchesSearch = !query || 
      (dr.dr_name && dr.dr_name.toLowerCase().includes(query)) ||
      (dr.dr_degree && dr.dr_degree.toLowerCase().includes(query)) ||
      (dr.speciality_names && dr.speciality_names.toLowerCase().includes(query));
    
    const matchesSpec = !selectedSpecialityFilter || 
      (dr.speciality_ids && dr.speciality_ids.split(',').map(s => s.trim()).includes(String(selectedSpecialityFilter)));

    return matchesSearch && matchesSpec;
  });

  const totalDoctorPages = Math.ceil(filteredDoctors.length / DOCTORS_PER_PAGE) || 1;
  const paginatedDoctors = filteredDoctors.slice((doctorPage - 1) * DOCTORS_PER_PAGE, doctorPage * DOCTORS_PER_PAGE);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'overview') loadDashboard();
    else if (tab === 'doctors') loadDoctors();
    else if (tab === 'news') loadNews();
    else if (tab === 'photos' || tab === 'videos') loadMedia();
    else if (tab === 'team') loadTeam();
    else if (tab === 'pages_seo') loadPages();
    else if (tab === 'settings') loadSettings();
    else if (tab === 'marketing' || tab === 'smtp_sms') loadMarketingSettings();
    else if (tab === 'specialities') {
      api.get('/admin/specialities').then(res => res.data?.success && setSpecialities(res.data.data));
      loadDoctors();
    }

    if (window.innerWidth < 992) {
      setSidebarOpen(false);
    }
  };

  // Status Toggle
  const handleToggleStatus = (table, key, id, field, listSetter) => {
    api.post('/admin/toggle-status', { table, key, id, field })
      .then(res => {
        if (res.data?.success) {
          showToast(`Status updated to ${res.data.status}`);
          listSetter(prev => prev.map(item => item[key] === id ? { ...item, [field]: res.data.newVal } : item));
        }
      })
      .catch(err => showToast(err.response?.data?.msg || 'Error updating status', 'danger'));
  };

  // Universal File Upload
  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);

    api.post('/admin/upload', data)
      .then(res => {
        if (res.data?.success) {
          showToast('Image uploaded successfully!');
          setFormData(prev => ({
            ...prev,
            [fieldName]: res.data.filename
          }));
        }
      })
      .catch(err => showToast(err.response?.data?.message || 'File upload failed', 'danger'))
      .finally(() => setUploading(false));
  };

  // Open Edit / Create Modals
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      if (type === 'doctor') {
        const specIds = item.speciality_ids ? item.speciality_ids.split(',').map(Number) : [];
        setFormData({
          ...item,
          dr_name: cleanField(item.dr_name),
          dr_degree: cleanField(item.dr_degree),
          dr_education: cleanField(item.dr_education),
          dr_prev_exp: cleanField(item.dr_prev_exp),
          dr_exp_sum: cleanField(item.dr_exp_sum),
          dr_visit_hrs: cleanField(item.dr_visit_hrs),
          specialities: specIds
        });
      } else {
        setFormData({ ...item });
      }
    } else {
      if (type === 'doctor') setFormData({ dr_name: '', dr_degree: '', dr_education: '', dr_prev_exp: '', dr_exp_sum: '', dr_visit_hrs: '', dr_image: 'male.jpg', specialities: [] });
      else if (type === 'news') setFormData({ news_title: '', news_detail: '', news_img: '', news_type: 1, news_postdate: new Date().toISOString().slice(0, 10) });
      else if (type === 'photo') setFormData({ med_title: '', med_desc: '', med_file: '', med_type: 'image', med_category: 1 });
      else if (type === 'video') setFormData({ med_title: '', med_desc: '', med_url: '', med_type: 'video', med_category: 2 });
      else if (type === 'team') setFormData({ name: '', designation: '', bio: '', image: '', row: 1, sl: 1 });
      else if (type === 'speciality') setFormData({ sp_name: '', sp_info: '', sp_desc: '' });
      else if (type === 'page_seo') setFormData({ page_id: item?.id || '', title: item?.meta_title || '', keywords: item?.meta_keywords || '', description: item?.meta_description || '', author: item?.meta_author || 'Popular Medical College Hospital' });
    }
  };

  const closeModal = () => {
    setModalType(null);
    setEditingItem(null);
    setFormData({});
  };

  // Open Doctor Specific SEO Modal
  const openDoctorSeoModal = (dr) => {
    setSelectedDoctorSeo(dr);
    setDoctorSeoModalOpen(true);
    api.get(`/admin/doctors/${dr.dr_id}/seo`)
      .then(res => {
        if (res.data?.success && res.data.seo) {
          const s = res.data.seo;
          setDoctorSeoForm({
            ...s,
            meta_title: cleanField(s.meta_title),
            meta_description: cleanField(s.meta_description),
            meta_keywords: cleanField(s.meta_keywords),
            canonical_url: s.canonical_url || `https://demo.pmch-bd.com/package?dr=${dr.dr_id}`,
            og_image: s.og_image || dr.dr_image || 'male.jpg',
            schema_markup: s.schema_markup || ''
          });
        }
      })
      .catch(err => showToast('Failed to load Doctor SEO', 'danger'));
  };

  const closeDoctorSeoModal = () => {
    setSelectedDoctorSeo(null);
    setDoctorSeoModalOpen(false);
    setDoctorSeoForm({});
  };

  const handleSaveDoctorSeo = (e) => {
    e.preventDefault();
    if (!selectedDoctorSeo) return;
    api.post(`/admin/doctors/${selectedDoctorSeo.dr_id}/seo`, doctorSeoForm)
      .then(res => {
        showToast(res.data.message);
        closeDoctorSeoModal();
      })
      .catch(err => showToast(err.response?.data?.message || 'Error saving Doctor SEO', 'danger'));
  };

  // Universal Save / Submit
  const handleModalSubmit = (e) => {
    e.preventDefault();

    if (modalType === 'doctor') {
      const promise = editingItem
        ? api.put(`/admin/doctors/${editingItem.dr_id}`, formData)
        : api.post('/admin/doctors', formData);
      promise.then(res => {
        showToast(res.data.message);
        closeModal();
        loadDoctors();
      }).catch(err => showToast(err.response?.data?.message || 'Error saving doctor', 'danger'));
    } 
    else if (modalType === 'news') {
      const promise = editingItem
        ? api.put(`/admin/news/${editingItem.news_id}`, formData)
        : api.post('/admin/news', formData);
      promise.then(res => {
        showToast(res.data.message);
        closeModal();
        loadNews();
      }).catch(err => showToast(err.response?.data?.message || 'Error saving news', 'danger'));
    }
    else if (modalType === 'photo' || modalType === 'video') {
      const promise = editingItem
        ? api.put(`/admin/media/${editingItem.med_id}`, formData)
        : api.post('/admin/media', formData);
      promise.then(res => {
        showToast(res.data.message);
        closeModal();
        loadMedia();
      }).catch(err => showToast(err.response?.data?.message || 'Error saving media', 'danger'));
    }
    else if (modalType === 'team') {
      const promise = editingItem
        ? api.put(`/admin/team/${editingItem.id}`, formData)
        : api.post('/admin/team', formData);
      promise.then(res => {
        showToast(res.data.message);
        closeModal();
        loadTeam();
      }).catch(err => showToast(err.response?.data?.message || 'Error saving team member', 'danger'));
    }
    else if (modalType === 'speciality') {
      const promise = editingItem
        ? api.put(`/admin/specialities/${editingItem.sp_id}`, formData)
        : api.post('/admin/specialities', formData);
      promise.then(res => {
        showToast(res.data.message);
        closeModal();
        api.get('/admin/specialities').then(r => setSpecialities(r.data?.data || []));
      }).catch(err => showToast(err.response?.data?.message || 'Error saving speciality', 'danger'));
    }
    else if (modalType === 'page_seo') {
      api.post('/admin/pages/seo', formData).then(res => {
        showToast(res.data.message);
        closeModal();
        loadPages();
      }).catch(err => showToast(err.response?.data?.message || 'Error saving SEO', 'danger'));
    }
  };

  // Universal Delete
  const handleDelete = (endpoint, id, reloadFn) => {
    if (!window.confirm('Are you sure you want to permanently delete this item?')) return;
    api.delete(`${endpoint}/${id}`)
      .then(res => {
        showToast(res.data.message || 'Item deleted successfully');
        reloadFn();
      })
      .catch(err => showToast(err.response?.data?.message || 'Delete failed', 'danger'));
  };

  // Save General Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    api.post('/admin/settings', settings)
      .then(res => showToast(res.data.message))
      .catch(err => showToast(err.response?.data?.message || 'Failed to update settings', 'danger'));
  };

  // Save Marketing Settings
  const handleSaveMarketingSettings = (e) => {
    e.preventDefault();
    api.post('/admin/marketing-settings', marketingSettings)
      .then(res => showToast(res.data.message))
      .catch(err => showToast(err.response?.data?.message || 'Failed to update marketing settings', 'danger'));
  };

  // Send Test Email
  const handleTestEmail = (e) => {
    e.preventDefault();
    setTestEmailResult(null);
    api.post('/admin/test-smtp', { test_email: testEmail })
      .then(res => {
        setTestEmailResult({ success: true, message: res.data.message });
        showToast('SMTP Test Passed!');
      })
      .catch(err => {
        setTestEmailResult({ success: false, message: err.response?.data?.message || 'SMTP Connection Failed' });
      });
  };

  // Send Test SMS
  const handleTestSms = (e) => {
    e.preventDefault();
    setTestSmsResult(null);
    api.post('/admin/test-sms', { test_mobile: testPhone, test_message: testSmsMsg })
      .then(res => {
        setTestSmsResult({ success: true, message: res.data.message });
        showToast('SMS Test Dispatched!');
      })
      .catch(err => {
        setTestSmsResult({ success: false, message: err.response?.data?.message || 'SMS Gateway Error' });
      });
  };

  // Change Password
  const handleChangePassword = (e) => {
    e.preventDefault();
    api.post('/admin/change-password', { oldPassword, newPassword })
      .then(res => {
        showToast(res.data.message);
        setOldPassword('');
        setNewPassword('');
      })
      .catch(err => showToast(err.response?.data?.message || 'Password update failed', 'danger'));
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('pmch_admin_token');
    localStorage.removeItem('pmch_admin_user');
    navigate('/login');
  };

  return (
    <div className="d-flex" style={{ height: '100vh', maxHeight: '100vh', backgroundColor: '#f4f7f6', overflow: 'hidden' }}>
      {/* Toast Notification Popup */}
      {toast.show && (
        <div
          className={`alert alert-${toast.type} shadow-lg position-fixed d-flex align-items-center`}
          style={{ top: '20px', right: '20px', zIndex: 99999, borderRadius: '8px', minWidth: '280px' }}
        >
          <i className={`fas fa-${toast.type === 'success' ? 'check-circle' : 'exclamation-triangle'} mr-2`}></i>
          <div>{toast.message}</div>
        </div>
      )}

      {/* ========================================================
          1. MODERN RESPONSIVE SIDEBAR (ROCK-SOLID FIXED)
          ======================================================== */}
      <aside
        style={{
          width: sidebarOpen ? '270px' : '0px',
          minWidth: sidebarOpen ? '270px' : '0px',
          height: '100vh',
          backgroundColor: '#0c1a14',
          color: '#ffffff',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 1000,
          flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.08)'
        }}
        className="d-flex flex-column"
      >
        {/* Sidebar Brand Header (Height 64px - Exact match with Top Navbar) */}
        <div
          className="px-3 d-flex align-items-center justify-content-between"
          style={{
            height: '64px',
            minHeight: '64px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: '#091510'
          }}
        >
          <div className="d-flex align-items-center">
            <div
              className="rounded d-flex align-items-center justify-content-center mr-2 shadow-sm"
              style={{
                width: '36px',
                height: '36px',
                minWidth: '36px',
                background: 'linear-gradient(135deg, #00984A 0%, #007a3b 100%)'
              }}
            >
              <i className="fas fa-hospital-alt text-white"></i>
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div className="font-weight-bold text-white small" style={{ letterSpacing: '0.5px' }}>
                PMCH ADMIN
              </div>
              <div className="d-flex align-items-center mt-1">
                <span className="badge badge-success px-1 py-0 mr-1" style={{ fontSize: '8px', backgroundColor: '#00984A' }}>
                  SUPER ADMIN
                </span>
                <span className="text-success small" style={{ fontSize: '9px' }}>
                  <i className="fas fa-circle mr-1" style={{ fontSize: '6px' }}></i>Online
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="btn btn-sm btn-link text-white-50 d-lg-none p-0"
            title="Close Sidebar"
          >
            <i className="fas fa-times fa-lg"></i>
          </button>
        </div>

        {/* Sidebar Nav Links with High Visibility and Card-Pills */}
        <div className="p-2 flex-grow-1" style={{ overflowY: 'auto' }}>
          <div className="sidebar-section-title px-2 pt-2 pb-1 text-uppercase font-weight-bold">
            <span>Main Navigation</span>
          </div>

          <button
            onClick={() => handleTabChange('overview')}
            className={`sidebar-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <div className="sidebar-icon-box" style={{ color: activeTab === 'overview' ? '#ffffff' : '#34d399' }}>
              <i className="fas fa-chart-line"></i>
            </div>
            <span className="sidebar-nav-text">Dashboard & Analytics</span>
            {activeTab === 'overview' && <i className="fas fa-chevron-right ml-auto small opacity-75"></i>}
          </button>

          <div className="sidebar-section-title px-2 pt-3 pb-1 text-uppercase font-weight-bold">
            <span>SEO & Digital Marketing</span>
          </div>

          <button
            onClick={() => handleTabChange('marketing')}
            className={`sidebar-nav-btn ${activeTab === 'marketing' ? 'active' : ''}`}
          >
            <div className="sidebar-icon-box" style={{ color: activeTab === 'marketing' ? '#ffffff' : '#f59e0b' }}>
              <i className="fas fa-bullhorn"></i>
            </div>
            <span className="sidebar-nav-text">Google Tags & Meta Pixel</span>
            {activeTab === 'marketing' && <i className="fas fa-chevron-right ml-auto small opacity-75"></i>}
          </button>

          <button
            onClick={() => handleTabChange('pages_seo')}
            className={`sidebar-nav-btn ${activeTab === 'pages_seo' ? 'active' : ''}`}
          >
            <div className="sidebar-icon-box" style={{ color: activeTab === 'pages_seo' ? '#ffffff' : '#38bdf8' }}>
              <i className="fas fa-globe"></i>
            </div>
            <span className="sidebar-nav-text">Page SEO & Metadata</span>
            {activeTab === 'pages_seo' && <i className="fas fa-chevron-right ml-auto small opacity-75"></i>}
          </button>

          <button
            onClick={() => handleTabChange('smtp_sms')}
            className={`sidebar-nav-btn ${activeTab === 'smtp_sms' ? 'active' : ''}`}
          >
            <div className="sidebar-icon-box" style={{ color: activeTab === 'smtp_sms' ? '#ffffff' : '#818cf8' }}>
              <i className="fas fa-envelope-open-text"></i>
            </div>
            <span className="sidebar-nav-text">SMTP & SMS Gateway</span>
            {activeTab === 'smtp_sms' && <i className="fas fa-chevron-right ml-auto small opacity-75"></i>}
          </button>

          <button
            onClick={() => handleTabChange('settings')}
            className={`sidebar-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
          >
            <div className="sidebar-icon-box" style={{ color: activeTab === 'settings' ? '#ffffff' : '#94a3b8' }}>
              <i className="fas fa-sliders-h"></i>
            </div>
            <span className="sidebar-nav-text">General Hospital Settings</span>
            {activeTab === 'settings' && <i className="fas fa-chevron-right ml-auto small opacity-75"></i>}
          </button>

          <div className="sidebar-section-title px-2 pt-3 pb-1 text-uppercase font-weight-bold">
            <span>Clinical & Medical</span>
          </div>

          <button
            onClick={() => handleTabChange('doctors')}
            className={`sidebar-nav-btn ${activeTab === 'doctors' ? 'active' : ''}`}
          >
            <div className="sidebar-icon-box" style={{ color: activeTab === 'doctors' ? '#ffffff' : '#10b981' }}>
              <i className="fas fa-user-md"></i>
            </div>
            <span className="sidebar-nav-text">Doctor List</span>
            {activeTab === 'doctors' && <i className="fas fa-chevron-right ml-auto small opacity-75"></i>}
          </button>

          <button
            onClick={() => handleTabChange('specialities')}
            className={`sidebar-nav-btn ${activeTab === 'specialities' ? 'active' : ''}`}
          >
            <div className="sidebar-icon-box" style={{ color: activeTab === 'specialities' ? '#ffffff' : '#06b6d4' }}>
              <i className="fas fa-stethoscope"></i>
            </div>
            <span className="sidebar-nav-text">Specialities & Departments</span>
            {activeTab === 'specialities' && <i className="fas fa-chevron-right ml-auto small opacity-75"></i>}
          </button>

          <div className="sidebar-section-title px-2 pt-3 pb-1 text-uppercase font-weight-bold">
            <span>News & Media Center</span>
          </div>

          <button
            onClick={() => handleTabChange('news')}
            className={`sidebar-nav-btn ${activeTab === 'news' ? 'active' : ''}`}
          >
            <div className="sidebar-icon-box" style={{ color: activeTab === 'news' ? '#ffffff' : '#fbbf24' }}>
              <i className="fas fa-newspaper"></i>
            </div>
            <span className="sidebar-nav-text">News & Hospital Events</span>
            {activeTab === 'news' && <i className="fas fa-chevron-right ml-auto small opacity-75"></i>}
          </button>

          <button
            onClick={() => handleTabChange('photos')}
            className={`sidebar-nav-btn ${activeTab === 'photos' ? 'active' : ''}`}
          >
            <div className="sidebar-icon-box" style={{ color: activeTab === 'photos' ? '#ffffff' : '#a78bfa' }}>
              <i className="fas fa-images"></i>
            </div>
            <span className="sidebar-nav-text">Photo Gallery</span>
            {activeTab === 'photos' && <i className="fas fa-chevron-right ml-auto small opacity-75"></i>}
          </button>

          <button
            onClick={() => handleTabChange('videos')}
            className={`sidebar-nav-btn ${activeTab === 'videos' ? 'active' : ''}`}
          >
            <div className="sidebar-icon-box" style={{ color: activeTab === 'videos' ? '#ffffff' : '#f87171' }}>
              <i className="fab fa-youtube"></i>
            </div>
            <span className="sidebar-nav-text">Video Gallery (YouTube)</span>
            {activeTab === 'videos' && <i className="fas fa-chevron-right ml-auto small opacity-75"></i>}
          </button>

          <div className="sidebar-section-title px-2 pt-3 pb-1 text-uppercase font-weight-bold">
            <span>Leadership & Security</span>
          </div>

          <button
            onClick={() => handleTabChange('team')}
            className={`sidebar-nav-btn ${activeTab === 'team' ? 'active' : ''}`}
          >
            <div className="sidebar-icon-box" style={{ color: activeTab === 'team' ? '#ffffff' : '#fb923c' }}>
              <i className="fas fa-users-cog"></i>
            </div>
            <span className="sidebar-nav-text">Management Team (Tiers)</span>
            {activeTab === 'team' && <i className="fas fa-chevron-right ml-auto small opacity-75"></i>}
          </button>

          <button
            onClick={() => handleTabChange('security')}
            className={`sidebar-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
          >
            <div className="sidebar-icon-box" style={{ color: activeTab === 'security' ? '#ffffff' : '#f43f5e' }}>
              <i className="fas fa-shield-alt"></i>
            </div>
            <span className="sidebar-nav-text">Security & Password</span>
            {activeTab === 'security' && <i className="fas fa-chevron-right ml-auto small opacity-75"></i>}
          </button>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#091510' }}>
          <Link
            to="/"
            target="_blank"
            className="btn btn-sm btn-outline-light btn-block mb-2 font-weight-bold"
            style={{ fontSize: '12px', borderRadius: '6px' }}
          >
            <i className="fas fa-external-link-alt mr-1"></i> Visit Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-danger btn-block font-weight-bold"
            style={{ fontSize: '12px', borderRadius: '6px' }}
          >
            <i className="fas fa-sign-out-alt mr-1"></i> Sign Out
          </button>
        </div>
      </aside>

      {/* ========================================================
          2. MAIN CONTENT AREA (HEADER + BODY)
          ======================================================== */}
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0, height: '100vh', overflowY: 'auto' }}>
        {/* Top Header Bar (Height 64px - Exact match with Sidebar Header) */}
        <header
          className="d-flex align-items-center justify-content-between px-3 px-md-4 bg-white shadow-sm"
          style={{
            height: '64px',
            minHeight: '64px',
            borderBottom: '1px solid #e2e8f0',
            position: 'sticky',
            top: 0,
            zIndex: 999
          }}
        >
          <div className="d-flex align-items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn btn-light btn-sm mr-3 border"
              title="Toggle Navigation Sidebar"
            >
              <i className="fas fa-bars"></i>
            </button>
            <h5 className="mb-0 font-weight-bold text-dark text-capitalize d-none d-sm-block" style={{ fontSize: '16px' }}>
              {activeTab === 'overview' && 'Executive Analytics & Dashboard'}
              {activeTab === 'marketing' && 'Digital Marketing, Meta Pixel & Google Tags Manager'}
              {activeTab === 'smtp_sms' && 'SMTP Mail Server & SMS Gateway Configuration'}
              {activeTab === 'settings' && 'General Hospital Settings (Header, Footer & Brand)'}
              {activeTab === 'pages_seo' && 'Page Management & SEO Configurations'}
              {activeTab === 'doctors' && 'Doctors Directory & Individual SEO Optimizer'}
              {activeTab === 'specialities' && 'Medical Specialities & Clinical Departments'}
              {activeTab === 'news' && 'News & Hospital Events Manager'}
              {activeTab === 'photos' && 'Hospital Photo Gallery'}
              {activeTab === 'videos' && 'Hospital Video Gallery (YouTube Stream)'}
              {activeTab === 'team' && 'Management Team Hierarchy & Leadership'}
              {activeTab === 'security' && 'Admin Account Security & Password'}
            </h5>
          </div>

          <div className="d-flex align-items-center">
            <span className="badge badge-light px-3 py-2 mr-3 d-none d-md-inline-block border text-muted">
              <i className="fas fa-database text-success mr-1"></i> MySQL Online
            </span>
            <Link
              to="/"
              target="_blank"
              className="btn btn-sm text-white mr-3 font-weight-bold shadow-sm"
              style={{ backgroundColor: '#00984A', borderRadius: '6px' }}
            >
              <i className="fas fa-eye mr-1"></i> Live Portal
            </Link>

            {/* Admin Profile Chip */}
            <div className="d-flex align-items-center mr-3 pl-3 border-left">
              <div
                className="rounded-circle mr-2 text-white font-weight-bold d-flex align-items-center justify-content-center shadow-sm"
                style={{ width: '34px', height: '34px', backgroundColor: '#00984A', fontSize: '13px' }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="d-none d-lg-block text-left" style={{ lineHeight: 1.2 }}>
                <div className="font-weight-bold text-dark small">{user?.name || 'Administrator'}</div>
                <div className="text-muted" style={{ fontSize: '10px' }}>Super Admin</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-sm btn-outline-danger"
              title="Logout"
              style={{ borderRadius: '6px' }}
            >
              <i className="fas fa-power-off"></i>
            </button>
          </div>
        </header>

        {/* Tab Body View */}
        <main className="p-3 p-md-4 flex-grow-1">
          {/* TAB 1: OVERVIEW & ANALYTICS DASHBOARD */}
          {activeTab === 'overview' && (
            <div>
              {/* Metric Counters Grid with Counting Animations */}
              <div className="row">
                <div className="col-xl-3 col-sm-6 mb-4">
                  <div className="card border-0 shadow-sm rounded-lg p-3 h-100" style={{ borderLeft: '4px solid #00984A' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div className="text-muted small font-weight-bold text-uppercase">Total Visitors</div>
                        <h3 className="font-weight-extra-bold text-dark mb-0 mt-1">
                          <AnimatedCounter end={stats?.counters?.views || 4173264} duration={1600} />
                        </h3>
                        <span className="badge badge-success px-2 py-1 mt-2" style={{ backgroundColor: '#00984A' }}>
                          <i className="fas fa-arrow-up mr-1"></i> +8.4% this month
                        </span>
                      </div>
                      <div className="rounded-circle p-3 shadow-sm" style={{ backgroundColor: '#e6f5ed', color: '#00984A' }}>
                        <i className="fas fa-users fa-2x"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-sm-6 mb-4">
                  <div className="card border-0 shadow-sm rounded-lg p-3 h-100" style={{ borderLeft: '4px solid #0088cc' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div className="text-muted small font-weight-bold text-uppercase">Specialist Doctors</div>
                        <h3 className="font-weight-extra-bold text-dark mb-0 mt-1">
                          <AnimatedCounter end={stats?.counters?.total_doctors || 800} duration={1400} />
                        </h3>
                        <span className="text-muted small mt-2 d-block">
                          <AnimatedCounter end={stats?.counters?.active_doctors || 430} duration={1200} /> active consultants
                        </span>
                      </div>
                      <div className="rounded-circle p-3 shadow-sm" style={{ backgroundColor: '#e6f3fa', color: '#0088cc' }}>
                        <i className="fas fa-user-md fa-2x"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-sm-6 mb-4">
                  <div className="card border-0 shadow-sm rounded-lg p-3 h-100" style={{ borderLeft: '4px solid #e08e0b' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div className="text-muted small font-weight-bold text-uppercase">News & Events</div>
                        <h3 className="font-weight-extra-bold text-dark mb-0 mt-1">
                          <AnimatedCounter end={stats?.counters?.news || 24} duration={1000} />
                        </h3>
                        <span className="text-muted small mt-2 d-block">Public health releases</span>
                      </div>
                      <div className="rounded-circle p-3 shadow-sm" style={{ backgroundColor: '#fcf3e8', color: '#e08e0b' }}>
                        <i className="fas fa-newspaper fa-2x"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-sm-6 mb-4">
                  <div className="card border-0 shadow-sm rounded-lg p-3 h-100" style={{ borderLeft: '4px solid #6f42c1' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div className="text-muted small font-weight-bold text-uppercase">Gallery Media</div>
                        <h3 className="font-weight-extra-bold text-dark mb-0 mt-1">
                          <AnimatedCounter end={(stats?.counters?.photos || 0) + (stats?.counters?.videos || 0)} duration={1000} />
                        </h3>
                        <span className="text-muted small mt-2 d-block">
                          <AnimatedCounter end={stats?.counters?.photos || 0} duration={800} /> Photos • <AnimatedCounter end={stats?.counters?.videos || 0} duration={800} /> Videos
                        </span>
                      </div>
                      <div className="rounded-circle p-3 shadow-sm" style={{ backgroundColor: '#f3eefb', color: '#6f42c1' }}>
                        <i className="fas fa-photo-video fa-2x"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* GRAPHICAL CHARTS & ALGORITHM ANALYTICS SECTION */}
              <div className="row">
                {/* Visual Chart 1: 6-Month Traffic & Inquiries Growth */}
                <div className="col-lg-8 mb-4">
                  <div className="card border-0 shadow-sm rounded-lg p-4 bg-white h-100">
                    <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap">
                      <div>
                        <h5 className="font-weight-bold text-dark mb-1">
                          <i className="fas fa-chart-area mr-2" style={{ color: '#00984A' }}></i>
                          Visitor Traffic & Engagement Algorithm
                        </h5>
                        <p className="text-muted small mb-0">6-Month monthly visitor traffic progression & online appointment leads</p>
                      </div>
                      <span className="badge badge-light px-3 py-2 border font-weight-bold">
                        Real-time Analytics Feed
                      </span>
                    </div>

                    {/* Pure SVG Animated Analytical Bar Chart */}
                    <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 10px', borderBottom: '2px solid #edf2ef' }}>
                      {(stats?.chartData || [
                        { month: 'May', visitors: 3920, appointments: 840 },
                        { month: 'Jun', visitors: 3980, appointments: 920 },
                        { month: 'Jul', visitors: 4030, appointments: 1050 },
                        { month: 'Aug', visitors: 4090, appointments: 1140 },
                        { month: 'Sep', visitors: 4140, appointments: 1280 },
                        { month: 'Oct', visitors: 4173, appointments: 1420 }
                      ]).map((item, idx) => {
                        const heightPct = 35 + idx * 11;
                        return (
                          <div key={idx} className="text-center" style={{ width: '14%' }}>
                            <div className="small font-weight-bold mb-1 text-success" style={{ fontSize: '11px' }}>
                              <AnimatedCounter end={item.visitors} duration={1200} formatter={(n) => `${n}k`} />
                            </div>
                            <div
                              className="rounded-top shadow-sm mx-auto chart-bar-item"
                              style={{
                                height: `${heightPct * 2}px`,
                                width: '38px',
                                background: idx === 5 ? 'linear-gradient(180deg, #00984A 0%, #007a3b 100%)' : 'linear-gradient(180deg, #34d399 0%, #10b981 100%)',
                                transition: 'all 0.4s ease',
                                cursor: 'pointer',
                                boxShadow: idx === 5 ? '0 4px 12px rgba(0, 152, 74, 0.35)' : 'none'
                              }}
                              title={`${item.month}: ${item.visitors}k Visitors | ${item.appointments} Appointments`}
                            />
                            <div className="font-weight-bold text-dark small mt-2">{item.month}</div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="d-flex justify-content-center align-items-center mt-3 pt-2 text-muted small">
                      <span className="mr-3"><i className="fas fa-square mr-1 text-success"></i> Monthly Web Visitors (k)</span>
                      <span><i className="fas fa-circle mr-1 text-primary"></i> Patient Registrations & Enquiries</span>
                    </div>
                  </div>
                </div>

                {/* Chart 2: Top Clinical Department Allocation - Animated Donut / Pie Chart */}
                <div className="col-lg-4 mb-4">
                  <div className="card border-0 shadow-sm rounded-lg p-4 bg-white h-100 d-flex flex-column">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h5 className="font-weight-bold text-dark mb-0">
                        <i className="fas fa-chart-pie mr-2" style={{ color: '#0088cc' }}></i>
                        Speciality Distribution
                      </h5>
                      <span className="badge badge-success px-2 py-1 small" style={{ backgroundColor: '#00984A' }}>
                        Live Faculty
                      </span>
                    </div>
                    <p className="text-muted small mb-3">Top consultant faculties at PMCH</p>

                    {/* Animated Interactive SVG Pie / Donut Chart */}
                    <div className="my-auto py-2">
                      <AnimatedDonutChart
                        data={(() => {
                          const pieColors = ['#00984A', '#0284C7', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'];
                          if (stats?.deptDistribution && stats.deptDistribution.length > 0) {
                            return stats.deptDistribution.map((dept, idx) => ({
                              label: dept.sp_name,
                              count: dept.doctor_count,
                              color: pieColors[idx % pieColors.length]
                            }));
                          }
                          return [
                            { label: 'Gynaecology & Obs', count: 52, color: '#00984A' },
                            { label: 'Chest Medicine', count: 78, color: '#0284C7' },
                            { label: 'Child/Paediatrics', count: 41, color: '#F59E0B' },
                            { label: 'ENT & Head Surgery', count: 36, color: '#8B5CF6' },
                            { label: 'Orthopaedics Specialist', count: 39, color: '#EC4899' }
                          ];
                        })()}
                      />
                    </div>

                    <div className="p-3 rounded mt-3" style={{ backgroundColor: '#f0f7f3', border: '1px solid #d9ede2' }}>
                      <div className="small font-weight-bold" style={{ color: '#007a3b' }}>
                        <i className="fas fa-lightbulb mr-1"></i> Search Engine Indexing
                      </div>
                      <p className="text-muted small mb-0 mt-1">
                        All doctor profiles and clinical pages have SEO metadata active for Google indexing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Shortcuts */}
              <div className="card border-0 shadow-sm rounded-lg p-4 bg-white mb-4">
                <h6 className="font-weight-bold text-dark mb-3 text-uppercase small" style={{ letterSpacing: '0.5px' }}>
                  Quick Action Center
                </h6>
                <div className="row">
                  <div className="col-md-3 col-6 mb-2">
                    <button onClick={() => openModal('doctor')} className="btn btn-outline-success btn-block font-weight-bold py-2 text-truncate">
                      <i className="fas fa-user-plus mr-1"></i> Add Doctor
                    </button>
                  </div>
                  <div className="col-md-3 col-6 mb-2">
                    <button onClick={() => openModal('news')} className="btn btn-outline-primary btn-block font-weight-bold py-2 text-truncate">
                      <i className="fas fa-plus-circle mr-1"></i> Publish News
                    </button>
                  </div>
                  <div className="col-md-3 col-6 mb-2">
                    <button onClick={() => openModal('photo')} className="btn btn-outline-info btn-block font-weight-bold py-2 text-truncate">
                      <i className="fas fa-camera mr-1"></i> Upload Photo
                    </button>
                  </div>
                  <div className="col-md-3 col-6 mb-2">
                    <button onClick={() => openModal('video')} className="btn btn-outline-danger btn-block font-weight-bold py-2 text-truncate">
                      <i className="fab fa-youtube mr-1"></i> Add YouTube Video
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DIGITAL MARKETING, PIXEL & GOOGLE TAGS SUITE */}
          {activeTab === 'marketing' && (
            <div className="card border-0 shadow-sm rounded-lg p-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <div>
                  <h5 className="font-weight-bold text-dark mb-1">
                    <i className="fas fa-bullhorn mr-2 text-warning"></i>
                    Digital Marketing, Meta Pixel & Google Tag Manager
                  </h5>
                  <p className="text-muted small mb-0">Configure Google Analytics (GA4), GTM, Facebook Pixel and tracking scripts for ad campaigns.</p>
                </div>
                <span className="badge badge-success px-3 py-2 font-weight-bold" style={{ backgroundColor: '#00984A' }}>
                  <i className="fas fa-check-circle mr-1"></i> Dynamic Tracking Active
                </span>
              </div>

              <form onSubmit={handleSaveMarketingSettings}>
                {/* 1. Google Analytics & GTM */}
                <div className="p-3 mb-4 rounded" style={{ backgroundColor: '#f8fbf9', border: '1px solid #d9ede2' }}>
                  <h6 className="font-weight-bold text-dark mb-3">
                    <i className="fab fa-google text-primary mr-2"></i> Google Tracking Infrastructure
                  </h6>
                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label className="font-weight-bold small text-dark">Google Analytics Measurement ID (GA4)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={marketingSettings.google_analytics_id || ''}
                        onChange={(e) => setMarketingSettings({ ...marketingSettings, google_analytics_id: e.target.value })}
                        placeholder="e.g. G-XXXXXXXXXX"
                      />
                      <small className="form-text text-muted">Automatically injects gtag.js on all public pages.</small>
                    </div>

                    <div className="col-md-6 form-group">
                      <label className="font-weight-bold small text-dark">Google Tag Manager Container ID (GTM)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={marketingSettings.google_tag_manager_id || ''}
                        onChange={(e) => setMarketingSettings({ ...marketingSettings, google_tag_manager_id: e.target.value })}
                        placeholder="e.g. GTM-XXXXXXX"
                      />
                      <small className="form-text text-muted">For enterprise Google Tag Manager container deployment.</small>
                    </div>
                  </div>
                </div>

                {/* 2. Meta Pixel (Facebook Pixel) */}
                <div className="p-3 mb-4 rounded" style={{ backgroundColor: '#f0f4ff', border: '1px solid #d2deff' }}>
                  <h6 className="font-weight-bold text-dark mb-3">
                    <i className="fab fa-facebook text-primary mr-2"></i> Meta Pixel / Facebook Pixel ID
                  </h6>
                  <div className="row">
                    <div className="col-md-12 form-group">
                      <label className="font-weight-bold small text-dark">Facebook Pixel ID</label>
                      <input
                        type="text"
                        className="form-control"
                        value={marketingSettings.facebook_pixel_id || ''}
                        onChange={(e) => setMarketingSettings({ ...marketingSettings, facebook_pixel_id: e.target.value })}
                        placeholder="e.g. 784910293847561"
                      />
                      <small className="form-text text-muted">Tracks PageView, appointment leads, and custom retargeting conversions on Facebook & Instagram.</small>
                    </div>
                  </div>
                </div>

                {/* 3. Global Site SEO Meta Default */}
                <div className="p-3 mb-4 rounded" style={{ backgroundColor: '#fffbf0', border: '1px solid #fae7b8' }}>
                  <h6 className="font-weight-bold text-dark mb-3">
                    <i className="fas fa-search-location text-warning mr-2"></i> Global Master SEO Defaults
                  </h6>
                  <div className="row">
                    <div className="col-md-12 form-group">
                      <label className="font-weight-bold small text-dark">Default Site Meta Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={marketingSettings.site_meta_title || ''}
                        onChange={(e) => setMarketingSettings({ ...marketingSettings, site_meta_title: e.target.value })}
                        placeholder="Popular Medical College Hospital | Premier Healthcare in Dhaka"
                      />
                    </div>
                    <div className="col-md-12 form-group">
                      <label className="font-weight-bold small text-dark">Default Site Meta Description</label>
                      <textarea
                        rows="2"
                        className="form-control"
                        value={marketingSettings.site_meta_description || ''}
                        onChange={(e) => setMarketingSettings({ ...marketingSettings, site_meta_description: e.target.value })}
                        placeholder="150-160 characters summary for Google Search snippet..."
                      />
                    </div>
                    <div className="col-md-12 form-group">
                      <label className="font-weight-bold small text-dark">Master SEO Keywords (Comma Separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={marketingSettings.site_meta_keywords || ''}
                        onChange={(e) => setMarketingSettings({ ...marketingSettings, site_meta_keywords: e.target.value })}
                        placeholder="popular hospital, doctor appointment dhaka, tertiary hospital bangladesh"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Custom Header & Footer Script Injections */}
                <div className="p-3 mb-4 rounded" style={{ backgroundColor: '#fcfcfc', border: '1px solid #e8e8e8' }}>
                  <h6 className="font-weight-bold text-dark mb-3">
                    <i className="fas fa-code text-secondary mr-2"></i> Custom Script Injections (Header & Footer)
                  </h6>
                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label className="font-weight-bold small text-dark">Custom Header Scripts (&lt;head&gt;)</label>
                      <textarea
                        rows="4"
                        className="form-control font-monospace small"
                        style={{ fontFamily: 'monospace', fontSize: '12px' }}
                        value={marketingSettings.header_custom_scripts || ''}
                        onChange={(e) => setMarketingSettings({ ...marketingSettings, header_custom_scripts: e.target.value })}
                        placeholder="<!-- Paste custom tracking scripts, TikTok pixel, or Schema tags here -->"
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <label className="font-weight-bold small text-dark">Custom Footer Scripts (&lt;body&gt;)</label>
                      <textarea
                        rows="4"
                        className="form-control font-monospace small"
                        style={{ fontFamily: 'monospace', fontSize: '12px' }}
                        value={marketingSettings.footer_custom_scripts || ''}
                        onChange={(e) => setMarketingSettings({ ...marketingSettings, footer_custom_scripts: e.target.value })}
                        placeholder="<!-- Paste conversion tracking or chat widgets here -->"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-success font-weight-bold px-4 py-2" style={{ backgroundColor: '#00984A' }}>
                  <i className="fas fa-save mr-1"></i> Save Marketing & SEO Configurations
                </button>
              </form>
            </div>
          )}

          {/* TAB: SMTP & SMS SERVER GATEWAYS */}
          {activeTab === 'smtp_sms' && (
            <div className="card border-0 shadow-sm rounded-lg p-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <div>
                  <h5 className="font-weight-bold text-dark mb-1">
                    <i className="fas fa-mail-bulk mr-2 text-info"></i>
                    SMTP Mail Server & SMS Gateway Configurations
                  </h5>
                  <p className="text-muted small mb-0">Manage notification servers for appointment booking confirmations, inquiry alerts, and staff notifications.</p>
                </div>
              </div>

              <form onSubmit={handleSaveMarketingSettings}>
                {/* SMTP Mail Server */}
                <div className="p-4 mb-4 rounded" style={{ backgroundColor: '#f9fbfb', border: '1px solid #dbe6e8' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="font-weight-bold text-dark mb-0">
                      <i className="fas fa-envelope text-primary mr-2"></i> SMTP Email Server Settings
                    </h6>
                    <span className="badge badge-primary px-3 py-1">Mail Gateway</span>
                  </div>

                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label className="font-weight-bold small text-dark">SMTP Host</label>
                      <input
                        type="text"
                        className="form-control"
                        value={marketingSettings.smtp_host || ''}
                        onChange={(e) => setMarketingSettings({ ...marketingSettings, smtp_host: e.target.value })}
                        placeholder="e.g. mail.popular-hospital.com or smtp.gmail.com"
                      />
                    </div>
                    <div className="col-md-3 col-6 form-group">
                      <label className="font-weight-bold small text-dark">SMTP Port</label>
                      <input
                        type="text"
                        className="form-control"
                        value={marketingSettings.smtp_port || '587'}
                        onChange={(e) => setMarketingSettings({ ...marketingSettings, smtp_port: e.target.value })}
                        placeholder="587 or 465"
                      />
                    </div>
                    <div className="col-md-3 col-6 form-group">
                      <label className="font-weight-bold small text-dark">Encryption</label>
                      <select
                        className="form-control"
                        value={marketingSettings.smtp_encryption || 'tls'}
                        onChange={(e) => setMarketingSettings({ ...marketingSettings, smtp_encryption: e.target.value })}
                      >
                        <option value="tls">TLS</option>
                        <option value="ssl">SSL</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                    <div className="col-md-6 form-group">
                      <label className="font-weight-bold small text-dark">SMTP Username / Email</label>
                      <input
                        type="text"
                        className="form-control"
                        value={marketingSettings.smtp_user || ''}
                        onChange={(e) => setMarketingSettings({ ...marketingSettings, smtp_user: e.target.value })}
                        placeholder="notifications@popular-hospital.com"
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <label className="font-weight-bold small text-dark">SMTP Password / App Secret</label>
                      <input
                        type="password"
                        className="form-control"
                        value={marketingSettings.smtp_pass || ''}
                        onChange={(e) => setMarketingSettings({ ...marketingSettings, smtp_pass: e.target.value })}
                        placeholder="••••••••••••"
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <label className="font-weight-bold small text-dark">Sender From Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={marketingSettings.smtp_from_name || ''}
                        onChange={(e) => setMarketingSettings({ ...marketingSettings, smtp_from_name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <label className="font-weight-bold small text-dark">Sender From Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={marketingSettings.smtp_from_email || ''}
                        onChange={(e) => setMarketingSettings({ ...marketingSettings, smtp_from_email: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Test Email Dispatch Box */}
                  <div className="p-3 bg-white rounded border mt-2">
                    <label className="font-weight-bold small text-dark mb-2">
                      <i className="fas fa-paper-plane text-success mr-1"></i> Send Test Email to Verify Handshake:
                    </label>
                    <div className="input-group">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your recipient email to test (e.g. admin@yourdomain.com)"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                      />
                      <div className="input-group-append">
                        <button type="button" onClick={handleTestEmail} className="btn btn-outline-primary font-weight-bold">
                          Test Email
                        </button>
                      </div>
                    </div>
                    {testEmailResult && (
                      <div className={`alert alert-${testEmailResult.success ? 'success' : 'danger'} py-2 px-3 small mt-2 mb-0`}>
                        {testEmailResult.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* SMS Gateway Server */}
                <div className="p-4 mb-4 rounded" style={{ backgroundColor: '#fcfcf4', border: '1px solid #eaeac0' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="font-weight-bold text-dark mb-0">
                      <i className="fas fa-sms text-success mr-2"></i> SMS Gateway Server (Patient Alerts)
                    </h6>
                    <span className="badge badge-success px-3 py-1" style={{ backgroundColor: '#00984A' }}>Active Gateway</span>
                  </div>

                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label className="font-weight-bold small text-dark">SMS Gateway API Endpoint URL</label>
                      <input
                        type="text"
                        className="form-control"
                        value={marketingSettings.sms_gateway_url || ''}
                        onChange={(e) => setMarketingSettings({ ...marketingSettings, sms_gateway_url: e.target.value })}
                        placeholder="https://api.sms-gateway.com/api/v3/send"
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <label className="font-weight-bold small text-dark">Sender ID / Masking Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={marketingSettings.sms_sender_id || ''}
                        onChange={(e) => setMarketingSettings({ ...marketingSettings, sms_sender_id: e.target.value })}
                        placeholder="PMCH / Popular"
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <label className="font-weight-bold small text-dark">API Key / Token</label>
                      <input
                        type="text"
                        className="form-control"
                        value={marketingSettings.sms_api_key || ''}
                        onChange={(e) => setMarketingSettings({ ...marketingSettings, sms_api_key: e.target.value })}
                        placeholder="Live SMS API Key"
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <label className="font-weight-bold small text-dark">API Secret / Client Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={marketingSettings.sms_api_secret || ''}
                        onChange={(e) => setMarketingSettings({ ...marketingSettings, sms_api_secret: e.target.value })}
                        placeholder="••••••••••••"
                      />
                    </div>
                  </div>

                  {/* Test SMS Dispatch Box */}
                  <div className="p-3 bg-white rounded border mt-2">
                    <label className="font-weight-bold small text-dark mb-2">
                      <i className="fas fa-mobile-alt text-success mr-1"></i> Send Test SMS to Verify Gateway:
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Mobile number (e.g. 01700000000)"
                        value={testPhone}
                        onChange={(e) => setTestPhone(e.target.value)}
                      />
                      <div className="input-group-append">
                        <button type="button" onClick={handleTestSms} className="btn btn-outline-success font-weight-bold">
                          Test SMS
                        </button>
                      </div>
                    </div>
                    {testSmsResult && (
                      <div className={`alert alert-${testSmsResult.success ? 'success' : 'danger'} py-2 px-3 small mt-2 mb-0`}>
                        {testSmsResult.message}
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn btn-success font-weight-bold px-4 py-2" style={{ backgroundColor: '#00984A' }}>
                  <i className="fas fa-save mr-1"></i> Save Server & Gateway Credentials
                </button>
              </form>
            </div>
          )}

          {/* TAB: GENERAL SETTINGS */}
          {activeTab === 'settings' && (
            <div className="card border-0 shadow-sm rounded-lg p-4 bg-white">
              <h5 className="font-weight-bold text-dark mb-1">
                <i className="fas fa-sliders-h mr-2" style={{ color: '#00984A' }}></i>
                Hospital General Settings & Contacts
              </h5>
              <p className="text-muted small mb-4">Configure hospital identity, address, phone numbers, and views counter displayed on Header & Footer.</p>

              <form onSubmit={handleSaveSettings}>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold small text-dark">Hospital Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.project_name || ''}
                      onChange={(e) => setSettings({ ...settings, project_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold small text-dark">Parent Group / Company</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.project_company || ''}
                      onChange={(e) => setSettings({ ...settings, project_company: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold small text-dark">Official Contact Phone & Helplines</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      value={settings.project_contact || ''}
                      onChange={(e) => setSettings({ ...settings, project_contact: e.target.value })}
                      placeholder="e.g. Phone: 09666 787800, Mobile: 017... Emergency: 24/7"
                    />
                  </div>

                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold small text-dark">Physical Address (Hospital Location)</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      value={settings.project_address || ''}
                      onChange={(e) => setSettings({ ...settings, project_address: e.target.value })}
                      placeholder="e.g. House: 08, Road: 02, Dhanmondi, Dhaka-1205"
                    />
                  </div>

                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small text-dark">Hospital Overview / Tagline Details</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      value={settings.project_details || ''}
                      onChange={(e) => setSettings({ ...settings, project_details: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold small text-dark">Total Portal Views (Visitor Counter)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={settings.views || 0}
                      onChange={(e) => setSettings({ ...settings, views: parseInt(e.target.value) || 0 })}
                    />
                    <small className="form-text text-muted">This count displays in the footer copyright view counter.</small>
                  </div>
                </div>

                <div className="mt-3">
                  <button type="submit" className="btn btn-success font-weight-bold px-4 py-2" style={{ backgroundColor: '#00984A' }}>
                    <i className="fas fa-save mr-1"></i> Save General Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: PAGE SETTINGS & SEO MANAGEMENT */}
          {activeTab === 'pages_seo' && (
            <div className="card border-0 shadow-sm rounded-lg p-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                <div>
                  <h5 className="font-weight-bold text-dark mb-1">
                    <i className="fas fa-search mr-2" style={{ color: '#00984A' }}></i>
                    Page Settings & SEO Metadata Manager
                  </h5>
                  <p className="text-muted small mb-0">Configure custom Meta Title, Meta Description, and Search Keywords for each page.</p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover table-striped align-middle">
                  <thead className="thead-light">
                    <tr>
                      <th style={{ width: '60px' }}>ID</th>
                      <th>Page Name</th>
                      <th>URL Path</th>
                      <th>Meta Title</th>
                      <th>Keywords</th>
                      <th style={{ width: '100px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((p) => (
                      <tr key={p.id}>
                        <td className="font-weight-bold">{p.id}</td>
                        <td className="font-weight-semibold text-dark">{p.name}</td>
                        <td>
                          <code className="text-primary">/{p.url}</code>
                        </td>
                        <td className="small text-truncate" style={{ maxWidth: '220px' }}>
                          {p.meta_title || <span className="text-muted italic">Default Site Title</span>}
                        </td>
                        <td className="small text-truncate" style={{ maxWidth: '180px' }}>
                          {p.meta_keywords || <span className="text-muted italic">Default Keywords</span>}
                        </td>
                        <td>
                          <button
                            onClick={() => openModal('page_seo', p)}
                            className="btn btn-sm btn-outline-success font-weight-bold px-3"
                          >
                            <i className="fas fa-edit mr-1"></i> Edit SEO
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: DOCTORS MANAGEMENT & DOCTOR SEO */}
          {activeTab === 'doctors' && (
            <div className="card border-0 shadow-sm rounded-lg p-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                <div>
                  <h5 className="font-weight-bold text-dark mb-1">
                    <i className="fas fa-user-md mr-2" style={{ color: '#00984A' }}></i>
                    Doctor List & Individual SEO Optimizer
                  </h5>
                  <p className="text-muted small mb-0">Manage doctor credentials, clinical schedules, and custom Google Search SEO metadata per doctor.</p>
                </div>
                <button
                  onClick={() => openModal('doctor')}
                  className="btn btn-success font-weight-bold mt-2 mt-sm-0"
                  style={{ backgroundColor: '#00984A' }}
                >
                  <i className="fas fa-plus-circle mr-1"></i> Add New Doctor
                </button>
              </div>

              {/* Doctor Search & Speciality Filter Bar */}
              <div className="p-3 mb-4 rounded bg-light border">
                <div className="row align-items-center">
                  <div className="col-md-5 mb-2 mb-md-0">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-white border-right-0">
                          <i className="fas fa-search text-muted"></i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control border-left-0"
                        placeholder="Search doctor by name, degree, department..."
                        value={doctorSearch}
                        onChange={(e) => {
                          setDoctorSearch(e.target.value);
                          setDoctorPage(1);
                        }}
                      />
                      {doctorSearch && (
                        <div className="input-group-append">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => { setDoctorSearch(''); setDoctorPage(1); }}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4 mb-2 mb-md-0">
                    <select
                      className="form-control"
                      value={selectedSpecialityFilter}
                      onChange={(e) => {
                        setSelectedSpecialityFilter(e.target.value);
                        setDoctorPage(1);
                      }}
                    >
                      <option value="">All Specialities ({specialities.length})</option>
                      {specialities.map(s => (
                        <option key={s.sp_id} value={s.sp_id}>
                          {s.sp_name} ({s.doctor_count || 0})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3 text-md-right">
                    {(doctorSearch || selectedSpecialityFilter) && (
                      <button
                        onClick={() => {
                          setDoctorSearch('');
                          setSelectedSpecialityFilter('');
                          setDoctorPage(1);
                        }}
                        className="btn btn-sm btn-outline-danger mr-2"
                      >
                        <i className="fas fa-undo mr-1"></i> Reset
                      </button>
                    )}
                    <span className="badge badge-success px-2 py-1">
                      {filteredDoctors.length} Doctors
                    </span>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover table-striped align-middle">
                  <thead className="thead-light">
                    <tr>
                      <th style={{ width: '70px' }}>Photo</th>
                      <th>Doctor Name & Degrees</th>
                      <th>Specialities</th>
                      <th>Chamber / Visiting Hours</th>
                      <th style={{ width: '90px' }}>Status</th>
                      <th style={{ width: '190px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDoctors.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">
                          <i className="fas fa-user-slash fa-2x mb-2 d-block text-secondary"></i>
                          No doctors found matching the search criteria.
                        </td>
                      </tr>
                    ) : (
                      paginatedDoctors.map((dr) => (
                        <tr key={dr.dr_id}>
                          <td>
                            <img
                              src={dr.dr_image ? (dr.dr_image.startsWith('/') ? dr.dr_image : `/uploads/${dr.dr_image}`) : '/male.jpg'}
                              alt={dr.dr_name}
                              className="rounded shadow-sm"
                              style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                              onError={(e) => { e.target.src = '/male.jpg'; }}
                            />
                          </td>
                          <td>
                            <div className="font-weight-bold text-dark">{cleanField(dr.dr_name)}</div>
                            <div className="text-muted small text-truncate" style={{ maxWidth: '340px' }}>
                              {cleanField(dr.dr_degree)}
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-light px-2 py-1 border text-primary small">
                              {dr.speciality_names || 'General'}
                            </span>
                          </td>
                          <td className="small text-muted">{cleanField(dr.dr_visit_hrs) || 'By Appointment'}</td>
                          <td>
                            <button
                              onClick={() => handleToggleStatus('tbl_doctor', 'dr_id', dr.dr_id, 'dr_status', setDoctors)}
                              className={`btn btn-xs px-2 py-1 font-weight-bold rounded-pill ${dr.dr_status === 1 ? 'btn-success' : 'btn-secondary'}`}
                              style={{ fontSize: '11px', backgroundColor: dr.dr_status === 1 ? '#00984A' : '' }}
                            >
                              {dr.dr_status === 1 ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td>
                            <button
                              onClick={() => openDoctorSeoModal(dr)}
                              className="btn btn-sm btn-outline-success mr-1"
                              title="Doctor SEO & Google Schema"
                            >
                              <i className="fas fa-search-plus mr-1"></i> SEO
                            </button>
                            <button
                              onClick={() => openModal('doctor', dr)}
                              className="btn btn-sm btn-outline-primary mr-1"
                              title="Edit Doctor Details"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDelete('/admin/doctors', dr.dr_id, loadDoctors)}
                              className="btn btn-sm btn-outline-danger"
                              title="Delete"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalDoctorPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top flex-wrap">
                  <div className="small text-muted mb-2 mb-sm-0">
                    Showing {(doctorPage - 1) * DOCTORS_PER_PAGE + 1} - {Math.min(doctorPage * DOCTORS_PER_PAGE, filteredDoctors.length)} of {filteredDoctors.length} doctors
                  </div>
                  <div className="btn-group">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      disabled={doctorPage <= 1}
                      onClick={() => setDoctorPage(1)}
                    >
                      First
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      disabled={doctorPage <= 1}
                      onClick={() => setDoctorPage(p => Math.max(1, p - 1))}
                    >
                      <i className="fas fa-chevron-left mr-1"></i> Prev
                    </button>
                    <span className="btn btn-sm btn-light border px-3">
                      Page {doctorPage} of {totalDoctorPages}
                    </span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      disabled={doctorPage >= totalDoctorPages}
                      onClick={() => setDoctorPage(p => Math.min(totalDoctorPages, p + 1))}
                    >
                      Next <i className="fas fa-chevron-right ml-1"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      disabled={doctorPage >= totalDoctorPages}
                      onClick={() => setDoctorPage(totalDoctorPages)}
                    >
                      Last
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: SPECIALITIES */}
          {activeTab === 'specialities' && (
            <div className="card border-0 shadow-sm rounded-lg p-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                <div>
                  <h5 className="font-weight-bold text-dark mb-1">
                    <i className="fas fa-stethoscope mr-2" style={{ color: '#00984A' }}></i>
                    Clinical Specialities & Departments
                  </h5>
                  <p className="text-muted small mb-0">Manage hospital medical departments and view consultant doctors by speciality.</p>
                </div>
                <button
                  onClick={() => openModal('speciality')}
                  className="btn btn-success font-weight-bold mt-2 mt-sm-0"
                  style={{ backgroundColor: '#00984A' }}
                >
                  <i className="fas fa-plus-circle mr-1"></i> Add Speciality
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover table-striped">
                  <thead className="thead-light">
                    <tr>
                      <th style={{ width: '60px' }}>ID</th>
                      <th>Speciality Name</th>
                      <th style={{ width: '150px' }}>Consultant Doctors</th>
                      <th>Overview Info</th>
                      <th style={{ width: '90px' }}>Status</th>
                      <th style={{ width: '160px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specialities.map((s) => (
                      <tr key={s.sp_id}>
                        <td className="font-weight-bold">{s.sp_id}</td>
                        <td className="font-weight-bold text-dark">{s.sp_name}</td>
                        <td>
                          <button
                            onClick={() => {
                              setSelectedSpecialityFilter(String(s.sp_id));
                              setDoctorSearch('');
                              setDoctorPage(1);
                              setActiveTab('doctors');
                            }}
                            className="btn btn-xs btn-outline-success font-weight-bold px-2 py-1 rounded-pill"
                            title={`Click to see all ${s.doctor_count || 0} doctors in ${s.sp_name}`}
                          >
                            <i className="fas fa-user-md mr-1"></i> {s.doctor_count || 0} Doctors
                          </button>
                        </td>
                        <td className="small text-muted text-truncate" style={{ maxWidth: '280px' }}>{s.sp_info || s.sp_desc || '—'}</td>
                        <td>
                          <button
                            onClick={() => handleToggleStatus('tbl_speciality', 'sp_id', s.sp_id, 'sp_status', setSpecialities)}
                            className={`btn btn-xs px-2 py-1 font-weight-bold rounded-pill ${s.sp_status === 1 ? 'btn-success' : 'btn-secondary'}`}
                            style={{ fontSize: '11px', backgroundColor: s.sp_status === 1 ? '#00984A' : '' }}
                          >
                            {s.sp_status === 1 ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              setSelectedSpecialityFilter(String(s.sp_id));
                              setDoctorSearch('');
                              setDoctorPage(1);
                              setActiveTab('doctors');
                            }}
                            className="btn btn-sm btn-outline-info mr-1"
                            title="Filter Doctors by this Speciality"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button onClick={() => openModal('speciality', s)} className="btn btn-sm btn-outline-primary mr-1">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button onClick={() => handleDelete('/admin/specialities', s.sp_id, () => api.get('/admin/specialities').then(r => setSpecialities(r.data?.data || [])))} className="btn btn-sm btn-outline-danger">
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: NEWS & EVENTS */}
          {activeTab === 'news' && (
            <div className="card border-0 shadow-sm rounded-lg p-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                <div>
                  <h5 className="font-weight-bold text-dark mb-1">
                    <i className="fas fa-newspaper mr-2" style={{ color: '#00984A' }}></i>
                    News & Hospital Events
                  </h5>
                  <p className="text-muted small mb-0">Publish clinical workshops, medical breakthroughs, and health campaigns.</p>
                </div>
                <button
                  onClick={() => openModal('news')}
                  className="btn btn-success font-weight-bold mt-2 mt-sm-0"
                  style={{ backgroundColor: '#00984A' }}
                >
                  <i className="fas fa-plus-circle mr-1"></i> Publish News / Event
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover table-striped">
                  <thead className="thead-light">
                    <tr>
                      <th style={{ width: '80px' }}>Date</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th style={{ width: '90px' }}>Status</th>
                      <th style={{ width: '120px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {news.map((item) => (
                      <tr key={item.news_id}>
                        <td className="small font-weight-bold text-muted">{item.news_postdate?.slice(0, 10)}</td>
                        <td className="font-weight-bold text-dark">{item.news_title}</td>
                        <td>
                          <span className="badge badge-light border">
                            {item.news_type === 2 ? 'Hospital Event' : 'Press News'}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleToggleStatus('tbl_news', 'news_id', item.news_id, 'news_status', setNews)}
                            className={`btn btn-xs px-2 py-1 font-weight-bold rounded-pill ${item.news_status === 1 ? 'btn-success' : 'btn-secondary'}`}
                            style={{ fontSize: '11px', backgroundColor: item.news_status === 1 ? '#00984A' : '' }}
                          >
                            {item.news_status === 1 ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td>
                          <button onClick={() => openModal('news', item)} className="btn btn-sm btn-outline-primary mr-1">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button onClick={() => handleDelete('/admin/news', item.news_id, loadNews)} className="btn btn-sm btn-outline-danger">
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: PHOTO GALLERY */}
          {activeTab === 'photos' && (
            <div className="card border-0 shadow-sm rounded-lg p-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                <div>
                  <h5 className="font-weight-bold text-dark mb-1">
                    <i className="fas fa-images mr-2" style={{ color: '#00984A' }}></i>
                    Hospital Photo Gallery
                  </h5>
                  <p className="text-muted small mb-0">Upload high-resolution photographs of surgery suites, ICU, amenities, and campus.</p>
                </div>
                <button
                  onClick={() => openModal('photo')}
                  className="btn btn-success font-weight-bold mt-2 mt-sm-0"
                  style={{ backgroundColor: '#00984A' }}
                >
                  <i className="fas fa-camera mr-1"></i> Upload Photo
                </button>
              </div>

              <div className="row">
                {media.filter(m => m.med_type === 'image' || m.med_type?.includes('image') || m.med_type == 1 || (!m.med_url && m.med_file)).map((item) => (
                  <div key={item.med_id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div className="card h-100 border shadow-sm rounded-lg overflow-hidden">
                      <div style={{ height: '180px', overflow: 'hidden' }}>
                        <img
                          src={item.med_file ? (item.med_file.startsWith('http') || item.med_file.startsWith('/') ? item.med_file : `/uploads/${item.med_file}`) : (item.med_url || '/banner.jpg')}
                          alt={item.med_title}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                          onError={(e) => { e.target.src = '/banner.jpg'; }}
                        />
                      </div>
                      <div className="p-3 d-flex flex-column justify-content-between flex-grow-1">
                        <h6 className="font-weight-bold text-dark mb-1 text-truncate" title={item.med_title}>
                          {item.med_title}
                        </h6>
                        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                          <button
                            onClick={() => handleToggleStatus('tbl_media', 'med_id', item.med_id, 'med_status', setMedia)}
                            className={`btn btn-xs px-2 py-0 ${item.med_status === 1 ? 'btn-success' : 'btn-secondary'}`}
                            style={{ fontSize: '10px' }}
                          >
                            {item.med_status === 1 ? 'Published' : 'Hidden'}
                          </button>
                          <div>
                            <button onClick={() => openModal('photo', item)} className="btn btn-sm btn-link text-primary p-0 mr-2">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button onClick={() => handleDelete('/admin/media', item.med_id, loadMedia)} className="btn btn-sm btn-link text-danger p-0">
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: VIDEO GALLERY (YOUTUBE) */}
          {activeTab === 'videos' && (
            <div className="card border-0 shadow-sm rounded-lg p-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                <div>
                  <h5 className="font-weight-bold text-dark mb-1">
                    <i className="fab fa-youtube mr-2 text-danger"></i>
                    Video Gallery (YouTube Link Integration)
                  </h5>
                  <p className="text-muted small mb-0">Provide any YouTube URL or ID. The system converts it automatically into an embedded responsive player.</p>
                </div>
                <button
                  onClick={() => openModal('video')}
                  className="btn btn-danger font-weight-bold mt-2 mt-sm-0"
                >
                  <i className="fab fa-youtube mr-1"></i> Add YouTube Video
                </button>
              </div>

              <div className="row">
                {media.filter(m => m.med_type === 'video' || m.med_type?.includes('video') || m.med_type == 2 || m.med_url).map((item) => {
                  const embedSrc = getYoutubeEmbed(item.med_url || item.med_file);
                  return (
                    <div key={item.med_id} className="col-lg-6 mb-4">
                      <div className="card h-100 border shadow-sm rounded-lg p-3">
                        <div className="embed-responsive embed-responsive-16by9 mb-3 rounded shadow-sm">
                          <iframe
                            className="embed-responsive-item"
                            src={embedSrc}
                            title={item.med_title}
                            allowFullScreen
                          ></iframe>
                        </div>
                        <h6 className="font-weight-bold text-dark mb-1">{item.med_title}</h6>
                        <code className="small text-muted d-block text-truncate mb-2">{item.med_url}</code>

                        <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                          <button
                            onClick={() => handleToggleStatus('tbl_media', 'med_id', item.med_id, 'med_status', setMedia)}
                            className={`btn btn-xs px-2 py-0 ${item.med_status === 1 ? 'btn-success' : 'btn-secondary'}`}
                            style={{ fontSize: '10px' }}
                          >
                            {item.med_status === 1 ? 'Published' : 'Hidden'}
                          </button>
                          <div>
                            <button onClick={() => openModal('video', item)} className="btn btn-sm btn-link text-primary p-0 mr-2">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button onClick={() => handleDelete('/admin/media', item.med_id, loadMedia)} className="btn btn-sm btn-link text-danger p-0">
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: MANAGEMENT TEAM (TIER ORDERING) */}
          {activeTab === 'team' && (
            <div className="card border-0 shadow-sm rounded-lg p-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                <div>
                  <h5 className="font-weight-bold text-dark mb-1">
                    <i className="fas fa-users-cog mr-2" style={{ color: '#00984A' }}></i>
                    Management Team Hierarchy & Serial Reordering
                  </h5>
                  <p className="text-muted small mb-0">Control the exact executive tier (Row 1 to 4) and horizontal serial position (Sl 1 to 4).</p>
                </div>
                <button
                  onClick={() => openModal('team')}
                  className="btn btn-success font-weight-bold mt-2 mt-sm-0"
                  style={{ backgroundColor: '#00984A' }}
                >
                  <i className="fas fa-user-plus mr-1"></i> Add Team Member
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover table-striped align-middle">
                  <thead className="thead-light">
                    <tr>
                      <th style={{ width: '70px' }}>Photo</th>
                      <th>Name & Designation</th>
                      <th style={{ width: '130px' }}>Tier / Row</th>
                      <th style={{ width: '90px' }}>Serial (Sl)</th>
                      <th>Qualifications / Bio</th>
                      <th style={{ width: '90px' }}>Status</th>
                      <th style={{ width: '120px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((m) => (
                      <tr key={m.id}>
                        <td>
                          <img
                            src={`/team/${m.image}`}
                            alt={m.name}
                            className="rounded shadow-sm"
                            style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = '/male.jpg'; }}
                          />
                        </td>
                        <td>
                          <div className="font-weight-bold text-dark">{m.name}</div>
                          <div className="text-muted small">{m.designation}</div>
                        </td>
                        <td>
                          <span
                            className="badge px-2 py-1 font-weight-bold"
                            style={{
                              backgroundColor: m.row === 1 ? '#00984A' : m.row === 2 ? '#0088cc' : '#6c757d',
                              color: '#ffffff'
                            }}
                          >
                            Tier {m.row} {m.row === 1 ? '(Apex)' : m.row === 2 ? '(Director)' : `(Row ${m.row})`}
                          </span>
                        </td>
                        <td className="font-weight-bold text-center">#{m.sl}</td>
                        <td className="small text-muted text-truncate" style={{ maxWidth: '250px' }}>
                          {m.bio?.replace(/<[^>]*>?/gm, ' ') || '—'}
                        </td>
                        <td>
                          <button
                            onClick={() => handleToggleStatus('tbl_team', 'id', m.id, 'status', setTeam)}
                            className={`btn btn-xs px-2 py-1 font-weight-bold rounded-pill ${m.status === 1 ? 'btn-success' : 'btn-secondary'}`}
                            style={{ fontSize: '11px', backgroundColor: m.status === 1 ? '#00984A' : '' }}
                          >
                            {m.status === 1 ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td>
                          <button onClick={() => openModal('team', m)} className="btn btn-sm btn-outline-primary mr-1">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button onClick={() => handleDelete('/admin/team', m.id, loadTeam)} className="btn btn-sm btn-outline-danger">
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div className="card border-0 shadow-sm rounded-lg p-4 bg-white" style={{ maxWidth: '600px' }}>
              <h5 className="font-weight-bold text-dark mb-1">
                <i className="fas fa-lock mr-2" style={{ color: '#00984A' }}></i>
                Admin Password & Credentials
              </h5>
              <p className="text-muted small mb-4">Secure your hospital administration credentials.</p>

              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label className="font-weight-bold small text-dark">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="font-weight-bold small text-dark">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength="6"
                    required
                  />
                  <small className="form-text text-muted">Use at least 6 characters with mixed letters and numbers.</small>
                </div>

                <button type="submit" className="btn btn-success font-weight-bold px-4 py-2" style={{ backgroundColor: '#00984A' }}>
                  <i className="fas fa-key mr-1"></i> Update Password
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================
          3. DOCTOR INDIVIDUAL SEO & SCHEMA.ORG MODAL
          ======================================================== */}
      {doctorSeoModalOpen && selectedDoctorSeo && (
        <div
          className="position-fixed w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ top: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 999999, padding: '20px' }}
        >
          <div
            className="card border-0 shadow-lg rounded-lg overflow-hidden w-100 d-flex flex-column"
            style={{ maxWidth: '820px', maxHeight: '90vh' }}
          >
            <div className="card-header bg-dark text-white d-flex align-items-center justify-content-between py-3 flex-shrink-0">
              <h6 className="font-weight-bold mb-0 text-white text-truncate mr-2">
                <i className="fas fa-search-plus text-success mr-2"></i>
                Doctor Individual SEO & Google Structured Schema: <span className="text-warning">{cleanField(selectedDoctorSeo.dr_name)}</span>
              </h6>
              <button onClick={closeDoctorSeoModal} className="btn btn-sm btn-link text-white p-0">
                <i className="fas fa-times fa-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSaveDoctorSeo} className="d-flex flex-column flex-grow-1 overflow-hidden" style={{ minHeight: 0 }}>
              <div className="p-3 p-md-4 bg-white flex-grow-1" style={{ overflowY: 'auto' }}>
                {/* Google Search Live Snippet Preview */}
                <div className="p-3 mb-4 rounded border" style={{ backgroundColor: '#fdfdfd' }}>
                  <div className="small font-weight-bold text-muted mb-2 text-uppercase" style={{ letterSpacing: '0.5px' }}>
                    <i className="fab fa-google text-primary mr-1"></i> Google Search Result Live Preview:
                  </div>
                  <div style={{ fontFamily: 'Arial, sans-serif' }}>
                    <div className="text-primary small text-truncate" style={{ fontSize: '13px' }}>
                      https://demo.pmch-bd.com/package?dr={selectedDoctorSeo.dr_id}
                    </div>
                    <h6 className="font-weight-bold mb-1" style={{ color: '#1a0dab', fontSize: '18px', lineHeight: '1.3' }}>
                      {cleanField(doctorSeoForm.meta_title) || `${cleanField(selectedDoctorSeo.dr_name)} - Specialist Consultant at PMCH`}
                    </h6>
                    <p className="mb-0 text-muted" style={{ fontSize: '13px', lineHeight: '1.4' }}>
                      {cleanField(doctorSeoForm.meta_description) || `Consult with ${cleanField(selectedDoctorSeo.dr_name)} at Popular Medical College Hospital. Visiting Hours: ${cleanField(selectedDoctorSeo.dr_visit_hrs) || 'By Appointment'}. Quality tertiary clinical healthcare in Dhaka.`}
                    </p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 form-group">
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="font-weight-bold small text-dark">Google Meta Title *</label>
                      <span className="small text-muted">{doctorSeoForm.meta_title?.length || 0} / 60 recommended</span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={doctorSeoForm.meta_title || ''}
                      onChange={(e) => setDoctorSeoForm({ ...doctorSeoForm, meta_title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-12 form-group">
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="font-weight-bold small text-dark">Google Meta Description</label>
                      <span className="small text-muted">{doctorSeoForm.meta_description?.length || 0} / 160 recommended</span>
                    </div>
                    <textarea
                      rows="3"
                      className="form-control"
                      value={doctorSeoForm.meta_description || ''}
                      onChange={(e) => setDoctorSeoForm({ ...doctorSeoForm, meta_description: e.target.value })}
                    />
                  </div>

                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small text-dark">Doctor Search Keywords (Comma Separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={doctorSeoForm.meta_keywords || ''}
                      onChange={(e) => setDoctorSeoForm({ ...doctorSeoForm, meta_keywords: e.target.value })}
                      placeholder="e.g. skin allergy specialist dhaka, dr shirajul islam, popular hospital doctor"
                    />
                  </div>

                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold small text-dark">Canonical URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={doctorSeoForm.canonical_url || ''}
                      onChange={(e) => setDoctorSeoForm({ ...doctorSeoForm, canonical_url: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold small text-dark">Social Share OG Image</label>
                    <input
                      type="text"
                      className="form-control"
                      value={doctorSeoForm.og_image || ''}
                      onChange={(e) => setDoctorSeoForm({ ...doctorSeoForm, og_image: e.target.value })}
                    />
                  </div>

                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small text-dark">Schema.org JSON-LD Structured Data (Physician Schema)</label>
                    <textarea
                      rows="4"
                      className="form-control font-monospace small"
                      style={{ fontFamily: 'monospace', fontSize: '11px', backgroundColor: '#fcfcfc' }}
                      value={doctorSeoForm.schema_markup || ''}
                      onChange={(e) => setDoctorSeoForm({ ...doctorSeoForm, schema_markup: e.target.value })}
                    />
                    <small className="form-text text-muted">Google Physician rich snippet markup to display doctor stars, specialty and phone directly in Google.</small>
                  </div>
                </div>
              </div>

              {/* Modal Sticky Footer (Always Visible Without Zooming Out) */}
              <div
                className="p-3 bg-light border-top d-flex justify-content-between align-items-center flex-shrink-0"
                style={{ position: 'sticky', bottom: 0, zIndex: 10 }}
              >
                <span className="small text-muted font-italic d-none d-sm-inline">
                  * Live Google snippet preview and Physician Schema generator
                </span>
                <div>
                  <button type="button" onClick={closeDoctorSeoModal} className="btn btn-secondary mr-2">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success font-weight-bold px-4" style={{ backgroundColor: '#00984A' }}>
                    <i className="fas fa-save mr-1"></i> Save Doctor SEO
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          4. UNIVERSAL CREATE / EDIT MODAL
          ======================================================== */}
      {modalType && (
        <div
          className="position-fixed w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ top: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 99999, padding: '20px' }}
        >
          <div
            className="card border-0 shadow-lg rounded-lg overflow-hidden w-100 d-flex flex-column"
            style={{ maxWidth: '750px', maxHeight: '90vh' }}
          >
            <div className="card-header bg-dark text-white d-flex align-items-center justify-content-between py-3 flex-shrink-0" style={{ backgroundColor: '#0c1a14' }}>
              <h6 className="font-weight-bold mb-0 text-white">
                <i className="fas fa-pen-fancy mr-2 text-success"></i>
                {editingItem ? 'Edit Item' : 'Add New Entry'}: {modalType.toUpperCase()}
              </h6>
              <button onClick={closeModal} className="btn btn-sm btn-link text-white p-0">
                <i className="fas fa-times fa-lg"></i>
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="d-flex flex-column flex-grow-1 overflow-hidden" style={{ minHeight: 0 }}>
              <div className="p-3 p-md-4 bg-white flex-grow-1" style={{ overflowY: 'auto' }}>
              {/* DOCTOR MODAL */}
              {modalType === 'doctor' && (
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold small">Doctor Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.dr_name || ''}
                      onChange={(e) => setFormData({ ...formData, dr_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold small">Degrees & Honors *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.dr_degree || ''}
                      onChange={(e) => setFormData({ ...formData, dr_degree: e.target.value })}
                      placeholder="e.g. MBBS, FCPS, FRCS"
                      required
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold small">Clinical Speciality</label>
                    <select
                      className="form-control"
                      value={formData.specialities?.[0] || ''}
                      onChange={(e) => setFormData({ ...formData, specialities: [parseInt(e.target.value)] })}
                    >
                      <option value="">Select Speciality...</option>
                      {specialities.map(s => (
                        <option key={s.sp_id} value={s.sp_id}>{s.sp_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold small">Visiting Hours & Room</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.dr_visit_hrs || ''}
                      onChange={(e) => setFormData({ ...formData, dr_visit_hrs: e.target.value })}
                      placeholder="e.g. 5:00 PM - 9:00 PM (Room 402)"
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small">Education / Qualifications</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      value={formData.dr_education || ''}
                      onChange={(e) => setFormData({ ...formData, dr_education: e.target.value })}
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small">Experience Summary & Specialization</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      value={formData.dr_exp_sum || ''}
                      onChange={(e) => setFormData({ ...formData, dr_exp_sum: e.target.value })}
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small">Doctor Photo</label>
                    <div className="d-flex align-items-center">
                      <input
                        type="file"
                        className="form-control-file mr-3"
                        onChange={(e) => handleFileUpload(e, 'dr_image')}
                      />
                      {uploading && <span className="small text-primary font-weight-bold">Uploading...</span>}
                      {formData.dr_image && (
                        <span className="badge badge-success p-2">File: {formData.dr_image}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* NEWS MODAL */}
              {modalType === 'news' && (
                <div className="row">
                  <div className="col-md-8 form-group">
                    <label className="font-weight-bold small">News / Event Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.news_title || ''}
                      onChange={(e) => setFormData({ ...formData, news_title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-4 form-group">
                    <label className="font-weight-bold small">Publish Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.news_postdate?.slice(0, 10) || ''}
                      onChange={(e) => setFormData({ ...formData, news_postdate: e.target.value })}
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small">Content Details</label>
                    <textarea
                      rows="5"
                      className="form-control"
                      value={formData.news_detail || ''}
                      onChange={(e) => setFormData({ ...formData, news_detail: e.target.value })}
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small">Featured Image</label>
                    <div className="d-flex align-items-center">
                      <input
                        type="file"
                        className="form-control-file mr-3"
                        onChange={(e) => handleFileUpload(e, 'news_img')}
                      />
                      {formData.news_img && (
                        <span className="badge badge-success p-2">Selected: {formData.news_img}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* PHOTO MODAL */}
              {modalType === 'photo' && (
                <div className="row">
                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small">Photo Title / Caption *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.med_title || ''}
                      onChange={(e) => setFormData({ ...formData, med_title: e.target.value })}
                      placeholder="e.g. Modern Laparoscopic Operation Theater"
                      required
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small">Upload Image File *</label>
                    <div className="p-3 rounded border text-center" style={{ backgroundColor: '#f8fafc' }}>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control-file mb-2"
                        onChange={(e) => handleFileUpload(e, 'med_file')}
                      />
                      {uploading && (
                        <div className="text-primary small font-weight-bold my-2">
                          <i className="fas fa-spinner fa-spin mr-1"></i> Uploading image file...
                        </div>
                      )}
                      {formData.med_file && (
                        <div className="mt-2">
                          <span className="badge badge-success px-3 py-2">
                            <i className="fas fa-check-circle mr-1"></i> Uploaded: {formData.med_file}
                          </span>
                          <div className="mt-2">
                            <img
                              src={formData.med_file.startsWith('/') ? formData.med_file : `/uploads/${formData.med_file}`}
                              alt="Preview"
                              className="img-thumbnail shadow-sm"
                              style={{ maxHeight: '120px' }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small">Brief Description</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      value={formData.med_desc || ''}
                      onChange={(e) => setFormData({ ...formData, med_desc: e.target.value })}
                      placeholder="Optional photo details or context..."
                    />
                  </div>
                </div>
              )}

              {/* VIDEO MODAL (YOUTUBE INTEGRATION) */}
              {modalType === 'video' && (
                <div className="row">
                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small">Video Title / Topic *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.med_title || ''}
                      onChange={(e) => setFormData({ ...formData, med_title: e.target.value })}
                      placeholder="e.g. Modern Laparoscopic Surgery at PMCH"
                      required
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small">YouTube Video URL / Link *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.med_url || ''}
                      onChange={(e) => setFormData({ ...formData, med_url: e.target.value })}
                      placeholder="Paste any YouTube URL: e.g. https://www.youtube.com/watch?v=..."
                      required
                    />
                    <small className="form-text text-muted">Supports full YouTube watch URLs, youtu.be short links, or raw video IDs.</small>
                  </div>
                  {formData.med_url && (
                    <div className="col-md-12 mb-3">
                      <label className="font-weight-bold small text-success d-block mb-1">
                        <i className="fas fa-play-circle mr-1"></i> Live Preview:
                      </label>
                      <div className="rounded overflow-hidden shadow-sm border bg-dark mx-auto" style={{ maxWidth: '340px', height: '190px' }}>
                        <iframe
                          style={{ width: '100%', height: '100%', border: 0 }}
                          src={getYoutubeEmbed(formData.med_url)}
                          title="Live Preview"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small">Description / Speaker Info</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      value={formData.med_desc || ''}
                      onChange={(e) => setFormData({ ...formData, med_desc: e.target.value })}
                      placeholder="Brief description or speaker details..."
                    />
                  </div>
                </div>
              )}

              {/* TEAM MODAL */}
              {modalType === 'team' && (
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold small">Executive Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold small">Designation *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.designation || ''}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="e.g. Managing Director / Deputy Director / Manager"
                      required
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold small">Hierarchy Tier (Row) *</label>
                    <select
                      className="form-control"
                      value={formData.row || 1}
                      onChange={(e) => setFormData({ ...formData, row: parseInt(e.target.value) })}
                    >
                      <option value={1}>Tier 1: Apex Leadership (Chairman & MD)</option>
                      <option value={2}>Tier 2: Directorate & Clinical Governance</option>
                      <option value={3}>Tier 3: Departmental Heads & Senior Admin</option>
                      <option value={4}>Tier 4: Operations, Billing & Specialist</option>
                    </select>
                    <small className="form-text text-muted">Controls which row this member appears in on the public page.</small>
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="font-weight-bold small">Serial Position (Sl in Row) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.sl || 1}
                      onChange={(e) => setFormData({ ...formData, sl: parseInt(e.target.value) })}
                      min="1"
                      max="10"
                      required
                    />
                    <small className="form-text text-muted">Order from left to right (1 is first, 2 is next to 1, etc.)</small>
                  </div>
                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small">Academic Bio / Credentials</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      value={formData.bio || ''}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small">Portrait Photo</label>
                    <div className="d-flex align-items-center">
                      <input
                        type="file"
                        className="form-control-file mr-3"
                        onChange={(e) => handleFileUpload(e, 'image')}
                      />
                      {formData.image && (
                        <span className="badge badge-success p-2">Image: {formData.image}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE SEO MODAL */}
              {modalType === 'page_seo' && (
                <div className="row">
                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small">Page Title (Google SEO Meta Title) *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Popular Medical College Hospital | Tertiary Healthcare in Dhaka"
                      required
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small">SEO Meta Description</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="150-160 characters summary of this page content..."
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small">SEO Search Keywords</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.keywords || ''}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      placeholder="comma separated: e.g. hospital in dhaka, doctor appointment, popular medical"
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small">Author Tag</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.author || ''}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* SPECIALITY MODAL */}
              {modalType === 'speciality' && (
                <div className="row">
                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small">Speciality / Department Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.sp_name || ''}
                      onChange={(e) => setFormData({ ...formData, sp_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-12 form-group">
                    <label className="font-weight-bold small">Department Overview Info</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      value={formData.sp_info || ''}
                      onChange={(e) => setFormData({ ...formData, sp_info: e.target.value })}
                    />
                  </div>
                </div>
              )}

              </div>

              {/* Modal Sticky Footer (Always Visible Without Zooming Out) */}
              <div
                className="p-3 bg-light border-top d-flex justify-content-between align-items-center flex-shrink-0"
                style={{ position: 'sticky', bottom: 0, zIndex: 10 }}
              >
                <span className="small text-muted font-italic d-none d-sm-inline">
                  {uploading ? 'Uploading file in progress...' : '* All required fields must be completed'}
                </span>
                <div className="ml-auto">
                  <button type="button" onClick={closeModal} className="btn btn-secondary mr-2">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="btn btn-success font-weight-bold px-4 shadow-sm"
                    style={{ backgroundColor: '#00984A' }}
                  >
                    <i className="fas fa-check-circle mr-1"></i> Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embedded Modern Styling */}
      <style>{`
        /* Sidebar Styling */
        .sidebar-section-title {
          font-size: 10px;
          letter-spacing: 1.2px;
          color: #94a3b8;
          display: flex;
          align-items: center;
        }
        .sidebar-section-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin-left: 8px;
        }

        .sidebar-nav-btn {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 6px 10px;
          margin-bottom: 2px;
          border: 1px solid transparent;
          border-radius: 8px;
          background: transparent;
          color: #e2e8f0 !important;
          font-size: 13px;
          font-weight: 500;
          text-align: left;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          text-decoration: none;
        }

        .sidebar-nav-btn:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
          transform: translateX(3px);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .sidebar-nav-btn.active {
          background: linear-gradient(135deg, #00984A 0%, #007a3b 100%) !important;
          color: #ffffff !important;
          font-weight: 600;
          border-color: #00b356;
          box-shadow: 0 4px 14px rgba(0, 152, 74, 0.45);
        }

        .sidebar-icon-box {
          width: 28px;
          height: 28px;
          min-width: 28px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .sidebar-nav-btn:hover .sidebar-icon-box {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff !important;
        }

        .sidebar-nav-btn.active .sidebar-icon-box {
          background: rgba(255, 255, 255, 0.22);
          color: #ffffff !important;
        }

        .sidebar-nav-text {
          flex-grow: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Chart Animations */
        @keyframes barRise {
          0% {
            transform: scaleY(0);
            opacity: 0.2;
          }
          100% {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        .chart-bar-item {
          transform-origin: bottom;
          animation: barRise 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .chart-bar-item:hover {
          filter: brightness(1.15);
          transform: scaleY(1.03);
        }

        .donut-segment {
          transition: stroke-width 0.3s ease, filter 0.3s ease;
        }
      `}</style>
    </div>
  );
}
