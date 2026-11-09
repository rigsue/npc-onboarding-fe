import React from 'react';

export default function AdminFooter() {
  return (
    <footer className="admin-footer">
      <span>©2021 Netrust Philippines Corporation. All Rights Reserved.</span>
      <span className="admin-footer-links">
        <a href="#" onClick={(e) => e.preventDefault()}>Audit Log</a>
        <span> · </span>
        <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
        <span> · </span>
        <a href="#" onClick={(e) => e.preventDefault()}>Support</a>
      </span>
    </footer>
  );
}
