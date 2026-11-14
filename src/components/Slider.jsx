import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    image: '/pmch/img/slides/slider-building.jpg',
    badge: 'Premier Healthcare Institution',
    title: 'Welcome to Popular Medical College Hospital',
    subtitle: 'An advanced center for tertiary clinical care, modern surgery and compassionate medical healing.',
    btnText: 'Learn More About PMCH',
    btnLink: '/about-us',
    btnSecText: 'Hospital Tour & Facilities',
    btnSecLink: '/amenities'
  },
  {
    image: '/pmch/img/slides/slider1.jpg',
    badge: 'Your Lifelong Health Partner',
    title: 'Advanced Medicine & Compassionate 24/7 Emergency Care',
    subtitle: 'Modern modular surgical suites, digital diagnostic labs, and dedicated ICU, CCU & NICU units.',
    btnText: 'Admission & Tariff Guide',
    btnLink: '/admission',
    btnSecText: 'Find Specialist Doctors',
    btnSecLink: '/package'
  },
  {
    image: '/pmch/img/slides/slider2.jpg',
    badge: 'Clinical Excellence & Medical Education',
    title: 'World-Class Faculty with 400+ Specialist Consultants',
    subtitle: 'Providing multidisciplinary outpatient consultations and round-the-clock intensive monitoring.',
    btnText: 'Browse Doctors Directory',
    btnLink: '/package',
    btnSecText: 'Book an Appointment',
    btnSecLink: '/contact-us'
  }
];

export default function Slider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((current + 1) % slides.length);
  const prevSlide = () => setCurrent((current - 1 + slides.length) % slides.length);

  return (
    <div
      className="position-relative overflow-hidden user-select-none"
      style={{
        minHeight: '560px',
        backgroundColor: '#111a15'
      }}
    >
      {slides.map((slide, idx) => {
        const isActive = idx === current;
        return (
          <div
            key={idx}
            className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              top: 0,
              left: 0,
              opacity: isActive ? 1 : 0,
              visibility: isActive ? 'visible' : 'hidden',
              transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), visibility 1.2s',
              zIndex: isActive ? 2 : 1
            }}
          >
            {/* Background Image with Cinematic Ken Burns Zoom effect */}
            <div
              className="position-absolute w-100 h-100"
              style={{
                backgroundImage: `linear-gradient(rgba(10, 25, 18, 0.65), rgba(10, 25, 18, 0.78)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: isActive ? 'scale(1.0)' : 'scale(1.08)',
                transition: 'transform 7s ease-out',
                zIndex: -1
              }}
            />

            {/* Content Container (Clean, Free-Floating Text - No Box Background) */}
            <div className="container py-5" style={{ maxWidth: '1200px', zIndex: 5 }}>
              <div className="row justify-content-center text-center">
                <div className="col-lg-11 col-xl-10">
                  <div className="hero-text-wrap mx-auto">
                    {/* Brand Badge */}
                    <div
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateY(0)' : 'translateY(-15px)',
                        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
                      }}
                    >
                      <span
                        className="badge px-3 py-2 text-uppercase font-weight-bold mb-3 shadow"
                        style={{
                          backgroundColor: '#00984A',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          color: '#ffffff',
                          letterSpacing: '1.5px',
                          fontSize: '12px',
                          borderRadius: '30px'
                        }}
                      >
                        <i className="fas fa-check-circle mr-1"></i> {slide.badge}
                      </span>
                    </div>

                    {/* Single-Line Clean Heading floating directly on slide */}
                    <h1
                      className="font-weight-extra-bold text-white mb-3 text-center"
                      style={{
                        fontSize: 'clamp(1.5rem, 2.8vw, 2.5rem)',
                        lineHeight: '1.25',
                        letterSpacing: '-0.3px',
                        textShadow: '0 3px 18px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.9)',
                        whiteSpace: 'normal',
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateY(0)' : 'translateY(25px)',
                        transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s'
                      }}
                    >
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p
                      className="lead text-white mb-4 mx-auto font-weight-normal"
                      style={{
                        maxWidth: '780px',
                        fontSize: 'clamp(0.95rem, 1.4vw, 1.18rem)',
                        lineHeight: '1.6',
                        color: 'rgba(255, 255, 255, 0.92)',
                        textShadow: '0 2px 10px rgba(0,0,0,0.9)',
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.5s'
                      }}
                    >
                      {slide.subtitle}
                    </p>

                    {/* CTA Buttons in Popular Brand Green #00984A */}
                    <div
                      className="d-flex justify-content-center flex-wrap"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateY(0)' : 'translateY(15px)',
                        transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.7s'
                      }}
                    >
                      <Link
                        to={slide.btnLink}
                        className="btn font-weight-bold px-4 py-3 mr-sm-3 mb-2 mb-sm-0 shadow text-uppercase text-white"
                        style={{
                          backgroundColor: '#00984A',
                          borderColor: '#00984A',
                          borderRadius: '6px',
                          letterSpacing: '0.8px',
                          fontSize: '13px',
                          boxShadow: '0 4px 15px rgba(0, 152, 74, 0.4)',
                          transition: 'all 0.25s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#007a3b';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 152, 74, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#00984A';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 152, 74, 0.4)';
                        }}
                      >
                        {slide.btnText} <i className="fas fa-arrow-right ml-2"></i>
                      </Link>

                      <Link
                        to={slide.btnSecLink}
                        className="btn btn-outline-light font-weight-bold px-4 py-3 text-uppercase"
                        style={{
                          borderRadius: '6px',
                          letterSpacing: '0.8px',
                          fontSize: '13px',
                          backgroundColor: 'rgba(0,0,0,0.3)',
                          borderColor: 'rgba(255,255,255,0.7)',
                          backdropFilter: 'blur(5px)',
                          transition: 'all 0.25s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                          e.currentTarget.style.color = '#00984A';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.3)';
                          e.currentTarget.style.color = '#ffffff';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {slide.btnSecText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="btn btn-outline-light rounded-circle position-absolute d-none d-md-flex align-items-center justify-content-center shadow"
        style={{
          top: '50%',
          left: '25px',
          transform: 'translateY(-50%)',
          width: '46px',
          height: '46px',
          zIndex: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          borderColor: 'rgba(255, 255, 255, 0.35)'
        }}
        aria-label="Previous Slide"
      >
        <i className="fas fa-chevron-left"></i>
      </button>

      <button
        onClick={nextSlide}
        className="btn btn-outline-light rounded-circle position-absolute d-none d-md-flex align-items-center justify-content-center shadow"
        style={{
          top: '50%',
          right: '25px',
          transform: 'translateY(-50%)',
          width: '46px',
          height: '46px',
          zIndex: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          borderColor: 'rgba(255, 255, 255, 0.35)'
        }}
        aria-label="Next Slide"
      >
        <i className="fas fa-chevron-right"></i>
      </button>

      {/* Progress Indicators */}
      <div className="position-absolute w-100 text-center" style={{ bottom: '20px', zIndex: 10 }}>
        {slides.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              display: 'inline-block',
              width: i === current ? '32px' : '10px',
              height: '8px',
              margin: '0 4px',
              borderRadius: '4px',
              backgroundColor: i === current ? '#00984A' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.4s ease',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>
    </div>
  );
}
