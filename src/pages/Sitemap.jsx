import React from 'react';
import { Link } from 'react-router-dom';

export default function Sitemap() {
  const links = [
    { section: 'Main Pages', items: [
      { name: 'Home', path: '/' },
      { name: 'About PMCH', path: '/about-us' },
      { name: 'Chairman Message', path: '/chairman-message' },
      { name: 'Managing Director Message', path: '/md-message' },
      { name: 'Management Team', path: '/management-team' },
      { name: 'Hospital History', path: '/history' },
      { name: 'Contact Us', path: '/contact-us' }
    ]},
    { section: 'Clinical Services', items: [
      { name: 'Indoor Services', path: '/indoor' },
      { name: 'Outdoor (OPD) Services', path: '/outdoor' },
      { name: 'Patient Facilities', path: '/patient-facilities' },
      { name: 'Vaccination Centre', path: '/vaccination' },
      { name: 'Blood Bank', path: '/blood-bank' },
      { name: 'Rate Charts', path: '/rates' }
    ]},
    { section: 'Doctors & Departments', items: [
      { name: 'Find Doctors', path: '/package' },
      { name: 'Admission Guidelines', path: '/admission' },
      { name: 'Hospital Amenities', path: '/amenities' },
      { name: 'Online Inquiry', path: '/enquiry' },
      { name: 'Birth Certificate Verification', path: '/birth-certificate' }
    ]},
    { section: 'News & Media', items: [
      { name: 'News & Events', path: '/news-event' },
      { name: 'Career Circulars', path: '/career' },
      { name: 'Photo Gallery', path: '/photo-gallery' },
      { name: 'Video Gallery', path: '/video-gallery' },
      { name: 'Patient Testimonials', path: '/testimonial' },
      { name: 'FAQs', path: '/faqs' }
    ]}
  ];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>Website Sitemap</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">Sitemap</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row">
          {links.map((group, idx) => (
            <div key={idx} className="col-lg-3 col-md-6 mb-4">
              <div className="card h-100 shadow-sm border-0 p-4">
                <h5 className="font-weight-bold text-primary mb-3">{group.section}</h5>
                <ul className="list-unstyled mb-0" style={{ lineHeight: '2' }}>
                  {group.items.map((item, i) => (
                    <li key={i}>
                      <Link to={item.path} className="text-dark text-decoration-none">
                        <i className="fas fa-angle-right text-muted mr-2"></i> {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
