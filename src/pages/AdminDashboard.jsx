import React, { useState, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeaderActions from '../components/AdminHeaderActions';
import AdminFooter from '../components/AdminFooter';
import { useAdminIdentity } from '../context/AdminIdentityContext';
import '../components/AdminLayout.css';
import './AdminDashboard.css';

const PAGE_SIZE = 7;

const QUEUE = [
  { name: 'Miguel Santos', position: 'IT Associate', department: 'IT', start: 'Jun 17, 2026', end: 'Aug 17, 2026', progress: 0, status: 'upcoming' },
  { name: 'Andrea Villanueva', position: 'Sales Associate', department: 'Sales', start: 'Jun 17, 2026', end: 'Aug 17, 2026', progress: 90, status: 'in-progress' },
  { name: 'Renz Aquino', position: 'Accounting Associate', department: 'Finance', start: 'Jun 17, 2026', end: 'Aug 17, 2026', progress: 50, status: 'in-progress' },
  { name: 'Katrina Bautista', position: 'Marketing Associate', department: 'Marketing', start: 'Jun 17, 2026', end: 'Aug 17, 2026', progress: 95, status: 'completed' },
  { name: 'Paolo Ramirez', position: 'Accounting Associate', department: 'Finance', start: 'Jun 17, 2026', end: 'Aug 17, 2026', progress: 95, status: 'overdue' },
  { name: 'Cristine Del Rosario', position: 'Accounting Associate', department: 'Finance', start: 'Jun 17, 2026', end: 'Aug 17, 2026', progress: 0, status: 'upcoming' },
  { name: 'Joshua Mercado', position: 'IT Associate', department: 'IT', start: 'Jun 17, 2026', end: 'Aug 17, 2026', progress: 0, status: 'upcoming' },
  { name: 'Bea Navarro', position: 'Marketing Associate', department: 'Marketing', start: 'Jun 17, 2026', end: 'Aug 17, 2026', progress: 0, status: 'upcoming' },
  { name: 'Rico Domingo', position: 'IT Associate', department: 'IT', start: 'Jun 17, 2026', end: 'Aug 17, 2026', progress: 0, status: 'upcoming' },
  { name: 'Samantha Cruz', position: 'Sales Associate', department: 'Sales', start: 'Jun 17, 2026', end: 'Aug 17, 2026', progress: 20, status: 'in-progress' },
];

const DEPARTMENT_SUMMARIES = ['Finance', 'IT', 'Sales', 'Marketing', 'SDG'];

function StatusPill({ status }) {
  const labels = {
    upcoming: 'UPCOMING',
    'in-progress': 'IN PROGRESS',
    completed: 'COMPLETED',
    overdue: 'OVERDUE',
  };
  return <span className={`status-pill status-${status}`}>{labels[status]}</span>;
}

function MailIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 6l10 7 10-7" /></svg>;
}

function PhoneIcon() {
  return <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8.1 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.9 2.2z" /></svg>;
}

