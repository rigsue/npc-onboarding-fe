import { useDispatch } from "react-redux"
import { login } from "../redux/slice/authSlice";
import { loginUser } from "../services/authServices";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useAdminIdentity } from "../context/AdminIdentityContext";
import "../layout.css";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const adminIdentity = useAdminIdentity();
  const [role, setRole] = useState('user');
  const [adminLevel, setAdminLevel] = useState('super-admin');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      dispatch(
        login({
          user: data.user,
          token: data.token,
        })
      );
        if (role === 'admin') {
          adminIdentity.setLevel(adminLevel);
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } catch (error) {
        console.error("login failed:", error);
      }
  };

  return (
    <div className="auth-page">
      <main>
        <div className="auth-card">
          <Link className="close-btn" to="/" aria-label="Close">&times;</Link>

          <div className="card-logo">
            <img className="card-logo-mark" src="/assets/signinlogo.png" alt="Netrust Philippines Corporation" />
          </div>

          <h1 className="form-title">Sign In</h1>

          <div className="tabs" role="tablist">
            <button
              type="button"
              className={`tab${role === 'user' ? ' active' : ''}`}
              id="tab-user"
              role="tab"
              aria-selected={role === 'user'}
              onClick={() => setRole('user')}
            >
              User
            </button>
            <button
              type="button"
              className={`tab${role === 'admin' ? ' active' : ''}`}
              id="tab-admin"
              role="tab"
              aria-selected={role === 'admin'}
              onClick={() => setRole('admin')}
            >
              Admin
            </button>
          </div>

          {role === 'admin' && (
            <div 
              className="admin-level-row" 
              role="radiogroup" 
              aria-label="Admin account type"
            >
              <label className={`admin-level-option${adminLevel === 'admin' ? ' selected' : ''}`}>
                <input
                  type="radio"
                  name="admin-level"
                  checked={adminLevel === 'admin'}
                  onChange={() => setAdminLevel('admin')}
                />
                Admin
              </label>
              <label className={`admin-level-option${adminLevel === 'super-admin' ? ' selected' : ''}`}>
                <input
                  type="radio"
                  name="admin-level"
                  checked={adminLevel === 'super-admin'}
                  onChange={() => setAdminLevel('super-admin')}
                />
                Super Admin
              </label>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="email">Email address</label>
            <input 
              className="field-input" 
              type="email" 
              id="email" 
              name="email" 
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />

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
            <input 
              className="field-input" 
              type="password" id="password" 
              name="password" 
              autoComplete="current-password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="btn-submit">Sign in</button>

            <div className="options-row">
              <label className="remember-me">
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <a className="need-help" href="#">Need help?</a>
            </div>

            <div className="signup-line">
              Don't have an acount? <Link to="/signup">Sign up</Link>
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

export default Login;