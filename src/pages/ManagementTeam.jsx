import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

// Verified fallback hierarchy matching PMCH organizational governance
const initialFallbackRows = {
  1: [
    {
      id: 1,
      name: 'Late Tahera Akhter',
      designation: 'Chairman',
      honorific: 'Founder Chairman (In Memoriam)',
      image: '2004062097-20260408153112-1486274258.png',
      row: 1,
      sl: 1,
      link: '/chairman-message'
    },
    {
      id: 2,
      name: 'Dr. Mostafizur Rahman',
      designation: 'Managing Director',
      honorific: 'Managing Director, Popular Group & PMCH',
      image: '483877393-20260408152857-743861522.jpeg',
      row: 1,
      sl: 2,
      link: '/md-message'
    }
  ],
  2: [
    {
      id: 7,
      name: 'Asso. Prof. Dr. Iftekhar Ibne Mannan',
      designation: 'Director',
      bio: 'MBBS, FCPS (Plastic Surgery), Associate Professor, Popular Medical College & Hospital',
      image: '362727246-20260409082056-979149026.jpeg',
      row: 2,
      sl: 1
    },
    {
      id: 4,
      name: 'Dr. Mohammed Ishtiaq Sazzadur Rahman',
      designation: 'Deputy Director',
      image: '1271073031-20260409082113-2004848453.jpeg',
      row: 2,
      sl: 2
    },
    {
      id: 6,
      name: 'Dr. Arif Emran Mohammad Wasim Reza',
      designation: 'Deputy Director',
      image: '571722132-20260409082127-619145865.jpeg',
      row: 2,
      sl: 3
    }
  ],
  3: [
    {
      id: 8,
      name: 'Md. Abul Khair',
      designation: 'Manager, Customer Service, Corporate & External Affairs',
      image: '155323397-20260409082223-1957165102.jpeg',
      row: 3,
      sl: 1
    },
    {
      id: 13,
      name: 'Mrs. Saleha Yasmin',
      designation: 'Matron, Department of Nursing',
      image: '1087353726-20260409082356-1618036080.jpeg',
      row: 3,
      sl: 2
    },
    {
      id: 11,
      name: 'Md. Nur Islam',
      designation: 'Manager, Finance & Accounts',
      image: '1066641795-20260409082259-1439865701.jpeg',
      row: 3,
      sl: 3
    },
    {
      id: 10,
      name: 'Md. Eddris Ali',
      designation: 'Manager, Business Development',
      image: '1348923862-20260409082240-1719696487.jpeg',
      row: 3,
      sl: 4
    }
  ],
  4: [
    {
      id: 15,
      name: 'Ma. Ha Tariquzzaman',
      designation: 'Manager, Billing',
      image: '1075877655-20260409161835-1058234411.jpeg',
      row: 4,
      sl: 1
    },
    {
      id: 12,
      name: 'Md. Rezaul Karim',
      designation: 'Deputy Manager, HR & Admin',
      image: '887811921-20260409082315-364358919.jpeg',
      row: 4,
      sl: 2
    },
    {
      id: 14,
      name: 'Nishat Sharmin Nishi',
      designation: 'Chief Dietitian, Dietetics',
      image: '599584819-20260409082412-778221239.jpeg',
      row: 4,
      sl: 3
    }
  ]
};

const tierMeta = {
  1: {
    title: 'Apex Leadership & Board of Trustees',
    subtitle: 'The visionary founders steering Popular Medical College & Hospital.',
    badge: 'Executive Trustees',
    colClass: 'col-lg-6 col-md-12 mb-4'
  },
  2: {
    title: 'Hospital Directorate & Clinical Governance',
    subtitle: 'Distinguished directors overseeing healthcare operations, ethics, and clinical standards.',
    badge: 'Hospital Directorate',
    colClass: 'col-lg-4 col-md-6 mb-4'
  },
  3: {
    title: 'Departmental Heads & Senior Leadership',
    subtitle: 'Functional leaders dedicated to operational excellence, patient nursing care, and corporate affairs.',
    badge: 'Departmental Leadership',
    colClass: 'col-lg-3 col-md-6 mb-4'
  },
  4: {
    title: 'Operations, Billing & Specialist Services',
    subtitle: 'Specialized healthcare management, billing administration, human resources, and clinical nutrition.',
    badge: 'Operations & Clinical Support',
    colClass: 'col-lg-4 col-md-6 mb-4'
  }
};