export default function AdminDashboard() {
  const admin = useAdminIdentity();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deptOpen, setDeptOpen] = useState(false);
  const [department, setDepartment] = useState(admin.isSuperAdmin ? 'Finance' : admin.departmentKey);

  const scopedQueue = useMemo(
    () => (admin.isSuperAdmin ? QUEUE : QUEUE.filter((row) => row.department === admin.departmentKey)),
    [admin.isSuperAdmin, admin.departmentKey]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return scopedQueue;
    return scopedQueue.filter((row) =>
      [row.name, row.position, row.department, row.status].some((field) =>
        field.toLowerCase().includes(q)
      )
    );
  }, [search, scopedQueue]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, filtered.length);
  const stillInProgressCount = scopedQueue.filter((row) => row.status !== 'completed').length;

  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const headerTitle = admin.isSuperAdmin ? 'Admin Dashboard' : `${admin.departmentKey} Dashboard`;

  return (
    <div className="admin-shell">
      <AdminSidebar active="dashboard" />

      <div className="admin-main">
        <header className="admin-header">
          <div>
            <div className="admin-header-title-row">
              <h1>{headerTitle}</h1>
              {!admin.isSuperAdmin && (
                <span className="admin-mode-pill">
                  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
                  ADMIN MODE
                </span>
              )}
            </div>
            <p className="admin-date">{today}</p>
          </div>
          <div className="admin-header-actions">
            <div className="admin-search">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
              <input type="text" placeholder="Search department, roles etc" />
            </div>
            <AdminHeaderActions />
          </div>
        </header>

        {stillInProgressCount > 0 && (
          <div className="admin-alert">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></svg>
            <span><strong>{stillInProgressCount} Employee Onboarding</strong> {stillInProgressCount === 1 ? 'is' : 'are'} still in progress.</span>
            <a href="#" className="admin-alert-link" onClick={(e) => e.preventDefault()}>Review now →</a>
          </div>
        )}

        <div className="admin-body">
          <section className="admin-queue">
            <div className="admin-queue-head">
              <h2>Onboarding queue</h2>
              <div className="admin-queue-search">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
                <input
                  type="text"
                  placeholder="Search Onboarding Employees, Status, etc"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Current Department</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Module Progress</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((row) => (
                    <tr key={row.name}>
                      <td><a href="#" className="admin-row-name" onClick={(e) => e.preventDefault()}>{row.name}</a></td>
                      <td>{row.position}</td>
                      <td>{row.department}</td>
                      <td>{row.start}</td>
                      <td>{row.end}</td>
                      <td>
                        <div className="admin-progress">
                          <div className="admin-progress-track">
                            <div className="admin-progress-fill" style={{ width: `${row.progress}%` }}></div>
                          </div>
                          <span>{row.progress}%</span>
                        </div>
                      </td>
                      <td><StatusPill status={row.status} /></td>
                    </tr>
                  ))}
                  {pageRows.length === 0 && (
                    <tr>
                      <td colSpan={7} className="admin-table-empty">No employees match "{search}".</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="admin-pagination">
              <span>{filtered.length === 0 ? 'No results' : `Showing ${rangeStart}-${rangeEnd} of ${filtered.length} Users`}</span>
              <div className="admin-page-btns">
                <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} aria-label="Previous page">‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={n === safePage ? 'active' : ''}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} aria-label="Next page">›</button>
              </div>
            </div>
          </section>

          <aside className="admin-side">
            <div className="admin-card">
              <div className="admin-card-head">
                <h3>{department} Onboarding Summary</h3>
                {admin.isSuperAdmin && (
                  <button type="button" className="admin-dept-toggle" onClick={() => setDeptOpen((v) => !v)} aria-haspopup="true" aria-expanded={deptOpen}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>
                )}
                {admin.isSuperAdmin && deptOpen && (
                  <div className="admin-dept-menu">
                    {DEPARTMENT_SUMMARIES.map((d) => (
                      <button
                        key={d}
                        type="button"
                        className={d === department ? 'active' : ''}
                        onClick={() => { setDepartment(d); setDeptOpen(false); }}
                      >
                        {d} Onboarding Summary
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <ul className="admin-summary-list">
                <li><span>Awaiting Review</span><span className="admin-summary-count">3</span></li>
                <li><span>Verify Employee Requirements</span><span className="admin-summary-count">2</span></li>
                <li><span>{department} Orientation</span><span className="admin-summary-count">2</span></li>
              </ul>

              <div className="admin-overdue">
                <span>Overdue Tasks</span>
                <span className="admin-overdue-count">1</span>
              </div>
            </div>

            <div className="admin-spotlight-card">
              <div className="admin-spotlight-head">
                <div className="admin-spotlight-avatar">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" /></svg>
                </div>
                <div>
                  <p className="admin-spotlight-name">John Doe <StatusPill status="in-progress" /></p>
                  <p className="admin-spotlight-contact"><MailIcon /> JohnDoe@netrust.com.ph</p>
                  <p className="admin-spotlight-contact"><PhoneIcon /> +63 906 5389 280</p>
                </div>
              </div>

              <div className="admin-progress-label-bar">Onboarding Progress</div>

              <div className="admin-onboard-stat">
                <p className="admin-onboard-stat-label">Learning Modules - 5/15</p>
                <div className="admin-onboard-stat-row">
                  <div className="admin-onboard-segbar">
                    {[1, 1, 0, 0, 0, 0].map((filled, i) => (
                      <span key={i} className={`admin-seg${filled ? ' filled' : ''}`}></span>
                    ))}
                  </div>
                  <span className="admin-onboard-pct">33.33%</span>
                </div>
              </div>

              <div className="admin-onboard-stat">
                <p className="admin-onboard-stat-label">Assessment/Quiz - 5/15</p>
                <div className="admin-onboard-stat-row">
                  <div className="admin-onboard-segbar">
                    {[1, 1, 0, 0, 0, 0].map((filled, i) => (
                      <span key={i} className={`admin-seg${filled ? ' filled' : ''}`}></span>
                    ))}
                  </div>
                  <span className="admin-onboard-pct">33.33%</span>
                </div>
              </div>

              <p className="admin-certs">Certificates: <span>–</span></p>
            </div>
          </aside>
        </div>

        <AdminFooter />
      </div>
    </div>
  );
}
