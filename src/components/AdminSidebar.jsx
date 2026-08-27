import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminIdentity, getInitials } from '../context/AdminIdentityContext';

export default function AdminSidebar({ active }) {
  const admin = useAdminIdentity();

  return (
    <aside className="admin-sidebar">
      <Link className="admin-logo" to="/admin">
        <img src="/assets/hpnavbarlogo.png" alt="Netrust Philippines Corporation" />
      </Link>

      <div className="admin-user-card">
        <div className="admin-user-card-top">
          <div className="admin-user-avatar">{getInitials(admin.name)}</div>
          <div>
            <p className="admin-user-name">{admin.name}</p>
            <p className="admin-user-role">{admin.role}</p>
            <p className="admin-user-dept">{admin.department}</p>
          </div>
        </div>
        <span className={`admin-level-pill${admin.isSuperAdmin ? ' super' : ''}`}>
          {admin.isSuperAdmin ? 'Super Admin' : 'Admin'}
        </span>
      </div>

      <nav className="admin-nav">
        <p className="admin-nav-label">Overview</p>
        <Link to="/admin" className={`admin-nav-link${active === 'dashboard' ? ' active' : ''}`}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>
          Dashboard
        </Link>

        <p className="admin-nav-label">Contents</p>
        <Link to="/admin/announcements" className={`admin-nav-link${active === 'announcements' ? ' active' : ''}`}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
          Announcement
        </Link>
        <Link to="/admin/materials" className={`admin-nav-link${active === 'materials' ? ' active' : ''}`}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
          Materials
        </Link>

        {admin.isSuperAdmin && (
          <>
            <p className="admin-nav-label">Profile</p>
            <Link to="/admin/users" className={`admin-nav-link${active === 'users' ? ' active' : ''}`}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="8" r="3.2" /><path d="M2.5 19c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" /><circle cx="17" cy="8" r="2.6" /><path d="M15 13.3c2.6.5 4.5 2.6 4.5 5.7" /></svg>
              Users
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
