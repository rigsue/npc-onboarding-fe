import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../../layout.css';
import './onboarding.css';

const MODULES = [
  {
    id: 1,
    title: 'PPT Best Practices and Usage Guidelines',
    items: [
      'Welcome to Netrust',
      'Our Organization',
      'How We Work',
      'Policies and Good Conduct',
    ],
  },
  {
    id: 2,
    title: 'Zoho',
    items: [],
  },
];

const Marketing = () => {
  console.log('Marketing component loaded');

  const [selectedModule, setSelectedModule] = useState(1);

  const currentModule = MODULES.find(
    (module) => module.id === selectedModule
  );

  return (
    <div className="page">

      {/* NAVBAR */}
      <Navbar active="onboarding" />

      {/* BODY */}
      <div className="body-wrap">

        {/* LEFT PANEL */}
        <aside className="sidebar">

          <div className="sidebar-banner">
            <h2>Marketing Modules</h2>
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
                    📄
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

          <h1>Marketing Department</h1>

          <div className="slide-row">

            {/* PREVIOUS */}
            <button
              type="button"
              className="nav-arrow"
              aria-label="Previous"
              onClick={() => {
                setSelectedModule((current) =>
                  current > 1
                    ? current - 1
                    : MODULES.length
                );
              }}
            >
              ‹
            </button>

            <div className="slide-stack">

              <div className={`slide-card panel-${selectedModule}`}>

                {/* MODULE 1 */}
                {selectedModule === 1 ? (

                  <div className="slide-body">

                    <div className="slide-logo">

                      <div className="n">
                        n
                      </div>

                      <div className="ring">
                        ◎
                      </div>

                    </div>

                    <div className="slide-buttons">

                      {currentModule.items.map((item) => (
                        <div
                          key={item}
                          className="item"
                        >
                          {item}
                        </div>
                      ))}

                    </div>

                  </div>

                ) : (

                  /* MODULE 2 */
                  <div className="slide-placeholder">

                    <p className="slide-placeholder-title">
                      {currentModule.title}
                    </p>

                    <p className="slide-placeholder-sub">
                      Slide deck placeholder — swap in the real
                      PowerPoint export here
                    </p>

                  </div>

                )}

                {/* SLIDE FOOTER */}
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

            {/* NEXT */}
            <button
              type="button"
              className="nav-arrow"
              aria-label="Next"
              onClick={() => {
                setSelectedModule((current) =>
                  current < MODULES.length
                    ? current + 1
                    : 1
                );
              }}
            >
              ›
            </button>

          </div>

          {/* PAGE COUNTER */}
          <div className="page-counter">
            {selectedModule}/{MODULES.length}
          </div>

        </main>

      </div>

      {/* FOOTER */}
      <Footer />

    </div>
  );
};

export default Marketing;