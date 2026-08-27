import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import '../layout.css';
import './Home.css';

const HERO_SLIDES = [
  '/assets/hp.jpg',
  '/assets/hp2.jpg',
  '/assets/hp3.jpg',
];

export default function Home() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slide]);

  return (
    <div className="page-shell">
      <Navbar active="home" />
      <main>

        {/* Hero carousel */}
        <section className="hero-wrap">
          <div className="hero-slide">
            <img key={slide} className="content-image hero-fade" src={HERO_SLIDES[slide]} alt="Netrust hero banner" />
            <div className="hero-dots">
              {HERO_SLIDES.map((_, i) => (
                <span
                  key={i}
                  className={`dot${i === slide ? ' active' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Show slide ${i + 1}`}
                  onClick={() => setSlide(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSlide(i);
                    }
                  }}
                ></span>
              ))}
            </div>
          </div>
        </section>

        {/* Welcome */}
        <section className="welcome">
          <h1 className="welcome-title">Welcome to the Team, <span>NETS!</span></h1>
          <a className="onboarding-pill" href="#">Proceed to your Onboarding Journey &gt;&gt;&gt;</a>
        </section>

        {/* Purpose section */}
        <section className="content-row">
          <img className="content-image" src="/assets/1pic.jpg" alt="Trust has changed campaign graphic" />
          <div className="content-text">
            <h2>Keeping the Digital World Safe</h2>
            <p>Netrust Philippines Corporation's purpose is to create a world where businesses, government organizations and individuals can securely transact in the digital space – through a wide range of Cybersecurity solutions that address multitudes of pain points and compliances.</p>

            <h2>Security Made Simple</h2>
            <p>Digital security can be difficult. That's why the goal of Netrust Philippines is to be a partner and not simply a solutions provider. So, we can help make security solutions easy to evaluate, easy to deploy, and easy to manage for organizations.</p>
          </div>
        </section>

        {/* Moving forward band */}
        <section className="moving-forward">
          <h2>Moving Forward</h2>
          <p>As the digital security landscape continue to evolve, trust that Netrust will continue to help organizations strengthen the security of their users, applications and data – without the need for compromise between security and agility.</p>
        </section>

        {/* Strengthen section */}
        <section className="content-row reverse">
          <div className="content-text">
            <h3 className="pill-heading">Strengthen the Security of your Users,<br />Applications and Data with Netrust</h3>

            <div className="feature-block">
              <h4>Secure Identity and Access</h4>
              <p>Trusted digital identity for individuals and machines, and access that is controlled prevents data breaches and fraudulent transactions.</p>
            </div>

            <div className="feature-block">
              <h4>Application Security</h4>
              <p>For secure online activities, application vulnerabilities must be identified and remediated early on before they are exploited.</p>
            </div>

            <div className="feature-block">
              <h4>Data Protection</h4>
              <p>Data - in motion and at rest - must be protected anywhere they are - within and beyond the confines of the office or in the cloud.</p>
            </div>
          </div>

          <img className="content-image" src="/assets/2pic.jpg" alt="Trust has changed campaign graphic" />
        </section>

      </main>

      <Footer />
    </div>
  );
}
