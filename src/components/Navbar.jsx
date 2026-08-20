import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ active }) {
  return (
    <header className="navbar">
      <Link className="nav-logo" to="/home">
        <img src="assets/hpnavbarlogo.png" alt="Netrust Philippines Corporation" />
      </Link>

      <nav className="nav-links">
        <Link className={`nav-link${active === 'home' ? ' active' : ''}`} to="/home">Home</Link>
        <div className="nav-dropdown">
          <button className="nav-link nav-dropdown-toggle" id="onboarding-toggle" aria-haspopup="true" aria-expanded="false">
            Onboarding
            <svg className="chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div className="nav-dropdown-menu" id="onboarding-menu">
            <Link to="/hr" className="active">HR Modules</Link>
            <Link to="/it">IT Modules</Link>
            <Link to="/finance">Finance Modules</Link>
            <Link to="/marketing">Marketing Modules</Link>
            <Link to="/presales">Pre-sales Modules</Link>
            <Link to="/customersuccess">Customer Success Modules</Link>
            <Link to="/sales">Sales Modules</Link>
            <Link to="/ppm">PPM Modules</Link>
            <Link to="/ooc">OOC Modules</Link>
          </div>
        </div>
        <Link className={`nav-link${active === 'certifications' ? ' active' : ''}`} to="/certifications">Certifications</Link>
        <Link className={`nav-link${active === 'profile' ? ' active' : ''}`} to="/profile">Profile</Link>

        <span className="nav-indicator"></span>
      </nav>

      <div className="nav-actions">
        <a className="icon-btn" href="notifications.html" aria-label="Notifications">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
            <path d="M10 20a2 2 0 0 0 4 0" />
          </svg>
          <span className="notif-dot"></span>
        </a>
        <div className="nav-dropdown avatar-dropdown">
          <button className="avatar" id="avatar-toggle" aria-haspopup="true" aria-expanded="false">JD</button>
          <div className="nav-dropdown-menu avatar-menu" id="avatar-menu">
            <Link to="/profile">Profile</Link>
            <Link to="/">Log out</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
