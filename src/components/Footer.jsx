import React from 'react';

export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-address">
          Unit 1, 24th Floor, Zuellig Building, Makati Avenue corner Paseo de<br />
          Roxas, Barangay Urdaneta, Makati City, 1225 Metro Manila,
        </div>

        <div className="footer-social">
          <a href="#" aria-label="Email">
            <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 6l10 7 10-7" /></svg>
          </a>
          <a href="#" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="2" width="20" height="20" rx="2" />
              <line x1="7" y1="10" x2="7" y2="17" />
              <circle cx="7" cy="6.5" r="0.6" fill="currentColor" />
              <path d="M11 17v-4.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5V17" />
              <line x1="11" y1="10" x2="11" y2="17" />
            </svg>
          </a>
          <a href="#" aria-label="Facebook">
            <svg viewBox="0 0 24 24"><path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h3l1-3h-4V9c0-.6.4-1 1-1z" /></svg>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <div>©2021 Netrust Philippines Corporation.&nbsp;&nbsp; All Rights Reserved.</div>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <span className="divider">|</span>
          <a href="#">Terms and Conditions</a>
        </div>
      </div>
    </footer>
  );
}
