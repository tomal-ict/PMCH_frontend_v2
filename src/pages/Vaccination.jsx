import React from 'react';
import { Link } from 'react-router-dom';

export default function Vaccination() {
  const vaccines = [
    { name: 'BCG (Tuberculosis)', timing: 'At birth or as early as possible', target: 'Infants' },
    { name: 'Pentavalent (DPT + Hep B + Hib)', timing: '6, 10, 14 weeks', target: 'Infants' },
    { name: 'PCV (Pneumococcal Conjugate Vaccine)', timing: '6, 10, 14 weeks', target: 'Infants' },
    { name: 'OPV / IPV (Polio Vaccines)', timing: '6, 14 weeks & booster', target: 'Infants & Children' },
    { name: 'MR (Measles & Rubella)', timing: '9 months & 15 months', target: 'Infants' },
    { name: 'Hepatitis B (Adult)', timing: '0, 1, 6 months schedule', target: 'Adults & High-Risk Workers' },
    { name: 'Typhoid Conjugate Vaccine', timing: 'Single dose booster', target: 'Children & Adults' },
    { name: 'Influenza (Flu Shot)', timing: 'Annual seasonal dose', target: 'Elderly, Asthmatic, All Ages' },
    { name: 'Cervical Cancer (HPV Vaccine)', timing: '2 or 3 doses schedule', target: 'Adolescent Girls & Women' }
  ];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>PMCH Immunization & Vaccination Centre</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">Vaccination</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row align-items-center mb-5">
          <div className="col-lg-7 mb-4 mb-lg-0">
            <h2 className="font-weight-bold text-dark mb-3">Lifelong Disease Prevention & Immunization</h2>
            <p className="text-muted leading-relaxed">
              The Dedicated Immunization & Vaccination Unit at Popular Medical College Hospital provides comprehensive vaccine protection for infants, children, adolescents, and adults. All vaccines are maintained within strict pharmaceutical cold-chain refrigeration monitored 24/7.
            </p>
            <p className="text-muted leading-relaxed">
              We administer the Government Extended Program on Immunization (EPI) as well as private specialized travel and preventative vaccinations.
            </p>
          </div>
          <div className="col-lg-5 text-center">
            <div className="card shadow-sm border-0 p-4 bg-light">
              <i className="fas fa-syringe fa-3x text-primary mb-3"></i>
              <h5 className="font-weight-bold text-dark mb-2">Vaccine Centre Hours</h5>
              <p className="text-muted small mb-3">Saturday to Thursday: 8:00 AM – 8:00 PM<br />Friday: 9:00 AM – 2:00 PM</p>
              <h5 className="text-primary font-weight-bold mb-3">09666 787800</h5>
              <Link to="/contact-us" className="btn btn-primary font-weight-bold btn-block">Book Vaccine Dose</Link>
            </div>
          </div>
        </div>

        <div className="card shadow-sm border-0 p-4">
          <h4 className="font-weight-bold text-dark mb-3">Available Routine & Special Vaccines</h4>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>Vaccine Name</th>
                  <th>Recommended Timing</th>
                  <th>Target Group</th>
                </tr>
              </thead>
              <tbody>
                {vaccines.map((v, i) => (
                  <tr key={i}>
                    <td className="font-weight-bold text-primary">{v.name}</td>
                    <td className="text-dark">{v.timing}</td>
                    <td><span className="badge badge-info">{v.target}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
