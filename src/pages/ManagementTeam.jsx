import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

// Verified fallback hierarchy in case of network latency
const initialFallbackRows = {
  1: [
    {
      id: 1,
      name: 'Late Tahera Akhter',
      designation: 'Chairman',
      image: '2004062097-20260408153112-1486274258.png',
      row: 1,
      sl: 1,
      link: '/chairman-message'
    },
    {
      id: 2,
      name: 'Dr. Mostafizur Rahman',
      designation: 'Managing Director',
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
    title: 'Apex Leadership & Board of Directors',
    subtitle: 'The visionary founders and executive trustees steering PMCH.',
    colClass: 'col-lg-5 col-md-6 mb-4',
    badge: 'Executive Trustees'
  },
  2: {
    title: 'Directorate & Clinical Governance',
    subtitle: 'Distinguished directors overseeing medical operations and hospital governance.',
    colClass: 'col-lg-4 col-md-6 mb-4',
    badge: 'Hospital Directorate'
  },
  3: {
    title: 'Departmental Heads & Nursing Leadership',
    subtitle: 'Senior functional managers dedicated to operational excellence and patient care.',
    colClass: 'col-lg-3 col-md-6 mb-4',
    badge: 'Departmental Heads'
  },
  4: {
    title: 'Operations, Billing & Specialist Services',
    subtitle: 'Specialized healthcare management and hospital administrative services.',
    colClass: 'col-lg-4 col-md-6 mb-4',
    badge: 'Operations & Clinical Support'
  }
};

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

  // Clean html bio tags helper
  const cleanBio = (bio) => {
    if (!bio) return null;
    return bio.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
  };

  // Sorted row keys
  const rowKeys = Object.keys(groupedRows).map(Number).sort((a, b) => a - b);

  return (
    <div className="bg-light">
      {/* Modern Page Header Banner */}
      <section
        className="page-header position-relative py-5 m-0 text-white"
        style={{
          background: 'linear-gradient(135deg, rgba(7, 30, 18, 0.92) 0%, rgba(0, 75, 36, 0.88) 100%), url("/pmch/img/sliderTwo.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: 'inset 0 -10px 25px rgba(0,0,0,0.2)'
        }}
      >
        <div className="container" style={{ maxWidth: '1240px' }}>
          <div className="row align-items-center">
            <div className="col-lg-8 text-center text-lg-left">
              <span
                className="badge px-3 py-1 text-uppercase font-weight-bold mb-2 shadow-sm"
                style={{
                  backgroundColor: '#00984A',
                  color: '#ffffff',
                  letterSpacing: '1.2px',
                  fontSize: '11px'
                }}
              >
                About PMCH • Organizational Structure
              </span>
              <h1 className="font-weight-extra-bold text-white mb-2" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
                Management Team
              </h1>
              <p className="text-white-50 mb-0 font-weight-light">
                Distinguished leadership driving clinical excellence, compassionate care, and hospital administration.
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
            title: `Leadership Tier ${rowNum}`,
            subtitle: 'Institutional Management',
            colClass: 'col-lg-4 col-md-6 mb-4',
            badge: 'Management'
          };

          return (
            <div key={rowNum} className="tier-section mb-5">
              {/* Tier Heading Divider */}
              <div className="text-center mb-4">
                <span
                  className="badge px-3 py-1 font-weight-bold text-uppercase mb-2 shadow-sm"
                  style={{
                    backgroundColor: rowNum === 1 ? 'rgba(0, 152, 74, 0.15)' : '#e9ecef',
                    color: rowNum === 1 ? '#00984A' : '#495057',
                    letterSpacing: '1.2px',
                    fontSize: '11px'
                  }}
                >
                  {meta.badge}
                </span>
                <h2
                  className="font-weight-bold text-dark mb-1"
                  style={{ fontSize: rowNum === 1 ? '1.85rem' : '1.5rem', letterSpacing: '-0.3px' }}
                >
                  {meta.title}
                </h2>
                <p className="text-muted small mb-0 font-weight-normal mx-auto" style={{ maxWidth: '650px' }}>
                  {meta.subtitle}
                </p>
                <div
                  className="mx-auto mt-2 mb-4"
                  style={{
                    width: '60px',
                    height: '3px',
                    backgroundColor: '#00984A',
                    borderRadius: '2px'
                  }}
                />
              </div>

              {/* Members Row (Strictly Ordered by row and sl) */}
              <div className="row justify-content-center">
                {members.map((member) => {
                  const bioText = cleanBio(member.bio);
                  const isTopTier = rowNum === 1;

                  return (
                    <div key={member.id} className={meta.colClass}>
                      <div
                        className="card h-100 border-0 shadow-sm rounded-lg overflow-hidden team-card"
                        style={{
                          backgroundColor: '#ffffff',
                          transition: 'all 0.3s ease',
                          borderTop: isTopTier ? '4px solid #00984A' : '3px solid transparent'
                        }}
                      >
                        {/* Member Portrait Frame */}
                        <div
                          className="position-relative overflow-hidden text-center"
                          style={{
                            backgroundColor: '#f8fbf9',
                            height: isTopTier ? '320px' : '260px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderBottom: '1px solid #edf2ef'
                          }}
                        >
                          <img
                            src={`/team/${member.image}`}
                            alt={`${member.name} - ${member.designation}`}
                            className="img-fluid w-100 h-100 team-img"
                            style={{
                              objectFit: 'cover',
                              objectPosition: 'top center',
                              transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                            onError={(e) => {
                              // If specific team photo fails, fallback to known images
                              if (member.id === 1) e.target.src = '/pmch/img/chairman.png';
                              else if (member.id === 2) e.target.src = '/pmch/img/md.png';
                              else e.target.src = '/male.jpg';
                            }}
                          />

                          {/* Order Badge Indicator */}
                          <span
                            className="position-absolute badge badge-dark px-2 py-1 shadow-sm"
                            style={{
                              top: '12px',
                              right: '12px',
                              opacity: 0.85,
                              fontSize: '10px',
                              letterSpacing: '0.5px'
                            }}
                          >
                            Tier {member.row} • #{member.sl}
                          </span>
                        </div>

                        {/* Member Details */}
                        <div className="card-body p-4 text-center d-flex flex-column justify-content-between">
                          <div>
                            <h4
                              className="font-weight-bold text-dark mb-1"
                              style={{
                                fontSize: isTopTier ? '1.25rem' : '1.05rem',
                                lineHeight: '1.3'
                              }}
                            >
                              {member.name}
                            </h4>

                            <span
                              className="badge px-3 py-1 font-weight-bold text-uppercase mb-2 shadow-sm d-inline-block text-wrap"
                              style={{
                                backgroundColor: isTopTier ? '#00984A' : '#e6f5ed',
                                color: isTopTier ? '#ffffff' : '#00984A',
                                fontSize: '11px',
                                letterSpacing: '0.6px',
                                lineHeight: '1.4'
                              }}
                            >
                              {member.designation}
                            </span>

                            {/* Academic or Professional Bio */}
                            {bioText && bioText !== '.' && (
                              <p
                                className="text-muted small mt-2 mb-0"
                                style={{ lineHeight: '1.5', fontSize: '12px' }}
                              >
                                {bioText}
                              </p>
                            )}
                          </div>

                          {/* Quick Message Link for Chairman & MD */}
                          {(member.id === 1 || member.row === 1 && member.sl === 1) && (
                            <div className="mt-3 pt-3 border-top">
                              <Link
                                to="/chairman-message"
                                className="btn btn-sm btn-outline-success font-weight-bold btn-block"
                                style={{ borderColor: '#00984A', color: '#00984A' }}
                              >
                                <i className="fas fa-envelope-open-text mr-1"></i> Read Chairman's Message
                              </Link>
                            </div>
                          )}

                          {(member.id === 2 || member.row === 1 && member.sl === 2) && (
                            <div className="mt-3 pt-3 border-top">
                              <Link
                                to="/md-message"
                                className="btn btn-sm btn-outline-success font-weight-bold btn-block"
                                style={{ borderColor: '#00984A', color: '#00984A' }}
                              >
                                <i className="fas fa-envelope-open-text mr-1"></i> Read MD's Message
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Institutional Contact Bar */}
        <div
          className="p-4 rounded-lg mt-5 shadow-sm text-center text-md-left text-white d-flex flex-column flex-md-row align-items-center justify-content-between"
          style={{ backgroundColor: '#00984A' }}
        >
          <div className="mb-3 mb-md-0">
            <h4 className="font-weight-bold mb-1 text-white">Join the PMCH Team or Consult Hospital Administration</h4>
            <p className="mb-0 text-white-50 small">
              For administrative inquiries, executive correspondence, or corporate partnerships, reach out directly.
            </p>
          </div>
          <div>
            <Link to="/contact-us" className="btn btn-light font-weight-bold px-4 py-2 text-uppercase shadow-sm" style={{ color: '#00984A' }}>
              Contact Administration <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Embedded CSS for hover card styling */}
      <style>{`
        .team-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 35px rgba(0, 0, 0, 0.1) !important;
          border-top-color: #00984A !important;
        }
        .team-card:hover .team-img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
