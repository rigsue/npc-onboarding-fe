import { useState, useRef, useEffect } from "react";
import { getInitials } from "../utils/getInitials";
import { useToast } from "../context/ToastContext";
import { useSelector } from "react-redux";

const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Welcome Aboard!',
    date: 'July 20, 2026',
    message: "Welcome aboard! We're excited to have you join us. Complete your onboarding tasks to set up your account, learn about the company, and prepare for your first day.",
    actionLabel: null,
  },
  {
    id: 2,
    title: 'Pending Tasks',
    date: 'July 20, 2026',
    message: 'You still have mandatory onboarding tasks to complete. Finish them before the deadline to complete your onboarding successfully.',
    actionLabel: 'View Task',
  },
];

function MailIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 6l10 7 10-7" /></svg>;
}

function BellIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>;
}

export default function AdminHeaderActions() {
  const user = useSelector((state) => state.auth.user);
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const handleClearAll = () => {
    setNotifications([]);
    showToast('Notifications cleared');
  };

  return (
    <>
      <button type="button" className="admin-icon-btn" aria-label="Messages" onClick={(e) => e.preventDefault()}><MailIcon /></button>

      <div className="admin-notif-wrap" ref={wrapRef}>
        <button
          type="button"
          className="admin-icon-btn"
          aria-label="Notifications"
          aria-haspopup="true"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <BellIcon />
          {notifications.length > 0 && <span className="admin-icon-dot"></span>}
        </button>

        {open && (
          <div className="admin-notif-panel">
            {notifications.length === 0 ? (
              <p className="admin-notif-empty">No notifications</p>
            ) : (
              <>
                {notifications.map((n) => (
                  <div className="admin-notif-card" key={n.id}>
                    <div className="admin-notif-card-head">
                      <h4>{n.title}</h4>
                      <span>{n.date}</span>
                    </div>
                    <p>{n.message}</p>
                    {n.actionLabel && (
                      <a
                        href="#"
                        className="admin-notif-action"
                        onClick={(e) => { e.preventDefault(); showToast(`${n.actionLabel} isn\u2019t wired up yet`); }}
                      >
                        {n.actionLabel}
                      </a>
                    )}
                  </div>
                ))}
                <button type="button" className="admin-notif-clear" onClick={handleClearAll}>Clear All</button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="admin-avatar">
        {getInitials(`${user.first_name} ${user.last_name}`)}
      </div>
    </>
  );
}
