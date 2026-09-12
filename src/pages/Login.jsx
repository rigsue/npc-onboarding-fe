import { useDispatch } from "react-redux"
import { login } from "../redux/auth/authSlice";
import { setCurrentView } from "../redux/ui/uiSlice";
import { loginUser } from "../services/authServices";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../layout.css";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const data = await loginUser(email, password);

      dispatch(
        login({
          user: data.user,
          token: data.token,
        })
      );
        if (data.user.role_name === "super_admin") {
          dispatch(setCurrentView("super_admin"));
          navigate("/superadmin");
        } else if (data.user.role_name === "admin"){
          dispatch(setCurrentView("admin"));
          navigate("/admin");
        } else if(data.user.role_name === "local_user"){
          dispatch(setCurrentView("local_user"));
          navigate('/home');
        }
      } catch (error) {
        console.error("Login failed:", error);
        setError(error.message || "Login failed, please try again.");
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="auth-page">
      <main>
        <div className="auth-card">
          <Link className="close-btn" to="/" aria-label="Close">
            &times;
          </Link>

          <div className="card-logo">
            <img 
              className="card-logo-mark" 
              src="/assets/signinlogo.png" 
              alt="Netrust Philippines Corporation" 
            />
          </div>

          <h1 className="form-title">Sign In</h1>

          <form onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="email">
              Email address
            </label>
            
            <input 
              className="field-input" 
              type="email" 
              id="email" 
              name="email" 
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
            />

            <div className="field-row">
              <label className="field-label" htmlFor="password">
                Password
              </label>

              <button 
                type="button"
                className="hide-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                
                <svg 
                  viewBox="0 0 24 24" 
                  width="16" height="16" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.8"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                 {!showPassword && ( 
                  <line x1="3" y1="21" x2="21" y2="3" />
                  )}
                </svg>
                
                <span>{showPassword ? "Hide" : "Show"}</span>
              </button>
            </div>

            <input 
              className="field-input" 
              type={showPassword ? "text" : "password"} 
              id="password" 
              name="password" 
              autoComplete="current-password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            <button 
              type="submit" 
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>

            <div className="options-row">
              <label className="remember-me">
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <a className="need-help" href="#">
                Need help?
              </a>
            </div>

            <div className="signup-line">
              Don't have an acount?{" "}
              <Link to="/signup">Sign up</Link>
            </div>

            <p className="recaptcha-note">
              This page is protected by Google reCAPTCHA
              <br />
                to ensure you're not a bot. {" "}
              <a href="#">Learn more.</a>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Login;