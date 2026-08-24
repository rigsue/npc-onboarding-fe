import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfilePhoto from '../components/ProfilePhoto';
import { useProfile } from '../context/ProfileContext';
import '../layout.css';
import './Profile.css';

const Profile = () => {
  const { profile } = useProfile();

  return (
    <div className="page-shell">
      <Navbar active="profile" />

      <main>
        <section className="profile-panel">

          <div className="profile-head">
            <ProfilePhoto />

            <div className="profile-details">
              <h1 className="profile-name">{profile.name}</h1>
              <p className="profile-role">{profile.role}</p>
              <p className="profile-contact">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 6l10 7 10-7" /></svg>
                {profile.email}
              </p>
              <p className="profile-contact">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8.1 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.9 2.2z" /></svg>
                {profile.phone}
              </p>
            </div>

            <Link className="manage-btn" to="/manageaccount">Manage your account</Link>
          </div>

          <div className="about-block">
            <h2>About</h2>
            <p>committed to ensuring secure, efficient, and uninterrupted IT operations while providing quality technical support to employees and company systems.</p>
          </div>

          <div className="progress-grid">


            <div className="progress-card">
              <h3>Onboarding Progress</h3>

              <div className="progress-item">
                <p className="progress-label">Learning Modules - 5/15</p>
                <div className="progress-row">
                  <div className="progress-bar">
                    <span className="seg filled"></span>
                    <span className="seg filled"></span>
                    <span className="seg"></span>
                    <span className="seg"></span>
                    <span className="seg"></span>
                    <span className="seg"></span>
                  </div>
                  <span className="progress-pct">33.33%</span>
                </div>
              </div>

              <div className="progress-item">
                <p className="progress-label">Assessment/Quiz - 5/15</p>
                <div className="progress-row">
                  <div className="progress-bar">
                    <span className="seg filled"></span>
                    <span className="seg filled"></span>
                    <span className="seg"></span>
                    <span className="seg"></span>
                    <span className="seg"></span>
                    <span className="seg"></span>
                  </div>
                  <span className="progress-pct">33.33%</span>
                </div>
              </div>
            </div>

            <div className="equipment-card">
              <h3>Assigned Equipments</h3>
              <label className="equip-row"><input type="checkbox" defaultChecked /><span className="equip-box"></span>Company Laptop</label>
              <label className="equip-row"><input type="checkbox" defaultChecked /><span className="equip-box"></span>External Monitor</label>
              <label className="equip-row"><input type="checkbox" defaultChecked /><span className="equip-box"></span>Keyboard and Mouse</label>
              <label className="equip-row"><input type="checkbox" /><span className="equip-box"></span>Headset</label>
              <label className="equip-row"><input type="checkbox" /><span className="equip-box"></span>Company ID</label>
            </div>

          </div>

          <div className="cert-panel">
            <h3>Certifications</h3>

            <Link className="cert-row" to="/certifications">
              <h4>Onboarding Completion</h4>
              <p>Awarded for successfully completing the company's onboarding program and meeting all onboarding requirements.</p>
            </Link>

            <Link className="cert-row" to="/certifications">
              <h4>Onboarding Completion</h4>
              <p>Awarded for successfully completing the company's onboarding program and meeting all onboarding requirements.</p>
            </Link>

            <Link className="cert-row" to="/certifications">
              <h4>Onboarding Completion</h4>
              <p>Awarded for successfully completing the company's onboarding program and meeting all onboarding requirements.</p>
            </Link>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
export default Profile;
