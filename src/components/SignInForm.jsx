import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignInForm.css";
import { useLoginUserMutation } from "../features/authApi";

const SignInForm = ({ onLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const navigate = useNavigate();
  const [loginUser] = useLoginUserMutation();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setServerErrors({});
    setLoading(true);
    try {
      const result = await loginUser(form).unwrap();
      if (result.user) {
        localStorage.setItem("token", result.user.token);
        if (onLogin) onLogin(result.user);
        navigate("/");
      } else {
        setError('Failed to login');
      }
    } catch (err) {
      if (err.data?.errors) {
        setServerErrors(err.data.errors);
      } else {
        setError('Failed to login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-bg">
      <div className="signin-form-wrapper">
        <form className="signin-form" onSubmit={handleSubmit}>
          <h2 className="signin-title">Sign In</h2>
          <label>
            <span>Email address</span>
            <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required className={serverErrors.email ? 'error' : ''} />
          </label>
          {serverErrors.email && <div className="error-message">{serverErrors.email.join(', ')}</div>}
          <label>
            <span>Password</span>
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className={serverErrors.password ? 'error' : ''} />
          </label>
          {serverErrors.password && <div className="error-message">{serverErrors.password.join(', ')}</div>}
          <button className="login-btn" type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
          {error && <div className="error-message">{error}</div>}
          <div className="signup-link">
            Don't have an account?{' '}
            <span className="signin-link-text" onClick={() => navigate('/sign-up')}>
              Sign Up.
            </span>
          </div>
        </form>
        <button className="go-main-btn" onClick={() => navigate("/")}>Перейти к статьям</button>
      </div>
    </div>
  );
};

export default SignInForm; 