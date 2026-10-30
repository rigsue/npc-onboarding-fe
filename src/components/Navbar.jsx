import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return '';

  return (
    parts[0][0] + (parts[1] ? parts[1][0] : '')
  ).toUpperCase();
}

const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    text: 'Your onboarding certificate is ready to download.',
    time: '2h ago',
  },
  {
    id: 2,
    text: 'New learning module was added to your onboarding journey.',
    time: '1d ago',
  },
  {
    id: 3,
    text: 'Reminder: finish your Assessment/Quiz to keep progressing.',
    time: '3d ago',
  },
];

export default function Navbar({ active }) {
  // Get authenticated user from Redux instead of ProfileContext.
  const user = useSelector((state) => state.auth.user);

  const [mobileOpen, setMobileOpen] = useState(false);

  const [notifications, setNotifications] = useState(() =>
    SAMPLE_NOTIFICATIONS.map((notification) => ({
      ...notification,
      read: false,
    }))
  );

  const firstName = user?.first_name ?? user?.firstName ?? '';
  const lastName = user?.last_name ?? user?.lastName ?? '';

  const displayName =
    [firstName, lastName].filter(Boolean).join(' ') ||
    user?.name ||
    user?.full_name ||
    user?.fullName ||
    user?.email ||
    'User';

  const profilePhoto =
    user?.profile_photo_url ??
    user?.photo_url ??
    user?.photo ??
    null;

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAllRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const closeMobileMenu = () => setMobileOpen(false);

  const navLinkClass = (section) =>
    `nav-link${active === section ? ' active' : ''}`;

  return (
    <header className="navbar">
      <Link
        className="nav-logo"
        to="/home"
        onClick={closeMobileMenu}
      >
        <img
          src="/assets/hpnavbarlogo.png"
          alt="Netrust Philippines Corporation"
        />
      </Link>

      <button
        type="button"
        className="navbar-hamburger"
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((previous) => !previous)}
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          {mobileOpen ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      <nav
        className={`nav-links${mobileOpen ? ' mobile-open' : ''}`}
      >
        <Link
          className={navLinkClass('home')}
          to="/home"
          onClick={closeMobileMenu}
        >
          Home
        </Link>

        <div className="nav-dropdown">
          <button
            type="button"
            className="nav-link nav-dropdown-toggle"
            id="onboarding-toggle"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Modules

            <svg
              className="chevron"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <div
            className="nav-dropdown-menu"
            id="onboarding-menu"
          >
            <Link
              className={navLinkClass('hr')}
              to="/hr"
              onClick={closeMobileMenu}
            >
              People &amp; Culture
            </Link>

            <Link
              className={navLinkClass('it')}
              to="/it"
              onClick={closeMobileMenu}
            >
              Service Delivery
            </Link>

            <Link
              className={navLinkClass('finance')}
              to="/finance"
              onClick={closeMobileMenu}
            >
              Accounting &amp; Finance
            </Link>

            <Link
              className={navLinkClass('marketing')}
              to="/marketing"
              onClick={closeMobileMenu}
            >
              Marketing
            </Link>

            <Link
              className={navLinkClass('preSales')}
              to="/presales"
              onClick={closeMobileMenu}
            >
              Presales
            </Link>

            <Link
              className={navLinkClass('customerSuccess')}
              to="/customerSuccess"
              onClick={closeMobileMenu}
            >
              Customer Success
            </Link>

            <Link
              className={navLinkClass('sales')}
              to="/sales"
              onClick={closeMobileMenu}
            >
              Sales
            </Link>

            <Link
              className={navLinkClass('ppm')}
              to="/ppm"
              onClick={closeMobileMenu}
            >
              Project Management
            </Link>

            <Link
              className={navLinkClass('ooc')}
              to="/ooc"
              onClick={closeMobileMenu}
            >
              Office of the CEO
            </Link>
          </div>
        </div>

        <Link
          className={navLinkClass('certifications')}
          to="/certifications"
          onClick={closeMobileMenu}
        >
          Certifications
        </Link>

        <Link
          className={navLinkClass('profile')}
          to="/profile"
          onClick={closeMobileMenu}
        >
          Profile
        </Link>

        <span className="nav-indicator" />
      </nav>

      <div className="nav-actions">
        {/* Notifications */}
        <div className="nav-dropdown">
          <button
            type="button"
            className="icon-btn"
            aria-label={`Notifications, ${unreadCount} unread`}
            aria-haspopup="true"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
              <path d="M10 20a2 2 0 0 0 4 0" />
            </svg>

            {unreadCount > 0 && (
              <span className="notif-dot" />
            )}
          </button>

          <div className="nav-dropdown-menu notif-menu">
            <div className="notif-menu-head">
              <span>Notifications</span>

              {unreadCount > 0 && (
                <button
                  type="button"
                  className="notif-mark-read"
                  onClick={markAllRead}
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="notif-list">
              {notifications.length === 0 ? (
                <p className="notif-empty">
                  No notifications
                </p>
              ) : (
                notifications.map((notification) => (
                  <div
                    className={`notif-item${
                      notification.read ? '' : ' unread'
                    }`}
                    key={notification.id}
                  >
                    <p className="notif-text">
                      {notification.text}
                    </p>

                    <span className="notif-time">
                      {notification.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* User avatar */}
        <div className="nav-dropdown avatar-dropdown">
          <button
            type="button"
            className="avatar"
            id="avatar-toggle"
            aria-label={`Open account menu for ${displayName}`}
            aria-haspopup="true"
            aria-expanded="false"
          >
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={displayName}
                className="avatar-img"
              />
            ) : (
              getInitials(displayName)
            )}
          </button>

          <div
            className="nav-dropdown-menu avatar-menu"
            id="avatar-menu"
          >
            <Link to="/profile">
              Profile
            </Link>

            <Link to="/">
              Log out
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}