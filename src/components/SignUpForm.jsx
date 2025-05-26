import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpForm.css";
import { useRegisterUserMutation } from "../features/authApi";

const SignUpForm = ({ onRegister }) => {
  const [form, setForm] = useState({ username: "", email: "", password: "", repeat: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [registerUser] = useRegisterUserMutation();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.repeat) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const result = await registerUser({ username: form.username, email: form.email, password: form.password }).unwrap();
      const user = result?.user;
      if (user) {
        localStorage.setItem("token", user.token);
        if (onRegister) onRegister(user);
        navigate("/");
        return;
      }
      setError('Failed to register');
    } catch (err) {
      if (err.data?.user) {
        localStorage.setItem("token", err.data.user.token);
        if (onRegister) onRegister(err.data.user);
        navigate("/");
        return;
      }
      if (err.data?.errors) {
        setError(
          Object.entries(err.data.errors)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(' ')
        );
      } else {
        setError('Failed to register');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-bg">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2 className="signup-title">Create new account</h2>
          <label>
            <span>Username</span>
          <input className="signup-input" name="username" type="text" placeholder="Username" value={form.username} onChange={handleChange} required />
          </label>
          <label>
            <span>Email address</span>
          <input className="signup-input" name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            <span>Password</span>
          <input className="signup-input" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          </label>
          <label>
            <span>Repeat Password</span>
          <input className="signup-input" name="repeat" type="password" placeholder="Repeat Password" value={form.repeat} onChange={handleChange} required />
          </label>
        <div className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0' }}>
          <input type="checkbox" defaultChecked style={{ marginRight: 8 }} />
          <span>I agree to the processing of my personal information</span>
        </div>
        <button className="signup-btn" type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</button>
        {error && <div className="signup-error">{error}</div>}
        <div className="signup-link">
            Already have an account?{' '}
          <span className="signup-link-text" onClick={() => navigate('/sign-in')}>
              Sign In.
            </span>
          </div>
        </form>
    </div>
  );
};

export default SignUpForm; 