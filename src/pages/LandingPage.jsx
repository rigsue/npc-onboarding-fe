import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../layout.css';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <main>
        <div className="card">
          <div className="logo">
            <img className="logo-img" src="assets/logo.png" alt="Netrust Philippines Corporation" />
          </div>

          <Link className="btn-signin" to="/login">Sign In</Link>

          <div className="signup-row">
            Don't have an account yet?
            <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
export default LandingPage;
