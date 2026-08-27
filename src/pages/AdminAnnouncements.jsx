import React, { useState, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeaderActions from '../components/AdminHeaderActions';
import AdminFooter from '../components/AdminFooter';
import { useToast } from '../context/ToastContext';
import { useAdminIdentity } from '../context/AdminIdentityContext';
import '../components/AdminLayout.css';
import './AdminAnnouncements.css';

const CATEGORIES = ['General', 'Finance', 'IT', 'HR', 'Sales', 'Marketing'];
const SUPER_ADMIN_ONLY_CATEGORIES = ['HR/Admin Update'];

const INITIAL_ANNOUNCEMENTS = [
  {
    id: 1,
    category: 'General',
    status: 'published',
    title: 'Finance Orientation is Ready',
    message: "Welcome to the Finance Department! We are excited to have you join our team. Please complete your assigned onboarding tasks and attend all scheduled orientation sessions.",
    date: 'July 30, 2026',
  },
  {
    id: 2,
    category: 'Finance',
    status: 'draft',
    title: 'Finance Orientation is Ready',
    message: "Welcome to the Finance Department! We are excited to have you join our team. Please complete your assigned onboarding tasks and attend all scheduled orientation sessions.",
    date: 'July 30, 2026',
  },
  {
    id: 3,
    category: 'General',
    status: 'scheduled',
    title: 'Finance Orientation is Ready',
    message: "Welcome to the Finance Department! We are excited to have you join our team. Please complete your assigned onboarding tasks and attend all scheduled orientation sessions.",
    date: 'July 30, 2026',
  },
  {
    id: 4,
    category: 'General',
    status: 'scheduled',
    title: 'Finance Orientation is Ready',
    message: "Welcome to the Finance Department! We are excited to have you join our team. Please complete your assigned onboarding tasks and attend all scheduled orientation sessions.",
    date: 'July 30, 2026',
  },
  {
    id: 5,
    category: 'General',
    status: 'published',
    title: 'Finance Orientation is Ready',
    message: "Welcome to the Finance Department! We are excited to have you join our team. Please complete your assigned onboarding tasks and attend all scheduled orientation sessions.",
    date: 'July 30, 2026',
  },
];

const STATUS_LABELS = {
  published: 'PUBLISHED',
  scheduled: 'SCHEDULED',
  draft: 'DRAFT',
};

function PostAnnouncementModal({ onClose, onPost, categoryOptions, defaultCategory, audienceNote }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [when, setWhen] = useState('now');

  const handlePost = () => {
    if (!title.trim()) return;
    const status = when === 'now' ? 'published' : when === 'schedule' ? 'scheduled' : 'draft';
    onPost({ title: title.trim(), message: message.trim(), category, status });
  };

  return (
    <div className="announce-modal-overlay" onClick={onClose}>
      <div className="announce-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="announce-modal-head">
          <h2>POST ANNOUNCEMENT</h2>
          <button type="button" className="announce-modal-close" aria-label="Close" onClick={onClose}>&times;</button>
        </div>

        <div className="announce-modal-body">
          <label className="announce-field">
            <div className="announce-field-label">
              <span>Title</span>
              <span className="announce-char-count">{title.length}/80</span>
            </div>
            <input
              type="text"
              placeholder="Welcome to Netrust!"
              value={title}
              maxLength={80}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="announce-field">
            <div className="announce-field-label">
              <span>Message</span>
              <span className="announce-char-count">{message.length}/400</span>
            </div>
            <textarea
              placeholder="What do people need to know?"
              value={message}
              maxLength={400}
              rows={5}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>

          <div className="announce-field-row">
            <label className="announce-field">
              <div className="announce-field-label"><span>Category</span></div>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <div className="announce-field">
              <div className="announce-field-label"><span>When</span></div>
              <div className="announce-when-group">
                <button type="button" className={when === 'now' ? 'active' : ''} onClick={() => setWhen('now')}>Publish now</button>
                <button type="button" className={when === 'schedule' ? 'active' : ''} onClick={() => setWhen('schedule')}>Schedule</button>
                <button type="button" className={when === 'draft' ? 'active' : ''} onClick={() => setWhen('draft')}>Save Draft</button>
              </div>
            </div>
          </div>

          {audienceNote && <p className="announce-audience-note">{audienceNote}</p>}
        </div>

        <div className="announce-modal-footer">
          <button type="button" className="announce-cancel-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="announce-post-btn" onClick={handlePost} disabled={!title.trim()}>Post Announcement</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminAnnouncements() {
  const { showToast } = useToast();
  const admin = useAdminIdentity();
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const categoryOptions = admin.isSuperAdmin
    ? [...CATEGORIES, ...SUPER_ADMIN_ONLY_CATEGORIES]
    : ['General', admin.departmentKey];

  const scoped = useMemo(
    () => (admin.isSuperAdmin ? announcements : announcements.filter((a) => a.category === 'General' || a.category === admin.departmentKey)),
    [announcements, admin.isSuperAdmin, admin.departmentKey]
  );

  const counts = useMemo(() => ({
    all: scoped.length,
    published: scoped.filter((a) => a.status === 'published').length,
    scheduled: scoped.filter((a) => a.status === 'scheduled').length,
    draft: scoped.filter((a) => a.status === 'draft').length,
  }), [scoped]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return scoped.filter((a) => {
      const matchesFilter = filter === 'all' || a.status === filter;
      const matchesSearch = !q || a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [scoped, filter, search]);

  const handleDelete = (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('Announcement deleted');
  };

  const handlePost = (draft) => {
    const nextId = Math.max(0, ...announcements.map((a) => a.id)) + 1;
    setAnnouncements((prev) => [
      {
        id: nextId,
        category: draft.category,
        status: draft.status,
        title: draft.title || 'Untitled announcement',
        message: draft.message,
        date: new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }),
      },
      ...prev,
    ]);
    setModalOpen(false);
    const toastText = draft.status === 'published'
      ? 'Announcement published'
      : draft.status === 'scheduled'
        ? 'Announcement scheduled'
        : 'Draft saved';
    showToast(toastText);
  };

  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="admin-shell">
      <AdminSidebar active="announcements" />

      <div className="admin-main">
        <header className="announce-banner">
          <div>
            <h1>Department Announcement</h1>
            <p>Create and manage department announcements, reminders, and onboarding updates for employees assigned to your department.</p>
          </div>
          <div className="admin-header-actions">
            <AdminHeaderActions />
          </div>
        </header>

        <div className="announce-body">
          <div className="announce-toolbar">
            <span className="announce-date-pill">{today}</span>
            <button type="button" className="announce-new-btn" onClick={() => setModalOpen(true)}>+ New Announcements</button>
          </div>

          <div className="announce-controls">
            <div className="announce-tabs">
              <button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All {counts.all}</button>
              <button type="button" className={filter === 'published' ? 'active' : ''} onClick={() => setFilter('published')}>Published {counts.published}</button>
              <button type="button" className={filter === 'scheduled' ? 'active' : ''} onClick={() => setFilter('scheduled')}>Scheduled {counts.scheduled}</button>
              <button type="button" className={filter === 'draft' ? 'active' : ''} onClick={() => setFilter('draft')}>Draft {counts.draft}</button>
            </div>

            <div className="announce-search">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
              <input
                type="text"
                placeholder="Search department, roles etc"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="announce-grid">
            {visible.map((a) => (
              <article className="announce-card" key={a.id}>
                <div className="announce-card-head">
                  <span className="announce-category-pill">{a.category}</span>
                  <span className={`announce-status-pill status-${a.status}`}>{STATUS_LABELS[a.status]}</span>
                </div>
                <h3>{a.title}</h3>
                <p>{a.message}</p>
                <div className="announce-card-foot">
                  <span>{a.date}</span>
                  <div className="announce-card-actions">
                    <button type="button" aria-label="Edit" onClick={() => showToast('Editing isn\u2019t wired up yet')}>
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
                    </button>
                    <button type="button" aria-label="Delete" onClick={() => handleDelete(a.id)}>
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {visible.length === 0 && (
              <p className="announce-empty">No announcements match your filters.</p>
            )}
          </div>
        </div>

        <AdminFooter />
      </div>

      {modalOpen && (
        <PostAnnouncementModal
          onClose={() => setModalOpen(false)}
          onPost={handlePost}
          categoryOptions={categoryOptions}
          defaultCategory={admin.isSuperAdmin ? 'General' : admin.departmentKey}
          audienceNote={admin.isSuperAdmin ? undefined : `Visible to Local Users in ${admin.department} and General announcements.`}
        />
      )}
    </div>
  );
}
