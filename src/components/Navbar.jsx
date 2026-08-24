import React from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';

function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

function ComingSoonLink({ className, children }) {
  return (
    <a href="#" className={className} onClick={(e) => e.preventDefault()}>
      {children}
    </a>
  );
}

const Navbar({ active }) => {
  const { profile } = useProfile();
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
            <ComingSoonLink className="active">HR Modules</ComingSoonLink>
            <ComingSoonLink>IT Modules</ComingSoonLink>
            <ComingSoonLink>Finance Modules</ComingSoonLink>
            <ComingSoonLink>Marketing Modules</ComingSoonLink>
            <ComingSoonLink>Pre-sales Modules</ComingSoonLink>
            <ComingSoonLink>Customer Success Modules</ComingSoonLink>
            <ComingSoonLink>Sales Modules</ComingSoonLink>
            <ComingSoonLink>PPM Modules</ComingSoonLink>
            <ComingSoonLink>OOC Modules</ComingSoonLink>
          </div>
        </div>
        <Link className={`nav-link${active === 'certifications' ? ' active' : ''}`} to="/certifications">Certifications</Link>
        <Link className={`nav-link${active === 'profile' ? ' active' : ''}`} to="/profile">Profile</Link>

        <span className="nav-indicator"></span>
      </nav>

      <div className="nav-actions">
        <a className="icon-btn" href="#" onClick={(e) => e.preventDefault()} aria-label="Notifications">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
            <path d="M10 20a2 2 0 0 0 4 0" />
          </svg>
          <span className="notif-dot"></span>
        </a>
        <div className="nav-dropdown avatar-dropdown">
          <button className="avatar" id="avatar-toggle" aria-haspopup="true" aria-expanded="false">
            {profile.photo ? (
              <img src={profile.photo} alt={profile.name} className="avatar-img" />
            ) : (
              getInitials(profile.name)
            )}
          </button>
          <div className="nav-dropdown-menu avatar-menu" id="avatar-menu">
            <Link to="/profile">Profile</Link>
            <Link to="/">Log out</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
export default Navbar;
