import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Rates() {
  const [activeTab, setActiveTab] = useState('cabin');

  const cabinRates = [
    { type: 'VIP Deluxe Suite (AC)', features: 'Attached bath, Attendant bed, TV, Refrigerator, Sofa set, Microwave', rate: '৳ 8,500' },
    { type: 'Super Deluxe Cabin (AC)', features: 'Attached bath, Attendant bed, LED TV, Fridge, Recliner sofa', rate: '৳ 6,000' },
    { type: 'Single Cabin (AC)', features: 'Attached bath, Attendant bed, Cable TV, Telephone, Wardrobe', rate: '৳ 4,000' },
    { type: 'Single Cabin (Non-AC)', features: 'Attached bath, Attendant bed, Telephone, Natural ventilation', rate: '৳ 2,500' },
    { type: 'Double Cabin / Shared (AC)', features: 'Shared bath between two beds, Attendant chair', rate: '৳ 2,000 / bed' },
    { type: 'General Male / Female Ward', features: 'Central oxygen supply, 24/7 nursing station, Attendant stool', rate: '৳ 900 / bed' },
    { type: 'ICU (Intensive Care Unit)', features: 'Invasive mechanical ventilator, Multi-para monitor, Infusion pump, 1:1 Nursing', rate: '৳ 9,000' },
    { type: 'CCU (Coronary Care Unit)', features: 'Defibrillator, Arterial line monitoring, Emergency cardiac pacing', rate: '৳ 8,000' },
    { type: 'NICU (Neonatal ICU)', features: 'Incubator, Neonatal phototherapy, Microprocessor CPAP', rate: '৳ 6,000' }
  ];

  const testRates = [
    { test: 'Complete Blood Count (CBC with ESR)', category: 'Hematology', rate: '৳ 500' },
    { test: 'Blood Sugar (Fasting / 2HABF)', category: 'Biochemistry', rate: '৳ 150' },
    { test: 'HbA1c (Glycated Hemoglobin)', category: 'Biochemistry', rate: '৳ 1,000' },
    { test: 'Lipid Profile (Cholesterol, TG, HDL, LDL)', category: 'Biochemistry', rate: '৳ 1,200' },
    { test: 'Serum Creatinine with eGFR', category: 'Biochemistry', rate: '৳ 400' },
    { test: 'Liver Function Test (LFT - Bilirubin, SGPT, SGOT, Alk Phos)', category: 'Biochemistry', rate: '৳ 1,300' },
    { test: 'Electrocardiogram (ECG 12-Lead)', category: 'Cardiology', rate: '৳ 400' },
    { test: '2D Echocardiography with Color Doppler', category: 'Cardiology', rate: '৳ 2,500' },
    { test: 'Digital Chest X-Ray (P/A View)', category: 'Radiology', rate: '৳ 600' },
    { test: 'Ultrasonography (USG of Whole Abdomen)', category: 'Radiology', rate: '৳ 1,800' }
  ];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>Rate Charts & Tariff Guide</h1>
            </div>
            <div className="col-md-4 text-md-right">
              <ol className="breadcrumb justify-content-md-end mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active text-white">Rate Charts</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="text-center mb-4">
          <h2 className="font-weight-bold text-dark">Transparent Hospital Charges</h2>
          <p className="text-muted">Popular Medical College Hospital guarantees affordable and transparent tariff structures without hidden costs.</p>
        </div>

        {/* Tab Buttons */}
        <div className="d-flex justify-content-center mb-4">
          <button
            className={`btn mr-3 font-weight-bold px-4 py-2 ${activeTab === 'cabin' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('cabin')}
          >
            <i className="fas fa-bed mr-1"></i> Cabin & Bed Rent Rates
          </button>
          <button
            className={`btn font-weight-bold px-4 py-2 ${activeTab === 'test' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('test')}
          >
            <i className="fas fa-microscope mr-1"></i> Common Diagnostic Tests
          </button>
        </div>

        {/* Cabin Table */}
        {activeTab === 'cabin' ? (
          <div className="card shadow-sm border-0 p-4">
            <h4 className="font-weight-bold text-dark mb-3">Room & Cabin Categories (Daily Charges)</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>Category</th>
                    <th>Facilities & Key Amenities</th>
                    <th className="text-right">Per Day Rent</th>
                  </tr>
                </thead>
                <tbody>
                  {cabinRates.map((c, i) => (
                    <tr key={i}>
                      <td className="font-weight-bold text-primary">{c.type}</td>
                      <td className="text-muted small">{c.features}</td>
                      <td className="text-right font-weight-bold text-dark">{c.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card shadow-sm border-0 p-4">
            <h4 className="font-weight-bold text-dark mb-3">Standard Laboratory & Diagnostic Tests</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>Investigation Name</th>
                    <th>Department</th>
                    <th className="text-right">Standard Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {testRates.map((t, i) => (
                    <tr key={i}>
                      <td className="font-weight-bold text-dark">{t.test}</td>
                      <td><span className="badge badge-info">{t.category}</span></td>
                      <td className="text-right font-weight-bold text-primary">{t.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="alert alert-secondary mt-4 text-center">
          <small className="text-muted">
            * Note: Room tariff does not include doctor rounds, medicines, disposables, or surgical fees. For corporate client discounts and insurance tie-ups, please contact our billing department at <strong>09666 787800</strong>.
          </small>
        </div>
      </div>
    </div>
  );
}
