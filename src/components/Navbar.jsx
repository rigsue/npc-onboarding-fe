import React, { useState } from 'react';
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

const SAMPLE_NOTIFICATIONS = [
  { id: 1, text: 'Your onboarding certificate is ready to download.', time: '2h ago' },
  { id: 2, text: 'New learning module was added to your onboarding journey.', time: '1d ago' },
  { id: 3, text: 'Reminder: finish your Assessment/Quiz to keep progressing.', time: '3d ago' },
];

export default function Navbar({ active }) {
  const { profile } = useProfile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState(
    SAMPLE_NOTIFICATIONS.map((n) => ({ ...n, read: false }))
  );

  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <header className="navbar">
      <Link className="nav-logo" to="/home">
        <img src="/assets/hpnavbarlogo.png" alt="Netrust Philippines Corporation" />
      </Link>

      <button
        className="navbar-hamburger"
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((v) => !v)}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          {mobileOpen ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      <nav className={`nav-links${mobileOpen ? ' mobile-open' : ''}`}>
        <Link className={`nav-link${active === 'home' ? ' active' : ''}`} to="/home" onClick={() => setMobileOpen(false)}>Home</Link>
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
        <Link className={`nav-link${active === 'certifications' ? ' active' : ''}`} to="/certifications" onClick={() => setMobileOpen(false)}>Certifications</Link>
        <Link className={`nav-link${active === 'profile' ? ' active' : ''}`} to="/profile" onClick={() => setMobileOpen(false)}>Profile</Link>

        <span className="nav-indicator"></span>
      </nav>

      <div className="nav-actions">
        <div className="nav-dropdown">
          <button className="icon-btn" aria-label="Notifications" aria-haspopup="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
              <path d="M10 20a2 2 0 0 0 4 0" />
            </svg>
            {unreadCount > 0 && <span className="notif-dot"></span>}
          </button>
          <div className="nav-dropdown-menu notif-menu">
            <div className="notif-menu-head">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <button type="button" className="notif-mark-read" onClick={markAllRead}>
                  Mark all as read
                </button>
              )}
            </div>
            <div className="notif-list">
              {notifications.length === 0 ? (
                <p className="notif-empty">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div className={`notif-item${n.read ? '' : ' unread'}`} key={n.id}>
                    <p className="notif-text">{n.text}</p>
                    <span className="notif-time">{n.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
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
// comments
