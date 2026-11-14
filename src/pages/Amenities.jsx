import React from 'react';
import { Link } from 'react-router-dom';

export default function Amenities() {
  const amenitiesList = [
    {
      title: 'State-of-the-Art Intensive Care (ICU & CCU)',
      desc: 'Equipped with world-class ventilators, advanced hemodynamic monitoring, bedside dialysis capability, and dedicated round-the-clock intensivist coverage.',
      icon: 'fa-heartbeat'
    },
    {
      title: 'Neonatal & Pediatric ICU (NICU / PICU)',
      desc: 'Advanced incubators, phototherapy units, surfactant therapy, and specialized pediatric critical care teams for newborns and infants.',
      icon: 'fa-baby'
    },
    {
      title: 'Modular Operation Theatres',
      desc: 'Equipped with laminar air flow, HEPA filtration, C-Arm image intensifiers, harmonic scalpels, and laparoscopic surgical towers.',
      icon: 'fa-procedures'
    },
    {
      title: '24/7 Advanced Emergency & Trauma Centre',
      desc: 'Immediate resuscitation, trauma care, triaging, dedicated emergency physicians, and swift access to diagnostic imaging.',
      icon: 'fa-ambulance'
    },
    {
      title: 'Comprehensive Diagnostic Laboratories',
      desc: 'Integrated with automated biochemistry, clinical pathology, microbiology, molecular biology, and histopathology testing.',
      icon: 'fa-microscope'
    },
    {
      title: '24/7 In-House Blood Bank & Transfusion Medicine',
      desc: 'Component separation (Platelet, FFP, Packed Red Blood Cells), screening, and leukoreduction for life-saving surgeries and oncology care.',
      icon: 'fa-tint'
    },
    {
      title: 'Modern Dialysis Unit',
      desc: 'High-flux hemodialysis machines with dedicated RO water filtration systems supervised by expert nephrologists.',
      icon: 'fa-lungs'
    },
    {
      title: 'Pharmacy & Medical Supplies (24 Hours)',
      desc: 'Fully stocked hospital pharmacy providing 100% genuine pharmaceutical drugs, implants, and surgical consumables 24/7.',
      icon: 'fa-pills'
    }
  ];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>Hospital Amenities & Advanced Facilities</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">Amenities</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="text-center max-w-75 mx-auto mb-5">
          <h2 className="font-weight-extra-bold text-dark mb-2">Modern Healthcare Infrastructure</h2>
          <p className="text-muted">
            Popular Medical College Hospital integrates modern clinical technology, specialized patient monitoring, and skilled medical professionals to deliver superior outcomes.
          </p>
        </div>

        <div className="row">
          {amenitiesList.map((item, idx) => (
            <div key={idx} className="col-lg-6 mb-4">
              <div className="card h-100 p-4 border-0 shadow-sm bg-white rounded">
                <div className="d-flex align-items-start">
                  <div className="p-3 bg-light rounded text-primary mr-3">
                    <i className={`fas ${item.icon} fa-2x`}></i>
                  </div>
                  <div>
                    <h5 className="font-weight-bold text-dark mb-2">{item.title}</h5>
                    <p className="text-muted small mb-0 line-height-7">{item.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
