import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../../layout.css';
import './onboarding.css';

const MODULES = [
  {
    id: 1,
    icon: '📄',
    title: 'Product Training',
  },
];

const SLIDES = [
  {
    title: 'Product Training',
    department: 'Pre-Sales Department',
  },
];

const Presales = () => {
  const [selectedModule, setSelectedModule] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = 25;

  const handlePrevious = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? totalSlides - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentSlide((prev) =>
      prev === totalSlides - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="page">
      <Navbar active="onboarding" />

      <div className="body-wrap">

        {/* LEFT PANEL */}
        <aside className="sidebar">

          <div className="sidebar-banner">
            <h2>Pre-sales Modules</h2>
          </div>

          <div className="sidebar-scroll">
            <div className="sidebar-list">

              {MODULES.map((module) => (
                <button
                  key={module.id}
                  type="button"
                  className={`module-card ${
                    selectedModule === module.id ? 'active' : ''
                  }`}
                  onClick={() => setSelectedModule(module.id)}
                >
                  <div className="icon-row">
                    {module.icon}
                  </div>

                  <p className="title">
                    {module.title}
                  </p>

                  <span className="view-link">
                    View Module ›
                  </span>
                </button>
              ))}

              <button
                type="button"
                className="proceed-btn"
              >
                Proceed to Assessment
              </button>

            </div>
          </div>

        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">

          <h1>Pre-Sales Department</h1>

          <div className="slide-row">

            <button
              type="button"
              className="nav-arrow"
              aria-label="Previous"
              onClick={handlePrevious}
            >
              ‹
            </button>

            <div className="slide-stack">

              <div className="slide-card panel-1">

                <div className="slide-body">

                  <div className="slide-logo">
                    <div className="n">n</div>
                    <div className="ring">◎</div>
                  </div>

                  <div className="slide-buttons">
                    <div className="item">
                      {SLIDES[currentSlide]?.title}
                    </div>
                  </div>

                </div>

                <div className="slide-footer">
                  <span>
                    in Netrust Philippines Corporation
                  </span>

                  <span>
                    https://www.netrust.com.ph
                  </span>

                  <span>
                    ✉ inquiry@netrust.com.ph
                  </span>
                </div>

              </div>

            </div>

            <button
              type="button"
              className="nav-arrow"
              aria-label="Next"
              onClick={handleNext}
            >
              ›
            </button>

          </div>

          <div className="page-counter">
            {currentSlide + 1}/{totalSlides}
          </div>

        </main>

      </div>

      <Footer />
    </div>
  );
};

export default Presales;