import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfilePhoto from '../components/ProfilePhoto';
import { useProfile } from '../context/ProfileContext';
import { useToast } from '../context/ToastContext';
import '../layout.css';
import './ManageAccount.css';

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
  );
}

function ChevronIcon() {
  return (
    <svg className="row-chevron" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
  );
}

export default function ManageAccount() {
  const { profile, updateProfile } = useProfile();
  const { showToast } = useToast();
  const [headEditing, setHeadEditing] = useState(false);
  const [aboutEditing, setAboutEditing] = useState(false);
  const [openPanels, setOpenPanels] = useState({});

  const nameRef = useRef(null);
  const roleRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);

  const togglePanel = (id) => {
    setOpenPanels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleHeadEditing = () => {
    if (headEditing) {
      // Currently editing -> "Done" was clicked: save whatever's in the DOM now.
      updateProfile({
        name: nameRef.current.textContent.trim() || profile.name,
        role: roleRef.current.textContent.trim() || profile.role,
        email: emailRef.current.textContent.trim() || profile.email,
        phone: phoneRef.current.textContent.trim() || profile.phone,
      });
      showToast('Profile updated');
    }
    setHeadEditing((v) => !v);
  };

  return (
    <div className="page-shell">
      <Navbar active="profile" />

      <main>
        <section className="account-panel">

          <div className="profile-head">
            <ProfilePhoto />

            <div className="profile-details">
              <h1 className="profile-name" ref={nameRef} contentEditable={headEditing} suppressContentEditableWarning>{profile.name}</h1>
              <p className="profile-role" ref={roleRef} contentEditable={headEditing} suppressContentEditableWarning>{profile.role}</p>
              <p className="profile-contact">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 6l10 7 10-7" /></svg>
                <span ref={emailRef} contentEditable={headEditing} suppressContentEditableWarning>{profile.email}</span>
              </p>
              <p className="profile-contact">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8.1 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.9 2.2z" /></svg>
                <span ref={phoneRef} contentEditable={headEditing} suppressContentEditableWarning>{profile.phone}</span>
              </p>
            </div>

            <button className="edit-btn" id="edit-head" onClick={toggleHeadEditing}>
              <EditIcon />
              <span>{headEditing ? 'Done' : 'Edit'}</span>
            </button>
          </div>

          <div className="about-block">
            <div className="about-head">
              <h2>About</h2>
              <button className="edit-btn" id="edit-about" onClick={() => setAboutEditing((v) => !v)}>
                <EditIcon />
                <span>{aboutEditing ? 'Done' : 'Edit'}</span>
              </button>
            </div>

            <p contentEditable={aboutEditing} suppressContentEditableWarning id="about-text">committed to ensuring secure, efficient, and uninterrupted IT operations while providing quality technical support to employees and company systems.</p>
          </div>

          <div className="settings-grid">

            <div className="settings-card">
              <h3>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" /></svg>
                Account Security
              </h3>

              <div className="settings-item">
                <button className="settings-row" aria-expanded={!!openPanels['panel-password']} onClick={() => togglePanel('panel-password')}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
                  <span>Change Password</span>
                  <ChevronIcon />
                </button>
                <div className="settings-panel" hidden={!openPanels['panel-password']}>
                  <label>Current Password<input type="password" placeholder="Enter current password" /></label>
                  <label>New Password<input type="password" placeholder="Enter new password" /></label>
                  <label>Confirm New Password<input type="password" placeholder="Re-enter new password" /></label>
                  <button className="panel-save" type="button" onClick={() => showToast('Password updated')}>Save Password</button>
                </div>
              </div>

              <div className="settings-item">
                <button className="settings-row" aria-expanded={!!openPanels['panel-devices']} onClick={() => togglePanel('panel-devices')}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="12" rx="1" /><path d="M2 20h20" /></svg>
                  <span>Manage Devices</span>
                  <ChevronIcon />
                </button>
                <div className="settings-panel" hidden={!openPanels['panel-devices']}>
                  <div className="device-row">
                    <div>
                      <p className="device-name">Windows PC — Chrome</p>
                      <p className="device-meta">Makati City, PH · Current session</p>
                    </div>
                    <span className="device-tag">This device</span>
                  </div>
                  <div className="device-row">
                    <div>
                      <p className="device-name">iPhone 14 — Safari</p>
                      <p className="device-meta">Makati City, PH · Last active 2 days ago</p>
                    </div>
                    <button className="panel-remove">Remove</button>
                  </div>
                </div>
              </div>

              <div className="settings-item">
                <button className="settings-row" aria-expanded={!!openPanels['panel-history']} onClick={() => togglePanel('panel-history')}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
                  <span>Login History</span>
                  <ChevronIcon />
                </button>
                <div className="settings-panel" hidden={!openPanels['panel-history']}>
                  <div className="history-row"><span>Aug 6, 2026 — 9:14 AM</span><span>Chrome on Windows</span></div>
                  <div className="history-row"><span>Aug 4, 2026 — 6:02 PM</span><span>Safari on iPhone</span></div>
                  <div className="history-row"><span>Aug 1, 2026 — 8:47 AM</span><span>Chrome on Windows</span></div>
                </div>
              </div>
            </div>

            <div className="settings-card">
              <h3>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>
                Account Preferences
              </h3>

              <div className="settings-item">
                <button className="settings-row" aria-expanded={!!openPanels['panel-language']} onClick={() => togglePanel('panel-language')}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" /></svg>
                  <span>Language</span>
                  <ChevronIcon />
                </button>
                <div className="settings-panel" hidden={!openPanels['panel-language']}>
                  <label>Display Language
                    <select>
                      <option>English</option>
                      <option>Filipino</option>
                      <option>Cebuano</option>
                    </select>
                  </label>
                  <button className="panel-save" type="button" onClick={() => showToast('Language preference saved')}>Save Language</button>
                </div>
              </div>
            </div>

          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
