import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../layout.css';
import './Certifications.css';

const CERTS = [
  {
    id: 1,
    name: 'John Doe',
    reason: 'For participating in the Onboarding Journey',
    signatures: [
      { name: 'John Doe', role: 'CEO & Founder' },
      { name: 'John Doe', role: 'Director' },
    ],
    infoTitle: 'Certificate of Onboarding Completion',
    infoDescription: "Awarded for successfully completing the company's onboarding program and meeting all onboarding requirements.",
  },
  {
    id: 2,
    name: 'John Doe',
    reason: 'For participating in the Onboarding Journey',
    signatures: [
      { name: 'John Doe', role: 'CEO & Founder' },
      { name: 'John Doe', role: 'Director' },
    ],
    infoTitle: 'Certificate of Onboarding Completion',
    infoDescription: "Awarded for successfully completing the company's onboarding program and meeting all onboarding requirements.",
  },
];

function CertThumb({ cert, onOpen }) {
  const interactiveProps = onOpen
    ? {
        tabIndex: 0,
        role: 'button',
        'aria-label': 'View certificate',
        onClick: onOpen,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        },
      }
    : {};

  return (
    <div className="cert-thumb" {...interactiveProps}>
      <div className="cert-corner cert-corner-tr"></div>
      <div className="cert-corner cert-corner-bl"></div>
      <div className="cert-corner-tip cert-corner-tip-tr"></div>
      <div className="cert-corner-tip cert-corner-tip-bl"></div>
      <div className="cert-body">
        <div className="cert-medal">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="#d4af37"><circle cx="12" cy="9" r="6" /><path d="M9 14l-2 7 5-3 5 3-2-7" /></svg>
        </div>
        <h3 className="cert-title">CERTIFICATE</h3>
        <p className="cert-subtitle">OF COMPLETION</p>
        <p className="cert-presented">This certificate is presented to</p>
        <p className="cert-name">{cert.name}</p>
        <p className="cert-reason">{cert.reason}</p>
        <div className="cert-signatures">
          {cert.signatures.map((sig, i) => (
            <div className="cert-sign" key={i}>
              <span className="cert-sign-name">{sig.name}</span>
              <span className="cert-sign-role">{sig.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Certifications() {
  const [openCertId, setOpenCertId] = useState(null);
  const [printingCertId, setPrintingCertId] = useState(null);

  const openCert = CERTS.find((c) => c.id === openCertId) || null;
  const printingCert = CERTS.find((c) => c.id === printingCertId) || null;

  // Trigger the browser print dialog once the print-only certificate has rendered.
  // From there the person can choose "Save as PDF" to download it.
  useEffect(() => {
    if (printingCertId === null) return;
    const timer = setTimeout(() => {
      window.print();
      setPrintingCertId(null);
    }, 50);
    return () => clearTimeout(timer);
  }, [printingCertId]);

  // Close the modal on Escape.
  useEffect(() => {
    if (openCertId === null) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpenCertId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openCertId]);

  return (
    <>
      <Navbar active="certifications" />

      <main>
        <section className="cert-list">
          {CERTS.map((cert) => (
            <article className="cert-card" key={cert.id}>
              <CertThumb cert={cert} onOpen={() => setOpenCertId(cert.id)} />

              <div className="cert-info">
                <h2><a href="#">{cert.infoTitle}</a></h2>
                <p>{cert.infoDescription}</p>
              </div>

              <button
                type="button"
                className="cert-download"
                aria-label="Download certificate"
                title="Download certificate"
                onClick={() => setPrintingCertId(cert.id)}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 3v12" />
                  <path d="M6 11l6 6 6-6" />
                  <path d="M5 21h14" />
                </svg>
              </button>
            </article>
          ))}
        </section>
      </main>

      {openCert && (
        <div className="cert-modal-overlay" id="cert-modal" onClick={() => setOpenCertId(null)}>
          <div className="cert-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="cert-modal-close" id="cert-modal-close" aria-label="Close" onClick={() => setOpenCertId(null)}>&times;</button>
            <div className="cert-modal-thumb" id="cert-modal-thumb">
              <CertThumb cert={openCert} />
            </div>
            <button className="cert-modal-download" id="cert-modal-download" onClick={() => setPrintingCertId(openCert.id)}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 3v12" />
                <path d="M6 11l6 6 6-6" />
                <path d="M5 21h14" />
              </svg>
              Download
            </button>
          </div>
        </div>
      )}

      <div id="print-area">
        {printingCert && <CertThumb cert={printingCert} />}
      </div>

      <Footer />
    </>
  );
}
