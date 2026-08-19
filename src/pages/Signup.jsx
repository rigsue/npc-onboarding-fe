import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import '../layout.css';
import './Login.css';

export default function Signup() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="auth-page">
      <main>
        <div className="auth-card">
          <Link className="close-btn" to="/" aria-label="Close">&times;</Link>

          <div className="card-logo">
            <img className="card-logo-mark" src="assets/signuplogo.png" alt="Netrust Philippines Corporation" />
          </div>

          <h1 className="form-title">Sign Up</h1>

          <div className="tabs" role="tablist">
            <button type="button" className="tab active" id="tab-user">User</button>
            <button type="button" className="tab" id="tab-admin">Admin</button>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="fullname">Full name</label>
            <input className="field-input" type="text" id="fullname" name="fullname" autoComplete="name" />

            <label className="field-label" htmlFor="email">Email address</label>
            <input className="field-input" type="email" id="email" name="email" autoComplete="username" />

            <div className="field-row">
              <label className="field-label" htmlFor="password">Password</label>
              <span className="hide-toggle">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                  <line x1="3" y1="21" x2="21" y2="3" />
                </svg>
                <span>Hide</span>
              </span>
            </div>
            <input className="field-input" type="password" id="password" name="password" autoComplete="new-password" />

            <div className="field-row">
              <label className="field-label" htmlFor="confirm-password">Confirm password</label>
              <span className="hide-toggle">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                  <line x1="3" y1="21" x2="21" y2="3" />
                </svg>
                <span>Hide</span>
              </span>
            </div>
            <input className="field-input" type="password" id="confirm-password" name="confirm-password" autoComplete="new-password" />

            <button type="submit" className="btn-submit">Create account</button>

            <div className="options-row">
              <label className="remember-me">
                <input type="checkbox" />
                <span>I agree to the Terms and Conditions</span>
              </label>
            </div>

            <div className="signup-line">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>

            <p className="recaptcha-note">
              This page is protected by Google reCAPTCHA<br />
              to ensure you're not a bot. <a href="#">Learn more.</a>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
