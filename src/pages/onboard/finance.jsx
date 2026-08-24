import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../../layout.css';
import './onboarding.css';

const MODULES = [
  {
    id: 1,
    title: 'Finance Forms',
    items: [
      'Welcome to Netrust',
      'Our Organization',
      'How We Work',
      'Policies and Good Conduct',
    ],
  },
];

const Finance = () => {
  const [selectedModule, setSelectedModule] = useState(1);

  const currentModule = MODULES.find(
    (module) => module.id === selectedModule
  );

  return (
    <div className="page">

      <Navbar active="finance" />

      <div className="body-wrap">

        {/* LEFT PANEL */}
        <aside className="sidebar">

          <div className="sidebar-banner">
            <h2>Finance Modules</h2>
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

          <h1>Finance Department</h1>

          <div className="slide-row">

            <button
              type="button"
              className="nav-arrow"
              aria-label="Previous"
            >
              ‹
            </button>

            <div className="slide-stack">

              <div className={`slide-card panel-${selectedModule}`}>

                <div className="slide-body">

                  <div className="slide-logo">
                    <div className="n">n</div>
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
            >
              ›
            </button>

          </div>

          <div className="page-counter">
            {selectedModule}/{MODULES.length}
          </div>

        </main>

      </div>

      <Footer />

    </div>
  );
};

export default Finance;