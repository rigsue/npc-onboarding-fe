import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../layout.css';
import './onboarding.css';

console.log ("check mo dito");
export default function Hr() {
  const [activeModuleId, setActiveModuleId] = useState(1);

  const hrModules = [
    { id: 1, title: "Welcome Session & Company Overview" },
    { id: 2, title: "Employee Culture & Engagement" },
    { id: 3, title: "Code of Conduct" },
    { id: 4, title: "HRIS - BIPO" },
    { id: 5, title: "Office Tour and Locker Assignment" }
  ];

  const activeModule = hrModules.find(m => m.id === activeModuleId) || hrModules[0];

  return (
    <>
    {/*<div className="page-wrapper">*/}
      <Navbar />

      <div className="body-wrap">
        <aside className="sidebar">
          <div className="sidebar-banner">
            <h2>HR Modules</h2>
          </div>

          <div className="sidebar-scroll">
            <div className="sidebar-list">
              {hrModules.map((mod) => (
                <div
                  key={mod.id}
                  className={`module-card ${activeModuleId === mod.id ? 'active' : ''}`}
                  onClick={() => setActiveModuleId(mod.id)}
                >
                  <p className="title">{mod.title}</p>
                  <span className="view-link">View Module ›</span>
                </div>
              ))}
              <button className="proceed-btn">Proceed to Assessment</button>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <h1>HR Department</h1>
          <div className="slide-card active-card">
            <h2>{activeModule.title}</h2>
            <p>PowerPoint / PDF viewer for HR Module {activeModule.id}</p>
          </div>
        </main>
      </div>

      <Footer />
    {/*</div>*/}
    </>
  );
}