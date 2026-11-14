import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Admission from './pages/Admission';
import Amenities from './pages/Amenities';
import Career from './pages/Career';
import NewsEvent from './pages/NewsEvent';
import NewsDetails from './pages/NewsDetails';
import AboutUs from './pages/AboutUs';
import ChairmanMessage from './pages/ChairmanMessage';
import MdMessage from './pages/MdMessage';
import ManagementTeam from './pages/ManagementTeam';
import Speciality from './pages/Speciality';
import Package from './pages/Package';
import Rates from './pages/Rates';
import PatientFacilities from './pages/PatientFacilities';
import Indoor from './pages/Indoor';
import Outdoor from './pages/Outdoor';
import Enquiry from './pages/Enquiry';
import Faqs from './pages/Faqs';
import BirthCertificate from './pages/BirthCertificate';
import BloodBank from './pages/BloodBank';
import Testimonial from './pages/Testimonial';
import Sitemap from './pages/Sitemap';
import Vaccination from './pages/Vaccination';
import PhotoGallery from './pages/PhotoGallery';
import VideoGallery from './pages/VideoGallery';
import History from './pages/History';
import ContactUs from './pages/ContactUs';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Automatically scroll to top on page change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <div className="d-flex flex-column min-vh-100">
      <ScrollToTop />
      {!isAdminRoute && <Header />}

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/amenities" element={<Amenities />} />
          <Route path="/career" element={<Career />} />
          <Route path="/news-event" element={<NewsEvent />} />
          <Route path="/news-details/:id" element={<NewsDetails />} />
          <Route path="/news-details/:id/:title" element={<NewsDetails />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/chairman-message" element={<ChairmanMessage />} />
          <Route path="/md-message" element={<MdMessage />} />
          <Route path="/management-team" element={<ManagementTeam />} />
          <Route path="/speciality/:id" element={<Speciality />} />
          <Route path="/speciality/:id/:name" element={<Speciality />} />
          <Route path="/package" element={<Package />} />
          <Route path="/rates" element={<Rates />} />
          <Route path="/corporate-patients" element={<Rates />} />
          <Route path="/patient-facilities" element={<PatientFacilities />} />
          <Route path="/indoor" element={<Indoor />} />
          <Route path="/outdoor" element={<Outdoor />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/birth-certificate" element={<BirthCertificate />} />
          <Route path="/blood-bank" element={<BloodBank />} />
          <Route path="/testimonial" element={<Testimonial />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/vaccination" element={<Vaccination />} />
          <Route path="/room-rent" element={<Rates />} />
          <Route path="/photo-gallery" element={<PhotoGallery />} />
          <Route path="/video-gallery" element={<VideoGallery />} />
          <Route path="/history" element={<History />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/location-map" element={<ContactUs />} />

          {/* Admin routes */}
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="container py-5 text-center my-5">
                <h1 className="display-4 font-weight-bold text-danger">404</h1>
                <h3>Page Not Found</h3>
                <p className="text-muted">The page you requested could not be located.</p>
                <a href="/" className="btn btn-primary mt-3">Return to Home</a>
              </div>
            }
          />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}