// Helper function to format ALL CAPS names into professional Title Case
function formatName(name) {
  if (!name) return '';
  const trimmed = name.trim();
  const letters = trimmed.replace(/[^a-zA-Z]/g, '');
  const upperCount = (trimmed.match(/[A-Z]/g) || []).length;

  if (letters.length > 0 && upperCount / letters.length > 0.6) {
    return trimmed.toLowerCase().split(/\s+/).map(word => {
      if (!word) return '';
      if (word === 'dr.' || word === 'dr') return 'Dr.';
      if (word === 'md.' || word === 'md') return 'Md.';
      if (word === 'ma.' || word === 'ma') return 'Ma.';
      if (word === 'ha' || word === 'ha.') return 'Ha.';
      if (word === 'asso.' || word === 'asso') return 'Asso.';
      if (word === 'prof.' || word === 'prof') return 'Prof.';
      if (word === 'mrs.' || word === 'mrs') return 'Mrs.';
      if (word === 'hr' || word === 'hr.') return 'HR';
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }
  return trimmed;
}

// Clean HTML tags, HTML entities, and remove redundant bios
function cleanBio(bio, designation) {
  if (!bio) return null;
  const clean = bio
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean || clean === '.' || clean === '-' || clean === designation?.trim()) return null;
  return clean;
}

// Clean text helper for designations
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>?/gm, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

export default function ManagementTeam() {
  const [groupedRows, setGroupedRows] = useState(initialFallbackRows);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/team')
      .then(res => {
        if (res.data?.success && res.data.grouped) {
          setGroupedRows(res.data.grouped);
        }
      })
      .catch(err => {
        console.error('Error fetching team from API, utilizing verified fallback:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Sorted row keys
  const rowKeys = Object.keys(groupedRows).map(Number).sort((a, b) => a - b);

  return (
    <div className="bg-light min-vh-100" style={{ fontFamily: 'Segoe UI, Roboto, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Modern Page Header Banner */}
      <section
        className="page-header position-relative py-5 m-0 text-white"
        style={{
          background: 'linear-gradient(135deg, rgba(7, 30, 18, 0.94) 0%, rgba(0, 75, 36, 0.90) 100%), url("/pmch/img/sliderTwo.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: 'inset 0 -10px 30px rgba(0,0,0,0.25)'
        }}
      >
        <div className="container" style={{ maxWidth: '1240px' }}>
          <div className="row align-items-center">
            <div className="col-lg-8 text-center text-lg-left">
              <span
                className="badge px-3 py-1 text-uppercase font-weight-bold mb-2 shadow-sm d-inline-block"
                style={{
                  backgroundColor: '#00984A',
                  color: '#ffffff',
                  letterSpacing: '1.2px',
                  fontSize: '11px',
                  borderRadius: '20px'
                }}
              >
                Governance & Hospital Leadership
              </span>
              <h1 className="font-weight-bold text-white mb-2" style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.6rem)', letterSpacing: '-0.5px' }}>
                Management Team
              </h1>
              <p className="text-white-50 mb-0 font-weight-normal" style={{ maxWidth: '640px', fontSize: '15px', lineHeight: '1.6' }}>
                The distinguished executives, clinicians, and administrative leaders steering Popular Medical College & Hospital with compassionate patient care and institutional excellence.
              </p>
            </div>
            <div className="col-lg-4 text-center text-lg-right mt-3 mt-lg-0">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent p-0 mb-0 justify-content-center justify-content-lg-end">
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-white-50 text-decoration-none">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <span className="text-white-50">About PMCH</span>
                  </li>
                  <li className="breadcrumb-item active text-white font-weight-semibold" aria-current="page">
                    Management Team
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* Main Hierarchy Container */}
      <div className="container py-5" style={{ maxWidth: '1240px' }}>
        {rowKeys.map((rowNum) => {
          const members = (groupedRows[rowNum] || []).sort((a, b) => (a.sl || 0) - (b.sl || 0));
          const meta = tierMeta[rowNum] || {
            title: `Leadership Category ${rowNum}`,
            subtitle: 'Institutional Management',
            colClass: 'col-lg-4 col-md-6 mb-4',
            badge: 'Management'
          };

          const isApexTier = rowNum === 1;

          return (
            <div key={rowNum} className="tier-section mb-5">
              {/* Category Heading Divider */}
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center mb-2">
                  <span
                    className="badge px-3 py-1 font-weight-bold text-uppercase shadow-sm"
                    style={{
                      backgroundColor: isApexTier ? '#00984A' : '#eaf7f0',
                      color: isApexTier ? '#ffffff' : '#00984A',
                      letterSpacing: '1px',
                      fontSize: '11px',
                      borderRadius: '20px'
                    }}
                  >
                    {meta.badge}
                  </span>
                </div>
                <h2
                  className="font-weight-bold text-dark mb-1"
                  style={{ fontSize: isApexTier ? '1.8rem' : '1.45rem', letterSpacing: '-0.3px' }}
                >
                  {meta.title}
                </h2>
                <p className="text-muted small mb-0 font-weight-normal mx-auto" style={{ maxWidth: '620px', lineHeight: '1.5' }}>
                  {meta.subtitle}
                </p>
                <div
                  className="mx-auto mt-3"
                  style={{
                    width: '45px',
                    height: '3px',
                    backgroundColor: '#00984A',
                    borderRadius: '2px'
                  }}
                />
              </div>

              {/* Members Row - Tier 1: Apex Leadership (Executive Horizontal / Duo Card) */}
              {isApexTier ? (
                <div className="row justify-content-center">
                  {members.map((member) => {
                    const formattedName = formatName(member.name);
                    const isChairman = member.id === 1 || (member.row === 1 && member.sl === 1);
                    const isMD = member.id === 2 || (member.row === 1 && member.sl === 2);

                    return (
                      <div key={member.id} className={meta.colClass}>
                        <div
                          className="card border-0 shadow-sm rounded-lg overflow-hidden h-100 team-card"
                          style={{
                            backgroundColor: '#ffffff',
                            borderTop: '4px solid #00984A',
                            borderRadius: '14px',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                        >
                          <div className="card-body p-4">
                            <div className="d-flex flex-column flex-sm-row align-items-center text-center text-sm-left">
                              {/* Compact, Sharp Portrait Frame */}
                              <div className="mb-3 mb-sm-0 mr-sm-4 flex-shrink-0">
                                <div
                                  style={{
                                    width: '135px',
                                    height: '160px',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    backgroundColor: '#f1f7f3',
                                    border: '2px solid #e1efe6',
                                    boxShadow: '0 6px 16px rgba(0, 152, 74, 0.12)'
                                  }}
                                >
                                  <img
                                    src={`/team/${member.image}`}
                                    alt={`${formattedName} - ${member.designation}`}
                                    className="w-100 h-100 team-img"
                                    style={{
                                      objectFit: 'cover',
                                      objectPosition: 'top center',
                                      imageRendering: '-webkit-optimize-contrast'
                                    }}
                                    onError={(e) => {
                                      if (isChairman) e.target.src = '/pmch/img/chairman.png';
                                      else if (isMD) e.target.src = '/pmch/img/md.png';
                                      else e.target.src = '/male.jpg';
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Content Info */}
                              <div className="flex-grow-1">
                                <span
                                  className="badge px-2 py-1 font-weight-bold text-uppercase mb-2 d-inline-block"
                                  style={{
                                    backgroundColor: 'rgba(0, 152, 74, 0.12)',
                                    color: '#00984A',
                                    fontSize: '11px',
                                    borderRadius: '6px'
                                  }}
                                >
                                  {cleanText(member.designation)}
                                </span>

                                <h3
                                  className="font-weight-bold text-dark mb-1"
                                  style={{ fontSize: '1.25rem', lineHeight: '1.3' }}
                                >
                                  {formattedName}
                                </h3>

                                <p className="text-muted small mb-3" style={{ fontSize: '13px', lineHeight: '1.4' }}>
                                  {isChairman
                                    ? 'Late Tahera Akhter laid the founding cornerstone and humanitarian vision of Popular Medical College & Hospital.'
                                    : 'Pioneering healthcare visionary and Managing Director leading Popular Group towards global clinical standards.'}
                                </p>

                                {/* Action message links */}
                                {isChairman && (
                                  <Link
                                    to="/chairman-message"
                                    className="btn btn-sm btn-outline-success font-weight-semibold shadow-sm"
                                    style={{ borderColor: '#00984A', color: '#00984A', borderRadius: '6px', fontSize: '12px' }}
                                  >
                                    <i className="fas fa-envelope-open-text mr-1"></i> Chairman's Message
                                  </Link>
                                )}

                                {isMD && (
                                  <Link
                                    to="/md-message"
                                    className="btn btn-sm btn-outline-success font-weight-semibold shadow-sm"
                                    style={{ borderColor: '#00984A', color: '#00984A', borderRadius: '6px', fontSize: '12px' }}
                                  >
                                    <i className="fas fa-envelope-open-text mr-1"></i> Managing Director's Message
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Members Row - Tier 2, 3, 4: Modern Compact Executive Cards without Hashtags */
                <div className="row justify-content-center">
                  {members.map((member) => {
                    const formattedName = formatName(member.name);
                    const bioText = cleanBio(member.bio, member.designation);

                    return (
                      <div key={member.id} className={meta.colClass}>
                        <div
                          className="card border-0 shadow-sm rounded-lg overflow-hidden h-100 team-card text-center"
                          style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '14px',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            borderTop: '3px solid transparent'
                          }}
                        >
                          <div className="card-body p-4 d-flex flex-column align-items-center justify-content-between">
                            {/* Compact Sharp Portrait */}
                            <div className="mb-3 position-relative">
                              <div
                                style={{
                                  width: rowNum === 3 ? '120px' : '125px',
                                  height: rowNum === 3 ? '140px' : '145px',
                                  borderRadius: '12px',
                                  overflow: 'hidden',
                                  backgroundColor: '#f8faf9',
                                  border: '2px solid #eef4f0',
                                  boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
                                }}
                              >
                                <img
                                  src={`/team/${member.image}`}
                                  alt={`${formattedName} - ${member.designation}`}
                                  className="w-100 h-100 team-img"
                                  style={{
                                    objectFit: 'cover',
                                    objectPosition: 'top center',
                                    imageRendering: '-webkit-optimize-contrast'
                                  }}
                                  onError={(e) => {
                                    e.target.src = '/male.jpg';
                                  }}
                                />
                              </div>
                            </div>

                            {/* Member Credentials */}
                            <div className="w-100">
                              <h4
                                className="font-weight-bold text-dark mb-1"
                                style={{
                                  fontSize: rowNum === 3 ? '1.02rem' : '1.1rem',
                                  lineHeight: '1.3',
                                  minHeight: '2.4em',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                {formattedName}
                              </h4>

                              <div className="mb-2">
                                <span
                                  className="badge px-2 py-1 font-weight-semibold text-wrap shadow-none d-inline-block"
                                  style={{
                                    backgroundColor: '#eaf7f0',
                                    color: '#00984A',
                                    fontSize: '11px',
                                    lineHeight: '1.4',
                                    borderRadius: '6px',
                                    maxWidth: '100%'
                                  }}
                                >
                                  {cleanText(member.designation)}
                                </span>
                              </div>

                              {bioText && (
                                <p
                                  className="text-muted small mt-2 mb-0"
                                  style={{
                                    fontSize: '11.5px',
                                    lineHeight: '1.45',
                                    backgroundColor: '#f8faf9',
                                    padding: '6px 8px',
                                    borderRadius: '6px',
                                    border: '1px solid #edf2ee'
                                  }}
                                >
                                  {bioText}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Institutional Contact Bar */}
        <div
          className="p-4 rounded-lg mt-5 shadow-sm text-center text-md-left text-white d-flex flex-column flex-md-row align-items-center justify-content-between"
          style={{
            background: 'linear-gradient(135deg, #00984A 0%, #007639 100%)',
            borderRadius: '12px'
          }}
        >
          <div className="mb-3 mb-md-0">
            <h4 className="font-weight-bold mb-1 text-white" style={{ fontSize: '1.25rem' }}>
              Connect with PMCH Hospital Administration
            </h4>
            <p className="mb-0 text-white-50 small" style={{ fontSize: '13px' }}>
              For executive inquiries, academic affiliations, corporate partnerships, or patient administrative assistance.
            </p>
          </div>
          <div>
            <Link
              to="/contact-us"
              className="btn btn-light font-weight-bold px-4 py-2 text-uppercase shadow-sm"
              style={{ color: '#00984A', borderRadius: '8px', fontSize: '12px', letterSpacing: '0.5px' }}
            >
              Contact Office <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Embedded CSS for hover card styling */}
      <style>{`
        .team-card {
          border: 1px solid #edf1ee !important;
        }
        .team-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 28px rgba(0, 152, 74, 0.12) !important;
          border-top: 3px solid #00984A !important;
        }
        .team-card:hover .team-img {
          transform: scale(1.04);
          transition: transform 0.3s ease;
        }
      `}</style>
    </div>
  );
}
